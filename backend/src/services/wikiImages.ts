import axios from "axios";
import NodeCache from "node-cache";
import PQueue from "p-queue";

const imageCache = new NodeCache({ stdTTL: 60 * 60 * 24 });
const restQueue = new PQueue({ concurrency: 5 });

export interface WikiImage {
  url: string;
  credit: string;
}

const http = axios.create({
  headers: {
    "User-Agent":
      "TLDRHistoryDev/0.1 (https://tldrhistory.dev; robleemorgan@gmail.com)",
  },
});

function extractTitleFromUrl(url: string) {
  const match = url.match(/\/wiki\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function wikiImages(sourceUrl: string): Promise<WikiImage | null> {
  const cacheKey = `wikiImage:${sourceUrl}`;
  const cached = imageCache.get(cacheKey);
  if (cached) return cached as WikiImage;

  return restQueue.add(async () => {
    const title = extractTitleFromUrl(sourceUrl);
    if (!title) return null;

    try {
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        title
      )}`;
      const res = await http.get(summaryUrl);
      const data = res.data;

      const imageUrl =
        data.thumbnail?.source ??
        "";

      const imageCredit = data.title
        ? `Image: ${data.title} / Wikimedia Commons`
        : "Wikimedia Commons";

      const result: WikiImage = { url: imageUrl, credit: imageCredit };
      imageCache.set(cacheKey, result);
      return result;
    } catch (err) {
      console.error(`Failed to fetch image for ${title}`, err);
      return null;
    }
  });
}
