import OpenAI from "openai";
import { AIInput, AIOutput } from "./types";
import { generatePrompt } from "../../utils/prompt/generatePrompt";
import { Filter } from "../../utils/generatePosts";
import prisma from "../../server/client";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export async function openAIService(
  rawData: AIInput,
  filter: Filter
): Promise<AIOutput> {
  const group = filter?.group
    ? await prisma.group.findUnique({ where: { id: filter.group } })
    : null;

  const theme = group?.name ?? "";
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      { role: "system", content: generatePrompt(filter, theme) },
      { role: "user", content: JSON.stringify(rawData) },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;

  if (!content) throw new Error("OpenAI returned empty content");

  const parsed = JSON.parse(content);

  return parsed.articles as AIOutput;
}
