import type { Metadata } from "next";
import { articles } from "../data/articles";
import ArticleListClient from "../components/article-list-client";

export const metadata: Metadata = { title: "미국 주식" };

export default function USStocksPage() {
  return (
    <ArticleListClient
      articles={articles["us-stocks"]}
      basePath="/us-stocks"
      hoverColor="hover:border-indigo-300"
      textColor="group-hover:text-indigo-700"
      headingKo="🇺🇸 미국 주식"
      headingEn="🇺🇸 US Stocks"
      subheadKo="NYSE·NASDAQ 상승/하락 Top 10 시황"
      subheadEn="NYSE·NASDAQ Top 10 Gainers & Losers"
    />
  );
}
