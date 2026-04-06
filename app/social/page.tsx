import type { Metadata } from "next";
import { articles } from "../data/articles";
import ArticleListClient from "../components/article-list-client";

export const metadata: Metadata = { title: "사회 정세" };

export default function SocialPage() {
  return (
    <ArticleListClient
      articles={articles.social}
      basePath="/social"
      hoverColor="hover:border-green-300"
      textColor="group-hover:text-green-700"
      headingKo="🌐 사회 정세"
      headingEn="🌐 Social News"
      subheadKo="국내외 사회·정치·경제 동향 분석"
      subheadEn="Korean & global society, politics & economy"
    />
  );
}
