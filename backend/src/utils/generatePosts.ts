import { Context } from "../schema/resolvers/query/user";
import { openAIService } from "../services/ai/openAIService";
import { SUBJECT_LIST } from "../services/ai/subjectList";
import { AIInput, AIOutput } from "../services/ai/types";
import { createBot } from "./createBot";
import { addPosts } from "./addPosts";
import { wikiImages } from "../services/wikiImages";
import { normaliseCountryName } from "./countryMap";
import prisma from "../server/client";

export interface Filter {
  yearStart?: number | undefined;
  yearEnd?: number | undefined;
  search: string;
  subject: string[];
  type: string[];
  continent: string[];
  sortBy: boolean;
  group?: number
}

export async function generatePosts(
  filter: Filter,
  existingNames: string[],
  count: number,
  ctx: Context
) {
  const bot = await createBot();

  const aiInput: AIInput = {
    count,
    subjectOptions: filter.subject.length > 0 ? filter.subject : SUBJECT_LIST,
    existingNames,
  };

  let rawAiPosts = (await openAIService(aiInput, filter)) as AIOutput;

  let filteredPosts = rawAiPosts;

  if (filter.yearStart !== undefined && filter.yearEnd !== undefined) {
    filteredPosts = rawAiPosts.filter(
      (p) => p.startYear >= filter.yearStart! && p.startYear <= filter.yearEnd!
    );
  }

  const postPromises = filteredPosts.map(async (r) => {
    try {
      const normalizedCountry = normaliseCountryName(r.country);
      const countryRecord = await prisma.country.findUnique({
        where: { name: normalizedCountry },
      });

      if (!countryRecord) {
        console.warn(`Skipping post due to unknown country: ${r.country}`);
        return null;
      }

      let imageUrl: string | undefined;
      let imageCredit: string | null | undefined;

      if (r.sourceUrl) {
        const wikiImage = await wikiImages(r.sourceUrl);
        if (wikiImage) {
          imageUrl = wikiImage.url;
          imageCredit = wikiImage.credit ?? null;
        }
      }

      const post = await addPosts(
        {
          ...r,
          imageUrl,
          imageCredit,
          country: countryRecord.name,
          groupId: filter?.group ?? undefined
        },
        bot,
        ctx
      );

      return { ...post, likes: 0, liked: false };
    } catch (err) {
      console.error("Error processing AI post:", err);
      return null;
    }
  });

  const createdPosts = (await Promise.all(postPromises)).filter(
    (p): p is NonNullable<typeof p> => p !== null
  );

  return { createdPosts };
}
