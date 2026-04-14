import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  async prerender() {
    const res = await fetch(`${process.env.VITE_API_URL}/seo/groups`);
    const groups: Array<{ slug: string }> = await res.json();

    return [
      "/timeline",
      "/terms",
      "/privacy",
      "/cookies",
      ...groups.map((g) => `/timeline/${g.slug}`),
    ];
  },
} satisfies Config;