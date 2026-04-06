import type { Metadata } from "next";
import { articles } from "../data/articles";
import ArticleListClient from "../components/article-list-client";

export const metadata: Metadata = { title: "주식" };

export default function StocksPage() {
  return (
    <ArticleListClient
      articles={articles.stocks}
      basePath="/stocks"
      hoverColor="hover:border-blue-300"
      textColor="group-hover:text-blue-700"
      headingKo="📈 국내 주식"
      headingEn="📈 KR Stocks"
      subheadKo="KOSPI·KOSDAQ 상승/하락 Top 10 시황"
      subheadEn="KOSPI·KOSDAQ Top 10 Gainers & Losers"
    />
  );
}
