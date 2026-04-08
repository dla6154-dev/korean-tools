import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기",
  description: "Korean Tools에 대한 피드백과 문의 안내 페이지입니다.",
};

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-950">문의하기</h1>
      <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
        <p>
          현재 별도의 문의 채널과 피드백 폼은 정리 중입니다. 우선은 홈페이지 구조와 핵심
          도구 품질을 먼저 개선하고 있습니다.
        </p>
        <p>
          추후 피드백 접수 방식이 준비되면 이 페이지에서 바로 안내할 예정입니다.
        </p>
      </div>
    </div>
  );
}
