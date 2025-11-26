import { Context } from "../schema/resolvers/query/user";
import { openAIService } from "../services/ai/openAIService";
import { SUBJECT_LIST } from "../services/ai/subjectList";
import { AIInput, AIOutput } from "../services/ai/types";
import { createBot } from "./createBot";
import { generatePosts } from "./generatePosts";
import { wikiImages } from "../services/wikiImages";

interface Filter {
  yearStart: number;
  yearEnd: number;
}
export async function addPosts(
  filter: Filter,
  existingNames: string[],
  ctx: Context
) {
  const bot = await createBot();

  const aiInput: AIInput = {
    start: filter.yearStart,
    end: filter.yearEnd,
    count: 10 - existingNames.length,
    subjectOptions: SUBJECT_LIST,
    existingNames,
  };

  const rawAiPosts = (await openAIService(aiInput)) as AIOutput;

  const aiPosts = rawAiPosts.filter(
    (p) => p.startYear >= filter.yearStart && p.startYear <= filter.yearEnd
  );

  const createdPosts = [];

  for (const r of aiPosts) {
    let imageUrl: string | undefined;
    let imageCredit: string | null | undefined;

    if (r.sourceUrl) {
      const wikiImage = await wikiImages(r.sourceUrl);
      if (wikiImage) {
        imageUrl = wikiImage.url;
        imageCredit = wikiImage.credit ?? null;
      }
    }

    const post = await generatePosts(
      {
        ...r,
        imageUrl,
        imageCredit,
      },
      bot,
      ctx
    );

    createdPosts.push({ ...post, likes: 0, liked: false });
  }

  return { createdPosts};
}
