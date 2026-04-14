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
  for (const controller of activeControllers) {
    controller.abort();
  }
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
  if (shouldStop) {
    throw new RateLimitAbortError();
  }

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

async function rejectImage(postId: number) {
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

async function processPost(post: any) {
  if (shouldStop) throw new RateLimitAbortError();
  if (!post.imageUrl || post.cdnUrl) return;

  const originalUrl = post.imageUrl;
  const normalizedUrl = normalizeWikimediaUrl(originalUrl);

  let finalSourceUrl: string | null = null;
  let finalResponse: Response | null = null;

  const firstRes = await fetchImage(originalUrl);

  if (firstRes.ok) {
    finalSourceUrl = originalUrl;
    finalResponse = firstRes;
  } else if (
    firstRes.status === 404 &&
    normalizedUrl &&
    normalizedUrl !== originalUrl
  ) {
    await sleep(2000);

    const secondRes = await fetchImage(normalizedUrl);

    if (secondRes.ok) {
      finalSourceUrl = normalizedUrl;
      finalResponse = secondRes;
    } else if (secondRes.status === 404) {
      await rejectImage(post.id);
      return;
    } else {
      throw new Error(
        `Unexpected status ${secondRes.status} for normalized URL`,
      );
    }
  } else if (firstRes.status === 404) {
    await rejectImage(post.id);
    return;
  } else {
    throw new Error(`Unexpected status ${firstRes.status} for original URL`);
  }

  if (!finalSourceUrl || !finalResponse) {
    throw new Error(`No valid image source for post ${post.id}`);
  }

  const key = getImageKey(finalSourceUrl);
  const cdnUrl = `${PUBLIC_URL}/${key}`;

  const exists = await existsInR2(key);

  if (!exists) {
    const arrayBuffer = await finalResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const processed = await sharp(buffer)
      .resize({ height: 230, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

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

  for (const post of posts) {
    queue
      .add(async () => {
        await processPost(post);
      })
      .catch((err) => {
        if (err instanceof RateLimitAbortError) throw err;
        throw err;
      });
  }

  await queue.onIdle();
}

main().catch((err) => {
  console.error("Migration aborted:", err);
  process.exit(1);
});
