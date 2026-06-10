import DateCalcClient from "./date-calc-client";
import { resolveGrowthMetadata } from "../data/growth-config";
import { createToolMetadata, createToolStructuredData } from "../seo";

const defaults = {
  title: "날짜 계산기 | 며칠 후 날짜, 100일 계산, 기념일 계산",
  description:
    "기준 날짜에서 며칠 후 또는 이전 날짜를 바로 계산합니다. 100일, 기념일, 마감일 같은 중요한 날짜를 빠르게 확인하세요.",
};

const { title, description } = resolveGrowthMetadata("/date-calc", defaults);

export const metadata = createToolMetadata({
  title,
  description,
  path: "/date-calc",
  keywords: [
    "날짜 계산기",
    "며칠 후 날짜",
    "며칠 전 날짜",
    "100일 계산",
    "기념일 계산",
    "마감일 계산",
  ],
});

export default function DateCalcPage() {
  const jsonLd = createToolStructuredData({
    title,
    description,
    path: "/date-calc",
    featureList: ["며칠 후 날짜 계산", "며칠 전 날짜 계산", "100일 기념일 계산"],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DateCalcClient />
    </>
  );
}
