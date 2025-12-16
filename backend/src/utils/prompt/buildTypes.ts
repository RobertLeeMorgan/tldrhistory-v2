import { Filter } from "../generatePosts";

const TYPE_RULES: Record<string, string> = {
  person: `- "person": historically significant individual; startYear = birth, endYear = death.`,
  event: `- "event": < 100 years (do not include people or landmarks such as Birth of or construction of).`,
  period: `- "period": ≥ 100 years.`,
  landmark: `- "landmark": physical structures, sites, monuments, temples, ruins, etc. Man made, not natural wonders.`,
};

export function buildTypes(filter: Filter) {
  const allowedTypes = filter.type?.length
    ? filter.type
    : ["person", "event", "period", "landmark"];

  return {
    options: allowedTypes.join(" | "),
    rules: allowedTypes.map(t => TYPE_RULES[t]).join("\n"),
  };
}