import type { Metadata } from "next";
import StarbucksRewardClient from "./starbucks-reward-client";

export const metadata: Metadata = {
  title: "스타벅스 별 쿠폰 비교기",
  description:
    "지금 마실 커피의 Tall 가격과 별 조건을 입력하면 스타벅스 별 쿠폰 중 가장 효율적인 선택을 비교해 드립니다.",
};

export default function StarbucksRewardPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "스타벅스 별 쿠폰 비교기",
    "url": "https://rate-snap.com/starbucks-reward",
    "description": "지금 마실 커피의 Tall 가격과 별 조건을 입력하면 스타벅스 별 쿠폰 중 가장 효율적인 선택을 비교해 드립니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StarbucksRewardClient />
    </>
  );
}
