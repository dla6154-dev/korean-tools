"use client";

import {
  EmptyToolState,
  RelatedToolsSection,
  ToolFaqSection,
  ToolPageShell,
  ToolPanel,
} from "../components/tool-page-shell";
import { tools } from "../tool-content";
import { useLanguage } from "../language-context";
import { useState } from "react";

type MeasureUnit = "l" | "ml" | "kg" | "g" | "ea";
type MeasureDimension = "volume" | "weight" | "piece";

type PriceInput = {
  id: number;
  name: string;
  amount: string;
  bundleCount: string;
  unit: MeasureUnit;
  price: string;
};

type ComparedItem = {
  id: number;
  label: string;
  dimension: MeasureDimension;
  standardLabel: string;
  standardPrice: number;
};

const UNIT_META: Record<
  MeasureUnit,
  {
    dimension: MeasureDimension;
    toBase: number;
    label: { ko: string; en: string };
    standardBase: number;
    standardLabel: { ko: string; en: string };
  }
> = {
  l: {
    dimension: "volume",
    toBase: 1000,
    label: { ko: "L", en: "L" },
    standardBase: 100,
    standardLabel: { ko: "100ml당", en: "per 100ml" },
  },
  ml: {
    dimension: "volume",
    toBase: 1,
    label: { ko: "ml", en: "ml" },
    standardBase: 100,
    standardLabel: { ko: "100ml당", en: "per 100ml" },
  },
  kg: {
    dimension: "weight",
    toBase: 1000,
    label: { ko: "kg", en: "kg" },
    standardBase: 100,
    standardLabel: { ko: "100g당", en: "per 100g" },
  },
  g: {
    dimension: "weight",
    toBase: 1,
    label: { ko: "g", en: "g" },
    standardBase: 100,
    standardLabel: { ko: "100g당", en: "per 100g" },
  },
  ea: {
    dimension: "piece",
    toBase: 1,
    label: { ko: "개", en: "pcs" },
    standardBase: 1,
    standardLabel: { ko: "1개당", en: "per item" },
  },
};

