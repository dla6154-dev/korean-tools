import type { Metadata } from "next";
import LadderClient from "./ladder-client";

export const metadata: Metadata = {
  title: "사다리타기",
  description: "온라인 사다리타기 게임. 참가자 이름과 결과를 입력하면 랜덤 사다리를 생성하고 경로를 애니메이션으로 보여줍니다.",
  alternates: { canonical: "/ladder" },
};

export default function LadderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "사다리타기",
    "url": "https://rate-snap.com/ladder",
    "description": "온라인 사다리타기 게임. 참가자 이름과 결과를 입력하면 랜덤 사다리를 생성하고 경로를 애니메이션으로 보여줍니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LadderClient />
    </>
  );
}
