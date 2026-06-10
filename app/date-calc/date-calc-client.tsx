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
import { useToolAnalytics } from "../use-tool-analytics";

type DateCalcResult = {
  resultDate: Date;
  actualDays: number;
  direction: "after" | "before";
};

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "날짜", "날짜 더하기/빼기"],
    title: "날짜 더하기 / 빼기 계산기",
    description:
      "기준 날짜에 일수를 더하거나 빼서 결과 날짜를 빠르게 계산합니다. 100일 후, 200일 전 날짜도 바로 확인하세요.",
    badges: ["무료", "날짜 계산", "모바일 최적화"],
    inputTitle: "날짜 입력",
    inputDescription: "기준 날짜와 더하거나 뺄 일수를 입력하세요.",
    baseDateLabel: "기준 날짜",
    baseDateHint: "계산의 기준이 되는 날짜를 선택하세요.",
    daysLabel: "일수",
    daysHint: "더하거나 뺄 날짜 수를 입력하세요 (1 ~ 9999).",
    directionLabel: "방향",
    directionAfter: "더하기 (이후)",
    directionBefore: "빼기 (이전)",
    calculate: "날짜 계산하기",
    infoTitle: "이렇게 사용하세요",
    infoItems: [
      "기준 날짜와 일수를 입력한 뒤 방향을 선택하면 결과 날짜가 바로 계산됩니다.",
      "100일 기념일, 출산 예정일, 프로젝트 마감일 등 다양하게 활용할 수 있습니다.",
      "입력값은 브라우저 안에서만 처리되며 별도로 저장되지 않습니다.",
    ],
    statusEmptyTitle: "날짜와 일수를 입력해 주세요",
    statusEmptyBody: "기준 날짜와 일수를 입력하면 바로 계산 준비 상태로 전환됩니다.",
    statusActiveTitle: "입력이 완료되었어요",
    statusActiveBody: "버튼을 누르면 결과 날짜를 바로 확인할 수 있습니다.",
    statusErrorTitle: "입력값을 확인해 주세요",
    statusSuccessTitle: "계산이 완료되었어요",
    resultTitle: "계산 결과",
    resultDescription: "기준 날짜로부터 계산된 결과입니다.",
    resultBadge: "결과 완료",
    resultDateLabel: "결과 날짜",
    resultSummaryLabel: "계산 내용",
    copy: "결과 복사",
    copied: "복사 완료",
    emptyTitle: "날짜를 계산해보세요",
    emptyDescription:
      "기준 날짜와 일수를 입력하고 버튼을 누르면 이 영역에 결과 카드가 표시됩니다.",
    weekdays: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
    afterLabel: "일 후",
    beforeLabel: "일 전",
    faqTitle: "자주 묻는 질문",
    faqDescription: "날짜 계산에서 많이 묻는 질문을 정리했습니다.",
    faqs: [
      {
        question: "100일 기념일은 어떻게 계산하나요?",
        answer:
          "시작 날짜를 기준 날짜로 입력하고, 일수에 99를 입력한 뒤 '더하기'를 선택하면 됩니다. (시작일 포함 100일째 날이 결과로 나옵니다.)",
      },
      {
        question: "윤년(2월 29일)도 정확히 계산되나요?",
        answer:
          "네. 브라우저 내장 날짜 계산을 사용하므로 윤년도 정확하게 처리됩니다.",
      },
      {
        question: "몇 일 전 날짜는 어떻게 구하나요?",
        answer:
          "방향을 '빼기(이전)'로 선택하면 기준 날짜에서 입력한 일수를 뺀 날짜를 계산합니다.",
      },
    ],
    relatedTitle: "관련 도구",
    relatedDescription: "날짜와 생활 계산 도구를 이어서 바로 열 수 있습니다.",
    relatedAction: "바로 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Dates", "Add / Subtract days"],
    title: "Date Add / Subtract Calculator",
    description:
      "Add or subtract days from any date to quickly find a result date. Great for 100-day anniversaries, deadlines, and due dates.",
    badges: ["Free", "Date calculator", "Mobile ready"],
    inputTitle: "Enter details",
    inputDescription: "Pick a base date and enter the number of days to add or subtract.",
    baseDateLabel: "Base date",
    baseDateHint: "The starting date for your calculation.",
    daysLabel: "Number of days",
    daysHint: "Enter a number from 1 to 9999.",
    directionLabel: "Direction",
    directionAfter: "Add (after)",
    directionBefore: "Subtract (before)",
    calculate: "Calculate date",
    infoTitle: "How to use it",
    infoItems: [
      "Enter a base date, a number of days, and choose a direction to get the result immediately.",
      "Useful for anniversaries, project deadlines, expected due dates, and more.",
      "All calculations happen in your browser and nothing is stored.",
    ],
    statusEmptyTitle: "Enter a date and number of days",
    statusEmptyBody: "Fill in the base date and the number of days to get started.",
    statusActiveTitle: "Ready to calculate",
    statusActiveBody: "Press the button to get the result date.",
    statusErrorTitle: "Please check the input",
    statusSuccessTitle: "Calculation complete",
    resultTitle: "Result",
    resultDescription: "The date calculated from your base date.",
    resultBadge: "Done",
    resultDateLabel: "Result date",
    resultSummaryLabel: "Calculation",
    copy: "Copy result",
    copied: "Copied",
    emptyTitle: "Calculate a date",
    emptyDescription:
      "Enter a base date and number of days, then press the button to see the result here.",
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    afterLabel: "days after",
    beforeLabel: "days before",
    faqTitle: "Frequently asked questions",
    faqDescription: "Common questions about date calculations.",
    faqs: [
      {
        question: "How do I find a 100-day anniversary?",
        answer:
          "Enter the start date as the base date, type 99 in the days field, and choose 'Add'. The result is the 100th day (counting from day 1).",
      },
      {
        question: "Does it handle leap years correctly?",
        answer:
          "Yes. The tool uses the browser's built-in date engine, which handles leap years accurately.",
      },
      {
        question: "How do I find a date in the past?",
        answer:
          "Choose 'Subtract (before)' as the direction and the tool will count back from the base date.",
      },
    ],
    relatedTitle: "Related tools",
    relatedDescription: "Open other date and everyday utility tools right away.",
    relatedAction: "Open now",
  },
};

