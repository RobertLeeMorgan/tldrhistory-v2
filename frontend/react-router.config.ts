import type { Config } from "@react-router/dev/config";
import { themes } from "./src/utils/drawerValues";

export default {
  ssr: true,
  async prerender({ getStaticPaths }) {
    // Container images are built independently from the API. Timeline
    // prerendering requires a live GraphQL service, so the frontend image
    // keeps those routes server-rendered at request time instead.
    if (process.env.DISABLE_PRERENDER === "true") return [];

    const slugs = themes.options.map((group) => group.slug);
    
    return [
      ...getStaticPaths(),
      ...slugs.map((slug: string) => `/timeline/${slug}`),
    ];
  },
} satisfies Config;
