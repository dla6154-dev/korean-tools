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
  calculateDiscount,
  formatDecimal,
  formatKrw,
  parsePositiveNumber,
} from "../life-tool-utils";
import { buildRelatedToolItems } from "../text-tool-utils";

type DiscountResult = NonNullable<ReturnType<typeof calculateDiscount>>;

const inputClass =
  "mt-2 w-full rounded-[20px] border border-slate-200 bg-slate-50/70 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100";

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "생활 계산", "할인율 계산기"],
    title: "할인율 계산기",
    description:
      "정가, 할인가, 할인율 중 두 값을 넣으면 나머지 하나와 실제 절감 금액까지 바로 계산합니다.",
    badges: [
      { label: "생활 계산", tone: "slate" as const },
      { label: "쇼핑 비교", tone: "blue" as const },
      { label: "즉시 계산", tone: "amber" as const },
    ],
    inputTitle: "가격 정보 입력",
    inputDescription:
      "세 항목 중 두 가지만 입력하면 나머지 하나를 자동 계산합니다.",
    originalPriceLabel: "정가",
    salePriceLabel: "할인가",
    discountRateLabel: "할인율",
    discountRateHint: "예: 15 또는 37.5",
    calculate: "할인율 계산하기",
    noteTitle: "사용 팁",
    noteItems: [
      "정가와 할인가를 넣으면 할인율을 계산합니다.",
      "정가와 할인율을 넣으면 할인가를 계산합니다.",
      "할인가와 할인율을 넣으면 원래 정가를 역산합니다.",
    ],
    resultTitle: "할인 계산 결과",
    resultDescription:
      "쇼핑이나 견적 비교에 바로 쓸 수 있도록 핵심 숫자만 정리했습니다.",
    emptyTitle: "두 개 이상의 값을 입력해보세요",
    emptyDescription: "계산 결과가 여기 표시됩니다.",
    originalPrice: "정가",
    salePrice: "할인가",
    discountRate: "할인율",
    savedAmount: "절감 금액",
    effectiveMultiplier: "실결제 비율",
    faqTitle: "자주 묻는 질문",
    faqDescription: "할인 계산에서 자주 확인하는 기준입니다.",
    faqs: [
      {
        question: "할인율이 100%도 계산되나요?",
        answer:
          "정가와 할인가를 모두 알고 있는 경우에는 100% 계산이 가능합니다. 하지만 할인가와 100% 할인율만으로 정가를 역산할 수는 없습니다.",
      },
      {
        question: "할인가가 정가보다 비싸면 어떻게 되나요?",
        answer:
          "이 도구는 할인 상황을 가정하므로 할인가가 정가보다 크면 입력 오류로 안내합니다.",
      },
      {
        question: "실결제 비율은 무엇인가요?",
        answer:
          "정가 대비 실제로 얼마를 지불하는지를 백분율로 보여주는 값입니다. 예를 들어 80%면 정가의 80%를 내는 상황입니다.",
      },
    ],
    relatedTitle: "같이 보면 좋은 생활 계산 도구",
    relatedDescription: "가격·구매 판단과 이어서 쓸 수 있는 도구입니다.",
    relatedAction: "도구 열기",
    errorNeedTwo: "정가, 할인가, 할인율 중 두 개 이상을 입력하세요.",
    errorMoney: "정가와 할인가는 0 이상 숫자로 입력하세요.",
    errorOriginal: "정가는 0보다 큰 숫자여야 합니다.",
    errorRate: "할인율은 0 이상 100 이하로 입력하세요.",
    errorImpossible: "입력한 조합으로는 할인 계산을 할 수 없습니다.",
    errorSaleHigher: "할인가는 정가보다 클 수 없습니다.",
  },
  en: {
    breadcrumbs: ["All tools", "Life", "Discount calculator"],
    title: "Discount Calculator",
    description:
      "Enter any two of original price, sale price, and discount rate to calculate the missing value.",
    badges: [
      { label: "Life", tone: "slate" as const },
      { label: "Shopping", tone: "blue" as const },
      { label: "Instant", tone: "amber" as const },
    ],
    inputTitle: "Enter price values",
    inputDescription:
      "Any two of the three fields are enough to calculate the rest.",
    originalPriceLabel: "Original price",
    salePriceLabel: "Sale price",
    discountRateLabel: "Discount rate",
    discountRateHint: "For example 15 or 37.5",
    calculate: "Calculate discount",
    noteTitle: "Tips",
    noteItems: [
      "Original price + sale price gives the discount rate.",
      "Original price + discount rate gives the sale price.",
      "Sale price + discount rate gives the original price.",
    ],
    resultTitle: "Discount result",
    resultDescription: "The core discount values are grouped into one summary.",
    emptyTitle: "Enter at least two values",
    emptyDescription: "The calculated result will appear here.",
    originalPrice: "Original price",
    salePrice: "Sale price",
    discountRate: "Discount rate",
    savedAmount: "Amount saved",
    effectiveMultiplier: "Payment ratio",
    faqTitle: "Frequently asked questions",
    faqDescription: "Common points people check before using this calculator.",
    faqs: [
      {
        question: "Can this handle a 100% discount?",
        answer:
          "Yes when the original and sale prices are known, but not when you try to reconstruct the original price from a 100% discount.",
      },
      {
        question: "What if the sale price is higher than the original price?",
        answer:
          "This tool assumes a discount scenario, so it treats that as invalid input.",
      },
      {
        question: "What is the payment ratio?",
        answer:
          "It shows how much of the original price you still pay after the discount.",
      },
    ],
    relatedTitle: "Related life tools",
    relatedDescription: "Continue with other purchase and value comparison tools.",
    relatedAction: "Open tool",
    errorNeedTwo: "Enter at least two of original price, sale price, and discount rate.",
    errorMoney: "Original and sale prices must be numbers of 0 or more.",
    errorOriginal: "The original price must be greater than 0.",
    errorRate: "Enter a discount rate between 0 and 100.",
    errorImpossible: "This input combination cannot be solved.",
    errorSaleHigher: "The sale price cannot exceed the original price.",
  },
};

