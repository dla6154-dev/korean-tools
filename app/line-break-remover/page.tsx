import type { Metadata } from "next";
import LineBreakRemoverClient from "./line-break-remover-client";

export const metadata: Metadata = {
  title: "줄바꿈 제거기",
  description:
    "복사한 문장의 줄바꿈을 한 번에 정리해서 한 줄 텍스트나 깔끔한 문단으로 변환합니다.",
  alternates: {
    canonical: "/line-break-remover",
  },
};

export default function LineBreakRemoverPage() {
  return <LineBreakRemoverClient />;
}
