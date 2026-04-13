import type { Metadata } from "next";
import Base64Client from "./base64-client";

export const metadata: Metadata = {
  title: "Base64 인코더/디코더",
  description:
    "텍스트를 Base64로 인코딩하거나 Base64 문자열을 다시 평문으로 디코딩합니다.",
  alternates: {
    canonical: "/base64",
  },
};

export default function Base64Page() {
  return <Base64Client />;
}
