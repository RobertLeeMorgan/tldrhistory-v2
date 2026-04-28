import type { Config } from "@react-router/dev/config";
import { themes } from "./src/utils/drawerValues";

export default {
  ssr: true,
  async prerender({ getStaticPaths }) {
    const slugs = themes.options.map((group: any) => group.slug);
    
    return [
      ...getStaticPaths(),
      ...slugs.map((slug: string) => `/timeline/${slug}`),
    ];
  },
} satisfies Config;