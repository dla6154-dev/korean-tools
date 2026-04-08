"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tools = [
  { href: "/age",            label: "만 나이 계산기",    icon: "🎂" },
  { href: "/anniversary",    label: "기념일 계산기",      icon: "💑" },
  { href: "/dday",           label: "디데이",             icon: "📅" },
  { href: "/bmi",            label: "BMI 계산기",         icon: "⚖️" },
  { href: "/loan",           label: "대출 이자 계산기",   icon: "🏦" },
  { href: "/severance",      label: "퇴직금 계산기",      icon: "💼" },
  { href: "/alcohol",        label: "음주측정 계산기",    icon: "🍺" },
  { href: "/characters",     label: "글자수 세기",        icon: "📝" },
  { href: "/chosung",        label: "초성 검색",          icon: "🔍" },
  { href: "/image-compress", label: "이미지 압축",        icon: "🖼️" },
  { href: "/keyboard",       label: "키보드 변환",        icon: "⌨️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-slate-200 bg-white sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-3 flex flex-col gap-0.5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
          편리한 기능
        </p>
        {tools.map(({ href, label, icon }) => {
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
      </nav>
    </aside>
  );
}
