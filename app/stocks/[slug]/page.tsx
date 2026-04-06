import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, getArticle } from "../../data/articles";
import ArticleBody from "../../components/article-body";

export async function generateStaticParams() {
  return articles.stocks.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("stocks", slug);
  return { title: article?.title ?? "주식" };
}

export default async function StockArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle("stocks", slug);
  if (!article) notFound();

  return (
    <ArticleBody
      article={article}
      backHref="/stocks"
      backLabelKo="국내 주식 목록"
      backLabelEn="KR Stocks List"
      backColorClass="text-blue-600 hover:text-blue-700"
    />
  );
}
