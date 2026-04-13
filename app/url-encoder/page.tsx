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
  return <UrlEncoderClient />;
}
