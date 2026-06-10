"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useDeferredValue, useState } from "react";
import { growthHomepagePromotions } from "./data/growth-config";
import { useLanguage } from "./language-context";
import { categories, faqItems, tools, trustHighlights, type ToolAccent } from "./tool-content";

const T = {
  ko: {
    eyebrow: "무료 · 빠른 · 로그인 불필요",
    title: "필요한 도구, 바로 찾고 바로 쓰세요",
    description:
      "날짜 계산, 텍스트 변환, 이미지 처리, 생활 계산까지. 한국에서 자주 쓰는 실용 도구를 한곳에 모았습니다.",
    searchPlaceholder: "찾고 싶은 도구를 입력하세요 (예: 나이 계산기, 글자수)",
    searchButton: "검색",
    browseAll: "전체 도구 보기",
    browsePopular: "인기 도구 보기",
    heroHighlights: ["무료 도구", "로그인 없음", "브라우저에서 바로 사용"],
    categoryTitle: "카테고리별 도구 둘러보기",
    categoryDescription: "원하는 작업 흐름에 맞는 도구 묶음을 빠르게 찾을 수 있습니다.",
    categoryDirectoryTitle: "카테고리 안의 전체 도구",
    categoryDirectoryDescription: "각 카테고리에 포함된 도구를 바로 열 수 있습니다.",
    popularTitle: "인기 도구",
    popularDescription: "가장 자주 쓰는 도구를 먼저 배치했습니다.",
    discoverTitle: "추천 도구",
    discoverDescription: "메인에서 자주 놓치는 도구도 함께 둘러보세요.",
    whyTitle: "왜 Korean Tools인가요?",
    whyDescription: "복잡한 가입 없이, 필요한 순간에 바로 쓰는 도구 경험에 집중했습니다.",
    faqTitle: "자주 묻는 질문",
    faqDescription: "사용 전에 많이 묻는 핵심 질문만 먼저 정리했습니다.",
    noResults: "일치하는 도구를 찾지 못했습니다.",
    quickResultLabel: "바로 열기",
    useTool: "바로 사용하기",
    moreToolsCardTitle: "더 많은 도구 둘러보기",
    moreToolsCardDescription: "카테고리별로 정리된 도구를 한 번에 살펴보세요.",
    moreToolsCardAction: "카테고리 보기",
    sectionAll: "전체 보기",
  },
  en: {
    eyebrow: "Free · Fast · No login",
    title: "Find the tool you need and use it right away",
    description:
      "From date calculations to text cleanup, image optimization, and everyday calculators, this is a Korean-first utility hub.",
    searchPlaceholder: "Search tools (e.g. age calculator, character counter)",
    searchButton: "Search",
    browseAll: "Browse all tools",
    browsePopular: "View popular tools",
    heroHighlights: ["Free tools", "No login", "Runs in your browser"],
    categoryTitle: "Browse by category",
    categoryDescription: "Find grouped tools based on the job you need to get done.",
    categoryDirectoryTitle: "Tools inside each category",
    categoryDirectoryDescription: "Open the full list of tools grouped under each category.",
    popularTitle: "Popular tools",
    popularDescription: "The tools people use most often are placed first.",
    discoverTitle: "More to explore",
    discoverDescription: "Useful tools beyond the headline features.",
    whyTitle: "Why Korean Tools?",
    whyDescription: "Built for quick use without sign-up or extra friction.",
    faqTitle: "Frequently asked questions",
    faqDescription: "The most common questions, answered upfront.",
    noResults: "No matching tool found.",
    quickResultLabel: "Open now",
    useTool: "Open tool",
    moreToolsCardTitle: "Browse more tools",
    moreToolsCardDescription: "Explore tools grouped by category.",
    moreToolsCardAction: "View categories",
    sectionAll: "View all",
  },
};

const accentStyles: Record<
  ToolAccent,
  {
    badge: string;
    icon: string;
    link: string;
    bar: string;
    sectionBg: string;
    chipBorder: string;
  }
