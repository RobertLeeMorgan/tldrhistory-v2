import prisma from "../server/client";
import PQueue from "p-queue";
import sharp from "sharp";
import crypto from "crypto";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const queue = new PQueue({
  concurrency: 1,
  intervalCap: 1,
  interval: 2000,
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
const USER_AGENT =
  "TLDRHistory/1.0 (https://tldrhistory.xyz; contact: robleemorgan@gmail.com)";

let shouldStop = false;
const activeControllers = new Set<AbortController>();

class RateLimitAbortError extends Error {
  constructor(message = "Received 429 from Wikimedia; aborting migration") {
    super(message);
    this.name = "RateLimitAbortError";
  }
}

function stopAllWork() {
  shouldStop = true;
  queue.pause();
  for (const controller of activeControllers) controller.abort();
}

function getImageKey(url: string) {
  const hash = crypto.createHash("sha1").update(url).digest("hex");
  return `images/${hash}.webp`;
}

function normalizeWikimediaUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname !== "upload.wikimedia.org") return null;
    if (!u.pathname.includes("/thumb/")) return null;

    const parts = u.pathname.split("/thumb/");
    const base = parts[1];
    const segments = base.split("/");
    segments.pop();

    return `https://${u.hostname}/wikipedia/commons/${segments.join("/")}`;
  } catch {
    return null;
  }
}

async function existsInR2(key: string) {
  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: BUCKET,
        Key: key,
      }),
    );
    return true;
  } catch (err: any) {
    const status = err?.$metadata?.httpStatusCode;
    const name = err?.name;
    if (status === 404 || name === "NotFound" || name === "NoSuchKey") {
      return false;
    }
    throw err;
  }
}

async function sleep(ms: number) {
  await new Promise((res) => setTimeout(res, ms));
}

async function fetchImage(url: string) {
  if (shouldStop) throw new RateLimitAbortError();

  const controller = new AbortController();
  activeControllers.add(controller);
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(encodeURI(url), {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
      },
      redirect: "follow",
      signal: controller.signal,
    });

    if (res.status === 429) {
      stopAllWork();
      throw new RateLimitAbortError(
        `429 received for ${url}. Retry-After: ${res.headers.get("retry-after") ?? "none"}`,
      );
    }

    return res;
  } finally {
    clearTimeout(timeout);
    activeControllers.delete(controller);
  }
}

async function rejectImage(postId: number, reason?: string) {
  if (reason) {
    console.warn(`Rejecting image for post ${postId}: ${reason}`);
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      imageUrl: null,
      imageCredit: null,
      cdnId: null,
      cdnUrl: null,
      imageStatus: "rejected",
    },
  });
}

async function resolveImageSource(originalUrl: string, postId: number) {
  const normalizedUrl = normalizeWikimediaUrl(originalUrl);

  const firstRes = await fetchImage(originalUrl);
  if (firstRes.ok) {
    return { finalSourceUrl: originalUrl, finalResponse: firstRes };
  }

  if (
    firstRes.status === 404 &&
    normalizedUrl &&
    normalizedUrl !== originalUrl
  ) {
    await sleep(2000);
    const secondRes = await fetchImage(normalizedUrl);

    if (secondRes.ok) {
      return { finalSourceUrl: normalizedUrl, finalResponse: secondRes };
    }

    if (secondRes.status === 404) {
      await rejectImage(
        postId,
        "both original and normalized Wikimedia URLs returned 404",
      );
      return null;
    }

    throw new Error(
      `Unexpected status ${secondRes.status} for normalized URL ${normalizedUrl}`,
    );
  }

  if (firstRes.status === 404) {
    await rejectImage(postId, "original image URL returned 404");
    return null;
  }

  throw new Error(
    `Unexpected status ${firstRes.status} for original URL ${originalUrl}`,
  );
}

async function processPost(post: any) {
  if (shouldStop) throw new RateLimitAbortError();
  if (!post.imageUrl || post.cdnUrl) return;

  const resolved = await resolveImageSource(post.imageUrl, post.id);
  if (!resolved) return;

  const { finalSourceUrl, finalResponse } = resolved;
  const key = getImageKey(finalSourceUrl);
  const cdnUrl = `${PUBLIC_URL}/${key}`;

  const exists = await existsInR2(key);

  if (!exists) {
    const contentType = finalResponse.headers.get("content-type") ?? "";

    if (!contentType.startsWith("image/")) {
      throw new Error(
        `Non-image response for post ${post.id}: ${contentType} (${finalSourceUrl})`,
      );
    }

    if (contentType.includes("svg")) {
      await rejectImage(post.id, `unsupported SVG source: ${finalSourceUrl}`);
      return;
    }

    const arrayBuffer = await finalResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let processed: Buffer;

    try {
      processed = await sharp(buffer)
        .resize({ height: 230, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    } catch (err) {
      throw new Error(
        `Sharp failed for post ${post.id} (${finalSourceUrl}, content-type: ${contentType}, bytes: ${buffer.length}): ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: processed,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  }

  await prisma.post.update({
    where: { id: post.id },
    data: {
      imageUrl: finalSourceUrl,
      cdnId: key,
      cdnUrl,
    },
  });
}

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
      try {
        await processPost(post);
      } catch (err) {
        if (err instanceof RateLimitAbortError) throw err;
        console.error(`Failed post ${post.id}:`, err);
      } finally {
        processed++;
        if (processed % 10 === 0) {
          console.log(`Progress: ${processed}/${posts.length}`);
        }
      }
    });
  }

  await queue.onIdle();
  console.log("Migration complete");
}

main().catch((err) => {
  console.error("Migration aborted:", err);
  process.exit(1);
});