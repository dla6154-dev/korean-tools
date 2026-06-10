import QrCodeClient from "./qr-code-client";
import { resolveGrowthMetadata } from "../data/growth-config";
import { createToolMetadata, createToolStructuredData } from "../seo";

const defaults = {
  title: "QR코드 생성기 | URL, 텍스트, 전화번호 무료 변환",
  description:
    "URL, 텍스트, 전화번호를 QR코드로 무료 변환합니다. 크기, 색상, 오류 복구 수준을 설정하고 브라우저에서 바로 다운로드하세요.",
};

const { title, description } = resolveGrowthMetadata("/qr-code", defaults);

export const metadata = createToolMetadata({
  title,
  description,
  path: "/qr-code",
  keywords: ["QR코드 생성기", "qr code generator", "URL QR코드", "텍스트 QR코드", "전화번호 QR"],
});

export default function QrCodePage() {
  const jsonLd = createToolStructuredData({
    title,
    description,
    path: "/qr-code",
    featureList: ["URL QR코드", "텍스트 QR코드", "색상과 크기 설정"],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <QrCodeClient />
    </>
  );
}
