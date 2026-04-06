import bitcoinData from "./bitcoin.json";
import stocksData from "./stocks.json";
import socialData from "./social.json";
import usStocksData from "./us-stocks.json";

export type Article = {
  slug: string;
  title: string;
  titleEn?: string;
  date: string;
  period?: "daily" | "weekly" | "monthly";
  summary: string;
  summaryEn?: string;
  content: string;
  contentEn?: string;
};

export type Category = "stocks" | "bitcoin" | "social" | "us-stocks";

export const articles: Record<Category, Article[]> = {
  stocks: stocksData as Article[],
  bitcoin: bitcoinData as Article[],
  social: socialData as Article[],
  "us-stocks": usStocksData as Article[],
};

export function getArticle(category: Category, slug: string): Article | undefined {
  return articles[category]?.find((a) => a.slug === slug);
}