function formatCurrency(value: number, lang: "ko" | "en") {
  return `${formatKrw(value, lang === "ko" ? "ko-KR" : "en-US")}${lang === "ko" ? "원" : " KRW"}`;
}

export default function DiscountClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [originalPrice, setOriginalPrice] = useState("10000");
  const [salePrice, setSalePrice] = useState("7900");
  const [discountRate, setDiscountRate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiscountResult | null>(null);

  const relatedItems = buildRelatedToolItems(lang, [
    "/unit-price",
    "/starbucks-reward",
    "/loan",
    "/net-pay",
  ]);

  function parseOptionalMoney(input: string) {
    return input.trim() === "" ? null : parsePositiveNumber(input);
  }

  function parseOptionalRate(input: string) {
    return input.trim() === "" ? null : Number(input.replace(/,/g, "").trim());
  }

  function handleCalculate() {
    const original = parseOptionalMoney(originalPrice);
    const sale = parseOptionalMoney(salePrice);
    const rate = parseOptionalRate(discountRate);
    const filledCount = [original, sale, rate].filter(
      (value) => value !== null && Number.isFinite(value),
    ).length;

    if (filledCount < 2) {
      setError(t.errorNeedTwo);
      setResult(null);
      return;
    }

    if (
      (original !== null && (!Number.isFinite(original) || original < 0)) ||
      (sale !== null && (!Number.isFinite(sale) || sale < 0))
    ) {
      setError(t.errorMoney);
      setResult(null);
      return;
    }

    if (original !== null && original <= 0) {
      setError(t.errorOriginal);
      setResult(null);
      return;
    }

    if (rate !== null && (!Number.isFinite(rate) || rate < 0 || rate > 100)) {
      setError(t.errorRate);
      setResult(null);
      return;
    }

    if (original === null && sale !== null && rate === 100) {
      setError(t.errorImpossible);
      setResult(null);
      return;
    }

    const calculated = calculateDiscount({
      originalPrice: original,
      salePrice: sale,
      discountRate: rate,
    });

    if (!calculated) {
      setError(t.errorImpossible);
      setResult(null);
      return;
    }

    if (calculated.originalPrice <= 0) {
      setError(t.errorOriginal);
      setResult(null);
      return;
    }

    if (calculated.salePrice > calculated.originalPrice) {
      setError(t.errorSaleHigher);
      setResult(null);
      return;
    }

    setError(null);
    setResult(calculated);
  }

  const decimal = (value: number) =>
    formatDecimal(value, 1, lang === "ko" ? "ko-KR" : "en-US");

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="🏷️"
      title={t.title}
      description={t.description}
      badges={t.badges}
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="space-y-6">
          <ToolPanel title={t.inputTitle} description={t.inputDescription}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  {t.originalPriceLabel}
                </label>
                <input
                  value={originalPrice}
                  onChange={(event) => setOriginalPrice(event.target.value)}
                  inputMode="numeric"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  {t.salePriceLabel}
                </label>
                <input
                  value={salePrice}
                  onChange={(event) => setSalePrice(event.target.value)}
                  inputMode="numeric"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  {t.discountRateLabel}
                </label>
                <input
                  value={discountRate}
                  onChange={(event) => setDiscountRate(event.target.value)}
                  inputMode="decimal"
                  className={inputClass}
                />
                <p className="mt-1 text-xs leading-5 text-slate-500">{t.discountRateHint}</p>
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
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/70 p-5">
                  <p className="text-sm font-semibold text-emerald-700">{t.savedAmount}</p>
                  <p className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
                    {formatCurrency(result.savedAmount, lang)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{t.discountRate}</p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
                  <p className="text-sm font-semibold text-slate-700">{t.discountRate}</p>
                  <p className="mt-4 text-2xl font-bold text-slate-950">{decimal(result.discountRate)}%</p>
                  <p className="mt-2 text-sm text-slate-500">{t.effectiveMultiplier}</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: t.originalPrice, value: formatCurrency(result.originalPrice, lang) },
                  { label: t.salePrice, value: formatCurrency(result.salePrice, lang) },
                  { label: t.discountRate, value: `${decimal(result.discountRate)}%` },
                  {
                    label: t.effectiveMultiplier,
                    value: `${decimal(result.effectiveMultiplier * 100)}%`,
                  },
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
              icon="🧾"
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
