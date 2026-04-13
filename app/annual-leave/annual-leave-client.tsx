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
  calculateAnnualLeave,
  formatDecimal,
  toDateInputValue,
} from "../life-tool-utils";
import { buildRelatedToolItems } from "../text-tool-utils";

type AnnualLeaveResult = ReturnType<typeof calculateAnnualLeave>;

const inputClass =
  "mt-2 w-full rounded-[20px] border border-slate-200 bg-slate-50/70 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100";

const defaultHireDate = (() => {
  const today = new Date();
  const sample = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  return toDateInputValue(sample);
})();

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "생활 계산", "연차 계산기"],
    title: "연차 계산기",
    description:
      "입사일과 기준일을 기준으로 근속연수, 현재 부여 연차, 잔여 연차, 다음 연차 부여 시점을 계산합니다.",
    badges: [
      { label: "생활 계산", tone: "slate" as const },
      { label: "근로기준법 기준", tone: "blue" as const },
      { label: "입사일 기준 단순 계산", tone: "amber" as const },
    ],
    inputTitle: "입사 정보 입력",
    inputDescription:
      "5인 이상 사업장 기준의 일반적인 연차 규칙을 간단화해 계산합니다. 회사별 회계연도 연차 운영과는 다를 수 있습니다.",
    hireDateLabel: "입사일",
    referenceDateLabel: "기준일",
    eligibleLabel: "5인 이상 사업장 등 연차 적용 대상입니다",
    eligibleHint:
      "근로기준법상 연차휴가가 적용되는 사업장과 근로 형태를 기준으로 확인하세요.",
    attendanceLabel: "직전 1년 출근율 80% 이상입니다",
    attendanceHint:
      "80% 미만이면 연차 15일 대신 개근 월수 기준으로 산정합니다.",
    lowAttendanceLabel: "출근율 80% 미만이지만 개근한 월 수",
    lowAttendanceHint: "0~11개월 사이 정수로 입력하세요.",
    usedDaysLabel: "이미 사용한 연차",
    usedDaysHint: "소수점이 필요한 경우 0.5일처럼 입력할 수 있습니다.",
    calculate: "연차 계산하기",
    noteTitle: "꼭 확인하세요",
    noteItems: [
      "입사일 기준으로 단순 계산한 참고용 수치입니다. 회사가 회계연도 기준으로 운영하면 실제 부여일과 다를 수 있습니다.",
      "첫 1년은 1개월 개근 시 1일, 그 이후에는 기본 15일과 2년마다 1일 가산 규칙을 단순 반영합니다.",
      "이월 연차, 소멸 규칙, 육아휴직·휴직기간 반영 여부는 회사 정책과 판례 해석에 따라 달라질 수 있습니다.",
    ],
    resultTitle: "연차 계산 결과",
    resultDescription:
      "현재 기준으로 부여된 연차와 남은 연차를 확인할 수 있습니다.",
    emptyTitle: "입사일과 기준일을 입력해보세요",
    emptyDescription: "연차 계산 결과가 여기 표시됩니다.",
    notEligibleTitle: "연차 적용 대상 아님",
    notEligibleBody: "입력한 조건으로는 현재 연차를 계산할 수 없습니다.",
    serviceYears: "근속연수",
    serviceDays: "재직일수",
    firstYearMonthlyLeave: "첫 1년 개근 연차",
    currentGrantedLeave: "현재 부여 연차",
    remainingLeave: "잔여 연차",
    nextGrantDate: "다음 연차 부여일",
    yearsUnit: "년",
    daysUnit: "일",
    faqTitle: "자주 묻는 질문",
    faqDescription: "연차 계산에서 자주 헷갈리는 기준을 먼저 정리했습니다.",
    faqs: [
      {
        question: "입사 1년 미만이면 연차가 어떻게 계산되나요?",
        answer:
          "일반적으로 매월 개근 시 1일씩, 최대 11일까지 발생하는 구조로 계산합니다. 이 계산기는 그 기준을 단순 반영합니다.",
      },
      {
        question: "출근율이 80% 미만이면 왜 15일이 아니게 나오나요?",
        answer:
          "법 기준상 직전 1년 출근율 80% 미만이면 연간 15일 대신 개근한 월 수만큼 부여하는 경우가 있어 그 규칙을 반영합니다.",
      },
      {
        question: "회사에서는 회계연도 기준으로 연차를 주는데요?",
        answer:
          "이 도구는 입사일 기준의 기본 규칙을 계산합니다. 회사가 회계연도 기준으로 전환 운영하면 실제 부여일과 잔여일은 달라질 수 있습니다.",
      },
    ],
    relatedTitle: "같이 보면 좋은 생활 계산 도구",
    relatedDescription: "근로·급여·날짜 계산 도구와 이어서 확인할 수 있습니다.",
    relatedAction: "도구 열기",
    errorDate: "입사일과 기준일을 올바르게 입력하세요.",
    errorReference: "기준일은 입사일보다 빠를 수 없습니다.",
    errorLowAttendance: "개근 월 수는 0부터 11 사이 정수로 입력하세요.",
    errorUsedDays: "사용한 연차는 0 이상 숫자로 입력하세요.",
  },
  en: {
    breadcrumbs: ["All tools", "Life", "Annual leave calculator"],
    title: "Annual Leave Calculator",
    description:
      "Estimate granted leave, remaining leave, service years, and next grant date from your hire date.",
    badges: [
      { label: "Life", tone: "slate" as const },
      { label: "Labor-law based", tone: "blue" as const },
      { label: "Hire-date simplification", tone: "amber" as const },
    ],
    inputTitle: "Enter employment details",
    inputDescription:
      "This is a simplified estimate for common Korean annual-leave rules and can differ from company-specific fiscal-year policies.",
    hireDateLabel: "Hire date",
    referenceDateLabel: "Reference date",
    eligibleLabel: "This worker is eligible for annual leave coverage",
    eligibleHint: "Use the common 5+ employee workplace rule as a guide.",
    attendanceLabel: "Attendance rate for the prior year is at least 80%",
    attendanceHint:
      "Below 80%, the calculator falls back to the monthly-attendance approach.",
    lowAttendanceLabel: "Months fully attended below 80% case",
    lowAttendanceHint: "Enter an integer between 0 and 11.",
    usedDaysLabel: "Leave already used",
    usedDaysHint: "You can enter half-days such as 0.5 if needed.",
    calculate: "Calculate annual leave",
    noteTitle: "Read this first",
    noteItems: [
      "This is a hire-date-based estimate and can differ from fiscal-year leave systems.",
      "The first year uses the monthly attendance rule up to 11 days, then 15 days plus additional days every two years.",
      "Carryover rules, expiry, and leave during leave-of-absence periods can differ by company policy.",
    ],
    resultTitle: "Annual leave result",
    resultDescription:
      "The current granted and remaining leave are grouped with service details.",
    emptyTitle: "Enter hire and reference dates",
    emptyDescription: "The estimated annual leave result will appear here.",
    notEligibleTitle: "Not eligible",
    notEligibleBody: "The current inputs do not qualify for annual leave estimation.",
    serviceYears: "Service years",
    serviceDays: "Days employed",
    firstYearMonthlyLeave: "First-year monthly leave",
    currentGrantedLeave: "Currently granted leave",
    remainingLeave: "Remaining leave",
    nextGrantDate: "Next grant date",
    yearsUnit: "years",
    daysUnit: "days",
    faqTitle: "Frequently asked questions",
    faqDescription: "Common questions about annual leave rules.",
    faqs: [
      {
        question: "How is leave handled in the first year?",
        answer:
          "In the common rule, one day can accrue for each fully attended month, up to 11 days during the first year.",
      },
      {
        question: "Why does low attendance change the result?",
        answer:
          "Because the annual 15-day grant can be replaced by a monthly-attendance basis when the attendance rate is below 80%.",
      },
      {
        question: "What if my company uses a fiscal-year leave system?",
        answer:
          "This tool does not model company-specific fiscal-year adjustments and should be used as a baseline reference only.",
      },
    ],
    relatedTitle: "Related life tools",
    relatedDescription: "Continue with work and date calculators.",
    relatedAction: "Open tool",
    errorDate: "Enter valid hire and reference dates.",
    errorReference: "The reference date cannot be earlier than the hire date.",
    errorLowAttendance: "Enter a full-attendance month count between 0 and 11.",
    errorUsedDays: "Enter used leave as a number of 0 or more.",
  },
};

