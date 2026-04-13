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
import {
  calculateWeeklyHolidayPay,
  formatDecimal,
  formatKrw,
  OFFICIAL_KR_RATES_2026,
  parsePositiveNumber,
} from "../life-tool-utils";
import { buildRelatedToolItems } from "../text-tool-utils";

type WeeklyHolidayResult = ReturnType<typeof calculateWeeklyHolidayPay>;

const inputClass =
  "mt-2 w-full rounded-[20px] border border-slate-200 bg-slate-50/70 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100";

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "생활 계산", "주휴수당 계산기"],
    title: "주휴수당 계산기",
    description:
      "시급과 주 근무시간을 입력하면 주휴수당 지급 가능 여부와 주·월 예상 금액을 빠르게 계산합니다.",
    badges: [
      { label: "생활 계산", tone: "slate" as const },
      { label: "근로기준법 기준", tone: "blue" as const },
      { label: "2026 최저임금 10,320원", tone: "amber" as const },
    ],
    inputTitle: "근무 조건 입력",
    inputDescription:
      "주 15시간 이상 근무하고 소정근로일을 모두 채운 경우를 기본 기준으로 계산합니다.",
    hourlyLabel: "시급",
    hourlyHint: "2026년 최저임금은 10,320원입니다.",
    weeklyHoursLabel: "주 근무시간",
    weeklyHoursHint: "주휴시간은 주 40시간 기준 비례 계산으로 산정합니다.",
    attendanceLabel: "소정근로일 개근 여부",
    attendanceHint: "결근이 있으면 주휴수당 지급 대상이 아닐 수 있습니다.",
    calculate: "주휴수당 계산하기",
    warningTitle: "최저임금 확인 필요",
    warningBody:
      "입력한 시급이 2026년 최저임금 10,320원보다 낮습니다. 실제 계약 조건을 다시 확인하세요.",
    resultTitle: "주휴수당 결과",
    resultDescription:
      "주휴 대상 여부와 주 기준·월 기준 예상 금액을 함께 보여줍니다.",
    emptyTitle: "근무 조건을 입력해보세요",
    emptyDescription: "계산 결과가 여기 표시됩니다.",
    eligible: "지급 대상",
    ineligible: "지급 대상 아님",
    weeklyHolidayHours: "주휴 인정 시간",
    weeklyHolidayPay: "주휴수당",
    weeklyBasePay: "주 기본 급여",
    monthlyHolidayPay: "월 예상 주휴수당",
    monthlyTotalPay: "월 예상 총급여",
    ruleTitle: "간단 기준 안내",
    ruleItems: [
      "주 소정근로시간 15시간 이상일 때 주휴수당 대상이 됩니다.",
      "지정된 근무일을 모두 채웠다는 전제에서 계산합니다.",
      "월 예상 금액은 4.345주 환산치로 표시합니다.",
    ],
    faqTitle: "자주 묻는 질문",
    faqDescription: "주휴수당 계산에서 자주 헷갈리는 기준을 정리했습니다.",
    faqs: [
      {
        question: "주 15시간 미만이면 주휴수당이 전혀 없나요?",
        answer:
          "일반적인 근로기준법 기준으로는 주 소정근로시간이 15시간 미만이면 주휴수당 대상이 되지 않습니다.",
      },
      {
        question: "월 예상 금액은 왜 정확한 월급과 다를 수 있나요?",
        answer:
          "달마다 주 수가 다르기 때문에 월 환산은 평균 4.345주 기준 추정치로 계산합니다. 실제 지급은 급여 주기와 회사 규정에 따라 달라질 수 있습니다.",
      },
      {
        question: "주휴 인정 시간은 어떻게 계산하나요?",
        answer:
          "주 40시간 근무 시 8시간을 기준으로, 실제 주 근무시간이 더 적으면 같은 비율로 줄여 계산합니다.",
      },
    ],
    relatedTitle: "같이 보면 좋은 생활 계산 도구",
    relatedDescription: "급여와 근무 조건을 다른 계산기와 이어서 확인하세요.",
    relatedAction: "도구 열기",
    errorHourly: "시급은 0원보다 큰 숫자로 입력하세요.",
    errorWeeklyHours: "주 근무시간은 0보다 크고 168 이하로 입력하세요.",
  },
  en: {
    breadcrumbs: ["All tools", "Life", "Weekly holiday pay calculator"],
    title: "Weekly Holiday Pay Calculator",
    description:
      "Estimate weekly holiday pay from hourly wage, weekly hours, and attendance condition.",
    badges: [
      { label: "Life", tone: "slate" as const },
      { label: "Korean labor rule", tone: "blue" as const },
      { label: "2026 minimum wage 10,320 KRW", tone: "amber" as const },
    ],
    inputTitle: "Enter work conditions",
    inputDescription:
      "This follows the common rule of at least 15 weekly hours plus full attendance.",
    hourlyLabel: "Hourly wage",
    hourlyHint: "The 2026 Korean minimum wage is 10,320 KRW.",
    weeklyHoursLabel: "Weekly hours",
    weeklyHoursHint: "Holiday hours are prorated from the 40-hour, 8-hour rule.",
    attendanceLabel: "Full attendance on scheduled days",
    attendanceHint: "Absences can make you ineligible for weekly holiday pay.",
    calculate: "Calculate holiday pay",
    warningTitle: "Check minimum wage",
    warningBody:
      "The entered hourly wage is below the 2026 minimum wage of 10,320 KRW.",
    resultTitle: "Weekly holiday pay result",
    resultDescription:
      "Eligibility and estimated weekly and monthly values are grouped together.",
    emptyTitle: "Enter work conditions",
    emptyDescription: "The estimated result will appear here.",
    eligible: "Eligible",
    ineligible: "Not eligible",
    weeklyHolidayHours: "Holiday hours",
    weeklyHolidayPay: "Weekly holiday pay",
    weeklyBasePay: "Weekly base pay",
    monthlyHolidayPay: "Estimated monthly holiday pay",
    monthlyTotalPay: "Estimated monthly total pay",
    ruleTitle: "Quick rules",
    ruleItems: [
      "At least 15 weekly hours are required in the common case.",
      "This assumes full attendance across scheduled workdays.",
      "Monthly estimates use an average factor of 4.345 weeks.",
    ],
    faqTitle: "Frequently asked questions",
    faqDescription: "Common questions about weekly holiday pay.",
    faqs: [
      {
        question: "Is there no holiday pay below 15 weekly hours?",
        answer:
          "In the common Korean labor-law case, workers scheduled under 15 weekly hours do not qualify.",
      },
      {
        question: "Why is the monthly estimate not exact?",
        answer:
          "Because the number of weeks per month varies, the calculator uses an average factor of 4.345.",
      },
      {
        question: "How are holiday hours calculated?",
        answer:
          "They are prorated from the 8-hour holiday standard at 40 weekly hours.",
      },
    ],
    relatedTitle: "Related life tools",
    relatedDescription: "Continue with other work and salary calculations.",
    relatedAction: "Open tool",
    errorHourly: "Enter an hourly wage greater than 0.",
    errorWeeklyHours: "Enter weekly hours greater than 0 and no more than 168.",
  },
};

