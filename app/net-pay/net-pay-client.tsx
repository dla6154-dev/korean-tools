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
import { estimateNetPay, formatKrw, parsePositiveNumber } from "../life-tool-utils";
import { buildRelatedToolItems } from "../text-tool-utils";

type NetPayResult = ReturnType<typeof estimateNetPay>;

const moneyInputClass =
  "w-full rounded-[20px] border border-slate-200 bg-slate-50/70 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100";
const labelClass = "text-sm font-semibold text-slate-700";
const hintClass = "mt-1 text-xs leading-5 text-slate-500";

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "생활 계산", "실수령액 계산기"],
    title: "실수령액 계산기",
    description:
      "월 급여와 비과세 금액을 넣으면 국민연금, 건강보험, 장기요양보험, 고용보험, 소득세를 반영한 예상 실수령액을 계산합니다.",
    badges: [
      { label: "생활 계산", tone: "slate" as const },
      { label: "급여 추정", tone: "blue" as const },
      { label: "2026 공식 요율 기준", tone: "amber" as const },
    ],
    inputTitle: "급여 정보 입력",
    inputDescription:
      "세전 월급과 비과세 수당을 기준으로 간단한 예상치를 계산합니다. 실제 급여명세서와는 차이가 날 수 있습니다.",
    grossLabel: "세전 월급",
    grossHint: "상여금과 일회성 지급액은 제외한 월 기준 금액을 입력하세요.",
    nonTaxableLabel: "비과세 월급",
    nonTaxableHint: "식대·차량유지비 등 과세 제외 금액이 있다면 입력하세요. 없으면 0원으로 두면 됩니다.",
    familyLabel: "공제 대상 가족 수",
    familyHint: "본인을 포함한 기본공제 인원 수입니다.",
    childLabel: "자녀 세액공제 대상 수",
    childHint: "자녀 세액공제를 적용할 수 있는 인원 수를 입력하세요.",
    withholdingLabel: "원천징수 비율",
    withholdingHint: "회사에서 간이세액 80%, 100%, 120% 중 무엇을 쓰는지 선택하세요.",
    calculate: "실수령액 계산하기",
    noteTitle: "계산 기준",
    noteItems: [
      "2026년 4월 9일 기준 공식 보험 요율과 기본 세액공제 규칙을 단순화해 반영합니다.",
      "실제 급여는 부양가족 인정 여부, 회사별 비과세 처리, 상여금, 간이세액표 적용 방식에 따라 달라질 수 있습니다.",
      "정확한 급여 신고나 세무 판단이 필요하면 회사 급여 담당자 또는 세무 전문가 기준으로 다시 확인하세요.",
    ],
    resultTitle: "예상 실수령액",
    resultDescription: "월 기준 예상 수령액과 주요 공제 항목을 함께 보여줍니다.",
    emptyTitle: "월급 정보를 입력해보세요",
    emptyDescription: "계산 결과가 여기 표시됩니다.",
    primaryLabel: "월 예상 실수령액",
    taxableLabel: "과세 대상 월급",
    deductionLabel: "월 총 공제액",
    annualGrossLabel: "연 과세 급여",
    pension: "국민연금",
    health: "건강보험",
    longTermCare: "장기요양보험",
    employment: "고용보험",
    incomeTax: "소득세",
    localTax: "지방소득세",
    annualSummaryTitle: "연간 세금 추정 요약",
    annualSummaryDescription:
      "월급에서 환산한 연 기준 과세표준과 세액공제 흐름입니다.",
    earnedIncomeDeduction: "근로소득공제",
    insuranceDeduction: "사회보험 공제",
    basicDeduction: "기본공제",
    taxableIncome: "과세표준",
    calculatedIncomeTax: "산출세액",
    earnedIncomeTaxCredit: "근로소득세액공제",
    childTaxCredit: "자녀 세액공제",
    finalIncomeTax: "연 소득세 추정",
    faqTitle: "자주 묻는 질문",
    faqDescription: "실수령액 계산기 사용 전에 많이 확인하는 내용을 정리했습니다.",
    faqs: [
      {
        question: "실제 월급명세서와 왜 차이가 날 수 있나요?",
        answer:
          "간이세액표 세부 적용, 비과세 항목 인정 범위, 상여금, 식대 정책, 노조비나 사내 공제 같은 추가 항목이 회사마다 다르기 때문입니다.",
      },
      {
        question: "비과세 금액을 모르면 어떻게 입력하나요?",
        answer:
          "모르면 0원으로 두고 먼저 계산한 뒤, 급여명세서에 비과세 식대나 차량유지비가 있다면 그 금액을 추가해 다시 확인하는 방식이 안전합니다.",
      },
      {
        question: "원천징수 비율 80%, 100%, 120%는 무엇인가요?",
        answer:
          "회사가 간이세액을 어느 강도로 적용하는지에 따라 소득세를 적게 떼거나 기본값으로 떼거나 더 많이 떼는 선택지입니다. 모르면 100%를 기준으로 보면 됩니다.",
      },
    ],
    relatedTitle: "같이 보면 좋은 생활 계산 도구",
    relatedDescription: "근로·급여·비교 계산을 이어서 확인할 수 있습니다.",
    relatedAction: "도구 열기",
    errorGross: "세전 월급은 0원보다 큰 숫자로 입력하세요.",
    errorNonTaxable: "비과세 월급은 0원 이상으로 입력하세요.",
    errorFamily: "공제 대상 가족 수는 1명 이상 정수로 입력하세요.",
    errorChild: "자녀 수는 0명 이상 정수로 입력하세요.",
  },
  en: {
    breadcrumbs: ["All tools", "Life", "Net pay calculator"],
    title: "Net Pay Calculator",
    description:
      "Estimate take-home pay from gross monthly salary, non-taxable income, insurance deductions, and withholding ratio.",
    badges: [
      { label: "Life", tone: "slate" as const },
      { label: "Payroll estimate", tone: "blue" as const },
      { label: "Based on 2026 official rates", tone: "amber" as const },
    ],
    inputTitle: "Enter salary details",
    inputDescription:
      "This gives a simplified monthly estimate, not a payroll statement.",
    grossLabel: "Gross monthly salary",
    grossHint: "Use your regular monthly pay excluding bonuses.",
    nonTaxableLabel: "Non-taxable monthly pay",
    nonTaxableHint:
      "Include tax-exempt meal or allowance amounts if applicable, otherwise keep it at 0.",
    familyLabel: "Deduction family count",
    familyHint: "This includes yourself.",
    childLabel: "Eligible child tax credit count",
    childHint: "Enter the number of children eligible for tax credit.",
    withholdingLabel: "Withholding ratio",
    withholdingHint: "Choose 80%, 100%, or 120% depending on your payroll setup.",
    calculate: "Calculate net pay",
    noteTitle: "How this estimate works",
    noteItems: [
      "This uses official 2026 insurance rates and simplified income-tax assumptions.",
      "Actual payroll can differ due to company rules, bonuses, or detailed withholding tables.",
      "Use your payslip or a payroll professional for final reporting decisions.",
    ],
    resultTitle: "Estimated take-home pay",
    resultDescription: "Monthly take-home pay and major deductions are grouped together.",
    emptyTitle: "Enter salary details",
    emptyDescription: "The estimated result will appear here.",
    primaryLabel: "Estimated monthly take-home",
    taxableLabel: "Taxable monthly pay",
    deductionLabel: "Total monthly deductions",
    annualGrossLabel: "Annual taxable gross",
    pension: "National pension",
    health: "Health insurance",
    longTermCare: "Long-term care",
    employment: "Employment insurance",
    incomeTax: "Income tax",
    localTax: "Local income tax",
    annualSummaryTitle: "Annual tax summary",
    annualSummaryDescription:
      "A simplified annual view converted from the monthly taxable salary.",
    earnedIncomeDeduction: "Earned income deduction",
    insuranceDeduction: "Insurance deduction",
    basicDeduction: "Basic deduction",
    taxableIncome: "Taxable income",
    calculatedIncomeTax: "Calculated tax",
    earnedIncomeTaxCredit: "Earned income tax credit",
    childTaxCredit: "Child tax credit",
    finalIncomeTax: "Estimated annual income tax",
    faqTitle: "Frequently asked questions",
    faqDescription: "Common questions about the estimate.",
    faqs: [
      {
        question: "Why can the result differ from my payslip?",
        answer:
          "Employers can apply different withholding tables, additional deductions, bonus treatment, and tax-exempt rules.",
      },
      {
        question: "What if I do not know my non-taxable amount?",
        answer:
          "Leave it at 0 first, then refine the result after checking your payslip for tax-exempt allowances.",
      },
      {
        question: "What does the withholding ratio mean?",
        answer:
          "It represents how aggressively simplified income tax is withheld relative to the base amount.",
      },
    ],
    relatedTitle: "Related life tools",
    relatedDescription: "Continue with other pay and work-related calculators.",
    relatedAction: "Open tool",
    errorGross: "Enter a gross monthly salary greater than 0.",
    errorNonTaxable: "Enter a non-taxable amount that is 0 or higher.",
    errorFamily: "Enter a family count of at least 1.",
    errorChild: "Enter a child count of 0 or higher.",
  },
};

