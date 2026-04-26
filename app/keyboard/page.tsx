import type { Metadata } from "next";
import KeyboardClient from "./keyboard-client";

export const metadata: Metadata = {
  title: "키보드 오타 변환기 — dkssudgktpdy → 안녕하세요 즉시 변환",
  description: "한/영 전환을 깜박하고 입력한 오타를 1초 만에 고쳐드립니다. 영어→한글, 한글→영어 양방향 무료 변환. 붙여넣기만 하면 끝.",
  alternates: { canonical: "/keyboard" },
};

export default function KeyboardPage() {
  return <KeyboardClient />;
}
