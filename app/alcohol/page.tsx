import type { Metadata } from "next";
import AlcoholClient from "./alcohol-client";

export const metadata: Metadata = {
  title: "음주측정 계산기 - 혈중 알코올 농도(BAC) 계산",
  description: "음주 후 혈중 알코올 농도(BAC)를 추정합니다. 성별, 체중, 음료 종류와 음주량을 입력하면 위드마크 공식으로 현재 BAC와 운전 가능 시간을 계산해드립니다.",
  alternates: { canonical: "/alcohol" },
};

export default function AlcoholPage() {
  return <AlcoholClient />;
}
