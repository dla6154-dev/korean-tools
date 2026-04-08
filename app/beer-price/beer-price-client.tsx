"use client";

import { useState } from "react";
import { useLanguage } from "../language-context";

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
    title: "단위 가격 비교기",
    subtitle:
      "용량, 중량, 개수 기준으로 묶음 상품까지 환산해서 단위 가격을 비교할 수 있습니다.",
    hint: "L/ml, kg/g, 개 중 하나를 골라 같은 종류 단위끼리 비교하세요.",
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
    compare: "비교하기",
    invalid: "기준 수량, 묶음 개수, 가격을 1개 이상 올바르게 입력해 주세요.",
    mixedUnits:
      "같은 종류의 단위끼리만 비교할 수 있습니다. 예: ml끼리, g끼리, 개끼리 비교해 주세요.",
    empty: "수량과 가격을 입력한 뒤 비교하기를 누르면 순위가 표시됩니다.",
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
      "3개 묶음 우유는 기준 수량 0.9L, 묶음 개수 3처럼 넣으면 총 수량으로 환산됩니다.",
      "결과는 100ml, 100g, 1개 기준의 단위 가격으로 비교됩니다.",
    ],
  },
  en: {
    title: "Unit Price Comparator",
    subtitle:
      "Compare bundled products by converting volume, weight, or piece counts into a standard unit price.",
    hint: "Choose one family of units at a time: L/ml, kg/g, or pieces.",
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
    compare: "Compare",
    invalid: "Enter at least one valid amount, bundle count, and price.",
    mixedUnits:
      "Only the same kind of units can be compared together. For example: ml with ml, g with g, or pieces with pieces.",
    empty: "Enter quantity and price, then press compare to see the ranking.",
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
      "For a 3-pack of milk, enter the per-pack amount and then the bundle count.",
      "Results are compared by a standard unit: 100ml, 100g, or 1 item.",
    ],
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {t.title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 md:text-base">{t.subtitle}</p>
        <p className="mt-2 text-xs leading-5 text-slate-400 md:text-sm">{t.hint}</p>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
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
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t.resultsTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{t.resultsDescription}</p>
          </div>
        </div>

        {showResults && rankedItems.length > 0 ? (
          <div className="mt-6 space-y-3">
            {rankedItems.map((item, index) => {
              const differencePercent =
                cheapestStandardPrice && cheapestStandardPrice > 0
                  ? ((item.standardPrice - cheapestStandardPrice) / cheapestStandardPrice) * 100
                  : 0;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 ${
                    index === 0
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
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

                      <h3 className="mt-3 truncate text-lg font-semibold text-slate-900">
                        {item.label}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {index === 0
                          ? t.cheapest
                          : differencePercent <= 0.04
                            ? t.samePrice
                            : `${t.compareWithBest} +${formatNumber(differencePercent)}% ${t.moreExpensive}`}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                      <p className="text-xs font-medium text-slate-400">{item.standardLabel}</p>
                      <p className="mt-1 text-xl font-bold text-blue-600">
                        {formatNumber(item.standardPrice)} {t.currencySuffix}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
            {t.empty}
          </div>
        )}
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 md:p-6">
        <h2 className="text-lg font-semibold text-slate-900">{t.tipsTitle}</h2>
        <div className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
          {t.tips.map((tip) => (
            <p key={tip} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>{tip}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
