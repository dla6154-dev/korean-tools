"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const mainMenu = [
  { href: "/stocks", label: "주식 (국내)", icon: "📈" },
  { href: "/us-stocks", label: "주식 (미국)", icon: "🇺🇸" },
  { href: "/bitcoin", label: "비트코인", icon: "₿" },
  { href: "/social", label: "사회 정세", icon: "🌐" },
];

const tools = [
  { href: "/age", label: "만 나이 계산기" },
  { href: "/anniversary", label: "기념일 계산기" },
  { href: "/dday", label: "디데이" },
  { href: "/characters", label: "글자수 세기" },
  { href: "/bmi", label: "BMI 계산기" },
  { href: "/loan", label: "대출 이자 계산기" },
  { href: "/alcohol", label: "음주측정 계산기" },
  { href: "/severance", label: "퇴직금 계산기" },
  { href: "/chosung", label: "초성 검색" },
  { href: "/image-compress", label: "이미지 압축" },
  { href: "/keyboard", label: "키보드 변환" },
];

const toolPaths = tools.map((t) => t.href);

export default function Sidebar() {
  const pathname = usePathname();
  const isOnTool = toolPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const [toolsOpen, setToolsOpen] = useState(isOnTool);

  return (
    <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-slate-200 bg-white sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-3 flex flex-col gap-0.5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
          카테고리
        </p>

        {mainMenu.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}

        <div className="my-2 border-t border-slate-100" />

        {/* 편리한 기능 토글 */}
        <button
          onClick={() => setToolsOpen((o) => !o)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isOnTool
              ? "bg-blue-50 text-blue-700"
              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <span className="text-base leading-none">🔧</span>
            <span>편리한 기능</span>
          </span>
          <span className="text-slate-400 text-xs">{toolsOpen ? "▲" : "▼"}</span>
        </button>

        {toolsOpen && (
          <div className="ml-4 pl-3 border-l border-slate-200 flex flex-col gap-0.5 mt-0.5">
            {tools.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`block py-1.5 px-2 rounded text-xs transition-colors ${
                    active
                      ? "text-blue-600 font-semibold"
                      : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </aside>
  );
}
