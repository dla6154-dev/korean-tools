"use client";

import Link from "next/link";
import { useLanguage } from "./language-context";

const T = {
  ko: {
    summary: "빠르고 무료인 한국형 유틸리티 도구 모음",
    categories: "도구 카테고리",
    quick: "빠른 링크",
    info: "정보",
    copyright: "© 2026 Korean Tools. 모든 권리 보유.",
    links: {
      allTools: "전체 도구 보기",
      dates: "날짜 · 기간",
      text: "텍스트 도구",
      image: "이미지 도구",
      life: "생활 계산",
      popular: "인기 도구",
      discover: "추천 도구",
      faq: "자주 묻는 질문",
      updates: "업데이트 내역",
      about: "서비스 소개",
      privacy: "개인정보처리방침",
      terms: "이용약관",
      feedback: "문의하기",
    },
  },
  en: {
    summary: "Fast and free Korean-first utility tools.",
    categories: "Categories",
    quick: "Quick Links",
    info: "Information",
    copyright: "© 2026 Korean Tools. All rights reserved.",
    links: {
      allTools: "Browse all tools",
      dates: "Dates & time",
      text: "Text tools",
      image: "Image tools",
      life: "Life calculators",
      popular: "Popular tools",
      discover: "Discover more",
      faq: "FAQ",
      updates: "Updates",
      about: "About",
      privacy: "Privacy",
      terms: "Terms",
      feedback: "Feedback",
    },
  },
};

export default function Footer() {
  const { lang } = useLanguage();
  const t = T[lang];

  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-sm font-bold text-white">
                K
              </span>
              <span className="text-lg font-semibold text-white">Korean Tools</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">{t.summary}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">{t.categories}</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link href="/#categories" className="block transition hover:text-white">
                {t.links.allTools}
              </Link>
              <Link href="/#date-tools" className="block transition hover:text-white">
                {t.links.dates}
              </Link>
              <Link href="/#text-tools" className="block transition hover:text-white">
                {t.links.text}
              </Link>
              <Link href="/#image-tools" className="block transition hover:text-white">
                {t.links.image}
              </Link>
              <Link href="/#life-tools" className="block transition hover:text-white">
                {t.links.life}
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">{t.quick}</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link href="/#popular-tools" className="block transition hover:text-white">
                {t.links.popular}
              </Link>
              <Link href="/#discover-tools" className="block transition hover:text-white">
                {t.links.discover}
              </Link>
              <Link href="/#faq" className="block transition hover:text-white">
                {t.links.faq}
              </Link>
              <Link href="/updates" className="block transition hover:text-white">
                {t.links.updates}
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">{t.info}</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link href="/about" className="block transition hover:text-white">
                {t.links.about}
              </Link>
              <Link href="/privacy" className="block transition hover:text-white">
                {t.links.privacy}
              </Link>
              <Link href="/terms" className="block transition hover:text-white">
                {t.links.terms}
              </Link>
              <Link href="/feedback" className="block transition hover:text-white">
                {t.links.feedback}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-xs text-slate-500 md:flex md:items-center md:justify-between">
          <p>{t.copyright}</p>
          <div className="mt-3 flex gap-4 md:mt-0">
            <Link href="/privacy" className="transition hover:text-slate-300">
              {t.links.privacy}
            </Link>
            <Link href="/terms" className="transition hover:text-slate-300">
              {t.links.terms}
            </Link>
            <Link href="/feedback" className="transition hover:text-slate-300">
              {t.links.feedback}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
