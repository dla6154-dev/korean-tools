import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import type { MetadataRoute } from "next";
import { absoluteUrl } from "./seo";
import { tools } from "./tool-content";

type SitemapEntryConfig = {
  pathname: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
};

const appDir = join(process.cwd(), "app");
const fallbackLastModified = statSync(join(appDir, "layout.tsx")).mtime;

const staticRoutes: SitemapEntryConfig[] = [
  { pathname: "/", changeFrequency: "daily", priority: 1 },
  { pathname: "/about", changeFrequency: "monthly", priority: 0.6 },
  { pathname: "/feedback", changeFrequency: "monthly", priority: 0.5 },
  { pathname: "/updates", changeFrequency: "monthly", priority: 0.5 },
  { pathname: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { pathname: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { pathname: "/en", changeFrequency: "monthly", priority: 0.4 },
];

function getPageFile(pathname: string) {
  if (pathname === "/") {
    return join(appDir, "page.tsx");
  }

  return join(appDir, pathname.slice(1), "page.tsx");
}

function getLastModified(pathname: string) {
  const pageFile = getPageFile(pathname);
  return existsSync(pageFile) ? statSync(pageFile).mtime : fallbackLastModified;
}

function createEntry({ pathname, changeFrequency, priority }: SitemapEntryConfig) {
  return {
    url: absoluteUrl(pathname),
    lastModified: getLastModified(pathname),
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const toolRoutes = Array.from(new Map(tools.map((tool) => [tool.href, tool])).values());

  return [
    ...staticRoutes.map(createEntry),
    ...toolRoutes.map((tool) =>
      createEntry({
        pathname: tool.href,
        changeFrequency: tool.featured ? "weekly" : "monthly",
        priority: tool.featured ? 0.9 : tool.discover ? 0.8 : 0.75,
      }),
    ),
  ];
}
