import AnniversaryClient from "./anniversary-client";
import { resolveGrowthMetadata } from "../data/growth-config";
import { createToolMetadata, createToolStructuredData } from "../seo";

const defaults = {
  title: "기념일 계산기 | 100일, 1주년 자동 계산",
  description:
    "시작일을 입력하면 100일, 200일, 1주년 등 주요 기념일을 자동으로 계산합니다. 연인, 결혼, 입사일 등 모든 기념일에 활용하세요.",
};

const { title, description } = resolveGrowthMetadata("/anniversary", defaults);

export const metadata = createToolMetadata({
  title,
  description,
  path: "/anniversary",
  keywords: ["기념일 계산기", "100일 계산", "1주년 계산", "연애 기념일", "입사 기념일"],
});

export default function AnniversaryPage() {
  const jsonLd = createToolStructuredData({
    title,
    description,
    path: "/anniversary",
    featureList: ["100일 계산", "200일 계산", "1주년 계산"],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AnniversaryClient />
    </>
  );
}
