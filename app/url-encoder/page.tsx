import type { Metadata } from "next";
import UrlEncoderClient from "./url-encoder-client";

export const metadata: Metadata = {
  title: "URL 인코더/디코더",
  description:
    "한글 URL이나 쿼리 문자열을 encodeURIComponent 기준으로 인코딩하거나 다시 디코딩합니다.",
  alternates: {
    canonical: "/url-encoder",
  },
};

export default function UrlEncoderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "URL 인코더/디코더",
    "url": "https://rate-snap.com/url-encoder",
    "description": "한글 URL이나 쿼리 문자열을 encodeURIComponent 기준으로 인코딩하거나 다시 디코딩합니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UrlEncoderClient />
    </>
  );
}
