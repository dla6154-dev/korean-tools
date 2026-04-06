import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, getArticle } from "../../data/articles";
import ArticleBody from "../../components/article-body";

export async function generateStaticParams() {
  return articles.social.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("social", slug);
  return { title: article?.title ?? "사회 정세" };
}

export default async function SocialArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle("social", slug);
  if (!article) notFound();

  return (
    <ArticleBody
      article={article}
      backHref="/social"
      backLabelKo="사회 정세 목록"
      backLabelEn="Social News List"
      backColorClass="text-green-700 hover:text-green-800"
    />
  );
}
