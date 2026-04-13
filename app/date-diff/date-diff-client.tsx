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

type DateDiffResult = {
  totalDays: number;
  totalWeeks: number;
  remainingDays: number;
  totalMonths: number;
  remainingDaysAfterMonths: number;
  years: number;
  months: number;
  days: number;
  fromDate: Date;
  toDate: Date;
  isFromEarlier: boolean;
};

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "날짜", "날짜 차이 계산기"],
    title: "날짜 차이 계산기",
    description:
      "두 날짜 사이가 며칠인지, 몇 주인지, 몇 개월인지 바로 계산합니다. 디데이 준비나 기간 확인에 바로 활용하세요.",
    badges: ["무료", "날짜 계산", "모바일 최적화"],
    inputTitle: "날짜 입력",
    inputDescription: "차이를 계산할 두 날짜를 선택하세요.",
    fromLabel: "시작 날짜",
    fromHint: "비교의 시작이 되는 날짜를 선택하세요.",
    toLabel: "끝 날짜",
    toHint: "비교의 끝이 되는 날짜를 선택하세요.",
    calculate: "날짜 차이 계산하기",
    infoTitle: "이렇게 사용하세요",
    infoItems: [
      "두 날짜를 선택하면 일, 주, 개월, 연 단위로 차이를 한번에 계산합니다.",
      "시작과 끝 날짜를 반대로 입력해도 자동으로 절댓값을 계산합니다.",
      "입력값은 브라우저 안에서만 처리되며 별도로 저장되지 않습니다.",
    ],
    statusEmptyTitle: "두 날짜를 모두 선택해 주세요",
    statusEmptyBody: "시작 날짜와 끝 날짜를 선택하면 바로 계산 준비 상태로 전환됩니다.",
    statusActiveTitle: "입력이 완료되었어요",
    statusActiveBody: "버튼을 누르면 날짜 차이를 바로 확인할 수 있습니다.",
    statusErrorTitle: "입력값을 확인해 주세요",
    statusSuccessTitle: "계산이 완료되었어요",
    sameDayResult: "두 날짜가 같아요",
    resultTitle: "날짜 차이 결과",
    resultDescription: "두 날짜 사이의 차이를 여러 단위로 보여줍니다.",
    resultBadge: "결과 완료",
    totalDaysLabel: "총 일수",
    totalWeeksLabel: "총 주수",
    totalMonthsLabel: "총 개월수",
    breakdownLabel: "연·월·일 분해",
    copy: "결과 복사",
    copied: "복사 완료",
    emptyTitle: "날짜 차이를 계산해보세요",
    emptyDescription:
      "두 날짜를 선택하고 버튼을 누르면 이 영역에 결과 카드가 표시됩니다.",
    dayUnit: "일",
    weekUnit: "주",
    monthUnit: "개월",
    yearUnit: "년",
    remainUnit: "나머지",
    periodLabel: "계산 기간",
    faqTitle: "자주 묻는 질문",
    faqDescription: "날짜 차이 계산에서 자주 묻는 질문을 정리했습니다.",
    faqs: [
      {
        question: "시작 날짜와 끝 날짜를 반대로 입력해도 되나요?",
        answer:
          "네. 어느 날짜가 더 이르든 자동으로 절댓값 차이를 계산하므로 순서는 상관없습니다.",
      },
      {
        question: "같은 날짜를 입력하면 어떻게 되나요?",
        answer: "0일 차이로 결과가 표시됩니다.",
      },
      {
        question: "날짜 차이에 오늘도 포함되나요?",
        answer:
          "두 날짜 사이의 경과 일수를 계산합니다. 시작일 포함 여부가 중요한 경우에는 일수에 1을 더하세요.",
      },
    ],
    relatedTitle: "관련 도구",
    relatedDescription: "날짜와 생활 계산 도구를 이어서 바로 열 수 있습니다.",
    relatedAction: "바로 열기",
    weekdays: ["일", "월", "화", "수", "목", "금", "토"],
  },
  en: {
    breadcrumbs: ["All tools", "Dates", "Date difference calculator"],
    title: "Date Difference Calculator",
    description:
      "Find out exactly how many days, weeks, or months lie between two dates. Perfect for planning and tracking milestones.",
    badges: ["Free", "Date calculator", "Mobile ready"],
    inputTitle: "Enter details",
    inputDescription: "Select the two dates you want to compare.",
    fromLabel: "Start date",
    fromHint: "The earlier of the two dates.",
    toLabel: "End date",
    toHint: "The later of the two dates.",
    calculate: "Calculate difference",
    infoTitle: "How to use it",
    infoItems: [
      "Pick two dates to see the difference in days, weeks, months, and years all at once.",
      "Order does not matter — the tool always returns a positive result.",
      "All calculations happen in your browser and nothing is stored.",
    ],
    statusEmptyTitle: "Select both dates",
    statusEmptyBody: "Once you fill in both dates the tool is ready to calculate.",
    statusActiveTitle: "Ready to calculate",
    statusActiveBody: "Press the button to see the date difference.",
    statusErrorTitle: "Please check the input",
    statusSuccessTitle: "Calculation complete",
    sameDayResult: "The two dates are the same",
    resultTitle: "Date difference",
    resultDescription: "The difference between your two dates in multiple units.",
    resultBadge: "Done",
    totalDaysLabel: "Total days",
    totalWeeksLabel: "Total weeks",
    totalMonthsLabel: "Total months",
    breakdownLabel: "Years · Months · Days",
    copy: "Copy result",
    copied: "Copied",
    emptyTitle: "Compare two dates",
    emptyDescription:
      "Select two dates and press the button to display the result card here.",
    dayUnit: "days",
    weekUnit: "weeks",
    monthUnit: "months",
    yearUnit: "yrs",
    remainUnit: "remainder",
    periodLabel: "Period",
    faqTitle: "Frequently asked questions",
    faqDescription: "Common questions about date difference calculations.",
    faqs: [
      {
        question: "Does the order of the two dates matter?",
        answer:
          "No. The tool always computes the absolute difference, so you can enter the dates in any order.",
      },
      {
        question: "What if I enter the same date twice?",
        answer: "The result will be 0 days.",
      },
      {
        question: "Is the start date included in the count?",
        answer:
          "The tool counts the elapsed days between the two dates. If you need to include the start day, add 1 to the result.",
      },
    ],
    relatedTitle: "Related tools",
    relatedDescription: "Open other date and everyday utility tools right away.",
    relatedAction: "Open now",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
};

