import DateDiffClient from "./date-diff-client";
import { resolveGrowthMetadata } from "../data/growth-config";
import { createToolMetadata, createToolStructuredData } from "../seo";

const defaults = {
  title: "날짜 차이 계산기 | 두 날짜 사이 며칠인지 바로 확인",
  description:
    "시작일과 종료일을 입력하면 총 일수, 주 수, 개월 수를 한 번에 계산합니다. 근무 기간, 계약 기간, 여행 기간 계산에 바로 사용할 수 있습니다.",
};

const { title, description } = resolveGrowthMetadata("/date-diff", defaults);

export const metadata = createToolMetadata({
  title,
  description,
  path: "/date-diff",
  keywords: [
    "날짜 차이 계산기",
    "두 날짜 차이",
    "기간 계산",
    "며칠 차이",
    "days between dates",
  ],
});

export default function DateDiffPage() {
  const jsonLd = createToolStructuredData({
    title,
    description,
    path: "/date-diff",
    featureList: ["두 날짜 일수 계산", "주 수 계산", "개월 수 계산"],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DateDiffClient />
    </>
  );
}
