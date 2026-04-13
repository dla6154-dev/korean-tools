import type { Metadata } from "next";
import AgeClient from "./age-client";

export const metadata: Metadata = {
  title: "만 나이 계산기",
  description:
    "생년월일을 입력하면 현재 만 나이와 다음 생일까지 남은 기간을 빠르게 확인할 수 있습니다. 2023년 6월 개정 법적 만 나이 기준.",
  alternates: { canonical: "/age" },
};

export default function AgePage() {
  return <AgeClient />;
}
