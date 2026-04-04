import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "../data/articles";

export const metadata: Metadata = { title: "비트코인" };

export default function BitcoinPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">₿ 비트코인</h1>
      <p className="text-sm text-slate-500 mb-6">암호화폐 시장 동향 및 투자 분석</p>
      <div className="space-y-4">
        {articles.bitcoin.map((article) => (
          <Link
            key={article.slug}
            href={`/bitcoin/${article.slug}`}
            className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-orange-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-slate-900 group-hover:text-orange-600 transition-colors mb-1">
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
