import axios from "axios";
import PQueue from "p-queue";
import NodeCache from "node-cache";
import prisma from "../server/client";
// import fs from "fs";
import path from "path";

// ==============================
// Setup
// ==============================

const queue = new PQueue({ concurrency: 2 });
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });
const REQUEST_DELAY = 300;

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let attempt = 0;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;

      const retryAfter = err?.response?.headers?.["retry-after"];

      if (retryAfter) {
        const wait = parseInt(retryAfter, 10) * 1000;
        console.warn(`⏳ Rate limited. Waiting ${wait}ms`);
        await delay(wait);
      } else {
        const backoff = 1000 * attempt;
        console.warn(`⚠️ Retry ${attempt}/${retries} after ${backoff}ms`);
        await delay(backoff);
      }

      if (attempt >= retries) throw err;
    }
  }

  throw new Error("Retry failed");
}

const http = axios.create({
  baseURL: "https://commons.wikimedia.org/w/api.php",
  timeout: 8000,
  headers: {
    "User-Agent":
      "TLDRHistory/1.0 (https://tldrhistory.xyz; robleemorgan@gmail.com)",
  },
});

const auditFile = path.resolve("metadata_audit.json");
const auditRecords: any[] = [];

// ==============================
// Types
// ==============================

type ImageStatus = "pending" | "approved" | "fallback" | "rejected";

interface ImageMeta {
  url: string;
  license?: string;
  credit: string;
  status: ImageStatus;
  sourceField?: string;
}

interface ProcessPostResult {
  imageStatus: ImageStatus;
  imageUrl: string | null;
  imageCredit: string | null;
  sourceField?: string;
}

// Strict typing for Prisma posts
interface Post {
  id: number;
  name: string;
  imageUrl: string | null;
  sourceUrl: string | null;
  imageStatus: ImageStatus;
  imageCredit: string | null;
}

// ==============================
// Helpers
// ==============================

function extractTitle(url: string): string | null {
  const match = url.match(/\/wiki\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function extractFilenameFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");

    const thumbIndex = parts.findIndex((p) => p === "thumb");
    if (thumbIndex !== -1) {
      // In thumbnail URLs, the filename is the 4th segment after /thumb/
      const filenameSegment = parts[thumbIndex + 3];
      if (!filenameSegment) return null;

      // Remove the leading size portion (e.g., "330px-") if present
      const match = filenameSegment.match(/^\d+px-(.+)$/);
      const decoded = decodeURIComponent(match ? match[1] : filenameSegment);

      return `File:${decoded}`;
    }

    // fallback: last path segment
    return `File:${decodeURIComponent(parts.pop()?.split("?")[0].split("#")[0] || "")}`;
  } catch {
    return null;
  }
}

function classifyLicense(license?: string): ImageStatus {
  if (!license) return "rejected";

  const l = license.toLowerCase();

  // APPROVED (commercial use allowed)
  if (
    l.includes("public domain") ||
    l.includes("cc0") ||
    l.includes("cc-by") ||
    l.includes("cc by") ||
    l.includes("cc-by-sa") ||
    l.includes("cc by sa") ||
    l.includes("no restrictions") ||
    l.includes("pdm") ||
    l.includes("creative commons")
  ) {
    return "approved";
  }

  // FALLBACK (restricted)
  if (
    l.includes("noncommercial") ||
    l.includes("nc") ||
    l.includes("no derivatives") ||
    l.includes("nd") ||
    l.includes("gfdl")
  ) {
    return "fallback";
  }

  return "rejected";
}

function isValidWikiSource(url: string | null): boolean {
  if (!url) return false;
  return url.includes("wikipedia.org/wiki/");
}

// ==============================
// Wikimedia API calls
// ==============================

async function fetchPageImages(title: string) {
  const cacheKey = `images:${title}`;
  const cached = cache.get<any[]>(cacheKey);
  if (cached) return cached;

  await delay(REQUEST_DELAY);

  const res = await withRetry(() =>
    http.get("", {
      params: {
        action: "query",
        format: "json",
        titles: title,
        prop: "images",
      },
    }),
  );
  const pages = res.data.query.pages;
  const page = Object.values(pages)[0] as any;
  const images = page.images || [];

  cache.set(cacheKey, images);
  return images;
}

function stripHtml(html?: unknown): string | undefined {
  if (!html || typeof html !== "string") return undefined;
  return html.replace(/<[^>]+>/g, "").trim();
}

function cleanLicense(raw?: string): string | undefined {
  if (!raw) return undefined;

  const l = raw.toLowerCase();

  if (l.includes("public domain")) return "Public domain";
  if (l.includes("cc0")) return "CC0";
  if (l.includes("cc-by-sa")) return "CC BY-SA";
  if (l.includes("cc-by")) return "CC BY";

  return raw;
}

