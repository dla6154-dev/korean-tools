import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "../data/articles";

export const metadata: Metadata = { title: "미국 주식" };

export default function USStocksPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">🇺🇸 미국 주식</h1>
      <p className="text-sm text-slate-500 mb-6">NYSE·NASDAQ 상승/하락 Top 10 시황</p>
      <div className="space-y-4">
        {articles["us-stocks"].length === 0 && (
          <p className="text-slate-400 text-sm">아직 데이터가 없습니다. 오전 9시에 자동 업데이트됩니다.</p>
        )}
        {articles["us-stocks"].map((article) => (
          <Link
            key={article.slug}
            href={`/us-stocks/${article.slug}`}
            className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors mb-1">
                  {article.title}
                </h2>
                <p className="text-sm text-slate-500 line-clamp-2">{article.summary}</p>
              </div>
              <span className="text-xs text-slate-400 flex-shrink-0 mt-0.5">{article.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
