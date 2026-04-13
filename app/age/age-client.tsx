"use client";

import { useState } from "react";
import {
  EmptyToolState,
  RelatedToolsSection,
  ToolFaqSection,
  ToolPageShell,
  ToolPanel,
} from "../components/tool-page-shell";
import { useLanguage } from "../language-context";
import { tools } from "../tool-content";

type AgeResult = {
  internationalAge: number;
  koreanCountingAge: number;
  completedMonths: number;
  completedWeeks: number;
  nextBirthdayDays: number;
  nextBirthdayDate: Date;
  birthDayLabel: string;
  totalDays: number;
  yearsPlusDays: number;
  yearsPlusWeeks: number;
  yearsPlusMonths: number;
};

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "날짜", "만 나이 계산기"],
    title: "만 나이 계산기",
    description:
      "생년월일을 입력하면 현재 만 나이와 다음 생일까지 남은 기간을 빠르게 확인할 수 있습니다.",
    badges: ["무료", "법적 만 나이 기준", "모바일 최적화"],
    inputTitle: "정보 입력",
    inputDescription:
      "생년월일을 입력하면 2023년 6월 개정 이후의 법적 만 나이 기준으로 결과를 계산합니다.",
    birthLabel: "생년월일",
    birthHint: "YYYY-MM-DD 형식으로 입력하거나 달력에서 선택하세요.",
    calculationDateLabel: "계산 기준일",
    calculationDateHint: "오늘 날짜를 기준으로 자동 계산됩니다.",
    calculate: "만 나이 계산하기",
    infoTitle: "이렇게 사용하세요",
    infoItems: [
      "생년월일만 입력하면 현재 만 나이와 다음 생일까지 남은 기간을 바로 계산합니다.",
      "한국식 세는 나이도 함께 보여줘서 비교 확인이 쉽습니다.",
      "입력값은 브라우저 안에서만 처리되며 별도로 저장되지 않습니다.",
    ],
    statusEmptyTitle: "아직 생년월일이 입력되지 않았어요",
    statusEmptyBody: "왼쪽 입력 카드에서 생년월일을 입력하면 바로 계산 준비 상태로 전환됩니다.",
    statusActiveTitle: "입력이 완료되었어요",
    statusActiveBody: "버튼을 누르면 오늘 기준 만 나이와 생일 정보를 계산합니다.",
    statusErrorTitle: "입력값을 확인해 주세요",
    statusSuccessTitle: "계산이 완료되었어요",
    statusSummaryLabel: "입력한 생년월일",
    statusBirthToday: "오늘이 생일입니다",
    statusBirthSoon: "다음 생일까지",
    statusBirthSoonSuffix: "일 남음",
    resultTitle: "만 나이 결과",
    resultDescription: "핵심 결과를 한눈에 보기 쉽게 정리했습니다.",
    resultBadge: "결과 완료",
    resultPrimary: "현재 만 나이",
    ageUnit: "세",
    copy: "결과 복사",
    copied: "복사 완료",
    koreanCountingAge: "세는 나이",
    completedMonths: "총 개월 수",
    completedWeeks: "총 주 수",
    totalDays: "살아온 일수",
    yearsPlusDays: "연 + 일",
    yearsPlusWeeks: "연 + 주",
    yearsPlusMonths: "연 + 개월",
    birthDayLabel: "태어난 요일",
    nextBirthday: "다음 생일까지",
    nextBirthdayToday: "오늘이 생일이에요",
    nextBirthdayDays: "일 남음",
    dayUnit: "일",
    weekUnit: "주",
    monthUnit: "개월",
    yearUnit: "년",
    summaryHint: "주민등록 등 대부분의 행정·법률 기준은 만 나이를 사용합니다.",
    emptyTitle: "만 나이를 계산해보세요",
    emptyDescription:
      "생년월일을 입력하고 버튼을 누르면 이 영역에 결과 카드가 표시됩니다.",
    faqTitle: "자주 묻는 질문",
    faqDescription: "계산 전에 많이 확인하는 질문을 먼저 정리했습니다.",
    faqs: [
      {
        question: "만 나이와 세는 나이의 차이는 무엇인가요?",
        answer:
          "만 나이는 태어난 날을 0세로 시작해 생일이 지날 때마다 한 살씩 증가합니다. 세는 나이는 태어나는 순간 1세로 보고 해가 바뀔 때마다 한 살씩 더하는 전통 방식입니다.",
      },
      {
        question: "지금 한국에서는 만 나이만 사용하나요?",
        answer:
          "대부분의 행정·법률 기준은 만 나이를 사용합니다. 다만 일부 서비스나 관습에서는 별도 기준이 남아 있을 수 있습니다.",
      },
      {
        question: "오늘이 생일이면 어떻게 표시되나요?",
        answer:
          "다음 생일까지 남은 날짜 대신 생일 안내 문구를 보여주고, 만 나이도 오늘 날짜 기준으로 바로 반영됩니다.",
      },
    ],
    relatedTitle: "관련 도구",
    relatedDescription: "날짜와 생활 계산 도구를 이어서 바로 열 수 있습니다.",
    relatedAction: "바로 열기",
    weekdays: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
  },
  en: {
    breadcrumbs: ["All tools", "Dates", "Age calculator"],
    title: "Korean Age Calculator",
    description:
      "Enter your birth date to check your international age and how long remains until your next birthday.",
    badges: ["Free", "Legal age standard", "Mobile ready"],
    inputTitle: "Enter details",
    inputDescription:
      "Results follow the legal international-age standard adopted in Korea after the June 2023 change.",
    birthLabel: "Date of birth",
    birthHint: "Use the YYYY-MM-DD format or pick a date from the calendar.",
    calculationDateLabel: "Calculation date",
    calculationDateHint: "This is always based on today.",
    calculate: "Calculate age",
    infoTitle: "How to use it",
    infoItems: [
      "Enter only the birth date to calculate the current international age and next-birthday countdown.",
      "The Korean counting age is shown alongside the international age for quick comparison.",
      "Everything is processed in the browser and not stored separately.",
    ],
    statusEmptyTitle: "No birth date entered yet",
    statusEmptyBody: "Once you enter your date of birth, the tool is ready to calculate instantly.",
    statusActiveTitle: "Input looks ready",
    statusActiveBody: "Press the button to calculate your legal age and birthday details as of today.",
    statusErrorTitle: "Please check the input",
    statusSuccessTitle: "Calculation complete",
    statusSummaryLabel: "Entered birth date",
    statusBirthToday: "Today is your birthday",
    statusBirthSoon: "Next birthday in",
    statusBirthSoonSuffix: "days",
    resultTitle: "Age summary",
    resultDescription: "The main values are grouped into a single result panel.",
    resultBadge: "Done",
    resultPrimary: "Current international age",
    ageUnit: "yrs",
    copy: "Copy result",
    copied: "Copied",
    koreanCountingAge: "Korean counting age",
    completedMonths: "Total months",
    completedWeeks: "Total weeks",
    totalDays: "Days alive",
    yearsPlusDays: "Years + days",
    yearsPlusWeeks: "Years + weeks",
    yearsPlusMonths: "Years + months",
    birthDayLabel: "Day of birth",
    nextBirthday: "Until next birthday",
    nextBirthdayToday: "Today is your birthday",
    nextBirthdayDays: "days left",
    dayUnit: "days",
    weekUnit: "weeks",
    monthUnit: "months",
    yearUnit: "yrs",
    summaryHint: "Most legal and administrative cases in Korea now use international age.",
    emptyTitle: "Calculate your age",
    emptyDescription:
      "Enter your birth date and press the button to display the result card here.",
    faqTitle: "Frequently asked questions",
    faqDescription: "A few common questions people ask before using this tool.",
    faqs: [
      {
        question: "What is the difference between international age and Korean counting age?",
        answer:
          "International age starts at zero on the day of birth and increases on each birthday. Korean counting age traditionally starts at one and increases every New Year.",
      },
      {
        question: "Is international age now the standard in Korea?",
        answer:
          "Yes, for most legal and administrative uses. Some services or habits can still show separate age conventions.",
      },
      {
        question: "What happens if today is my birthday?",
        answer:
          "The countdown is replaced with a birthday message, and the result reflects the new age immediately.",
      },
    ],
    relatedTitle: "Related tools",
    relatedDescription: "Open other date and everyday utility tools right away.",
    relatedAction: "Open now",
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
};

