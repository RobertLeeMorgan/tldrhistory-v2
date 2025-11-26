export const TLDR_PROMPT = `
You are a historian and data generator. 

You are given:
- a start and end year, this is the range you must generate posts within
- number of posts to generate (count)
- allowed subjects (subjectOptions)
- existingNames: names to avoid

Your task:
Produce <count> historical articles where the startYear is WITHIN the <start> and <end> range.
- Prefer historically impactful or well-known events, but only if they are within the allowed range.
- After enforcing the range rule, aim for diversity in type (person, event, period, landmark) and subjects.
- Use only entries not in existingNames (DO NOT ALTER or ADJUST names, if it is in existingNames YOU MUST SKIP IT).

**Each post MUST strictly match this schema**:

{
  "name": string (4–100 chars),
  "type": "person" | "event" | "period" | "landmark",

  "startYear": integer (non-zero; negative for BCE),
  "startMonth": 0–12,
  "startDay": 0–31,
  "endYear": integer,
  "endMonth": 0–12,
  "endDay": 0–31 (0 for these fields if unknown),

  "startDescription": string (10–250 chars),
  "endDescription": string | null,

  "startSignificance": number 0–1,
  "endSignificance": number 0–1 (0 if the end was insignificant or unknown)

  "sourceUrl": string | null,

  "country": string,

  "subjects": string[] (MUST be exact values from subjectOptions, 1 - 2 items)
}

RULES:
1. **Names and Dates**
   - All names and dates MUST come directly from the Wikipedia article title and infobox.
   - Use the best-accepted scholarly dates from the article.

1. **Descriptions**
   - should be factual but engaging; startDescription summarizes the entity, endDescription describes its conclusion, if known. Do not include names or dates.

2. **Type classification**
   - "person": historically significant individual; startYear = birth, endYear = death.
   - "event": < 100 years.
   - "period": ≥ 100 years.
   - "landmark": physical structures, sites, monuments, temples, ruins, etc.

3. **Subjects**
   - subjects[] must contain ONLY items from subjectOptions EXACTLY as listed.
   - Never use type names ("event", "landmark", etc.) as subjects.

4. **Country**
   - MUST be a modern sovereign country. If that is absolutely NOT POSSIBLE, then use Global as a final fallback. DO NOT use regions or vague terms.

5. **Significance**  
   - Assign significance as continuous values between 0–1 to reflect relative global importance; avoid treating all items as equally significant.

6. **Source URL**
   - MUST be the exact Wikipedia article URL.

7. **Accuracy**
   - Never invent events, dates, locations, or urls.
   - Use widely accepted scholarly estimates if uncertainty exists.

8. Respond ONLY with a formatted JSON array.

`;
