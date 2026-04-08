import type { Metadata } from "next";
import HomePageClient from "./home-page-client";

export const metadata: Metadata = {
  title: "Korean Tools",
  description:
    "만 나이 계산기, 디데이 계산기, 글자수 세기, 이미지 압축기 등 한국형 실용 도구를 무료로 빠르게 사용할 수 있습니다.",
};

export default function HomePage() {
  return <HomePageClient />;
}
