"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "./language-context";
import { useTheme } from "./theme-context";
import { tools } from "./tool-content";

export default function Nav() {
  const { lang, setLang } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return tools
      .filter((t) => {
        const title = (lang === "ko" ? t.title.ko : t.title.en).toLowerCase();
        const desc = (lang === "ko" ? t.description.ko : t.description.en).toLowerCase();
        const kw = t.keywords.join(" ").toLowerCase();
        return title.includes(q) || desc.includes(q) || kw.includes(q);
      })
      .slice(0, 7);
  }, [query, lang]);

  // close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // reset active index when results change
  useEffect(() => {
    setActiveIdx(0);
  }, [results]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (results[activeIdx]) {
        router.push(results[activeIdx].href);
        setQuery("");
        setOpen(false);
        inputRef.current?.blur();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  const links =
    lang === "ko"
      ? [
          { href: "/#categories", label: "전체 도구" },
          { href: "/#date-tools", label: "날짜" },
          { href: "/#text-tools", label: "텍스트" },
          { href: "/#image-tools", label: "이미지" },
          { href: "/#life-tools", label: "생활 계산" },
          { href: "/#random-tools", label: "🎲 랜덤" },
        ]
      : [
          { href: "/#categories", label: "All tools" },
          { href: "/#date-tools", label: "Dates" },
          { href: "/#text-tools", label: "Text" },
          { href: "/#image-tools", label: "Image" },
          { href: "/#life-tools", label: "Life" },
          { href: "/#random-tools", label: "🎲 Random" },
        ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white">
            K
          </span>
          <span className="text-base font-semibold text-slate-950 dark:text-white md:text-lg">Korean Tools</span>
        </Link>

        <nav className="flex items-center gap-4 overflow-x-auto text-sm font-medium text-slate-600 dark:text-slate-300">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap transition-colors hover:text-blue-600 hidden md:inline"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/#popular-tools"
            className="hidden whitespace-nowrap rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-600 lg:inline-flex"
          >
            {lang === "ko" ? "인기 도구" : "Popular"}
          </Link>

          {/* Search */}
          <div ref={searchRef} className="relative">
            <div className="flex items-center gap-1.5 rounded-full border border-[var(--card-border)] bg-[var(--muted-bg)] px-3 py-1.5 focus-within:border-blue-400 focus-within:bg-[var(--card)] transition-colors">
              <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder={lang === "ko" ? "도구 검색…" : "Search tools…"}
                className="w-28 bg-transparent text-xs text-[var(--foreground)] placeholder-slate-400 outline-none md:w-36"
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }}
                  className="shrink-0 text-slate-400 hover:text-slate-600"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {open && results.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-lg overflow-hidden z-50">
                {results.map((t, i) => (
                  <button
                    key={t.href}
                    onMouseEnter={() => setActiveIdx(i)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      router.push(t.href);
                      setQuery("");
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      i === activeIdx ? "bg-blue-50 dark:bg-blue-950" : "hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="text-xl leading-none">{t.icon}</span>
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-medium ${i === activeIdx ? "text-blue-700 dark:text-blue-300" : "text-slate-800 dark:text-slate-200"}`}>
                        {lang === "ko" ? t.title.ko : t.title.en}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {lang === "ko" ? t.description.ko : t.description.en}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {open && query.trim() && results.length === 0 && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 shadow-lg text-sm text-[var(--muted)] z-50">
                {lang === "ko" ? "검색 결과가 없습니다." : "No tools found."}
              </div>
            )}
          </div>

          {/* 다크모드 토글 */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "라이트모드로 전환" : "다크모드로 전환"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--muted-bg)] text-sm transition-colors hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <div className="ml-1 flex shrink-0 gap-1">
            <button
              onClick={() => setLang("ko")}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                lang === "ko"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 dark:bg-slate-700 dark:text-slate-300 hover:bg-blue-100 hover:text-blue-600 text-slate-500"
              }`}
            >
              KO
            </button>
            <button
              onClick={() => setLang("en")}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                lang === "en"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 dark:bg-slate-700 dark:text-slate-300 hover:bg-blue-100 hover:text-blue-600 text-slate-500"
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
