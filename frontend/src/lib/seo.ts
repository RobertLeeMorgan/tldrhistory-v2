type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  robots?: string;
  type?: "website" | "article" | "profile";
};

const SITE_NAME = "TLDR History";
const SITE_URL = "https://tldrhistory.xyz";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export function buildMeta({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  robots = "index, follow",
  type = "website",
}: SeoInput) {
  const url = `${SITE_URL}${path}`;

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: robots },
    { name: "author", content: "Rob Morgan" },

    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:site_name", content: SITE_NAME },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
}