import { Filter } from "../generatePosts";
import { buildConditions } from "./buildConditions";
import { buildTypes } from "./buildTypes";

export function generatePrompt(filter: Filter, theme: string) {
  const conditions = buildConditions(filter, theme);
  const { options: typeOptions, rules: typeRules } = buildTypes(filter);

  return `
You are a historian and data generator. 

You are given:
- allowed subjects (subjectOptions)
- existingNames: names to avoid
- count: number of articles to create

Your task:
Produce <count> historical articles ${conditions}.

Use only entries not in existingNames (DO NOT ALTER OR ADJUST NAMES; if a name appears in existingNames YOU MUST SKIP IT).

**Each post MUST strictly match this schema**:

{
  "name": string (4–100 chars),
  "type": ${typeOptions},

  "startYear": integer (0 not allowed! negative for BCE, positive for CE),
  "startMonth": 0–12 (0 if unknown),
  "startDay": 0–31 (0 if unknown),
  "endYear": integer (0 if unknown, negative for BCE),
  "endMonth": 0–12 (0 if unknown),
  "endDay": 0–31 (0 if unknown),

  "startDescription": string (must be below 200 chars),
  "endDescription": string,

  "startSignificance": number 0–1,
  "endSignificance": number 0–1 (0 if the end was insignificant or unknown)

  "sourceUrl": string,

  "country": string,

  "subjects": string[] (MUST be exact values from subjectOptions. 1 item is preferred, 2 are allowed)
}

RULES:
1. **Names and Dates**
   - All names and dates must come directly from the Wikipedia article title and infobox.
   - Use the best-accepted scholarly dates from the article. Use 0 if unknown.

2. **Descriptions**
   - should be factual but engaging; startDescription summarizes the entity, endDescription describes its conclusion. Do not include names or dates.

3. **Type classification**
   - must be one of the following options:
   ${typeRules}

4. **Subjects**
   - subjects[] must contain ONLY items from subjectOptions EXACTLY as listed.
   - Never use type names ("event", "landmark", etc.) as subjects.

5. **Country**
   - MUST be a modern sovereign country. If that is absolutely NOT POSSIBLE, then use most relevant continent, if that is still not possible use Global as a final fallback.

6. **Significance**  
   - Assign significance as continuous values between 0–1 to reflect relative global importance; avoid treating all items as equally significant.

7. **Source URL**
   - MUST be the exact Wikipedia article URL.

8. **Accuracy**
   - Never invent events, dates, locations, or urls.
   - Use widely accepted scholarly estimates if uncertainty exists.

Respond ONLY with a formatted JSON object:

{
  "articles": [
    {
      "name": "...",
      "type": "...",
      ...
    }
  ]
}

Always return "articles" as an array, even if there is only one entry.
`;
}
