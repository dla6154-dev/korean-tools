import type { Metadata } from "next";
import NetPayClient from "./net-pay-client";

export const metadata: Metadata = {
  title: "실수령액 계산기",
  description:
    "월급과 비과세 금액을 기준으로 4대 보험과 원천징수 비율을 반영한 예상 실수령액을 계산합니다.",
  alternates: {
    canonical: "/net-pay",
  },
};

export default function NetPayPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "실수령액 계산기",
    "url": "https://rate-snap.com/net-pay",
    "description": "월급과 비과세 금액을 기준으로 4대 보험과 원천징수 비율을 반영한 예상 실수령액을 계산합니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NetPayClient />
    </>
  );
}
