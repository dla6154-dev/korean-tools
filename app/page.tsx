import type { Metadata } from "next";
import HomePageClient from "./home-page-client";

export const metadata: Metadata = {
  title: "날짜 계산기, 단위 가격 비교, 글자 수 세기, 이미지 도구",
  description:
    "한국어 사용자가 자주 찾는 날짜 계산기, 단위 가격 비교기, 글자 수 세기, 이미지 도구를 한곳에 모았습니다. 설치 없이 무료로 바로 사용할 수 있습니다.",
  keywords: [
    "날짜 계산기",
    "단위 가격 비교",
    "글자 수 세기",
    "이미지 압축",
    "생활 도구 모음",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
