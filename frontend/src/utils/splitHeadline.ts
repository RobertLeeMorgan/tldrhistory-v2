export function splitHeadline(str: string | null) {
  if (!str) return { title: "", subtitle: null };

  if (!str.includes(":")) return { title: str, subtitle: null };

  const [left, right] = str.split(/:(.+)/);
  return {
    title: left.trim(),
    subtitle: right?.trim() || null,
  };
}