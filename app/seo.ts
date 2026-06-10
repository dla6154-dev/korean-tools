import type { Metadata } from "next";

export const SITE_NAME = "Korean Tools";
export const SITE_URL = "https://rate-snap.com";
export const SITE_DESCRIPTION =
  "날짜 계산기, 디데이 계산기, 단위 가격 비교, 글자 수 세기, 이미지 압축까지. 설치 없이 브라우저에서 바로 쓰는 한국어 생활 도구 모음.";
export const SITE_KEYWORDS = [
  "날짜 계산기",
  "디데이 계산기",
  "단위 가격 비교",
  "100g당 가격 계산",
  "글자 수 세기",
  "이미지 압축",
  "QR 코드 만들기",
  "BMI 계산기",
];
export const SITE_METADATA_BASE = new URL(SITE_URL);

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

type ToolMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function createToolMetadata({
  title,
  description,
  path,
  keywords = [],
}: ToolMetadataOptions): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

type ToolStructuredDataOptions = ToolMetadataOptions & {
  featureList?: string[];
};

export function createToolStructuredData({
  title,
  description,
  path,
  featureList = [],
}: ToolStructuredDataOptions) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: title,
      url: absoluteUrl(path),
      description,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      inLanguage: "ko-KR",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "KRW",
      },
      ...(featureList.length > 0 ? { featureList } : {}),
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "홈",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: title,
          item: absoluteUrl(path),
        },
      ],
    },
  ];
}