function formatDisplayDate(date: Date, lang: "ko" | "en") {
  if (lang === "ko") {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  }
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function calcMonthsDiff(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export default function DateDiffPage() {
  const { lang } = useLanguage();
  const t = T[lang];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<DateDiffResult | null>(null);

  const relatedItems = ["/date-calc", "/weekday", "/dday", "/anniversary"]
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

    if (!fromDate || !toDate) {
      setError(t.statusErrorTitle);
      setResult(null);
      return;
    }

    const from = new Date(`${fromDate}T00:00:00`);
    const to = new Date(`${toDate}T00:00:00`);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      setError(t.statusErrorTitle);
      setResult(null);
      return;
    }

    const isFromEarlier = from <= to;
    const earlier = isFromEarlier ? from : to;
    const later = isFromEarlier ? to : from;

    const totalDays = Math.round((later.getTime() - earlier.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const totalMonths = Math.floor(totalDays / 30);
    const { years, months, days } = calcMonthsDiff(earlier, later);

    setResult({
      totalDays,
      totalWeeks,
      remainingDays,
      totalMonths,
      remainingDaysAfterMonths: days,
      years,
      months,
      days,
      fromDate: from,
      toDate: to,
      isFromEarlier,
    });
  }

  async function copyResult() {
    if (!result || typeof navigator === "undefined" || !navigator.clipboard) return;
    const text =
      lang === "ko"
        ? [
            t.title,
            `기간: ${fromDate} ~ ${toDate}`,
            `총 일수: ${result.totalDays.toLocaleString()}일`,
            `총 주수: ${result.totalWeeks.toLocaleString()}주 ${result.remainingDays}일`,
            `연·월·일: ${result.years}년 ${result.months}개월 ${result.days}일`,
          ].join("\n")
        : [
            t.title,
            `Period: ${fromDate} to ${toDate}`,
            `Total days: ${result.totalDays.toLocaleString()} days`,
            `Total weeks: ${result.totalWeeks.toLocaleString()} weeks ${result.remainingDays} days`,
            `Years · Months · Days: ${result.years}y ${result.months}m ${result.days}d`,
          ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const isReady = fromDate && toDate;
  const statusToneClass = error
    ? "border-rose-200 bg-rose-50/80"
    : result
      ? "border-emerald-200 bg-emerald-50/70"
      : isReady
        ? "border-blue-200 bg-blue-50/70"
        : "border-slate-200 bg-slate-50";
  const statusIcon = error ? "⚠️" : result ? "✅" : isReady ? "⏳" : "📆";
  const statusTitle = error
    ? t.statusErrorTitle
    : result
      ? t.statusSuccessTitle
      : isReady
        ? t.statusActiveTitle
        : t.statusEmptyTitle;
  const statusBody = error
    ? t.fromHint
    : result
      ? (lang === "ko"
          ? `${fromDate} ~ ${toDate} 기간 계산 완료`
          : `Calculated period: ${fromDate} to ${toDate}`)
      : isReady
        ? t.statusActiveBody
        : t.statusEmptyBody;

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="📆"
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
                <label className="text-sm font-semibold text-slate-800">{t.fromLabel}</label>
                <p className="mt-1 text-xs leading-5 text-slate-400">{t.fromHint}</p>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setError("");
                    setCopied(false);
                    setResult(null);
                  }}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800">{t.toLabel}</label>
                <p className="mt-1 text-xs leading-5 text-slate-400">{t.toHint}</p>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
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
                disabled={!isReady}
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

              {result.totalDays === 0 ? (
                <div className="mt-5 rounded-[24px] border border-emerald-200 bg-white px-5 py-8 text-center shadow-sm">
                  <div className="text-4xl">🟰</div>
                  <p className="mt-4 text-lg font-semibold text-slate-700">{t.sameDayResult}</p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  <div className="rounded-[24px] border border-emerald-200 bg-white px-5 py-6 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                      {t.totalDaysLabel}
                    </div>
                    <div className="mt-2 text-5xl font-bold tracking-tight text-slate-950">
                      {result.totalDays.toLocaleString()}
                      <span className="ml-2 text-2xl font-semibold text-slate-400">
                        {t.dayUnit}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-slate-500">
                      {lang === "ko"
                        ? `${formatDisplayDate(result.isFromEarlier ? result.fromDate : result.toDate, lang)} ~ ${formatDisplayDate(result.isFromEarlier ? result.toDate : result.fromDate, lang)}`
                        : `${formatDisplayDate(result.isFromEarlier ? result.fromDate : result.toDate, lang)} → ${formatDisplayDate(result.isFromEarlier ? result.toDate : result.fromDate, lang)}`}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-4">
                      <div className="text-xs font-medium text-slate-400">{t.totalWeeksLabel}</div>
                      <div className="mt-2 text-xl font-bold text-slate-900">
                        {result.totalWeeks.toLocaleString()}
                        <span className="ml-1 text-sm font-medium text-slate-400">{t.weekUnit}</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        +{result.remainingDays}{lang === "ko" ? "일" : " days"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-4">
                      <div className="text-xs font-medium text-slate-400">{t.totalMonthsLabel}</div>
                      <div className="mt-2 text-xl font-bold text-slate-900">
                        {result.totalMonths.toLocaleString()}
                        <span className="ml-1 text-sm font-medium text-slate-400">{t.monthUnit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-4">
                    <div className="text-xs font-medium text-slate-400">{t.breakdownLabel}</div>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {result.years > 0 && (
                        <span className="text-xl font-bold text-slate-900">
                          {result.years}
                          <span className="ml-1 text-sm font-medium text-slate-400">{t.yearUnit}</span>
                        </span>
                      )}
                      {result.months > 0 && (
                        <span className="text-xl font-bold text-slate-900">
                          {result.months}
                          <span className="ml-1 text-sm font-medium text-slate-400">{t.monthUnit}</span>
                        </span>
                      )}
                      <span className="text-xl font-bold text-slate-900">
                        {result.days}
                        <span className="ml-1 text-sm font-medium text-slate-400">{lang === "ko" ? "일" : "days"}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </ToolPanel>
          ) : (
            <EmptyToolState icon="📆" title={t.emptyTitle} description={t.emptyDescription} />
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
