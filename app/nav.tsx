"use client";

import Link from "next/link";
import { useLanguage } from "./language-context";

export default function Nav() {
  const { lang, setLang } = useLanguage();

  const links =
    lang === "ko"
      ? [
          { href: "/",              label: "홈" },
          { href: "/age",           label: "만 나이" },
          { href: "/loan",          label: "대출 계산기" },
          { href: "/bmi",           label: "BMI" },
          { href: "/anniversary",   label: "기념일" },
          { href: "/dday",          label: "디데이" },
        ]
      : [
          { href: "/",              label: "Home" },
          { href: "/age",           label: "Age" },
          { href: "/loan",          label: "Loan" },
          { href: "/bmi",           label: "BMI" },
          { href: "/anniversary",   label: "Anniversary" },
          { href: "/dday",          label: "D-Day" },
        ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 flex-shrink-0">
          RateSnap
        </Link>
        <nav className="flex gap-4 text-sm font-medium text-slate-600 items-center overflow-x-auto">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-1 ml-1 flex-shrink-0">
            <button
              onClick={() => setLang("ko")}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                lang === "ko"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-500"
              }`}
            >
              KO
            </button>
            <button
              onClick={() => setLang("en")}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                lang === "en"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-500"
              }`}
            >
              EN
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
