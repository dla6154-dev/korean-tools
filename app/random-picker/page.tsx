import type { Metadata } from "next";
import RandomPickerClient from "./random-picker-client";

export const metadata: Metadata = {
  title: "랜덤 뽑기 / 복불복",
  description: "이름, 번호, 팀을 랜덤으로 뽑아드립니다. 당번 정하기, 팀 나누기, 복불복 게임에 바로 활용하세요.",
  alternates: { canonical: "/random-picker" },
};

export default function RandomPickerPage() {
  return <RandomPickerClient />;
}
