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

type WeekdayResult = {
  date: Date;
  weekdayIndex: number;
  weekdayName: string;
  weekdayNameEn: string;
  isWeekend: boolean;
  isHolidayCandidate: boolean;
  weekOfYear: number;
  dayOfYear: number;
  daysUntilWeekend: number;
  quarter: number;
};

const WEEKDAYS_KO = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
const WEEKDAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAYS_KO_SHORT = ["일", "월", "화", "수", "목", "금", "토"];

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "날짜", "요일 계산기"],
    title: "요일 계산기",
    description:
      "특정 날짜가 무슨 요일인지, 올해 몇 번째 날인지, 몇 주차인지를 바로 확인합니다.",
    badges: ["무료", "날짜 계산", "모바일 최적화"],
    inputTitle: "날짜 입력",
    inputDescription: "요일을 확인하고 싶은 날짜를 선택하세요.",
    dateLabel: "날짜",
    dateHint: "요일을 확인할 날짜를 선택하거나 직접 입력하세요.",
    calculate: "요일 확인하기",
    infoTitle: "이렇게 사용하세요",
    infoItems: [
      "날짜를 선택하면 요일, 주차, 연중 일수를 한번에 확인합니다.",
      "태어난 날의 요일, 중요한 날의 요일 확인에 바로 활용하세요.",
      "입력값은 브라우저 안에서만 처리되며 별도로 저장되지 않습니다.",
    ],
    statusEmptyTitle: "날짜를 선택해 주세요",
    statusEmptyBody: "날짜를 선택하면 바로 계산 준비 상태로 전환됩니다.",
    statusActiveTitle: "입력이 완료되었어요",
    statusActiveBody: "버튼을 누르면 요일 정보를 바로 확인할 수 있습니다.",
    statusErrorTitle: "입력값을 확인해 주세요",
    statusSuccessTitle: "계산이 완료되었어요",
    resultTitle: "요일 결과",
    resultDescription: "선택한 날짜의 요일과 상세 정보입니다.",
    resultBadge: "결과 완료",
    weekdayLabel: "요일",
    weekendLabel: "주말",
    weekdayMainLabel: "평일",
    weekOfYearLabel: "올해 몇 주차",
    dayOfYearLabel: "올해 몇 번째 날",
    quarterLabel: "분기",
    daysUntilWeekendLabel: "주말까지",
    copy: "결과 복사",
    copied: "복사 완료",
    emptyTitle: "요일을 확인해보세요",
    emptyDescription:
      "날짜를 선택하고 버튼을 누르면 이 영역에 결과 카드가 표시됩니다.",
    weekUnit: "주차",
    dayUnit: "일째",
    quarterUnit: "분기",
    daysUnit: "일 후",
    todayWeekend: "오늘이 주말이에요",
    faqTitle: "자주 묻는 질문",
    faqDescription: "요일 계산에서 자주 묻는 질문을 정리했습니다.",
    faqs: [
      {
        question: "과거 날짜의 요일도 계산할 수 있나요?",
        answer:
          "네. 연도 제한 없이 과거와 미래 날짜 모두 계산 가능합니다.",
      },
      {
        question: "주차는 어떻게 계산되나요?",
        answer:
          "ISO 기준이 아닌 1월 1일 기준으로 몇 번째 주인지를 계산합니다. (1월 1일 = 1주차)",
      },
      {
        question: "분기는 어떻게 나뉘나요?",
        answer:
          "1~3월이 1분기, 4~6월이 2분기, 7~9월이 3분기, 10~12월이 4분기입니다.",
      },
    ],
    relatedTitle: "관련 도구",
    relatedDescription: "날짜와 생활 계산 도구를 이어서 바로 열 수 있습니다.",
    relatedAction: "바로 열기",
    weekCalendar: "이번 주 달력",
  },
  en: {
    breadcrumbs: ["All tools", "Dates", "Day of week calculator"],
    title: "Day of Week Calculator",
    description:
      "Find out what day of the week any date falls on, along with the week number and day of year.",
    badges: ["Free", "Date calculator", "Mobile ready"],
    inputTitle: "Enter a date",
    inputDescription: "Select the date you want to check.",
    dateLabel: "Date",
    dateHint: "Pick or type any date to see what day of the week it falls on.",
    calculate: "Check day of week",
    infoTitle: "How to use it",
    infoItems: [
      "Select a date to see the weekday, week number, and day of year all at once.",
      "Useful for checking birthdays, public holidays, or project milestones.",
      "All calculations happen in your browser and nothing is stored.",
    ],
    statusEmptyTitle: "Select a date",
    statusEmptyBody: "Once you pick a date, the tool will be ready to calculate.",
    statusActiveTitle: "Ready to calculate",
    statusActiveBody: "Press the button to see the day of week and details.",
    statusErrorTitle: "Please check the input",
    statusSuccessTitle: "Calculation complete",
    resultTitle: "Day of week result",
    resultDescription: "Weekday and additional date details.",
    resultBadge: "Done",
    weekdayLabel: "Day of week",
    weekendLabel: "Weekend",
    weekdayMainLabel: "Weekday",
    weekOfYearLabel: "Week of year",
    dayOfYearLabel: "Day of year",
    quarterLabel: "Quarter",
    daysUntilWeekendLabel: "Days until weekend",
    copy: "Copy result",
    copied: "Copied",
    emptyTitle: "Check any date",
    emptyDescription:
      "Select a date and press the button to display the result card here.",
    weekUnit: "",
    dayUnit: "",
    quarterUnit: "Q",
    daysUnit: "days away",
    todayWeekend: "It's already the weekend",
    faqTitle: "Frequently asked questions",
    faqDescription: "Common questions about day of week calculations.",
    faqs: [
      {
        question: "Can I check dates in the past?",
        answer:
          "Yes. The tool works for any past or future date without year restrictions.",
      },
      {
        question: "How is the week number calculated?",
        answer:
          "The week number counts from January 1st as week 1. It does not follow the ISO 8601 standard.",
      },
      {
        question: "How are quarters defined?",
        answer:
          "Q1 is January–March, Q2 is April–June, Q3 is July–September, and Q4 is October–December.",
      },
    ],
    relatedTitle: "Related tools",
    relatedDescription: "Open other date and everyday utility tools right away.",
    relatedAction: "Open now",
    weekCalendar: "This week",
  },
};

