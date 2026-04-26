import type { Metadata } from "next";
import LoremIpsumClient from "./lorem-ipsum-client";

export const metadata: Metadata = {
  title: "Lorem Ipsum 생성기",
  description:
    "더미 문단을 영문 또는 한국어 버전으로 생성하고 복사할 수 있습니다.",
  alternates: {
    canonical: "/lorem-ipsum",
  },
};

export default function LoremIpsumPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Lorem Ipsum 생성기",
    "url": "https://rate-snap.com/lorem-ipsum",
    "description": "더미 문단을 영문 또는 한국어 버전으로 생성하고 복사할 수 있습니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LoremIpsumClient />
    </>
  );
}