const UNIT_OPTIONS: MeasureUnit[] = ["l", "ml", "kg", "g", "ea"];

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "생활 계산", "단위 가격 비교기"],
    title: "단위 가격 비교기",
    subtitle:
      "용량, 중량, 개수 기준으로 묶음 상품까지 환산해서 가장 저렴한 단위 가격 순서를 보여줍니다.",
    badges: ["무료", "묶음 상품 지원", "모바일 최적화"],
    inputTitle: "비교할 상품 입력",
    inputDescription:
      "같은 단위 계열끼리만 비교하세요. 예: L/ml끼리, kg/g끼리, 개끼리 비교",
    hint: "기준 수량과 묶음 개수, 총 가격을 넣으면 자동으로 100ml, 100g, 1개 기준으로 환산합니다.",
    namePlaceholder: "상품 이름 입력",
    baseAmount: "기준 수량",
    bundleCount: "묶음 개수",
    price: "총 가격",
    bundleCountUnit: "묶음",
    priceUnit: "원",
    currencySuffix: "원",
    edit: "수정",
    save: "완료",
    remove: "삭제",
    addItem: "+ 항목 추가",
    compare: "단위 비교하기",
    invalid: "기준 수량, 묶음 개수, 가격을 1개 이상 올바르게 입력해 주세요.",
    mixedUnits:
      "같은 종류의 단위끼리만 비교할 수 있습니다. 예: ml끼리, g끼리, 개끼리 비교해 주세요.",
    empty: "수량과 가격을 입력한 뒤 비교하기를 누르면 순위 카드가 표시됩니다.",
    previewTotal: "총 수량",
    resultsTitle: "비교 결과",
    resultsDescription: "가장 저렴한 단위 가격 순서대로 정렬했습니다.",
    cheapest: "가장 저렴",
    samePrice: "동일 가격",
    moreExpensive: "더 비쌈",
    compareWithBest: "최저가 대비",
    itemPrefix: "상품",
    rankSuffix: "위",
    tipsTitle: "입력 팁",
    tips: [
      "500ml는 0.5L로, 900g은 0.9kg로도 입력할 수 있습니다.",
      "3개 묶음 우유는 기준 수량에 개당 용량을 넣고 묶음 개수에 3을 입력하세요.",
      "결과는 100ml, 100g, 1개 기준의 단위 가격으로 비교됩니다.",
    ],
    faqTitle: "자주 묻는 질문",
    faqDescription: "비교 전에 자주 나오는 질문을 먼저 정리했습니다.",
    faqs: [
      {
        question: "단위가 다른 상품끼리 비교해도 되나요?",
        answer:
          "아니요. 같은 계열의 단위끼리만 비교해야 정확합니다. 예를 들어 ml와 g는 서로 다른 기준이므로 함께 비교할 수 없습니다.",
      },
      {
        question: "묶음 상품은 어떻게 입력하나요?",
        answer:
          "기준 수량에는 낱개 하나의 용량 또는 중량을, 묶음 개수에는 총 묶음 수를 넣으면 됩니다. 총 가격은 묶음 전체 가격을 입력하면 자동 환산됩니다.",
      },
      {
        question: "이름을 꼭 입력해야 하나요?",
        answer:
          "아니요. 이름을 비워두면 상품 1, 상품 2처럼 자동 이름이 붙습니다. 필요하면 수정 버튼으로 바꿀 수 있습니다.",
      },
    ],
    relatedTitle: "관련 도구",
    relatedDescription: "생활 계산 도구와 함께 자주 쓰는 화면을 바로 이어서 열 수 있습니다.",
    relatedAction: "바로 열기",
  },
  en: {
    breadcrumbs: ["All tools", "Life", "Unit price comparator"],
    title: "Unit Price Comparator",
    subtitle:
      "Convert bundles by volume, weight, or pieces and rank products from the cheapest unit price.",
    badges: ["Free", "Bundle support", "Mobile ready"],
    inputTitle: "Enter products to compare",
    inputDescription:
      "Compare only the same unit family together. Example: L/ml with L/ml, kg/g with kg/g, and pieces with pieces.",
    hint: "Enter the base amount, bundle count, and total price to convert automatically to a standard unit.",
    namePlaceholder: "Enter item name",
    baseAmount: "Base amount",
    bundleCount: "Bundle count",
    price: "Total price",
    bundleCountUnit: "packs",
    priceUnit: "",
    currencySuffix: "KRW",
    edit: "Edit",
    save: "Done",
    remove: "Remove",
    addItem: "+ Add item",
    compare: "Compare unit price",
    invalid: "Enter at least one valid amount, bundle count, and price.",
    mixedUnits:
      "Only the same kind of units can be compared together. For example: ml with ml, g with g, or pieces with pieces.",
    empty: "Enter quantity and price, then press compare to see ranking cards.",
    previewTotal: "Total quantity",
    resultsTitle: "Comparison results",
    resultsDescription: "Sorted from the cheapest standard unit price.",
    cheapest: "Best value",
    samePrice: "Same price",
    moreExpensive: "more expensive",
    compareWithBest: "vs best value",
    itemPrefix: "Item",
    rankSuffix: "",
    tipsTitle: "Tips",
    tips: [
      "You can enter 500ml as 0.5L, or 900g as 0.9kg.",
      "For a 3-pack of milk, enter the per-pack amount and use the bundle count for 3.",
      "Results are compared by a standard unit: 100ml, 100g, or 1 item.",
    ],
    faqTitle: "Frequently asked questions",
    faqDescription: "A few common questions before comparing products.",
    faqs: [
      {
        question: "Can I compare products with different unit families?",
        answer:
          "No. Only compare products within the same unit family. For example, ml and g should not be ranked together.",
      },
      {
        question: "How should I enter bundle products?",
        answer:
          "Enter the amount for a single item as the base amount, then enter the pack count as the bundle count. The total price should be the price of the whole bundle.",
      },
      {
        question: "Do I need to name every item?",
        answer:
          "No. If you leave the name blank, the tool will label items automatically. You can rename them later with the edit button.",
      },
    ],
    relatedTitle: "Related tools",
    relatedDescription: "Open other everyday tools people often use together.",
    relatedAction: "Open now",
  },
};

function createItem(id: number): PriceInput {
  return {
    id,
    name: "",
    amount: "",
    bundleCount: "1",
    unit: "ml",
    price: "",
  };
}

