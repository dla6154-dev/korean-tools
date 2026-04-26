import type { Metadata } from "next";
import WhatToEatClient from "./what-to-eat-client";

export const metadata: Metadata = {
  title: "오늘 뭐 먹지? - 메뉴 랜덤 추천기",
  description: "메뉴를 고르지 못할 때 랜덤으로 오늘 먹을 음식을 골라드립니다. 한식, 양식, 일식, 중식 등 다양한 메뉴 중에서 선택.",
  alternates: { canonical: "/what-to-eat" },
};

export default function WhatToEatPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "오늘 뭐 먹지? - 메뉴 랜덤 추천기",
    "url": "https://rate-snap.com/what-to-eat",
    "description": "메뉴를 고르지 못할 때 랜덤으로 오늘 먹을 음식을 골라드립니다. 한식, 양식, 일식, 중식 등 다양한 메뉴 중에서 선택.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WhatToEatClient />
    </>
  );
}