function formatCurrency(value: number, lang: "ko" | "en") {
  return `${formatKrw(value, lang === "ko" ? "ko-KR" : "en-US")}${lang === "ko" ? "원" : " KRW"}`;
}

export default function WeeklyHolidayPayClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [hourlyWage, setHourlyWage] = useState(String(OFFICIAL_KR_RATES_2026.minimumWage));
  const [weeklyHours, setWeeklyHours] = useState("20");
  const [attendanceMet, setAttendanceMet] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WeeklyHolidayResult | null>(null);

  const relatedItems = buildRelatedToolItems(lang, [
    "/net-pay",
    "/annual-leave",
    "/loan",
    "/unit-price",
  ]);

  function handleCalculate() {
    const wage = parsePositiveNumber(hourlyWage);
    const hours = parsePositiveNumber(weeklyHours);

    if (!Number.isFinite(wage) || wage <= 0) {
      setError(t.errorHourly);
      setResult(null);
      return;
    }

    if (!Number.isFinite(hours) || hours <= 0 || hours > 168) {
      setError(t.errorWeeklyHours);
      setResult(null);
      return;
    }

    setError(null);
    setResult(
      calculateWeeklyHolidayPay({
        hourlyWage: wage,
        weeklyHours: hours,
        attendanceMet,
      }),
    );
  }

  const money = (value: number) => formatCurrency(value, lang);
  const decimal = (value: number) =>
    formatDecimal(value, 1, lang === "ko" ? "ko-KR" : "en-US");

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="🗓️"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="space-y-6">
          <ToolPanel title={t.inputTitle} description={t.inputDescription}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">{t.hourlyLabel}</label>
                <input
                  value={hourlyWage}
                  onChange={(event) => setHourlyWage(event.target.value)}
                  inputMode="numeric"
                  className={inputClass}
                />
                <p className="mt-1 text-xs leading-5 text-slate-500">{t.hourlyHint}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">{t.weeklyHoursLabel}</label>
                <input
                  value={weeklyHours}
                  onChange={(event) => setWeeklyHours(event.target.value)}
                  inputMode="decimal"
                  className={inputClass}
                />
                <p className="mt-1 text-xs leading-5 text-slate-500">{t.weeklyHoursHint}</p>
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={attendanceMet}
                  onChange={(event) => setAttendanceMet(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span>
                  <span className="font-semibold">{t.attendanceLabel}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {t.attendanceHint}
                  </span>
                </span>
              </label>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleCalculate}
                className="w-full rounded-2xl bg-blue-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                {t.calculate}
              </button>
            </div>
          </ToolPanel>

          <ToolPanel title={t.ruleTitle}>
            <ul className="space-y-3 text-sm leading-6 text-slate-600">
              {t.ruleItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-amber-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ToolPanel>
        </div>

        <ToolPanel title={t.resultTitle} description={t.resultDescription}>
          {result ? (
            <div className="space-y-5">
              {parsePositiveNumber(hourlyWage) < OFFICIAL_KR_RATES_2026.minimumWage ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <p className="font-semibold">{t.warningTitle}</p>
                  <p className="mt-1">{t.warningBody}</p>
                </div>
              ) : null}

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div
                  className={`rounded-[24px] border p-5 ${
                    result.eligible
                      ? "border-emerald-200 bg-emerald-50/70"
                      : "border-rose-200 bg-rose-50/70"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      result.eligible ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {result.eligible ? t.eligible : t.ineligible}
                  </p>
                  <p className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
                    {money(result.weeklyHolidayPay)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{t.weeklyHolidayPay}</p>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
                    <p className="text-xs font-semibold text-slate-400">{t.weeklyHolidayHours}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{decimal(result.weeklyHolidayHours)}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
                    <p className="text-xs font-semibold text-slate-400">{t.weeklyBasePay}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{money(result.weeklyBasePay)}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <p className="text-xs font-semibold text-slate-400">{t.monthlyHolidayPay}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{money(result.estimatedMonthlyHolidayPay)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <p className="text-xs font-semibold text-slate-400">{t.monthlyTotalPay}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{money(result.estimatedMonthlyTotalPay)}</p>
                </div>
              </div>
            </div>
          ) : (
            <EmptyToolState
              icon="⏱️"
              title={t.emptyTitle}
              description={t.emptyDescription}
            />
          )}
        </ToolPanel>
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
          items={relatedItems}
          actionLabel={t.relatedAction}
        />
      </div>
    </ToolPageShell>
  );
}
