import type { Metadata } from "next";
import DdayClient from "./dday-client";

export const metadata: Metadata = {
  title: "디데이 계산기 — D-Day 남은 날짜 무료 계산",
  description: "수능·시험·여행·생일·전역일까지 며칠 남았는지 계산합니다. 여러 디데이를 동시에 등록하고 한눈에 관리하세요. 무료, 로그인 불필요.",
  alternates: { canonical: "/dday" },
};

export default function DdayPage() {
  return <DdayClient />;
}
