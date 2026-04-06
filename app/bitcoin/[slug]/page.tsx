import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, getArticle } from "../../data/articles";
import ArticleBody from "../../components/article-body";

export async function generateStaticParams() {
  return articles.bitcoin.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("bitcoin", slug);
  return { title: article?.title ?? "비트코인" };
}

export default async function BitcoinArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle("bitcoin", slug);
  if (!article) notFound();

  return (
    <ArticleBody
      article={article}
      backHref="/bitcoin"
      backLabelKo="비트코인 목록"
      backLabelEn="Bitcoin List"
      backColorClass="text-orange-600 hover:text-orange-700"
    />
  );
}
