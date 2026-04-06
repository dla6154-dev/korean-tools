import type { Metadata } from "next";
import { articles } from "../data/articles";
import ArticleListClient from "../components/article-list-client";

export const metadata: Metadata = { title: "비트코인" };

export default function BitcoinPage() {
  return (
    <ArticleListClient
      articles={articles.bitcoin}
      basePath="/bitcoin"
      hoverColor="hover:border-orange-300"
      textColor="group-hover:text-orange-600"
      headingKo="₿ 비트코인"
      headingEn="₿ Bitcoin"
      subheadKo="암호화폐 시장 동향 및 투자 분석"
      subheadEn="Crypto market trends & investment analysis"
    />
  );
}
