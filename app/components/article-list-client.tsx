"use client";

import Link from "next/link";
import { useLanguage } from "../language-context";
import type { Article } from "../data/articles";

interface Props {
  articles:    Article[];
  basePath:    string;
  hoverColor:  string; // tailwind class e.g. "hover:border-blue-300"
  textColor:   string; // e.g. "group-hover:text-blue-700"
  headingKo:   string;
  headingEn:   string;
  subheadKo:   string;
  subheadEn:   string;
  emptyKo?:    string;
  emptyEn?:    string;
}

export default function ArticleListClient({
  articles,
  basePath,
  hoverColor,
  textColor,
  headingKo,
  headingEn,
  subheadKo,
  subheadEn,
  emptyKo = "아직 데이터가 없습니다. 오전 9시에 자동 업데이트됩니다.",
  emptyEn = "No data yet. Auto-updates at 9 AM KST.",
}: Props) {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        {isEn ? headingEn : headingKo}
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        {isEn ? subheadEn : subheadKo}
      </p>
      <div className="space-y-4">
        {articles.length === 0 && (
          <p className="text-slate-400 text-sm">{isEn ? emptyEn : emptyKo}</p>
        )}
        {articles.map((article) => {
          const title   = isEn && article.titleEn   ? article.titleEn   : article.title;
          const summary = isEn && article.summaryEn ? article.summaryEn : article.summary;
          return (
            <Link
              key={article.slug}
              href={`${basePath}/${article.slug}`}
              className={`block bg-white rounded-xl border border-slate-200 p-5 ${hoverColor} hover:shadow-sm transition-all group`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className={`text-base font-semibold text-slate-900 ${textColor} transition-colors mb-1`}>
                    {title}
                  </h2>
                  <p className="text-sm text-slate-500 line-clamp-2">{summary}</p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0 mt-0.5">{article.date}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
