"use client";

import Link from "next/link";
import { useLanguage } from "../language-context";
import type { Article } from "../data/articles";

interface Props {
  article:    Article;
  backHref:   string;
  backLabelKo: string;
  backLabelEn: string;
  backColorClass: string; // e.g. "text-blue-600 hover:text-blue-700"
}

export default function ArticleBody({
  article,
  backHref,
  backLabelKo,
  backLabelEn,
  backColorClass,
}: Props) {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  const title   = isEn && article.titleEn   ? article.titleEn   : article.title;
  const content = isEn && article.contentEn ? article.contentEn : article.content;
  const backLabel = isEn ? backLabelEn : backLabelKo;

  return (
    <article className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href={backHref}
        className={`inline-flex items-center gap-1 text-sm ${backColorClass} mb-6`}
      >
        ← {backLabel}
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-sm text-slate-400 mb-8">{article.date}</p>
      <div
        className="text-slate-700 text-[15px]"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="mt-10 pt-6 border-t border-slate-200">
        <Link href={backHref} className={`text-sm ${backColorClass}`}>
          ← {isEn ? "Back to list" : "목록으로 돌아가기"}
        </Link>
      </div>
    </article>
  );
}