function cleanAuthors(raw: string): string[] {
  if (!raw) return [];

  let cleaned = raw;
  cleaned = cleaned.replace(/<[^>]+>/g, " ").trim();
  cleaned = cleaned.replace(
    /\b(File|User|Overlay|Modified|Derivative work):/gi,
    "",
  );
  cleaned = cleaned.replace(/\(.*?\)/g, "");
  cleaned = cleaned
    .replace(/This image has been extracted from another file/gi, "")
    .replace(/Own work/gi, "")
    .replace(/unknown author/gi, "")
    .replace(/Image by Author/gi, "")
    .replace(/using/gi, "")
    .replace(/used/gi, "")
    .replace(/coordinates/gi, "")
    .replace(/Original by/gi, "")
    .replace(/Derivative version by/gi, "/")
    .replace(/Derivative by/gi, "/")
    .replace(/version by/gi, "/")
    .replace(/not provided/gi, "/")
    .replace(/detail/gi, "/")
    .replace(/files/gi, "/")
    .replace(/global/gi, "/")
    .trim();

  // Split
  let parts = cleaned
    .split(/\/|,|;|\n|:/)
    .map((p) => p.trim())
    .filter(Boolean);

  parts = parts.filter((p) => {
    if (p.length < 3 || p.length > 40) return false;
    if (/^\s*[\W_]+\s*$/.test(p)) return false;
    if (/\.(svg|png|jpg|jpeg|gif)$/i.test(p)) return false;
    if (p.includes("http") || p.includes("www")) return false;
    if (/[0-9]{3,}/.test(p)) return false;
    if (/[°′″]/.test(p)) return false;
    if (p.split(" ").length > 5) return false;

    if (
      /^(using|based on|data from|coordinates|map|location|own work|et al)$/i.test(
        p,
      )
    ) {
      return false;
    }

    return /[a-zA-ZÀ-ÿ]/.test(p);
  });

  const unique = Array.from(new Set(parts)).slice(0, 3);

  return unique;
}

function isValidAuthors(authors: string[]): boolean {
  if (!authors.length) return false;

  return authors.some((a) => {
    const lower = a.toLowerCase();
    if (
      lower.includes("unknown") ||
      lower.includes("own work") ||
      lower.includes("ms.") ||
      lower.includes("folio") ||
      lower.includes("fol.") ||
      lower.includes("manuscript") ||
      lower.includes("collection") ||
      lower.includes("http") ||
      lower.includes("www") ||
      lower.includes("[")
    ) {
      return false;
    }
    if (a.length < 3 || a.length > 40) return false;
    if (!/[a-zA-ZÀ-ÿ]/.test(a)) return false;
    if (a.split(" ").length > 4) return false;
    if (/[0-9]{3,}/.test(a)) return false;

    return true;
  });
}

function extractAuthors(meta: any): { authors: string[]; sourceField: string } {
  const fields = [
    { key: "Artist", value: meta?.Artist?.value },
    { key: "Credit", value: meta?.Credit?.value },
    { key: "Attribution", value: meta?.Attribution?.value },
  ];

  for (const field of fields) {
    if (!field.value) continue;

    const cleaned = cleanAuthors(field.value);

    if (isValidAuthors(cleaned)) {
      return {
        authors: cleaned,
        sourceField: field.key,
      };
    }
  }

  return {
    authors: [],
    sourceField: "none",
  };
}

async function fetchImageMeta(filename: string) {
  const cacheKey = `meta:${filename}`;
  const cached = cache.get<any>(cacheKey);
  if (cached) return cached;

 await delay(REQUEST_DELAY);

const res = await withRetry(() =>
  http.get("", {
    params: {
      action: "query",
      format: "json",
      titles: filename,
      prop: "imageinfo",
      iiprop: "url|extmetadata",
    },
  }),
);

  const pages = res.data.query.pages;
  const page = Object.values(pages)[0] as any;
  const info = page.imageinfo?.[0];
  if (!info) return null;

  const meta = info.extmetadata;

  //   console.log("\n================ IMAGE META DEBUG ================");
  //   console.log("Filename:", filename);

  //   for (const key in meta) {
  //     const value = meta[key]?.value;
  //     if (value) {
  //       console.log(`${key}:`, stripHtml(value));
  //     }
  //   }

  //   console.log("=================================================\n");

  const { authors, sourceField } = extractAuthors(meta);

  const authorString =
    authors.length > 0
      ? `${authors.join(" / ")} / Wikimedia Commons`
      : "Unknown author / Wikimedia Commons";

  // License
  const license = cleanLicense(
    stripHtml(meta?.LicenseShortName?.value) ||
      stripHtml(meta?.UsageTerms?.value) ||
      stripHtml(meta?.License?.value) ||
      stripHtml(meta?.LicenseUrl?.value) ||
      undefined,
  );

  const credit = license ? `${authorString} / ${license}` : authorString;

  const result = {
    url: info.url,
    license,
    credit,
    sourceField,
  };

  cache.set(cacheKey, result);
  return result;
}

// ==============================
// Resolve best image
// ==============================

