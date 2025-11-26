export function cleanName(str: string) {
  if (!str) return str;

  return str
    .replace(/^The\s+/i, "")
    .replace(/^Rise of the\s+/i, "")
    .trim();
}