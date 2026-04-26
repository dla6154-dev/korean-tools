import type { Metadata } from "next";
import DiscountClient from "./discount-client";

export const metadata: Metadata = {
  title: "할인율 계산기",
  description:
    "정가, 할인가, 할인율 중 두 값을 입력하면 나머지 하나와 절감 금액을 계산합니다.",
  alternates: {
    canonical: "/discount",
  },
};

export default function DiscountPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "할인율 계산기",
    "url": "https://rate-snap.com/discount",
    "description": "정가, 할인가, 할인율 중 두 값을 입력하면 나머지 하나와 절감 금액을 계산합니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DiscountClient />
    </>
  );
}
