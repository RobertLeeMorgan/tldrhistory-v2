import axios from "axios";
import NodeCache from "node-cache";
import PQueue from "p-queue";

const imageCache = new NodeCache({ stdTTL: 60 * 60 * 24 }); // 24h
const restQueue = new PQueue({ concurrency: 5 });

export interface WikiImage {
  url: string;
  credit: string;
}

interface WikiSummaryResponse {
  title: string;
  thumbnail?: { source: string };
}

// Axios instance with timeout
const http = axios.create({
  headers: {
    "User-Agent":
      "TLDRHistoryDev/0.1 (https://tldrhistory.dev; robleemorgan@gmail.com)",
  },
  timeout: 5000,
});

function extractTitleFromUrl(url: string): string | null {
  const match = url.match(/\/wiki\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function wikiImages(sourceUrl: string): Promise<WikiImage | null> {
  const cacheKey = `wikiImage:${sourceUrl}`;
  const cached = imageCache.get<WikiImage | null>(cacheKey);

  if (cached !== undefined) return cached;

  return restQueue.add(async () => {
    const title = extractTitleFromUrl(sourceUrl);
    if (!title) {
      imageCache.set(cacheKey, null);
      return null;
    }

    try {
      const { data } = await http.get<WikiSummaryResponse>(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
      );

      const result: WikiImage = {
        url: data?.thumbnail?.source ?? "",
        credit: data?.title ? `Image: ${data.title} / Wikimedia Commons` : "Wikimedia Commons",
      };

      imageCache.set(cacheKey, result);
      return result;
    } catch (err) {
      console.error(`Failed to fetch image for ${title}`, err);
      imageCache.set(cacheKey, null);
      return null;
    }
  });
}