function formatDisplayDate(date: Date, lang: "ko" | "en") {
  const weekdays = T[lang].weekdays;
  const dow = weekdays[date.getDay()];
  if (lang === "ko") {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${dow})`;
  }
  return `${date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} (${dow})`;
}

function formatIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function DateCalcPage() {
  const { lang } = useLanguage();
  const t = T[lang];
  const { markStart, trackComplete, trackCopyResult } = useToolAnalytics("date-calc", lang);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [baseDate, setBaseDate] = useState(formatIsoDate(today));
  const [days, setDays] = useState("");
  const [direction, setDirection] = useState<"after" | "before">("after");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<DateCalcResult | null>(null);

  const relatedItems = ["/date-diff", "/weekday", "/dday", "/anniversary"]
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
    markStart({ trigger: "calculate_click" });
    setCopied(false);
    setError("");

    const daysNum = parseInt(days, 10);
    if (!baseDate || !days || isNaN(daysNum) || daysNum < 1 || daysNum > 9999) {
      setError(t.statusErrorTitle);
      setResult(null);
      return;
    }

    const base = new Date(`${baseDate}T00:00:00`);
    if (isNaN(base.getTime())) {
      setError(t.statusErrorTitle);
      setResult(null);
      return;
    }

    const resultDate = new Date(base);
    if (direction === "after") {
      resultDate.setDate(resultDate.getDate() + daysNum);
    } else {
      resultDate.setDate(resultDate.getDate() - daysNum);
    }

    setResult({ resultDate, actualDays: daysNum, direction });
    trackComplete({
      days_value: daysNum,
      direction,
    });
  }

  async function copyResult() {
    if (!result || typeof navigator === "undefined" || !navigator.clipboard) return;
    const label = direction === "after" ? t.afterLabel : t.beforeLabel;
    const text =
      lang === "ko"
        ? `${t.title}\n기준 날짜: ${baseDate}\n계산: ${result.actualDays}${label}\n결과: ${formatDisplayDate(result.resultDate, lang)}`
        : `${t.title}\nBase date: ${baseDate}\nCalculation: ${result.actualDays} ${label}\nResult: ${formatDisplayDate(result.resultDate, lang)}`;
    await navigator.clipboard.writeText(text);
    trackCopyResult({
      days_value: result.actualDays,
      direction: result.direction,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const isReady = baseDate && days && !isNaN(parseInt(days, 10));
  const statusToneClass = error
    ? "border-rose-200 bg-rose-50/80"
    : result
      ? "border-emerald-200 bg-emerald-50/70"
      : isReady
        ? "border-blue-200 bg-blue-50/70"
        : "border-slate-200 bg-slate-50";
  const statusIcon = error ? "⚠️" : result ? "✅" : isReady ? "⏳" : "📅";
  const statusTitle = error
    ? t.statusErrorTitle
    : result
      ? t.statusSuccessTitle
      : isReady
        ? t.statusActiveTitle
        : t.statusEmptyTitle;
  const statusBody = error
    ? t.daysHint
    : result
      ? (lang === "ko"
          ? `${baseDate} 기준, ${result.actualDays}${result.direction === "after" ? t.afterLabel : t.beforeLabel}`
          : `${result.actualDays} ${result.direction === "after" ? t.afterLabel : t.beforeLabel} ${baseDate}`)
      : isReady
        ? t.statusActiveBody
        : t.statusEmptyBody;

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="📅"
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
                <label className="text-sm font-semibold text-slate-800">{t.baseDateLabel}</label>
                <p className="mt-1 text-xs leading-5 text-slate-400">{t.baseDateHint}</p>
                <input
                  type="date"
                  value={baseDate}
                  onChange={(e) => {
                    setBaseDate(e.target.value);
                    setError("");
                    setCopied(false);
                    setResult(null);
                  }}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800">{t.daysLabel}</label>
                <p className="mt-1 text-xs leading-5 text-slate-400">{t.daysHint}</p>
                <input
                  type="number"
                  value={days}
                  min={1}
                  max={9999}
                  onChange={(e) => {
                    setDays(e.target.value);
                    setError("");
                    setCopied(false);
                    setResult(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && calculate()}
                  placeholder="100"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800">{t.directionLabel}</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["after", "before"] as const).map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => {
                        setDirection(dir);
                        setResult(null);
                        setError("");
                      }}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                        direction === dir
                          ? "border-blue-400 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/50"
                      }`}
                    >
                      {dir === "after" ? t.directionAfter : t.directionBefore}
                    </button>
                  ))}
                </div>
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

              <div className="mt-5 rounded-[24px] border border-emerald-200 bg-white px-5 py-6 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  {t.resultDateLabel}
                </div>
                <div className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                  {formatDisplayDate(result.resultDate, lang)}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs font-medium text-slate-400">
                      {lang === "ko" ? "기준 날짜" : "Base date"}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-800">{baseDate}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs font-medium text-slate-400">
                      {lang === "ko" ? "계산" : "Calculation"}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-800">
                      {result.direction === "after"
                        ? `+${result.actualDays}${lang === "ko" ? "일" : " days"}`
                        : `-${result.actualDays}${lang === "ko" ? "일" : " days"}`}
                    </div>
                  </div>
                </div>
              </div>
            </ToolPanel>
          ) : (
            <EmptyToolState icon="📅" title={t.emptyTitle} description={t.emptyDescription} />
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
