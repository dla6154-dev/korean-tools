import type { MetadataRoute } from "next";
import bitcoinData  from "./data/bitcoin.json";
import stocksData   from "./data/stocks.json";
import usStocksData from "./data/us-stocks.json";
import socialData   from "./data/social.json";

type Article = { slug: string; date?: string };

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://rate-snap.com";

  const staticPaths: MetadataRoute.Sitemap = [
    { url: "https://rate-snap.com", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://rate-snap.com/stocks", lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: "https://rate-snap.com/us-stocks", lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: "https://rate-snap.com/bitcoin", lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: "https://rate-snap.com/social", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://rate-snap.com/age", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://rate-snap.com/anniversary", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://rate-snap.com/dday", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://rate-snap.com/bmi", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://rate-snap.com/characters", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://rate-snap.com/loan", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://rate-snap.com/severance", lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: "https://rate-snap.com/alcohol", lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: "https://rate-snap.com/chosung", lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: "https://rate-snap.com/keyboard", lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: "https://rate-snap.com/image-compress", lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: "https://rate-snap.com/en", lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
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
