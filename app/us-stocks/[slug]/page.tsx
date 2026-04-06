import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, getArticle } from "../../data/articles";
import ArticleBody from "../../components/article-body";

export async function generateStaticParams() {
  return articles["us-stocks"].map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("us-stocks", slug);
  return { title: article?.title ?? "미국 주식" };
}

export default async function USStockArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle("us-stocks", slug);
  if (!article) notFound();

  return (
    <ArticleBody
      article={article}
      backHref="/us-stocks"
      backLabelKo="미국 주식 목록"
      backLabelEn="US Stocks List"
      backColorClass="text-indigo-600 hover:text-indigo-700"
    />
  );
}