function isValidImage(filename: string): boolean {
  const lower = filename.toLowerCase();

  return !(
    lower.includes("icon") ||
    lower.includes("logo") ||
    lower.includes("symbol") ||
    lower.includes("edit") ||
    lower.includes("pencil") ||
    lower.includes("wiki") ||
    lower.endsWith(".svg")
  );
}

async function resolveBestImage(sourceUrl: string): Promise<ImageMeta | null> {
  const title = extractTitle(sourceUrl);
  if (!title) return null;

  const images = await fetchPageImages(title);
  let fallbackCandidate: ImageMeta | null = null;

  for (const img of images) {
    if (!isValidImage(img.title)) continue;

    const meta = await fetchImageMeta(img.title);
    if (!meta) continue;

    const status = classifyLicense(meta.license);

    if (status === "approved") return { ...meta, status };
    if (status === "fallback" && !fallbackCandidate)
      fallbackCandidate = { ...meta, status };
  }

  return fallbackCandidate;
}

// ==============================
// Process single post
// ==============================

async function processPost(post: Post): Promise<ProcessPostResult> {
  if (!post.sourceUrl)
    return { imageStatus: "rejected", imageUrl: null, imageCredit: null };

  let best: ImageMeta | null = null;

  if (post.imageUrl) {
    let filename = extractFilenameFromUrl(post.imageUrl);
    if (filename) {
      if (!filename.startsWith("File:")) filename = `File:${filename}`;
      const meta = await fetchImageMeta(filename);
      if (meta) {
        const status = classifyLicense(meta.license);
        if (status === "approved") best = { ...meta, status };
      }
    }
  }

  if (!best) best = await resolveBestImage(post.sourceUrl);
  if (!best)
    return { imageStatus: "rejected", imageUrl: null, imageCredit: null };

  return {
    imageStatus: best.status,
    imageUrl:
      post.imageUrl && best.status === "approved" ? post.imageUrl : best.url,
    imageCredit: best.credit || null,
    sourceField: best.sourceField,
  };
}

// ==============================
// Main runner
// ==============================

async function run() {
  console.log("Starting metadata cleanup...");

  //   const summary = {
  //     pending: 0,
  //     approved: 0,
  //     fallback: 0,
  //     rejected: 0,
  //   };

  const posts = await prisma.post.findMany({
    where: { imageStatus: "pending" },
  });
  console.log(`Found ${posts.length} posts`);

  await Promise.all(
    posts.map((post) =>
      queue.add(async () => {
        try {
          let originalLicense: string | null = null;

          if (post.imageUrl) {
            let filename = extractFilenameFromUrl(post.imageUrl);
            if (filename) {
              if (!filename.startsWith("File:")) filename = `File:${filename}`;
              const meta = await fetchImageMeta(filename);
              originalLicense = meta?.license || null;
            }
          }

          const previous = {
            imageStatus: post.imageStatus,
            imageUrl: post.imageUrl,
            imageCredit: post.imageCredit,
            license: originalLicense,
          };

          const result = await processPost(post);

          //   summary[result.imageStatus]++;

          await prisma.post.update({
            where: { id: post.id },
            data: {
              imageStatus: result.imageStatus,
              imageUrl: result.imageUrl,
              imageCredit: result.imageCredit,
            },
          });

          //   auditRecords.push({
          //     postId: post.id,
          //     name: post.name,
          //     timestamp: new Date().toISOString(),
          //     sourceUrl: post.sourceUrl,
          //     sourceValid: isValidWikiSource(post.sourceUrl),
          //     previous,
          //     updated: result,
          //     sourceField: result.sourceField,
          //     usedFallback: result.imageStatus === "fallback",
          //   });

          console.log(`✔ Post ${post.id} → ${result.imageStatus}`);
        } catch (err) {
          console.error(`✖ Post ${post.id} failed`, err);
        }
      }),
    ),
  );

  //   let existing = null;

  //   if (fs.existsSync(auditFile)) {
  //     try {
  //       const raw = fs.readFileSync(auditFile, "utf-8");
  //       existing = JSON.parse(raw);
  //     } catch {
  //       existing = null;
  //     }
  //   }

  //   const finalAudit = {
  //     summary,
  //     totalProcessed: (existing?.totalProcessed || 0) + auditRecords.length,
  //     records: [...(existing?.records || []), ...auditRecords],
  //   };

  //   const keys = Object.keys(summary) as (keyof typeof summary)[];

  //   for (const key of keys) {
  //     finalAudit.summary[key] = (existing.summary[key] || 0) + summary[key];
  //   }

  //   fs.writeFileSync(auditFile, JSON.stringify(finalAudit, null, 2));
  //   console.log(`Audit written to ${auditFile}`);

  console.log("Metadata cleanup complete");
}

// ==============================
// Execute
// ==============================

run()
  .catch((err) => console.error("Fatal error:", err))
  .finally(async () => await prisma.$disconnect());
