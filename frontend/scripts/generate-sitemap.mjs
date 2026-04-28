import fs from "node:fs";
import path from "node:path";
import { themes } from "../src/utils/drawerValues.js";

const SITE_URL = "https://tldrhistory.xyz";

const staticRoutes = [
  "/",
  "/timeline",
  "/terms",
  "/privacy",
  "/cookies",
];

const timelineRoutes = themes.options.map((group) => `/timeline/${group.slug}`);

const routes = [...staticRoutes, ...timelineRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route}</loc>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const outputPath = path.resolve("public/sitemap.xml");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, xml, "utf8");

console.log("Generated public/sitemap.xml");