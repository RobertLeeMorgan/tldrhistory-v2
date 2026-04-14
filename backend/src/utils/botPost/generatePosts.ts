import { Context } from "../../schema/resolvers/query/user";
import { openAIService } from "../../services/ai/openAIService";
import { SUBJECT_LIST } from "../../services/ai/subjectList";
import { AIInput, AIOutput } from "../../services/ai/types";
import { createBot } from "./createBot";
import { addPosts } from "./addPosts";
import { wikiImages } from "../../services/wikiImages";
import { normaliseCountryName } from "./countryMap";
import prisma from "../../server/client";

export interface Filter {
  yearStart?: number;
  yearEnd?: number;
  search: string;
  subject: string[];
  type: string[];
  continent: string[];
  sortBy: boolean;
  group?: number;
}

export async function generatePosts(
  filter: Filter,
  existingNames: string[],
  count: number,
  ctx: Context,
) {
  const bot = await createBot();

  const aiInput: AIInput = {
    count,
    subjectOptions: filter.subject.length > 0 ? filter.subject : SUBJECT_LIST,
    existingNames,
  };

  const rawAiPosts = (await openAIService(aiInput, filter)) as AIOutput;

  const allCountries = await prisma.country.findMany();
  const countryMap = Object.fromEntries(allCountries.map((c) => [c.name, c]));

  const validPosts: AIOutput = [];

  for (const r of rawAiPosts) {
    if (
      filter.yearStart !== undefined &&
      filter.yearEnd !== undefined &&
      (r.startYear < filter.yearStart || r.startYear > filter.yearEnd)
    ) {
      continue;
    }

    if (existingNames.includes(r.name)) continue;

    const normalizedCountry = normaliseCountryName(r.country);
    const countryRecord = countryMap[normalizedCountry];
    if (!countryRecord) {
      console.warn(`Skipping post due to unknown country: ${r.country}`);
      continue;
    }

    validPosts.push({
      ...r,
      country: countryRecord.name,
    });
  }

  const createdPosts = (
    await Promise.all(
      validPosts.map(async (r) => {
        try {
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
              groupId: filter.group ?? undefined,
            },
            bot,
            ctx,
          );

          return { ...post, likes: 0, liked: false };
        } catch (err) {
          console.error("Error creating AI post:", err);
          return null;
        }
      }),
    )
  ).filter((p): p is NonNullable<typeof p> => p !== null);

  return createdPosts;
}
