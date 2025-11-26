import OpenAI from "openai";
import { AIInput, AIOutput } from "./types";
import { TLDR_PROMPT } from "../../config/aiPrompt";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
export async function openAIService(rawData: AIInput): Promise<AIOutput> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      { role: "system", content: TLDR_PROMPT },
      { role: "user", content: JSON.stringify(rawData) }
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("OpenAI returned empty content");

  const parsed = JSON.parse(content);
  return parsed as AIOutput;
}