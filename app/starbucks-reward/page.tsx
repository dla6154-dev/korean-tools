import type { Metadata } from "next";
import StarbucksRewardClient from "./starbucks-reward-client";

export const metadata: Metadata = {
  title: "스타벅스 별 쿠폰 비교기",
  description:
    "지금 마실 커피의 Tall 가격과 별 조건을 입력하면 스타벅스 별 쿠폰 중 가장 효율적인 선택을 비교해 드립니다.",
};

export default function StarbucksRewardPage() {
  return <StarbucksRewardClient />;
}
