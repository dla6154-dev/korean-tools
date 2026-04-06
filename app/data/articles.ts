import bitcoinData from "./bitcoin.json";
import stocksData from "./stocks.json";
import socialData from "./social.json";

export type Article = {
  slug: string;
  title: string;
  date: string;
  period?: "daily" | "weekly" | "monthly";
  summary: string;
  content: string;
};

export type Category = "stocks" | "bitcoin" | "social";

export const articles: Record<Category, Article[]> = {
  stocks: stocksData as Article[],
  bitcoin: bitcoinData as Article[],
  social: socialData as Article[],
};

export function getArticle(category: Category, slug: string): Article | undefined {
  return articles[category]?.find((a) => a.slug === slug);
}
