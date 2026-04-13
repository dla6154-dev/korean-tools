import type { Metadata } from "next";
import QrCodeClient from "./qr-code-client";

export const metadata: Metadata = {
  title: "QR코드 생성기",
  description: "URL, 텍스트, 전화번호를 QR코드로 무료 변환. 크기·색상·오류 복구 수준 설정 가능. 브라우저에서 바로 다운로드.",
  alternates: { canonical: "/qr-code" },
};

export default function QrCodePage() {
  return <QrCodeClient />;
}
