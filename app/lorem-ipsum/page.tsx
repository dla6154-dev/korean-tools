import type { Metadata } from "next";
import LoremIpsumClient from "./lorem-ipsum-client";

export const metadata: Metadata = {
  title: "Lorem Ipsum 생성기",
  description:
    "더미 문단을 영문 또는 한국어 버전으로 생성하고 복사할 수 있습니다.",
  alternates: {
    canonical: "/lorem-ipsum",
  },
};

export default function LoremIpsumPage() {
  return <LoremIpsumClient />;
}