function formatDate(date: Date, lang: "ko" | "en") {
  return new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function AnnualLeaveClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [hireDate, setHireDate] = useState(defaultHireDate);
  const [referenceDate, setReferenceDate] = useState(toDateInputValue(new Date()));
  const [eligible, setEligible] = useState(true);
  const [attendanceMet, setAttendanceMet] = useState(true);
  const [belowEightyQualifyingMonths, setBelowEightyQualifyingMonths] = useState("0");
  const [usedDays, setUsedDays] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnnualLeaveResult | null>(null);

  const relatedItems = buildRelatedToolItems(lang, [
    "/net-pay",
    "/weekly-holiday-pay",
    "/date-diff",
    "/weekday",
  ]);

  function handleCalculate() {
    const hire = new Date(hireDate);
    const reference = new Date(referenceDate);
    const lowAttendanceMonths = Number(belowEightyQualifyingMonths);
    const used = Number(usedDays);

    if (Number.isNaN(hire.getTime()) || Number.isNaN(reference.getTime())) {
      setError(t.errorDate);
      setResult(null);
      return;
    }

    if (reference < hire) {
      setError(t.errorReference);
      setResult(null);
      return;
    }

    if (
      !attendanceMet &&
      (!Number.isInteger(lowAttendanceMonths) || lowAttendanceMonths < 0 || lowAttendanceMonths > 11)
    ) {
      setError(t.errorLowAttendance);
      setResult(null);
      return;
    }

    if (!Number.isFinite(used) || used < 0) {
      setError(t.errorUsedDays);
      setResult(null);
      return;
    }

    setError(null);
    setResult(
      calculateAnnualLeave({
        hireDate: hire,
        referenceDate: reference,
        eligible,
        attendanceMet,
        belowEightyQualifyingMonths: attendanceMet ? 0 : lowAttendanceMonths,
        usedDays: used,
      }),
    );
  }

  const decimal = (value: number) =>
    formatDecimal(value, 1, lang === "ko" ? "ko-KR" : "en-US");

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="📆"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="space-y-6">
          <ToolPanel title={t.inputTitle} description={t.inputDescription}>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700">{t.hireDateLabel}</label>
                  <input
                    type="date"
                    value={hireDate}
                    onChange={(event) => setHireDate(event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    {t.referenceDateLabel}
                  </label>
                  <input
                    type="date"
                    value={referenceDate}
                    onChange={(event) => setReferenceDate(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={eligible}
                  onChange={(event) => setEligible(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span>
                  <span className="font-semibold">{t.eligibleLabel}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {t.eligibleHint}
                  </span>
                </span>
              </label>

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

              {!attendanceMet ? (
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    {t.lowAttendanceLabel}
                  </label>
                  <input
                    value={belowEightyQualifyingMonths}
                    onChange={(event) => setBelowEightyQualifyingMonths(event.target.value)}
                    inputMode="numeric"
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs leading-5 text-slate-500">{t.lowAttendanceHint}</p>
                </div>
              ) : null}

              <div>
                <label className="text-sm font-semibold text-slate-700">{t.usedDaysLabel}</label>
                <input
                  value={usedDays}
                  onChange={(event) => setUsedDays(event.target.value)}
                  inputMode="decimal"
                  className={inputClass}
                />
                <p className="mt-1 text-xs leading-5 text-slate-500">{t.usedDaysHint}</p>
              </div>

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

          <ToolPanel title={t.noteTitle}>
            <ul className="space-y-3 text-sm leading-6 text-slate-600">
              {t.noteItems.map((item) => (
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
            result.eligible ? (
              <div className="space-y-5">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                  <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/70 p-5">
                    <p className="text-sm font-semibold text-emerald-700">{t.remainingLeave}</p>
                    <p className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
                      {decimal(result.remainingLeave)} {t.daysUnit}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{t.currentGrantedLeave}</p>
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
                      <p className="text-xs font-semibold text-slate-400">{t.serviceYears}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {result.serviceYears} {t.yearsUnit}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
                      <p className="text-xs font-semibold text-slate-400">{t.serviceDays}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {result.serviceDays.toLocaleString(lang === "ko" ? "ko-KR" : "en-US")} {t.daysUnit}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      label: t.firstYearMonthlyLeave,
                      value: `${result.firstYearMonthlyLeave} ${t.daysUnit}`,
                    },
                    {
                      label: t.currentGrantedLeave,
                      value: `${decimal(result.currentGrantedLeave)} ${t.daysUnit}`,
                    },
                    {
                      label: t.remainingLeave,
                      value: `${decimal(result.remainingLeave)} ${t.daysUnit}`,
                    },
                    { label: t.nextGrantDate, value: formatDate(result.nextGrantDate, lang) },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
                    >
                      <p className="text-xs font-semibold text-slate-400">{label}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyToolState
                icon="📌"
                title={t.notEligibleTitle}
                description={t.notEligibleBody}
              />
            )
          ) : (
            <EmptyToolState
              icon="🗂️"
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
