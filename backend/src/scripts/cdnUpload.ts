import prisma from "../server/client";
import PQueue from "p-queue";
import sharp from "sharp";
import crypto from "crypto";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

// ==============================
// Setup
// ==============================

const queue = new PQueue({
  concurrency: 2,
  intervalCap: 2,
  interval: 1000,
});

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

// ==============================
// Helpers
// ==============================

// Deterministic key
function getImageKey(imageUrl: string) {
  const hash = crypto.createHash("sha1").update(imageUrl).digest("hex");
  return `images/${hash}.webp`;
}

// Check if already exists
async function existsInR2(key: string) {
  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: BUCKET,
        Key: key,
      }),
    );
    return true;
  } catch {
    return false;
  }
}

// Retry wrapper
async function withRetry(fn: () => Promise<any>, retries = 4) {
  let attempt = 0;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;

      const status = err?.$metadata?.httpStatusCode || err?.status;

      // Respect Retry-After if present (Wikimedia sends this)
      const retryAfter =
        err?.response?.headers?.["retry-after"] ||
        err?.$response?.headers?.["retry-after"];

      if (retryAfter) {
        const delay = parseInt(retryAfter, 10) * 1000;
        console.warn(`Rate limited. Waiting ${delay}ms`);
        await new Promise((res) => setTimeout(res, delay));
        continue;
      }

      // Exponential backoff
      const delay = Math.min(1000 * 2 ** attempt, 10000);
      console.warn(`Retry ${attempt}/${retries} after ${delay}ms`);
      await new Promise((res) => setTimeout(res, delay));

      if (attempt >= retries) throw err;
    }
  }
}

// ==============================
// Core logic
// ==============================
function normalizeWikimediaUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname !== "upload.wikimedia.org") return url;

    // Only process /thumb/ URLs
    if (!u.pathname.includes("/thumb/")) return url;

    const parts = u.pathname.split("/thumb/");
    const base = parts[1]; // a/a8/Image_name.jpg/330px-Image_name.jpg
    const segments = base.split("/");
    segments.pop(); // remove the last 330px-... segment
    return `https://${u.hostname}/wikipedia/commons/${segments.join("/")}`;
  } catch {
    return url;
  }
}

async function processPost(post: any) {
  if (!post.imageUrl) return;

  const key = getImageKey(post.imageUrl);
  const cdnUrl = `${PUBLIC_URL}/${key}`;

  try {
    // Skip if in DB
    if (post.cdnUrl) {
      console.log(`Skipping (already in DB): ${post.id}`);
      return;
    }

    // Check if exists
    const exists = await existsInR2(key);

    if (!exists) {
      await new Promise((res) => setTimeout(res, 200)); // 👈 throttle

      console.log(`⬇️ Fetching image for post ${post.id}`);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const fetchUrl = normalizeWikimediaUrl(post.imageUrl);

      const res = await withRetry(() =>
        fetch(encodeURI(fetchUrl), {
          headers: {
            "User-Agent":
              "TLDRHistory/1.0 (https://tldrhistory.xyz; contact: robleemorgan@gmail.com)",
          },
          redirect: "follow", // follow redirects explicitly
          signal: controller.signal, // enable timeout
        }),
      );

      clearTimeout(timeout);

      if (!res.ok) {
        console.error(
          `Fetch failed for post ${post.id} with status ${res.status} and URL: ${post.imageUrl}`,
        );
        throw new Error(`Failed to fetch image (HTTP ${res.status})`);
      }

      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Resize + convert
      const processed = await sharp(buffer)
        .resize({ height: 230, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      console.log(`Uploading to R2: ${key}`);

      await withRetry(() =>
        s3.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: processed,
            ContentType: "image/webp",
            CacheControl: "public, max-age=31536000, immutable",
          }),
        ),
      );
    }
    // Update DB
    await prisma.post.update({
      where: { id: post.id },
      data: {
        cdnId: key,
        cdnUrl,
      },
    });

    console.log(`Done post ${post.id}`);
  } catch (err) {
    console.error(`Failed post ${post.id}`, err);
  }
}

// ==============================
// Main runner
// ==============================

async function main() {
  const posts = await prisma.post.findMany({
    where: {
      imageStatus: "approved",
      imageUrl: { not: null },
      cdnUrl: null,
    },
  });

  console.log(`Processing ${posts.length} posts`);

  let processed = 0;

  for (const post of posts) {
    queue.add(async () => {
      await processPost(post);
      processed++;

      if (processed % 10 === 0) {
        console.log(`Progress: ${processed}/${posts.length}`);
      }
    });
  }

  await queue.onIdle();

  console.log("Migration complete");
}

main();