> = {
  blue: {
    badge: "bg-blue-50 text-blue-600",
    icon: "bg-blue-50 text-blue-600",
    link: "text-blue-600",
    bar: "bg-blue-500",
    sectionBg: "bg-[var(--card)]",
    chipBorder: "border-blue-200 bg-blue-50 text-blue-700",
  },
  green: {
    badge: "bg-emerald-50 text-emerald-600",
    icon: "bg-emerald-50 text-emerald-600",
    link: "text-emerald-600",
    bar: "bg-emerald-500",
    sectionBg: "bg-[var(--card)] dark:bg-[var(--card)]",
    chipBorder: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  orange: {
    badge: "bg-orange-50 text-orange-600",
    icon: "bg-orange-50 text-orange-600",
    link: "text-orange-600",
    bar: "bg-orange-500",
    sectionBg: "bg-[var(--card)]",
    chipBorder: "border-orange-200 bg-orange-50 text-orange-700",
  },
  violet: {
    badge: "bg-violet-50 text-violet-600",
    icon: "bg-violet-50 text-violet-600",
    link: "text-violet-600",
    bar: "bg-violet-500",
    sectionBg: "bg-[var(--card)] dark:bg-[var(--card)]",
    chipBorder: "border-violet-200 bg-violet-50 text-violet-700",
  },
};

function ToolCard({
  href,
  icon,
  title,
  description,
  badge,
  action,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.18)] transition-all duration-200 hover:-translate-y-2 hover:border-blue-300 hover:shadow-[0_28px_48px_-20px_rgba(37,99,235,0.25)]"
    >
      {/* hover 시 배경 글로우 */}
      <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-blue-50/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--card-border)] bg-[var(--muted-bg)] text-lg shadow-sm transition-transform duration-200 group-hover:scale-110">
          {icon}
        </div>
        <span className="rounded-md bg-[var(--muted-bg)] px-2 py-1 text-[11px] font-semibold text-[var(--muted)] transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
          {badge}
        </span>
      </div>
      <h3 className="relative mt-4 text-base font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="relative mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{description}</p>
      <div className="relative mt-5 inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-all duration-200 group-hover:border-blue-300 group-hover:bg-blue-500 group-hover:text-white">
        <span>{action}</span>
        <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}