function formatCurrency(value: number, lang: "ko" | "en") {
  return `${formatKrw(value, lang === "ko" ? "ko-KR" : "en-US")}${lang === "ko" ? "원" : " KRW"}`;
}

export default function NetPayClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [grossMonthly, setGrossMonthly] = useState("3000000");
  const [nonTaxableMonthly, setNonTaxableMonthly] = useState("200000");
  const [familyCount, setFamilyCount] = useState("1");
  const [childCount, setChildCount] = useState("0");
  const [withholdingRatio, setWithholdingRatio] = useState<80 | 100 | 120>(100);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NetPayResult | null>(null);

  const relatedItems = buildRelatedToolItems(lang, [
    "/weekly-holiday-pay",
    "/annual-leave",
    "/discount",
    "/severance",
  ]);

  function handleCalculate() {
    const gross = parsePositiveNumber(grossMonthly);
    const nonTaxable = nonTaxableMonthly.trim() === "" ? 0 : parsePositiveNumber(nonTaxableMonthly);
    const family = Number(familyCount);
    const children = Number(childCount);

    if (!Number.isFinite(gross) || gross <= 0) {
      setError(t.errorGross);
      setResult(null);
      return;
    }

    if (!Number.isFinite(nonTaxable) || nonTaxable < 0) {
      setError(t.errorNonTaxable);
      setResult(null);
      return;
    }

    if (!Number.isInteger(family) || family < 1) {
      setError(t.errorFamily);
      setResult(null);
      return;
    }

    if (!Number.isInteger(children) || children < 0) {
      setError(t.errorChild);
      setResult(null);
      return;
    }

    setError(null);
    setResult(
      estimateNetPay({
        grossMonthly: gross,
        nonTaxableMonthly: nonTaxable,
        familyCount: family,
        childCount: children,
        withholdingRatio,
      }),
    );
  }

  const money = (value: number) => formatCurrency(value, lang);

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="💰"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="space-y-6">
          <ToolPanel title={t.inputTitle} description={t.inputDescription}>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t.grossLabel}</label>
                <input
                  value={grossMonthly}
                  onChange={(event) => setGrossMonthly(event.target.value)}
                  inputMode="numeric"
                  className={`${moneyInputClass} mt-2`}
                />
                <p className={hintClass}>{t.grossHint}</p>
              </div>

              <div>
                <label className={labelClass}>{t.nonTaxableLabel}</label>
                <input
                  value={nonTaxableMonthly}
                  onChange={(event) => setNonTaxableMonthly(event.target.value)}
                  inputMode="numeric"
                  className={`${moneyInputClass} mt-2`}
                />
                <p className={hintClass}>{t.nonTaxableHint}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>{t.familyLabel}</label>
                  <input
                    value={familyCount}
                    onChange={(event) => setFamilyCount(event.target.value)}
                    inputMode="numeric"
                    className={`${moneyInputClass} mt-2`}
                  />
                  <p className={hintClass}>{t.familyHint}</p>
                </div>
                <div>
                  <label className={labelClass}>{t.childLabel}</label>
                  <input
                    value={childCount}
                    onChange={(event) => setChildCount(event.target.value)}
                    inputMode="numeric"
                    className={`${moneyInputClass} mt-2`}
                  />
                  <p className={hintClass}>{t.childHint}</p>
                </div>
              </div>

              <div>
                <label className={labelClass}>{t.withholdingLabel}</label>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {[80, 100, 120].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setWithholdingRatio(ratio as 80 | 100 | 120)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                        withholdingRatio === ratio
                          ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                      }`}
                    >
                      {ratio}%
                    </button>
                  ))}
                </div>
                <p className={hintClass}>{t.withholdingHint}</p>
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
            <div className="space-y-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/70 p-5">
                  <p className="text-sm font-semibold text-emerald-700">{t.primaryLabel}</p>
                  <p className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
                    {money(result.monthly.net)}
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/90 px-4 py-3">
                      <p className="text-xs font-semibold text-slate-400">{t.taxableLabel}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {money(result.taxableMonthly)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/90 px-4 py-3">
                      <p className="text-xs font-semibold text-slate-400">{t.deductionLabel}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {money(result.monthly.totalDeductions)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
                  <p className="text-sm font-semibold text-slate-700">{t.annualGrossLabel}</p>
                  <p className="mt-4 text-2xl font-bold text-slate-950">
                    {money(result.annual.gross)}
                  </p>
                  <dl className="mt-5 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between gap-3">
                      <dt>{t.incomeTax}</dt>
                      <dd className="font-semibold text-slate-900">
                        {money(result.monthly.incomeTax)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt>{t.localTax}</dt>
                      <dd className="font-semibold text-slate-900">
                        {money(result.monthly.localIncomeTax)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {[
                  { label: t.pension, value: result.monthly.pension },
                  { label: t.health, value: result.monthly.health },
                  { label: t.longTermCare, value: result.monthly.longTermCare },
                  { label: t.employment, value: result.monthly.employment },
                  { label: t.incomeTax, value: result.monthly.incomeTax },
                  { label: t.localTax, value: result.monthly.localIncomeTax },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
                  >
                    <p className="text-xs font-semibold text-slate-400">{label}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{money(value)}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[24px] border border-blue-200 bg-blue-50/60 p-5">
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-slate-900">
                    {t.annualSummaryTitle}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {t.annualSummaryDescription}
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { label: t.earnedIncomeDeduction, value: result.annual.earnedIncomeDeduction },
                    { label: t.insuranceDeduction, value: result.annual.insuranceDeduction },
                    { label: t.basicDeduction, value: result.annual.basicDeduction },
                    { label: t.taxableIncome, value: result.annual.taxableIncome },
                    { label: t.calculatedIncomeTax, value: result.annual.calculatedIncomeTax },
                    {
                      label: t.earnedIncomeTaxCredit,
                      value: result.annual.earnedIncomeTaxCredit,
                    },
                    { label: t.childTaxCredit, value: result.annual.childTaxCredit },
                    { label: t.finalIncomeTax, value: result.annual.finalIncomeTax },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3"
                    >
                      <span className="text-sm text-slate-500">{label}</span>
                      <span className="text-sm font-semibold text-slate-900">{money(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <EmptyToolState
              icon="💸"
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