function getWeekOfYear(date: Date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  return Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
}

function getDayOfYear(date: Date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  return Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

function formatDisplayDate(date: Date, lang: "ko" | "en") {
  if (lang === "ko") {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  }
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function WeekdayPage() {
  const { lang } = useLanguage();
  const t = T[lang];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [dateInput, setDateInput] = useState(formatIsoDate(today));
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<WeekdayResult | null>(null);

  const relatedItems = ["/date-calc", "/date-diff", "/dday", "/age"]
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
    setError("");

    if (!dateInput) {
      setError(t.statusErrorTitle);
      setResult(null);
      return;
    }

    const date = new Date(`${dateInput}T00:00:00`);
    if (isNaN(date.getTime())) {
      setError(t.statusErrorTitle);
      setResult(null);
      return;
    }

    const weekdayIndex = date.getDay();
    const isWeekend = weekdayIndex === 0 || weekdayIndex === 6;
    const daysUntilWeekend = isWeekend ? 0 : 6 - weekdayIndex;
    const quarter = Math.floor(date.getMonth() / 3) + 1;

    setResult({
      date,
      weekdayIndex,
      weekdayName: WEEKDAYS_KO[weekdayIndex],
      weekdayNameEn: WEEKDAYS_EN[weekdayIndex],
      isWeekend,
      isHolidayCandidate: weekdayIndex === 0 || weekdayIndex === 6,
      weekOfYear: getWeekOfYear(date),
      dayOfYear: getDayOfYear(date),
      daysUntilWeekend,
      quarter,
    });
  }

  async function copyResult() {
    if (!result || typeof navigator === "undefined" || !navigator.clipboard) return;
    const text =
      lang === "ko"
        ? [
            t.title,
            `날짜: ${formatDisplayDate(result.date, "ko")}`,
            `요일: ${result.weekdayName}`,
            `올해 ${result.weekOfYear}주차`,
            `올해 ${result.dayOfYear}번째 날`,
            `${result.quarter}분기`,
          ].join("\n")
        : [
            t.title,
            `Date: ${formatDisplayDate(result.date, "en")}`,
            `Day: ${result.weekdayNameEn}`,
            `Week ${result.weekOfYear} of the year`,
            `Day ${result.dayOfYear} of the year`,
            `Q${result.quarter}`,
          ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const statusToneClass = error
    ? "border-rose-200 bg-rose-50/80"
    : result
      ? "border-emerald-200 bg-emerald-50/70"
      : dateInput
        ? "border-blue-200 bg-blue-50/70"
        : "border-slate-200 bg-slate-50";
  const statusIcon = error ? "⚠️" : result ? "✅" : dateInput ? "⏳" : "🗓️";
  const statusTitle = error
    ? t.statusErrorTitle
    : result
      ? t.statusSuccessTitle
      : dateInput
        ? t.statusActiveTitle
        : t.statusEmptyTitle;
  const statusBody = error
    ? t.dateHint
    : result
      ? (lang === "ko"
          ? `${formatDisplayDate(result.date, "ko")} · ${result.weekdayName}`
          : `${formatDisplayDate(result.date, "en")} · ${result.weekdayNameEn}`)
      : dateInput
        ? t.statusActiveBody
        : t.statusEmptyBody;

  // Build weekly mini calendar
  const weekDays = result
    ? Array.from({ length: 7 }, (_, i) => {
        const d = new Date(result.date);
        d.setDate(d.getDate() - result.weekdayIndex + i);
        return d;
      })
    : null;

  const weekdayColors = [
    "text-rose-500", // 일
    "text-slate-800",
    "text-slate-800",
    "text-slate-800",
    "text-slate-800",
    "text-slate-800",
    "text-blue-500", // 토
  ];

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="🗓️"
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
                <label className="text-sm font-semibold text-slate-800">{t.dateLabel}</label>
                <p className="mt-1 text-xs leading-5 text-slate-400">{t.dateHint}</p>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => {
                    setDateInput(e.target.value);
                    setError("");
                    setCopied(false);
                    setResult(null);
                  }}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                onClick={calculate}
                disabled={!dateInput}
                className="w-full rounded-2xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {t.calculate}
              </button>
            </div>
          </ToolPanel>

          <ToolPanel className="border-amber-200 bg-amber-50/80" title={t.infoTitle}>
            <div className="space-y-2 text-sm leading-6 text-slate-700">
              {t.infoItems.map((item) => (
                <p key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </ToolPanel>
        </div>

        <div className="space-y-6">
          <ToolPanel className={statusToneClass}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                {statusIcon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{statusTitle}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{statusBody}</p>
              </div>
            </div>
          </ToolPanel>

          {result ? (
            <ToolPanel
              title={t.resultTitle}
              description={t.resultDescription}
              className="border-emerald-200 bg-emerald-50/80"
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

              {/* Main weekday display */}
              <div className="mt-5 rounded-[24px] border border-emerald-200 bg-white px-5 py-6 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  {t.weekdayLabel}
                </div>
                <div className={`mt-3 text-5xl font-bold tracking-tight ${weekdayColors[result.weekdayIndex]}`}>
                  {lang === "ko" ? result.weekdayName : result.weekdayNameEn}
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  {formatDisplayDate(result.date, lang)}
                </div>
                <span
                  className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    result.isWeekend
                      ? "bg-rose-50 text-rose-600"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {result.isWeekend ? t.weekendLabel : t.weekdayMainLabel}
                </span>
              </div>

              {/* Stats grid */}
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-4">
                  <div className="text-xs font-medium text-slate-400">{t.weekOfYearLabel}</div>
                  <div className="mt-2 text-xl font-bold text-slate-900">
                    {lang === "ko" ? `${result.weekOfYear}${t.weekUnit}` : `Week ${result.weekOfYear}`}
                  </div>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-4">
                  <div className="text-xs font-medium text-slate-400">{t.dayOfYearLabel}</div>
                  <div className="mt-2 text-xl font-bold text-slate-900">
                    {lang === "ko" ? `${result.dayOfYear}${t.dayUnit}` : `Day ${result.dayOfYear}`}
                  </div>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-4">
                  <div className="text-xs font-medium text-slate-400">{t.quarterLabel}</div>
                  <div className="mt-2 text-xl font-bold text-slate-900">
                    {lang === "ko" ? `${result.quarter}${t.quarterUnit}` : `${t.quarterUnit}${result.quarter}`}
                  </div>
                </div>
              </div>

              {/* Days until weekend */}
              {!result.isWeekend && (
                <div className="mt-3 rounded-2xl border border-emerald-200 bg-white px-4 py-4">
                  <div className="text-xs font-medium text-slate-400">{t.daysUntilWeekendLabel}</div>
                  <div className="mt-2 text-xl font-bold text-slate-900">
                    {lang === "ko" ? `${result.daysUntilWeekend}${t.daysUnit}` : `${result.daysUntilWeekend} ${t.daysUnit}`}
                  </div>
                </div>
              )}

              {/* Mini weekly calendar */}
              {weekDays && (
                <div className="mt-3 rounded-2xl border border-emerald-200 bg-white px-4 py-4">
                  <div className="mb-3 text-xs font-medium text-slate-400">{t.weekCalendar}</div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {WEEKDAYS_KO_SHORT.map((d, i) => (
                      <div key={d} className={`text-xs font-semibold ${weekdayColors[i]}`}>
                        {d}
                      </div>
                    ))}
                    {weekDays.map((d, i) => (
                      <div
                        key={i}
                        className={`rounded-xl py-2 text-sm font-bold ${
                          d.getTime() === result.date.getTime()
                            ? "bg-blue-500 text-white"
                            : weekdayColors[i] === "text-rose-500"
                              ? "text-rose-400"
                              : weekdayColors[i] === "text-blue-500"
                                ? "text-blue-400"
                                : "text-slate-700"
                        }`}
                      >
                        {d.getDate()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ToolPanel>
          ) : (
            <EmptyToolState icon="🗓️" title={t.emptyTitle} description={t.emptyDescription} />
          )}
        </div>
      </div>

      <div className="mt-10 space-y-10">
        <ToolFaqSection title={t.faqTitle} description={t.faqDescription} items={t.faqs} />
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
