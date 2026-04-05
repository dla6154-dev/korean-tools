import bitcoinData from "./bitcoin.json";

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
  stocks: [],
  social: [],
  bitcoin: bitcoinData as Article[],
};

export function getArticle(category: Category, slug: string): Article | undefined {
  return articles[category]?.find((a) => a.slug === slug);
}
