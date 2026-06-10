import BeerPriceClient from "../beer-price/beer-price-client";
import { resolveGrowthMetadata } from "../data/growth-config";
import { createToolMetadata, createToolStructuredData } from "../seo";

const defaults = {
  title: "단위 가격 계산기 | 100g당 가격, 100ml당 가격, 개당 가격 비교",
  description:
    "묶음 상품과 용량, 중량, 개수 상품을 100g, 100ml, 개당 가격 기준으로 비교해 가장 가성비 좋은 선택을 빠르게 찾으세요.",
};

const { title, description } = resolveGrowthMetadata("/unit-price", defaults);

export const metadata = createToolMetadata({
  title,
  description,
  path: "/unit-price",
  keywords: [
    "단위 가격 계산기",
    "100g당 가격",
    "100ml당 가격",
    "개당 가격 비교",
    "가성비 계산",
  ],
});

export default function UnitPricePage() {
  const jsonLd = createToolStructuredData({
    title,
    description,
    path: "/unit-price",
    featureList: ["100g당 가격 비교", "100ml당 가격 비교", "개당 가격 비교"],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BeerPriceClient />
    </>
  );
}
