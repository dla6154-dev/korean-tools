import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles, getArticle } from "../../data/articles";

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
    <article className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/social"
        className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-800 mb-6"
      >
        ← 사회 정세 목록
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{article.title}</h1>
      <p className="text-sm text-slate-400 mb-8">{article.date}</p>
      <div className="space-y-5">
        {article.paragraphs.map((p, i) => (
          <p key={i} className="text-slate-700 leading-relaxed text-[15px]">
            {p}
          </p>
        ))}
      </div>
      <div className="mt-10 pt-6 border-t border-slate-200">
        <Link href="/social" className="text-sm text-green-700 hover:text-green-800">
          ← 목록으로 돌아가기
        </Link>
      </div>
    </article>
  );
}