function getInternationalAge(birthDate: Date, today: Date) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthday =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasHadBirthday) {
    age -= 1;
  }

  return age;
}

function getNextBirthdayDate(birthDate: Date, today: Date) {
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  return nextBirthday;
}

function getCompletedMonths(startDate: Date, endDate: Date) {
  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  if (endDate.getDate() < startDate.getDate()) {
    months -= 1;
  }

  return Math.max(months, 0);
}

function getMostRecentBirthdayDate(birthDate: Date, today: Date) {
  const recentBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  if (recentBirthday > today) {
    recentBirthday.setFullYear(today.getFullYear() - 1);
  }

  return recentBirthday;
}

function formatDisplayDate(date: Date, lang: "ko" | "en") {
  if (lang === "ko") {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

export default function AgeClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [birth, setBirth] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<AgeResult | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const relatedItems = ["/dday", "/anniversary", "/characters", "/bmi"]
    .map((href) => tools.find((tool) => tool.href === href))
    .filter((tool): tool is NonNullable<(typeof tools)[number]> => Boolean(tool))
    .map((tool) => ({
      href: tool.href,
      icon: tool.icon,
      title: tool.title[lang],
      description: tool.description[lang],
      badge: tool.badge[lang],
    }));

  function calculate() {
    setCopied(false);

    if (!birth) {
      setError(t.statusErrorTitle);
      setResult(null);
      return;
    }

    const birthDate = new Date(`${birth}T00:00:00`);

    if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
      setError(t.statusErrorTitle);
      setResult(null);
      return;
    }

    const nextBirthdayDate = getNextBirthdayDate(birthDate, today);
    const mostRecentBirthdayDate = getMostRecentBirthdayDate(birthDate, today);
    const totalDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceBirthday = Math.floor(
      (today.getTime() - mostRecentBirthdayDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    setError("");
    setResult({
      internationalAge: getInternationalAge(birthDate, today),
      koreanCountingAge: today.getFullYear() - birthDate.getFullYear() + 1,
      completedMonths: getCompletedMonths(birthDate, today),
      completedWeeks: Math.floor(totalDays / 7),
      nextBirthdayDays: Math.ceil(
        (nextBirthdayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      ),
      nextBirthdayDate,
      birthDayLabel: t.weekdays[birthDate.getDay()],
      totalDays,
      yearsPlusDays: daysSinceBirthday,
      yearsPlusWeeks: Math.floor(daysSinceBirthday / 7),
      yearsPlusMonths: getCompletedMonths(mostRecentBirthdayDate, today),
    });
  }

  async function copyResult() {
    if (!result || typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    const lines =
      lang === "ko"
        ? [
            `${t.title}`,
            `${t.resultPrimary}: ${result.internationalAge}${t.ageUnit}`,
            `${t.koreanCountingAge}: ${result.koreanCountingAge}${t.ageUnit}`,
            `${t.completedMonths}: ${result.completedMonths.toLocaleString()}${t.monthUnit}`,
            `${t.completedWeeks}: ${result.completedWeeks.toLocaleString()}${t.weekUnit}`,
            `${t.totalDays}: ${result.totalDays.toLocaleString()}일`,
            `${t.yearsPlusMonths}: ${result.internationalAge}${t.yearUnit} + ${result.yearsPlusMonths}${t.monthUnit}`,
            `${t.yearsPlusWeeks}: ${result.internationalAge}${t.yearUnit} + ${result.yearsPlusWeeks}${t.weekUnit}`,
            `${t.yearsPlusDays}: ${result.internationalAge}${t.yearUnit} + ${result.yearsPlusDays}${t.dayUnit}`,
            `${t.birthDayLabel}: ${result.birthDayLabel}`,
            result.nextBirthdayDays === 0
              ? `${t.nextBirthday}: ${t.nextBirthdayToday}`
              : `${t.nextBirthday}: ${result.nextBirthdayDays}${t.nextBirthdayDays}`,
          ]
        : [
            `${t.title}`,
            `${t.resultPrimary}: ${result.internationalAge} ${t.ageUnit}`,
            `${t.koreanCountingAge}: ${result.koreanCountingAge} ${t.ageUnit}`,
            `${t.completedMonths}: ${result.completedMonths.toLocaleString()} ${t.monthUnit}`,
            `${t.completedWeeks}: ${result.completedWeeks.toLocaleString()} ${t.weekUnit}`,
            `${t.totalDays}: ${result.totalDays.toLocaleString()} days`,
            `${t.yearsPlusMonths}: ${result.internationalAge} ${t.yearUnit} + ${result.yearsPlusMonths} ${t.monthUnit}`,
            `${t.yearsPlusWeeks}: ${result.internationalAge} ${t.yearUnit} + ${result.yearsPlusWeeks} ${t.weekUnit}`,
            `${t.yearsPlusDays}: ${result.internationalAge} ${t.yearUnit} + ${result.yearsPlusDays} ${t.dayUnit}`,
            `${t.birthDayLabel}: ${result.birthDayLabel}`,
            result.nextBirthdayDays === 0
              ? `${t.nextBirthday}: ${t.nextBirthdayToday}`
              : `${t.nextBirthday}: ${result.nextBirthdayDays} ${t.nextBirthdayDays}`,
          ];

    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const hasTypedBirth = birth.length > 0;
  const statusToneClass = error
    ? "border-rose-200 bg-rose-50/80 dark:border-rose-800 dark:bg-rose-950/40"
    : result
      ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-950/40"
      : hasTypedBirth
        ? "border-blue-200 bg-blue-50/70 dark:border-blue-800 dark:bg-blue-950/40"
        : "border-[var(--card-border)] bg-[var(--muted-bg)]";
  const statusIcon = error ? "⚠️" : result ? "✅" : hasTypedBirth ? "⏳" : "🧁";
  const statusTitle = error
    ? t.statusErrorTitle
    : result
      ? t.statusSuccessTitle
      : hasTypedBirth
        ? t.statusActiveTitle
        : t.statusEmptyTitle;
  const statusBody = error
    ? t.birthHint
    : result
      ? t.summaryHint
      : hasTypedBirth
        ? t.statusActiveBody
        : t.statusEmptyBody;
  const metricCards = result
    ? [
        {
          label: t.completedMonths,
          value:
            lang === "ko"
              ? `${result.completedMonths.toLocaleString()}${t.monthUnit}`
              : `${result.completedMonths.toLocaleString()} ${t.monthUnit}`,
        },
        {
          label: t.completedWeeks,
          value:
            lang === "ko"
              ? `${result.completedWeeks.toLocaleString()}${t.weekUnit}`
              : `${result.completedWeeks.toLocaleString()} ${t.weekUnit}`,
        },
        {
          label: t.totalDays,
          value:
            lang === "ko"
              ? `${result.totalDays.toLocaleString()}${t.dayUnit}`
              : `${result.totalDays.toLocaleString()} ${t.dayUnit}`,
        },
        {
          label: t.yearsPlusMonths,
          value:
            lang === "ko"
              ? `${result.internationalAge}${t.yearUnit} + ${result.yearsPlusMonths}${t.monthUnit}`
              : `${result.internationalAge} ${t.yearUnit} + ${result.yearsPlusMonths} ${t.monthUnit}`,
        },
        {
          label: t.yearsPlusWeeks,
          value:
            lang === "ko"
              ? `${result.internationalAge}${t.yearUnit} + ${result.yearsPlusWeeks}${t.weekUnit}`
              : `${result.internationalAge} ${t.yearUnit} + ${result.yearsPlusWeeks} ${t.weekUnit}`,
        },
        {
          label: t.yearsPlusDays,
          value:
            lang === "ko"
              ? `${result.internationalAge}${t.yearUnit} + ${result.yearsPlusDays}${t.dayUnit}`
              : `${result.internationalAge} ${t.yearUnit} + ${result.yearsPlusDays} ${t.dayUnit}`,
        },
      ]
    : [];

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="🎂"
      title={t.title}
      description={t.description}
      badges={t.badges.map((label, index) => ({
        label,
        tone: index === 0 ? "green" : index === 1 ? "blue" : "amber",
      }))}
    >
      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.04fr)]">
        <div className="space-y-6">
          <ToolPanel title={t.inputTitle} description={t.inputDescription}>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-[var(--foreground)]">{t.birthLabel}</label>
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{t.birthHint}</p>
                <input
                  type="date"
                  value={birth}
                  onChange={(event) => {
                    setBirth(event.target.value);
                    setError("");
                    setCopied(false);
                  }}
                  max={formatIsoDate(today)}
                  className="mt-2 w-full rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 text-base text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[var(--foreground)]">
                  {t.calculationDateLabel}
                </label>
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  {t.calculationDateHint}
                </p>
                <div className="mt-2 rounded-2xl border border-[var(--card-border)] bg-[var(--muted-bg)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
                  {formatDisplayDate(today, lang)}
                </div>
              </div>

              <button
                type="button"
                onClick={calculate}
                disabled={!birth}
                className="w-full rounded-2xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {t.calculate}
              </button>
            </div>
          </ToolPanel>

          <ToolPanel className="border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/40" title={t.infoTitle}>
            <div className="space-y-2 text-sm leading-6 text-[var(--muted)]">
              {t.infoItems.map((item) => (
                <p key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </ToolPanel>
        </div>

        <div className="space-y-6">
          <ToolPanel className={statusToneClass}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--card)] text-2xl shadow-sm">
                {statusIcon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)]">{statusTitle}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{statusBody}</p>

                {hasTypedBirth ? (
                  <div className="mt-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3">
                    <div className="text-xs font-medium text-[var(--muted)]">{t.statusSummaryLabel}</div>
                    <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">{birth}</div>
                    {result ? (
                      <div className="mt-2 text-xs text-[var(--muted)]">
                        {result.nextBirthdayDays === 0
                          ? t.statusBirthToday
                          : `${t.statusBirthSoon} ${result.nextBirthdayDays}${lang === "ko" ? t.statusBirthSoonSuffix : ` ${t.statusBirthSoonSuffix}`}`}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </ToolPanel>

          {result ? (
            <ToolPanel
              title={t.resultTitle}
              description={t.resultDescription}
              className="border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white">
                  {t.resultBadge}
                </span>
                <button
                  type="button"
                  onClick={copyResult}
                  className="rounded-xl bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-600"
                >
                  {copied ? t.copied : t.copy}
                </button>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="rounded-[24px] border border-emerald-200 bg-[var(--card)] px-5 py-6 shadow-sm dark:border-emerald-800">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                    {t.resultPrimary}
                  </div>
                  <div className="mt-3 text-5xl font-bold tracking-tight text-[var(--foreground)]">
                    {result.internationalAge}
                    <span className="ml-2 text-2xl font-semibold text-[var(--muted)]">
                      {t.ageUnit}
                    </span>
                  </div>
                  <div className="mt-4 rounded-2xl border border-[var(--card-border)] bg-[var(--muted-bg)] px-4 py-3">
                    <div className="text-xs font-medium text-[var(--muted)]">{t.birthDayLabel}</div>
                    <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                      {result.birthDayLabel}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{t.summaryHint}</p>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-2xl border border-emerald-200 bg-[var(--card)] px-4 py-4 dark:border-emerald-800">
                    <div className="text-xs font-medium text-[var(--muted)]">{t.koreanCountingAge}</div>
                    <div className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                      {result.koreanCountingAge}
                      <span className="ml-1 text-base font-medium text-[var(--muted)]">
                        {t.ageUnit}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-[var(--card)] px-4 py-4 dark:border-emerald-800">
                    <div className="text-xs font-medium text-[var(--muted)]">{t.nextBirthday}</div>
                    <div className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                      {result.nextBirthdayDays === 0
                        ? t.nextBirthdayToday
                        : `${result.nextBirthdayDays}${lang === "ko" ? t.nextBirthdayDays : ` ${t.nextBirthdayDays}`}`}
                    </div>
                    {result.nextBirthdayDays > 0 ? (
                      <div className="mt-1 text-xs text-[var(--muted)]">
                        {formatDisplayDate(result.nextBirthdayDate, lang)}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {metricCards.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-emerald-200 bg-[var(--card)] px-4 py-4 dark:border-emerald-800"
                  >
                    <div className="text-xs font-medium text-[var(--muted)]">{metric.label}</div>
                    <div className="mt-2 text-xl font-bold text-[var(--foreground)]">{metric.value}</div>
                  </div>
                ))}
              </div>
            </ToolPanel>
          ) : (
            <EmptyToolState icon="🎂" title={t.emptyTitle} description={t.emptyDescription} />
          )}
        </div>
      </div>

      <div className="mt-10 space-y-10">
        <ToolFaqSection
          title={t.faqTitle}
          description={t.faqDescription}
          items={t.faqs}
        />
        <RelatedToolsSection
          title={t.relatedTitle}
          description={t.relatedDescription}
          actionLabel={t.relatedAction}
          items={relatedItems}
        />
      </div>
    </ToolPageShell>
  );
}