export default function HomePageClient() {
  const { lang } = useLanguage();
  const router = useRouter();
  const t = T[lang];
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const deferredQuery = useDeferredValue(query);
  const featuredTools = tools.filter((tool) => tool.featured);
  const promotedTools = growthHomepagePromotions
    .map((promotion) => tools.find((tool) => tool.href === promotion.route))
    .filter((tool): tool is NonNullable<(typeof tools)[number]> => Boolean(tool));
  const discoverTools = Array.from(
    new Map(
      [...promotedTools, ...tools.filter((tool) => tool.discover)].map((tool) => [tool.href, tool]),
    ).values(),
  );
  const categoryGroups = categories.map((category) => ({
    ...category,
    items: tools.filter((tool) => tool.categoryId === category.id),
  }));
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? tools
        .filter((tool) => {
          const text = [
            tool.title.ko,
            tool.title.en,
            tool.description.ko,
            tool.description.en,
            ...tool.keywords,
          ]
            .join(" ")
            .toLowerCase();

          return text.includes(normalizedQuery);
        })
        .slice(0, 5)
    : [];

  const activeSearchResults = deferredQuery.trim() ? searchResults : [];

  function handleSearch(targetHref?: string) {
    const normalized = query.trim().toLowerCase();
    const topMatch =
      targetHref ??
      tools.find((tool) => {
        const text = [
          tool.title.ko,
          tool.title.en,
          tool.description.ko,
          tool.description.en,
          ...tool.keywords,
        ]
          .join(" ")
          .toLowerCase();

        return text.includes(normalized);
      })?.href;

    if (!topMatch) {
      return;
    }

    startTransition(() => {
      router.push(topMatch);
      setQuery("");
    });
  }

  return (
    <div className="bg-[var(--background)]">
      <section className="relative overflow-hidden py-8 md:py-10">
        {/* 배경 글로우 */}
        <div className="absolute -left-32 -top-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="rounded-[36px] bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 px-5 py-8 text-center shadow-[0_32px_80px_-24px_rgba(15,23,42,0.5)] md:px-10 md:py-12">
            {/* 내부 글로우 장식 */}
            <div className="pointer-events-none absolute inset-0 rounded-[36px] overflow-hidden">
              <div className="absolute -top-20 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
            </div>

            <div className="relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t.eyebrow}
            </div>
            <h1 className="relative mx-auto mt-6 max-w-4xl break-keep text-balance text-4xl font-bold tracking-tight text-white md:text-6xl"
              style={{ textShadow: "0 0 60px rgba(147,197,253,0.3)" }}>
              {t.title}
            </h1>
            <p className="relative mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-white/70 md:text-lg">
              {t.description}
            </p>

            <div className="relative mx-auto mt-8 max-w-3xl">
              <div className="rounded-[28px] border border-white/10 bg-white/95 p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)]">
                <div className="flex flex-col gap-2 md:flex-row">
                  <div className="flex flex-1 items-center gap-3 rounded-2xl px-4 py-3">
                    <span className="text-lg">🔍</span>
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      placeholder={t.searchPlaceholder}
                      className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] md:text-base"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSearch()}
                    className="rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                  >
                    {t.searchButton}
                  </button>
                </div>

                {deferredQuery.trim() ? (
                  <div className="mt-2 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-2 text-left shadow-[0_18px_40px_-28px_rgba(15,23,42,0.24)]">
                    {activeSearchResults.length > 0 ? (
                      activeSearchResults.map((tool) => (
                        <button
                          key={tool.href}
                          type="button"
                          onMouseDown={() => handleSearch(tool.href)}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-3 transition hover:bg-[var(--muted-bg)]"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--muted-bg)] text-sm">
                              {tool.icon}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                                {tool.title[lang]}
                              </p>
                              <p className="truncate text-xs text-[var(--muted)]">
                                {tool.description[lang]}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-blue-600">
                            {t.quickResultLabel}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-3 text-sm text-[var(--muted)]">{t.noResults}</p>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="relative mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/#categories"
                className="rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                {t.browseAll}
              </Link>
              <Link
                href="/#popular-tools"
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                {t.browsePopular}
              </Link>
            </div>

            <div className="relative mt-6 grid gap-3 text-left sm:grid-cols-3">
              {t.heroHighlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/8 px-5 py-4 backdrop-blur-sm"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  <p className="text-sm font-semibold text-white/90">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="scroll-mt-24 py-6 md:py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-[32px] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.22)] md:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)] md:text-3xl">{t.categoryTitle}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)] md:text-base">
                  {t.categoryDescription}
                </p>
              </div>
              <Link href="/#category-directory" className="hidden text-sm font-semibold text-blue-600 md:block">
                {t.sectionAll} →
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {categories.map((category) => {
                const accent = accentStyles[category.accent];

                return (
                  <section
                    key={category.id}
                    id={category.id}
                    className="scroll-mt-24 rounded-[24px] border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.18)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 text-xl shadow-sm ${accent.icon}`}
                      >
                        {category.icon}
                      </div>
                      <span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${accent.badge}`}>
                        {category.countLabel[lang]}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{category.title[lang]}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{category.description[lang]}</p>
                    <div className="mt-4 border-t border-[var(--card-border)] pt-4 text-sm text-[var(--foreground)]">
                      {category.examples.map((item) => {
                        const matchedTool = tools.find((t) => t.title.ko === item.ko);
                        return matchedTool ? (
                          <Link key={item.ko} href={matchedTool.href} className="flex items-center gap-2 py-1.5 transition-colors hover:text-blue-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
                            <span>{item[lang]}</span>
                          </Link>
                        ) : (
                          <div key={item.ko} className="flex items-center gap-2 py-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
                            <span>{item[lang]}</span>
                          </div>
                        );
                      })}
                    </div>
                    <Link href={`/#category-${category.id}`} className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${accent.link}`}>
                      <span>{t.sectionAll}</span>
                      <span aria-hidden>→</span>
                    </Link>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="popular-tools" className="scroll-mt-24 py-6 md:py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-[32px] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.22)] md:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)] md:text-3xl">{t.popularTitle}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)] md:text-base">
                  {t.popularDescription}
                </p>
              </div>
              <Link href="/#categories" className="hidden text-sm font-semibold text-blue-600 md:block">
                {t.sectionAll} →
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {featuredTools.map((tool) => (
                <ToolCard
                  key={tool.href}
                  href={tool.href}
                  icon={tool.icon}
                  title={tool.title[lang]}
                  description={tool.description[lang]}
                  badge={tool.badge[lang]}
                  action={t.useTool}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="category-directory" className="scroll-mt-24 py-6 md:py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-[32px] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.22)] md:p-8">
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] md:text-3xl">
                {t.categoryDirectoryTitle}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)] md:text-base">
                {t.categoryDirectoryDescription}
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {categoryGroups.map((category) => {
                const accent = accentStyles[category.accent];

                return (
                  <section
                    key={category.id}
                    id={`category-${category.id}`}
                    className={`scroll-mt-24 overflow-hidden rounded-[24px] border border-[var(--card-border)] ${accent.sectionBg} shadow-sm`}
                  >
                    {/* 상단 컬러 액센트 바 */}
                    <div className={`h-1 w-full ${accent.bar}`} />

                    <div className="p-5 md:p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/80 text-xl shadow-sm ${accent.icon}`}
                          >
                            {category.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-[var(--foreground)]">
                              {category.title[lang]}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                              {category.description[lang]}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`w-fit rounded-full border px-3 py-1 text-[11px] font-semibold ${accent.chipBorder}`}
                        >
                          {category.countLabel[lang]}
                        </span>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {category.items.map((tool) => (
                          <ToolCard
                            key={tool.href}
                            href={tool.href}
                            icon={tool.icon}
                            title={tool.title[lang]}
                            description={tool.description[lang]}
                            badge={tool.badge[lang]}
                            action={t.useTool}
                          />
                        ))}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="discover-tools" className="scroll-mt-24 py-6 md:py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-[32px] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.22)] md:p-8">
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] md:text-3xl">{t.discoverTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)] md:text-base">
                {t.discoverDescription}
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-4">
              {discoverTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex h-full flex-col rounded-[24px] border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_24px_50px_-34px_rgba(37,99,235,0.22)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--card-border)] bg-[var(--muted-bg)] text-lg shadow-sm">
                      {tool.icon}
                    </span>
                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600">
                      {tool.badge[lang]}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[var(--foreground)]">{tool.title[lang]}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{tool.description[lang]}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                    <span>{t.quickResultLabel}</span>
                    <span aria-hidden>→</span>
                  </div>
                </Link>
              ))}

              <Link
                href="/#category-directory"
                className="group rounded-[24px] border border-dashed border-[var(--card-border)] bg-[var(--card)] p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.14)] transition hover:border-blue-200 hover:bg-blue-50/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-lg text-blue-600 shadow-sm">
                  ➕
                </div>
                <h3 className="mt-4 text-base font-semibold text-[var(--foreground)]">{t.moreToolsCardTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{t.moreToolsCardDescription}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <span>{t.moreToolsCardAction}</span>
                  <span aria-hidden>→</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 md:py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-[32px] border border-blue-100 bg-[linear-gradient(180deg,rgba(239,246,255,0.92),rgba(255,255,255,0.98))] p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.2)] md:p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[var(--foreground)] md:text-3xl">{t.whyTitle}</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] md:text-base">
                {t.whyDescription}
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              {trustHighlights.map((item) => (
                <div
                  key={item.title.ko}
                  className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-sm"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <h3 className="mt-5 text-sm font-semibold text-[var(--foreground)]">{item.title[lang]}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 py-6 md:py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-[32px] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.22)] md:p-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)] md:text-3xl">{t.faqTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)] md:text-base">{t.faqDescription}</p>

            <div className="mt-8 space-y-3">
              {faqItems.map((item, index) => {
                const open = openFaq === index;

                return (
                  <div
                    key={item.question.ko}
                    className={`overflow-hidden rounded-2xl border ${
                      open ? "border-blue-200 bg-blue-50/70 dark:border-blue-800 dark:bg-blue-950/40" : "border-[var(--card-border)] bg-[var(--card)]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className={`text-sm font-semibold md:text-base ${open ? "text-blue-600" : "text-[var(--foreground)]"}`}>
                        Q. {item.question[lang]}
                      </span>
                      <span className={`text-xs ${open ? "text-blue-600" : "text-[var(--muted)]"}`}>
                        {open ? "▲" : "▼"}
                      </span>
                    </button>
                    {open ? (
                      <div className="border-t border-blue-100 px-5 py-4 text-sm leading-6 text-[var(--muted)]">
                        A. {item.answer[lang]}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
