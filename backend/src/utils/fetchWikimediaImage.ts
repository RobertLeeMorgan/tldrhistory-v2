// The image job ingests Commons media. Never follow a supplied URL off its
// upload origin, including redirects. Limits cover headers and streamed bytes.
export function assertWikimediaImageUrl(value: string): URL {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.hostname !== "upload.wikimedia.org" ||
      url.port || url.username || url.password) {
    throw new Error("Image source must use https://upload.wikimedia.org");
  }
  return url;
}

export async function fetchWikimediaImage(
  source: string,
  controller: AbortController,
  options: { userAgent: string; maxBytes?: number; timeoutMs?: number },
) {
  const maxBytes = options.maxBytes ?? 25 * 1024 * 1024;
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 20_000);
  try {
    let url = assertWikimediaImageUrl(source);
    for (let redirects = 0; redirects <= 5; redirects++) {
      const response = await fetch(url, {
        headers: { "User-Agent": options.userAgent },
        redirect: "manual",
        signal: controller.signal,
      });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        await response.body?.cancel();
        const location = response.headers.get("location");
        if (!location || redirects === 5) throw new Error("Invalid image redirect");
        url = assertWikimediaImageUrl(new URL(location, url).href);
        continue;
      }
      const contentType = response.headers.get("content-type") ?? "";
      const result = { ok: response.ok, status: response.status, headers: response.headers, buffer: Buffer.alloc(0) };
      if (!response.ok || !contentType.startsWith("image/") || contentType.includes("svg")) {
        await response.body?.cancel();
        return result;
      }
      const size = Number(response.headers.get("content-length"));
      if (size > maxBytes) {
        await response.body?.cancel();
        throw new Error("Image exceeds download byte limit");
      }
      if (!response.body) throw new Error("Image response has no body");
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let total = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          total += value.byteLength;
          if (total > maxBytes) throw new Error("Image exceeds download byte limit");
          chunks.push(value);
        }
      } finally {
        await reader.cancel();
        reader.releaseLock();
      }
      return { ...result, buffer: Buffer.concat(chunks, total) };
    }
    throw new Error("Too many image redirects");
  } finally {
    clearTimeout(timeout);
  }
}
