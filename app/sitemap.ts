import type { MetadataRoute } from "next";
import bitcoinData  from "./data/bitcoin.json";
import stocksData   from "./data/stocks.json";
import usStocksData from "./data/us-stocks.json";
import socialData   from "./data/social.json";

type Article = { slug: string; date?: string };

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://korean-tools.vercel.app";

  const staticPaths: MetadataRoute.Sitemap = [
    { url: "https://korean-tools.vercel.app", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://korean-tools.vercel.app/stocks", lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: "https://korean-tools.vercel.app/us-stocks", lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: "https://korean-tools.vercel.app/bitcoin", lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: "https://korean-tools.vercel.app/social", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://korean-tools.vercel.app/age", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://korean-tools.vercel.app/anniversary", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://korean-tools.vercel.app/dday", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://korean-tools.vercel.app/bmi", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://korean-tools.vercel.app/characters", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://korean-tools.vercel.app/loan", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://korean-tools.vercel.app/severance", lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: "https://korean-tools.vercel.app/alcohol", lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: "https://korean-tools.vercel.app/chosung", lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: "https://korean-tools.vercel.app/keyboard", lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: "https://korean-tools.vercel.app/image-compress", lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: "https://korean-tools.vercel.app/en", lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
  ];

  const articlePaths = (
    category: string,
    articles: Article[],
    priority: number
  ): MetadataRoute.Sitemap =>
    articles.map((a) => ({
      url: `${baseUrl}/${category}/${a.slug}`,
      lastModified: a.date ? new Date(a.date) : new Date(),
      changeFrequency: "weekly" as const,
      priority,
    }));

  return [
    ...staticPaths,
    ...articlePaths("stocks",    stocksData    as Article[], 0.85),
    ...articlePaths("us-stocks", usStocksData  as Article[], 0.85),
    ...articlePaths("bitcoin",   bitcoinData   as Article[], 0.85),
    ...articlePaths("social",    socialData    as Article[], 0.8),
  ];
}