export default function BeerPriceClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [items, setItems] = useState<PriceInput[]>([createItem(1), createItem(2)]);
  const [editingNameId, setEditingNameId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);

  const locale = lang === "ko" ? "ko-KR" : "en-US";
  const numberFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  });

  const comparedItems = items
    .map((item, index) => {
      const amount = Number(item.amount);
      const bundleCount = Number(item.bundleCount);
      const price = Number(item.price);
      const unitMeta = UNIT_META[item.unit];

      if (
        !Number.isFinite(amount) ||
        !Number.isFinite(bundleCount) ||
        !Number.isFinite(price) ||
        amount <= 0 ||
        bundleCount <= 0 ||
        price <= 0
      ) {
        return null;
      }

      const totalBaseQuantity = amount * bundleCount * unitMeta.toBase;
      const standardPrice = price / (totalBaseQuantity / unitMeta.standardBase);

      return {
        id: item.id,
        label: item.name.trim() || `${t.itemPrefix} ${index + 1}`,
        dimension: unitMeta.dimension,
        standardLabel: unitMeta.standardLabel[lang],
        standardPrice,
      } satisfies ComparedItem;
    })
    .filter((item): item is ComparedItem => item !== null);

  const uniqueDimensions = Array.from(new Set(comparedItems.map((item) => item.dimension)));
  const hasMixedDimensions = uniqueDimensions.length > 1;
  const rankedItems = [...comparedItems].sort(
    (left, right) => left.standardPrice - right.standardPrice,
  );
  const cheapestStandardPrice = rankedItems[0]?.standardPrice ?? null;

  function updateItem(id: number, field: keyof Omit<PriceInput, "id">, value: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );

    if (error) {
      setError("");
    }
  }

  function addItem() {
    setItems((current) => [...current, createItem(Date.now())]);
  }

  function removeItem(id: number) {
    setItems((current) => current.filter((item) => item.id !== id));

    if (editingNameId === id) {
      setEditingNameId(null);
    }
  }

  function compareItems() {
    if (rankedItems.length === 0) {
      setError(t.invalid);
      setShowResults(false);
      return;
    }

    if (hasMixedDimensions) {
      setError(t.mixedUnits);
      setShowResults(false);
      return;
    }

    setError("");
    setShowResults(true);
  }

  function formatNumber(value: number) {
    return numberFormatter.format(Math.round(value * 10) / 10);
  }

  function getDisplayName(item: PriceInput, index: number) {
    return item.name.trim() || `${t.itemPrefix} ${index + 1}`;
  }

  const relatedItems = ["/loan", "/bmi", "/alcohol", "/characters"]
    .map((href) => tools.find((tool) => tool.href === href))
    .filter((tool): tool is NonNullable<(typeof tools)[number]> => Boolean(tool))
    .map((tool) => ({
      href: tool.href,
      icon: tool.icon,
      title: tool.title[lang],
      description: tool.description[lang],
      badge: tool.badge[lang],
    }));

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="💸"
      title={t.title}
      description={t.subtitle}
      badges={t.badges.map((label, index) => ({
        label,
        tone: index === 0 ? "green" : index === 1 ? "blue" : "amber",
      }))}
    >
      <div className="mt-8 space-y-6">
        <ToolPanel title={t.inputTitle} description={t.inputDescription}>
          <p className="mb-5 text-sm leading-6 text-slate-500">{t.hint}</p>
          <div className="space-y-4">
            {items.map((item, index) => {
              const amount = Number(item.amount);
              const bundleCount = Number(item.bundleCount);
              const price = Number(item.price);
              const unitMeta = UNIT_META[item.unit];
              const hasPreview =
                Number.isFinite(amount) &&
                Number.isFinite(bundleCount) &&
                Number.isFinite(price) &&
                amount > 0 &&
                bundleCount > 0 &&
                price > 0;

              const totalBaseQuantity = hasPreview ? amount * bundleCount * unitMeta.toBase : null;
              const totalDisplayQuantity = hasPreview ? amount * bundleCount : null;
              const previewStandardPrice =
                hasPreview && totalBaseQuantity
                  ? price / (totalBaseQuantity / unitMeta.standardBase)
                  : null;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {editingNameId === item.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            value={item.name}
                            onChange={(event) => updateItem(item.id, "name", event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                setEditingNameId(null);
                              }
                            }}
                            placeholder={t.namePlaceholder}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => setEditingNameId(null)}
                            className="shrink-0 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                          >
                            {t.save}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-700">
                            {getDisplayName(item, index)}
                          </p>
                          <button
                            type="button"
                            onClick={() => setEditingNameId(item.id)}
                            className="shrink-0 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                          >
                            {t.edit}
                          </button>
                        </div>
                      )}
                    </div>

                    {items.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 text-xs font-semibold text-slate-400 transition hover:text-red-500"
                      >
                        {t.remove}
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="min-w-0">
                      <label className="mb-1 block text-[11px] font-medium text-slate-600 sm:text-sm">
                        {t.baseAmount}
                      </label>
                      <div className="flex rounded-xl border border-slate-300 bg-white">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          value={item.amount}
                          onChange={(event) => updateItem(item.id, "amount", event.target.value)}
                          placeholder="0.5"
                          className="min-w-0 flex-1 rounded-l-xl bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none sm:px-4 sm:py-3"
                        />
                        <select
                          value={item.unit}
                          onChange={(event) =>
                            updateItem(item.id, "unit", event.target.value as MeasureUnit)
                          }
                          className="w-14 shrink-0 rounded-r-xl border-l border-slate-200 bg-transparent px-1 text-xs font-medium text-slate-600 outline-none sm:w-16 sm:px-2 sm:text-sm"
                        >
                          {UNIT_OPTIONS.map((unit) => (
                            <option key={unit} value={unit}>
                              {UNIT_META[unit].label[lang]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <label className="mb-1 block text-[11px] font-medium text-slate-600 sm:text-sm">
                        {t.bundleCount}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="numeric"
                          min="1"
                          step="1"
                          value={item.bundleCount}
                          onChange={(event) =>
                            updateItem(item.id, "bundleCount", event.target.value)
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:px-4 sm:py-3 sm:pr-12"
                        />
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 sm:right-3 sm:text-xs">
                          {t.bundleCountUnit}
                        </span>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <label className="mb-1 block text-[11px] font-medium text-slate-600 sm:text-sm">
                        {t.price}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="1"
                          value={item.price}
                          onChange={(event) => updateItem(item.id, "price", event.target.value)}
                          placeholder="3500"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-8 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:px-4 sm:py-3 sm:pr-12"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 sm:right-3 sm:text-xs">
                          {t.priceUnit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-slate-500 sm:text-xs">
                    {hasPreview && totalDisplayQuantity !== null && previewStandardPrice !== null ? (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span>
                          {t.previewTotal}{" "}
                          <strong className="text-slate-800">
                            {formatNumber(totalDisplayQuantity)} {unitMeta.label[lang]}
                          </strong>
                        </span>
                        <span>
                          {unitMeta.standardLabel[lang]}{" "}
                          <strong className="text-slate-800">
                            {formatNumber(previewStandardPrice)} {t.currencySuffix}
                          </strong>
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400">
                        {t.baseAmount} + {t.bundleCount} + {t.price}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={addItem}
              className="rounded-2xl border-2 border-dashed border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
            >
              {t.addItem}
            </button>
            <button
              type="button"
              onClick={compareItems}
              className="rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              {t.compare}
            </button>
          </div>

          {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
        </ToolPanel>

        <ToolPanel
          title={t.resultsTitle}
          description={t.resultsDescription}
          className={showResults && rankedItems.length > 0 ? "border-emerald-200 bg-emerald-50/60" : ""}
        >
          {showResults && rankedItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {rankedItems.map((item, index) => {
                const differencePercent =
                  cheapestStandardPrice && cheapestStandardPrice > 0
                    ? ((item.standardPrice - cheapestStandardPrice) / cheapestStandardPrice) * 100
                    : 0;

                return (
                  <div
                    key={item.id}
                    className={`rounded-[24px] border p-5 ${
                      index === 0
                        ? "border-emerald-200 bg-white shadow-sm"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                          {lang === "ko" ? `${index + 1}${t.rankSuffix}` : `#${index + 1}`}
                        </span>
                        {index === 0 ? (
                          <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white">
                            {t.cheapest}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.label}</h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {index === 0
                        ? t.cheapest
                        : differencePercent <= 0.04
                          ? t.samePrice
                          : `${t.compareWithBest} +${formatNumber(differencePercent)}% ${t.moreExpensive}`}
                    </p>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-xs font-medium text-slate-400">{item.standardLabel}</p>
                      <p className="mt-2 text-2xl font-bold text-blue-600">
                        {formatNumber(item.standardPrice)} {t.currencySuffix}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyToolState icon="💸" title={t.resultsTitle} description={t.empty} />
          )}
        </ToolPanel>

        <ToolPanel className="border-amber-200 bg-amber-50/70" title={t.tipsTitle}>
          <div className="space-y-2 text-sm leading-6 text-slate-600">
            {t.tips.map((tip) => (
              <p key={tip} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>{tip}</span>
              </p>
            ))}
          </div>
        </ToolPanel>

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
