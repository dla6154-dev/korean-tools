import type { Metadata } from "next";
import JsonFormatterClient from "./json-formatter-client";

export const metadata: Metadata = {
  title: "JSON 포매터",
  description:
    "JSON 문자열을 보기 좋게 들여쓰기하거나 압축하고, 문법 오류를 빠르게 확인할 수 있습니다.",
  alternates: {
    canonical: "/json-formatter",
  },
};

export default function JsonFormatterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "JSON 포매터",
    "url": "https://rate-snap.com/json-formatter",
    "description": "JSON 문자열을 보기 좋게 들여쓰기하거나 압축하고, 문법 오류를 빠르게 확인할 수 있습니다.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "inLanguage": "ko"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <JsonFormatterClient />
    </>
  );
}
