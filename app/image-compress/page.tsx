import ImageCompressClient from "./image-compress-client";
import { resolveGrowthMetadata } from "../data/growth-config";
import { createToolMetadata, createToolStructuredData } from "../seo";

const defaults = {
  title: "이미지 압축기 | JPG, PNG, WebP 용량 줄이기",
  description:
    "JPG, PNG, WebP 이미지를 브라우저에서 바로 압축합니다. 서버 업로드 없이 용량을 줄이고 PNG를 JPG로 변환할 수 있습니다.",
};

const { title, description } = resolveGrowthMetadata("/image-compress", defaults);

export const metadata = createToolMetadata({
  title,
  description,
  path: "/image-compress",
  keywords: ["이미지 압축기", "사진 용량 줄이기", "JPG 압축", "PNG 압축", "WebP 압축"],
});

export default function ImageCompressPage() {
  const jsonLd = createToolStructuredData({
    title,
    description,
    path: "/image-compress",
    featureList: ["JPG 압축", "PNG 압축", "브라우저 내 처리"],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ImageCompressClient />
    </>
  );
}
