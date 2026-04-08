import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "업데이트 내역",
  description: "Korean Tools의 개선 방향과 업데이트 메모를 확인합니다.",
};

const updates = [
  "홈페이지를 툴 허브 구조로 재정렬",
  "카테고리 중심 탐색 구조 강화",
  "검색 중심 히어로와 인기 도구 섹션 추가",
  "신뢰 섹션과 FAQ를 메인에 배치",
];

export default function UpdatesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-950">업데이트 내역</h1>
      <ul className="mt-6 space-y-4 text-base leading-8 text-slate-600">
        {updates.map((item) => (
          <li key={item} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
