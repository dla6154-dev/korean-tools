import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles, getArticle } from "../../data/articles";

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
    <article className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/bitcoin"
        className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 mb-6"
      >
        ← 비트코인 목록
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{article.title}</h1>
      <p className="text-sm text-slate-400 mb-8">{article.date}</p>
      <div
        className="text-slate-700 text-[15px]"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      <div className="mt-10 pt-6 border-t border-slate-200">
        <Link href="/bitcoin" className="text-sm text-orange-600 hover:text-orange-700">
          ← 목록으로 돌아가기
        </Link>
      </div>
    </article>
  );
}
