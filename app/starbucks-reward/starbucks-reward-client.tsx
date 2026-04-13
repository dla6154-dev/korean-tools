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
import { tools, type LangText } from "../tool-content";

type MembershipLevel = "welcome" | "green" | "gold";
type CouponKey = "size-up" | "coffee-8" | "drink-12" | "food-15" | "md-50";
type ComparisonMode = "efficiency" | "discount" | "stars";
type CouponScope = "beverage" | "food" | "md";

type CouponAnalysis = {
  key: CouponKey;
  name: string;
  summary: string;
  scope: CouponScope;
  starsRequired: number;
  expectedDiscount: number;
  efficiency: number;
  isApplicable: boolean;
  isAvailableNow: boolean;
  starsToEarn: number | null;
  status: string;
  reason: string;
};

type MenuPreset = {
  id: string;
  label: LangText;
  description: LangText;
  eightEligible: boolean;
  supportsSizeUp: boolean;
};

const MENU_PRESETS: MenuPreset[] = [
  {
    id: "americano",
    label: { ko: "카페 아메리카노 Tall", en: "Tall Caffe Americano" },
    description: {
      ko: "8별 무료 커피 대상",
      en: "Eligible for the 8-star coffee coupon",
    },
    eightEligible: true,
    supportsSizeUp: true,
  },
  {
    id: "latte",
    label: { ko: "카페 라떼 Tall", en: "Tall Caffe Latte" },
    description: {
      ko: "8별 무료 커피 대상",
      en: "Eligible for the 8-star coffee coupon",
    },
    eightEligible: true,
    supportsSizeUp: true,
  },
  {
    id: "brewed",
    label: { ko: "오늘의 커피 / 아이스 커피 Tall", en: "Tall brewed or iced coffee" },
    description: {
      ko: "8별 무료 커피 대상",
      en: "Eligible for the 8-star coffee coupon",
    },
    eightEligible: true,
    supportsSizeUp: false,
  },
  {
    id: "cold-brew",
    label: { ko: "콜드 브루 Tall", en: "Tall Cold Brew" },
    description: {
      ko: "12별 무료 음료 비교용",
      en: "Useful for the 12-star drink comparison",
    },
    eightEligible: false,
    supportsSizeUp: true,
  },
  {
    id: "caramel-macchiato",
    label: { ko: "카라멜 마키아또 Tall", en: "Tall Caramel Macchiato" },
    description: {
      ko: "12별 무료 음료 비교용",
      en: "Useful for the 12-star drink comparison",
    },
    eightEligible: false,
    supportsSizeUp: true,
  },
  {
    id: "seasonal",
    label: { ko: "시즌 제조 음료 Tall", en: "Tall seasonal handcrafted drink" },
    description: {
      ko: "12별 무료 음료 비교용",
      en: "Useful for the 12-star drink comparison",
    },
    eightEligible: false,
    supportsSizeUp: true,
  },
];

const FOOD_VOUCHER_CAP = 8000;
const MD_VOUCHER_CAP = 25000;

const T = {
  ko: {
    breadcrumbs: ["전체 도구", "생활 계산", "스타벅스 별 쿠폰 비교기"],
    title: "스타벅스 별 쿠폰 비교기",
    description:
      "지금 마실 커피 가격을 기준으로 별 쿠폰을 비교하고, 필요하면 푸드·MD 바우처까지 함께 계산해 가장 효율적인 선택을 찾아줍니다.",
    badges: ["공식 혜택 기준", "2026-04-08 확인", "커피 + 바우처 비교"],
    inputTitle: "비교 조건 입력",
    inputDescription:
      "스타벅스 코리아 공식 리워드 규칙을 기준으로, 현재 음료와 선택한 교환 대상의 원/별 효율을 비교합니다.",
    menuPresetTitle: "대표 메뉴 빠른 선택",
    menuPresetDescription:
      "프리셋은 쿠폰 적용 조건을 빠르게 채워 줍니다. Tall 가격은 매장·옵션에 따라 달라질 수 있으니 직접 확인해 수정하세요.",
    selectedPreset: "선택한 메뉴",
    priceLabel: "비교할 음료의 Tall 가격",
    priceHint:
      "8별, 12별 쿠폰은 Tall 기준이라 지금 마실 음료의 Tall 가격을 입력해 두는 편이 가장 정확합니다.",
    pricePlaceholder: "예: 5300",
    levelLabel: "회원 등급",
    starsLabel: "보유 별",
    starsHint:
      "비워두면 효율만 비교하고, 입력하면 지금 바로 쓸 수 있는 쿠폰과 앞으로 모을 만한 쿠폰을 함께 보여줍니다.",
    eightEligibleLabel: "8별 무료 커피 대상 음료예요",
    eightEligibleHint:
      "카페 아메리카노, 카페 라떼, 오늘의 커피, 아이스 커피 Tall이면 체크하세요.",
    sizeUpLabel: "2별 사이즈업도 같이 비교할래요",
    sizeUpHint:
      "2별 쿠폰은 제조 음료 1단계 사이즈업 기준입니다. Trenta는 적용되지 않습니다.",
    sizeUpValueLabel: "1단계 사이즈업 차액",
    voucherTitle: "푸드·MD 바우처도 함께 비교",
    voucherDescription:
      "커피 쿠폰만 볼 수도 있고, Gold 회원이라면 15별 푸드 8,000원 바우처와 50별 MD 25,000원 바우처까지 함께 비교할 수 있습니다.",
    foodPriceLabel: "비교할 푸드 가격",
    foodPriceHint:
      "15별 푸드 바우처는 8,000원 이하 1개 무료, 초과 시 차액 결제입니다. 비워두면 비교에서 제외됩니다.",
    mdPriceLabel: "비교할 MD 가격",
    mdPriceHint:
      "50별 MD 바우처는 25,000원 이하 1개 무료, 초과 시 차액 결제입니다. 비워두면 비교에서 제외됩니다.",
    compare: "가장 효율적인 쿠폰 찾기",
    inputError: "Tall 가격을 0보다 큰 숫자로 입력해 주세요.",
    starsError: "보유 별은 0 이상의 정수로 입력해 주세요.",
    sizeUpError: "사이즈업 차액은 0보다 큰 숫자로 입력해 주세요.",
    recommendationModeTitle: "추천 기준",
    modeEfficiency: "별당 효율 최대",
    modeDiscount: "절감 금액 최대",
    modeStars: "별 소모 최소",
    modeEfficiencyBody:
      "같은 별을 썼을 때 얼마나 큰 금액을 아끼는지 중심으로 추천합니다.",
    modeDiscountBody:
      "지금 한 번 쓸 때 절감 금액이 가장 큰 쿠폰을 우선 추천합니다.",
    modeStarsBody:
      "가능한 한 적은 별을 쓰면서 조건에 맞는 쿠폰을 먼저 추천합니다.",
    resultTitle: "쿠폰 비교 결과",
    resultDescription:
      "예상 절감액, 별당 효율, 즉시 사용 가능 여부를 함께 보면서 가장 좋은 선택을 정리했습니다.",
    recommendation: "추천 쿠폰",
    availableNow: "지금 바로 사용 가능",
    bestLater: "조금 더 모으면 가장 좋음",
    noCoupon: "현재 조건에 맞는 쿠폰이 없습니다",
    noCouponDescription:
      "회원 등급, 음료 종류, 푸드/MD 가격 입력 여부를 다시 확인해 보세요.",
    reasonBestNow: "현재 조건에서 바로 쓸 수 있는 선택지 중 추천 기준에 가장 잘 맞습니다.",
    reasonBestLater: "지금은 별이 부족하지만, 조금 더 모으면 가장 매력적인 선택입니다.",
    expectedDiscount: "예상 절감액",
    efficiency: "별당 효율",
    starsUnit: "별",
    currencyUnit: "원",
    applicableNow: "사용 가능",
    notEnoughStars: "별 부족",
    notApplicable: "조건 불일치",
    scopeBeverage: "음료",
    scopeFood: "푸드",
    scopeMd: "MD",
    nowVsSaveTitle: "지금 쓰기 vs 모아서 쓰기",
    nowVsSaveDescription:
      "보유 별이 있을 때는 지금 당장 쓰는 선택과 조금 더 모아 쓰는 선택을 따로 보여줍니다.",
    useNow: "지금 바로 쓰기",
    saveForLater: "조금 더 모아서 쓰기",
    noAvailableNow: "현재 보유 별로 바로 쓸 수 있는 쿠폰이 없습니다.",
    noFutureTarget: "입력한 조건에서 더 모을 만한 추가 쿠폰이 없습니다.",
    starsMoreNeeded: "더 필요한 별",
    extraSavings: "지금보다 더 아끼는 금액",
    breakEvenTitle: "손익분기점과 효율 벤치마크",
    breakEvenDescription:
      "2별 사이즈업이 무료 음료 쿠폰보다 유리해지는 구간과 푸드·MD 바우처의 최대 효율 기준을 함께 보여줍니다.",
    breakEven8: "2별이 8별보다 유리해지는 차액",
    breakEven12: "2별이 12별보다 유리해지는 차액",
    currentSizeUpValue: "현재 입력한 차액",
    aboveBreakEven: "현재 차액은 기준 이상",
    belowBreakEven: "현재 차액은 기준 미만",
    foodBenchmark: "15별 푸드 최대 효율",
    mdBenchmark: "50별 MD 최대 효율",
    foodBenchmarkBody:
      "푸드 가격이 8,000원 이상이면 15별 바우처는 최대 효율에 도달합니다.",
    mdBenchmarkBody:
      "MD 가격이 25,000원 이상이면 50별 바우처는 최대 효율에 도달합니다.",
    officialNoteTitle: "공식 기준 요약",
    officialNotes: [
      "2026년 4월 8일 스타벅스 코리아 등급 및 혜택 페이지 기준입니다.",
      "별 2개: Green/Gold 등급, 제조 음료 1단계 사이즈업, Trenta 적용 불가",
      "별 8개: 카페 아메리카노·카페 라떼·오늘의 커피·아이스 커피 Tall 무료",
      "별 12개: Gold 등급 전용, 제조 음료 Tall 1잔 무료",
      "별 15개: Gold 등급 전용, 푸드 8,000원 바우처",
      "별 50개: Gold 등급 전용, MD 25,000원 바우처",
    ],
    officialLinkLabel: "스타벅스 공식 혜택 페이지 보기",
    faqTitle: "자주 묻는 질문",
    faqDescription: "쿠폰 비교 전에 자주 헷갈리는 기준만 먼저 정리했습니다.",
    faqs: [
      {
        question: "왜 Tall 가격을 기준으로 넣어야 하나요?",
        answer:
          "별 8개 무료 커피와 별 12개 무료 음료 쿠폰이 모두 Tall 기준으로 제공되기 때문입니다. Grande나 Venti를 마실 예정이어도 기준 비교는 Tall 가격으로 잡는 편이 안전합니다.",
      },
      {
        question: "2별 사이즈업 쿠폰은 왜 차액을 따로 넣나요?",
        answer:
          "2별 쿠폰은 무료 음료가 아니라 1단계 사이즈업 혜택입니다. 실제 절감액은 메뉴별 사이즈업 차액에 따라 달라져서, 이 값을 별도로 반영해야 정확한 비교가 됩니다.",
      },
      {
        question: "보유 별을 입력하지 않으면 어떻게 계산되나요?",
        answer:
          "지금 바로 사용할 수 있는지 여부를 제외하고, 현재 조건에서 적용 가능한 쿠폰을 추천 기준에 맞춰 정렬합니다.",
      },
      {
        question: "푸드와 MD 바우처는 언제 비교에 포함되나요?",
        answer:
          "Gold 등급이면서 비교할 푸드 가격이나 MD 가격을 입력했을 때만 포함됩니다. 입력하지 않으면 음료 쿠폰 중심으로만 추천합니다.",
      },
    ],
    relatedTitle: "같이 보기 좋은 도구",
    relatedDescription: "생활 계산과 가격 비교 도구를 이어서 바로 열 수 있습니다.",
    relatedAction: "바로 열기",
    levelWelcome: "Welcome",
    levelGreen: "Green",
    levelGold: "Gold",
    couponSizeUp: "별 2개 사이즈업",
    couponSizeUpSummary: "제조 음료 1단계 사이즈업",
    couponCoffee8: "별 8개 기본 커피 무료",
    couponCoffee8Summary: "아메리카노·라떼·브루드 커피 Tall 무료",
    couponDrink12: "별 12개 제조 음료 무료",
    couponDrink12Summary: "Gold 전용 제조 음료 Tall 무료",
    couponFood15: "별 15개 푸드 바우처",
    couponFood15Summary: "푸드 1개 최대 8,000원 할인",
    couponMd50: "별 50개 MD 바우처",
    couponMd50Summary: "MD 1개 최대 25,000원 할인",
    reasonWelcome: "Welcome 등급은 별 교환 쿠폰 대상이 아닙니다.",
    reasonEightEligible:
      "8별 쿠폰은 카페 아메리카노, 카페 라떼, 오늘의 커피, 아이스 커피 Tall에만 적용됩니다.",
    reasonGoldOnly: "이 쿠폰은 Gold 등급 전용입니다.",
    reasonNeedSizeUp: "사이즈업으로 주문할 때만 2별 쿠폰을 비교할 수 있습니다.",
    reasonNeedFoodPrice: "푸드 가격을 입력하면 15별 바우처도 같이 비교합니다.",
    reasonNeedMdPrice: "MD 가격을 입력하면 50별 바우처도 같이 비교합니다.",
    reasonNeedMoreStarsPrefix: "보유 별이 부족합니다. 현재",
    reasonNeedMoreStarsSuffix: "개 보유",
    emptyTitle: "커피 가격을 넣고 비교해 보세요",
    emptyDescription:
      "Tall 가격과 조건을 입력하면 어떤 별 쿠폰이 지금 가장 효율적인지 결과 카드가 여기에 표시됩니다.",
  },
  en: {
    breadcrumbs: ["All tools", "Life", "Starbucks rewards coupon picker"],
    title: "Starbucks Rewards Coupon Picker",
    description:
      "Compare Starbucks drink coupons against the Tall price of the coffee you want, and optionally include food or MD vouchers too.",
    badges: ["Official rules", "Checked on April 8, 2026", "Coffee + voucher comparison"],
    inputTitle: "Enter comparison inputs",
    inputDescription:
      "This compares Starbucks Korea star rewards by discount value, value per star, and current availability.",
    menuPresetTitle: "Quick menu presets",
    menuPresetDescription:
      "The presets only fill in coupon conditions quickly. Because public web pages do not expose a stable live price feed, keep the Tall price editable and adjust it as needed.",
    selectedPreset: "Selected menu",
    priceLabel: "Tall price of the drink",
    priceHint:
      "The 8-star and 12-star drink coupons are based on Tall beverages, so using the Tall price keeps the comparison consistent.",
    pricePlaceholder: "e.g. 5300",
    levelLabel: "Membership level",
    starsLabel: "Stars you have",
    starsHint:
      "Leave blank to compare efficiency only, or enter a value to split the result into 'use now' and 'save up' strategies.",
    eightEligibleLabel: "This drink qualifies for the 8-star coffee coupon",
    eightEligibleHint:
      "Check this for Tall Americano, Tall Latte, brewed coffee, or iced coffee.",
    sizeUpLabel: "Also compare the 2-star size-up coupon",
    sizeUpHint:
      "The 2-star coupon is a one-step size-up benefit for handcrafted beverages. Trenta is excluded.",
    sizeUpValueLabel: "One-step size-up surcharge",
    voucherTitle: "Include food and MD vouchers",
    voucherDescription:
      "If you are Gold, you can compare the 15-star food voucher and the 50-star MD voucher alongside beverage coupons.",
    foodPriceLabel: "Food item price",
    foodPriceHint:
      "The 15-star food voucher covers one food item up to 8,000 KRW. Leave blank to exclude it.",
    mdPriceLabel: "MD item price",
    mdPriceHint:
      "The 50-star MD voucher covers one MD item up to 25,000 KRW. Leave blank to exclude it.",
    compare: "Pick the best coupon",
    inputError: "Enter a Tall price greater than 0.",
    starsError: "Enter stars owned as a whole number greater than or equal to 0.",
    sizeUpError: "Enter a size-up surcharge greater than 0.",
    recommendationModeTitle: "Recommendation mode",
    modeEfficiency: "Best value per star",
    modeDiscount: "Biggest discount",
    modeStars: "Use the fewest stars",
    modeEfficiencyBody:
      "Prioritizes how much money each spent star saves you.",
    modeDiscountBody:
      "Prioritizes the single coupon that saves the biggest amount right away.",
    modeStarsBody:
      "Prioritizes spending as few stars as possible while still matching the input conditions.",
    resultTitle: "Coupon comparison",
    resultDescription:
      "Estimated discount, value per star, and whether the reward can be used right now are grouped together.",
    recommendation: "Recommended coupon",
    availableNow: "Available right now",
    bestLater: "Best after earning more stars",
    noCoupon: "No coupon matches the current inputs",
    noCouponDescription:
      "Check the membership level, drink type, and optional food or MD prices.",
    reasonBestNow: "This is the strongest option among rewards you can use right now under the chosen recommendation mode.",
    reasonBestLater:
      "You cannot use it yet, but it becomes the strongest option once you earn enough stars.",
    expectedDiscount: "Estimated discount",
    efficiency: "Value per star",
    starsUnit: "stars",
    currencyUnit: "KRW",
    applicableNow: "Available",
    notEnoughStars: "Need more stars",
    notApplicable: "Not applicable",
    scopeBeverage: "Drink",
    scopeFood: "Food",
    scopeMd: "MD",
    nowVsSaveTitle: "Use now vs save up",
    nowVsSaveDescription:
      "When a star balance is entered, the tool separates the best reward you can use now from the best reward worth saving for.",
    useNow: "Use now",
    saveForLater: "Save for later",
    noAvailableNow: "No reward can be used with the current star balance.",
    noFutureTarget: "There is no stronger future target under the current inputs.",
    starsMoreNeeded: "More stars needed",
    extraSavings: "Extra savings vs now",
    breakEvenTitle: "Break-even and efficiency benchmarks",
    breakEvenDescription:
      "See when the 2-star size-up becomes more efficient than free drink coupons, and how the food and MD vouchers compare at full value.",
    breakEven8: "Size-up threshold vs 8 stars",
    breakEven12: "Size-up threshold vs 12 stars",
    currentSizeUpValue: "Current surcharge",
    aboveBreakEven: "Current surcharge is above the threshold",
    belowBreakEven: "Current surcharge is below the threshold",
    foodBenchmark: "15-star food max efficiency",
    mdBenchmark: "50-star MD max efficiency",
    foodBenchmarkBody:
      "The 15-star food voucher reaches full efficiency when the food price is 8,000 KRW or more.",
    mdBenchmarkBody:
      "The 50-star MD voucher reaches full efficiency when the MD price is 25,000 KRW or more.",
    officialNoteTitle: "Official rule summary",
    officialNotes: [
      "Based on Starbucks Korea's published reward rules as of April 8, 2026.",
      "2 stars: Green/Gold only, one-step size-up, Trenta excluded",
      "8 stars: Tall Americano, Tall Latte, brewed coffee, or iced coffee",
      "12 stars: Gold only, one Tall handcrafted beverage",
      "15 stars: Gold only, one food voucher up to 8,000 KRW",
      "50 stars: Gold only, one MD voucher up to 25,000 KRW",
    ],
    officialLinkLabel: "View Starbucks official rewards page",
    faqTitle: "Frequently asked questions",
    faqDescription: "The main assumptions behind the comparison.",
    faqs: [
      {
        question: "Why do I enter the Tall price?",
        answer:
          "The 8-star coffee coupon and the 12-star free drink coupon are both defined around Tall beverages, so the Tall price keeps the comparison stable.",
      },
      {
        question: "Why is the 2-star size-up based on a separate surcharge?",
        answer:
          "The 2-star reward is not a free drink. It only covers the one-step size-up difference, which can vary by drink.",
      },
      {
        question: "What if I leave the star balance empty?",
        answer:
          "The tool still ranks rewards according to the selected recommendation mode. It simply skips the 'available right now' strategy split.",
      },
      {
        question: "When are food and MD vouchers included?",
        answer:
          "They are only included when you are Gold and you enter a food or MD item price to compare against.",
      },
    ],
    relatedTitle: "Related tools",
    relatedDescription: "Open other price and everyday calculators right away.",
    relatedAction: "Open now",
    levelWelcome: "Welcome",
    levelGreen: "Green",
    levelGold: "Gold",
    couponSizeUp: "2-star size-up",
    couponSizeUpSummary: "One-step size-up for a handcrafted drink",
    couponCoffee8: "8-star coffee coupon",
    couponCoffee8Summary: "Free Tall Americano, Latte, or brewed coffee",
    couponDrink12: "12-star drink coupon",
    couponDrink12Summary: "Gold-only free Tall handcrafted beverage",
    couponFood15: "15-star food voucher",
    couponFood15Summary: "Up to 8,000 KRW off one food item",
    couponMd50: "50-star MD voucher",
    couponMd50Summary: "Up to 25,000 KRW off one MD item",
    reasonWelcome: "Welcome level cannot exchange stars for these coupons.",
    reasonEightEligible:
      "The 8-star reward only applies to Tall Americano, Tall Latte, brewed coffee, or iced coffee.",
    reasonGoldOnly: "This reward is Gold-only.",
    reasonNeedSizeUp: "Only compare the 2-star reward if you are planning a size-up order.",
    reasonNeedFoodPrice: "Enter a food price to include the 15-star voucher.",
    reasonNeedMdPrice: "Enter an MD price to include the 50-star voucher.",
    reasonNeedMoreStarsPrefix: "Not enough stars right now.",
    reasonNeedMoreStarsSuffix: "stars owned",
    emptyTitle: "Enter a drink price to compare",
    emptyDescription:
      "Once you add the Tall price and relevant conditions, the best reward recommendation appears here.",
  },
};

function parsePositiveNumber(value: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function formatCurrency(value: number, lang: "ko" | "en") {
  const locale = lang === "ko" ? "ko-KR" : "en-US";

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: value >= 100 ? 0 : 1,
  }).format(Math.round(value * 10) / 10);
}

function compareByMode(left: CouponAnalysis, right: CouponAnalysis, mode: ComparisonMode) {
  if (mode === "discount") {
    if (right.expectedDiscount !== left.expectedDiscount) {
      return right.expectedDiscount - left.expectedDiscount;
    }
    if (right.efficiency !== left.efficiency) {
      return right.efficiency - left.efficiency;
    }
    return left.starsRequired - right.starsRequired;
  }

  if (mode === "stars") {
    if (left.starsRequired !== right.starsRequired) {
      return left.starsRequired - right.starsRequired;
    }
    if (right.expectedDiscount !== left.expectedDiscount) {
      return right.expectedDiscount - left.expectedDiscount;
    }
    return right.efficiency - left.efficiency;
  }

  if (right.efficiency !== left.efficiency) {
    return right.efficiency - left.efficiency;
  }
  if (right.expectedDiscount !== left.expectedDiscount) {
    return right.expectedDiscount - left.expectedDiscount;
  }
  return left.starsRequired - right.starsRequired;
}

function sortCoupons(items: CouponAnalysis[], mode: ComparisonMode) {
  return [...items].sort((left, right) => compareByMode(left, right, mode));
}

function buildCouponAnalyses(params: {
  lang: "ko" | "en";
  drinkPrice: number;
  foodPrice: number | null;
  mdPrice: number | null;
  ownedStars: number | null;
  level: MembershipLevel;
  eightEligible: boolean;
  wantsSizeUp: boolean;
  sizeUpValue: number;
}) {
  const { lang, drinkPrice, foodPrice, mdPrice, ownedStars, level, eightEligible, wantsSizeUp, sizeUpValue } =
    params;
  const t = T[lang];
  const canUseStarExchange = level !== "welcome";
  const enoughStars = (requiredStars: number) =>
    ownedStars === null || ownedStars >= requiredStars;
  const getStarShortage = (requiredStars: number) =>
    ownedStars === null ? null : Math.max(requiredStars - ownedStars, 0);
  const shortageReason = (requiredStars: number) =>
    `${t.reasonNeedMoreStarsPrefix} ${ownedStars ?? 0}${t.reasonNeedMoreStarsSuffix}. ${requiredStars}${lang === "ko" ? "개 필요" : " needed"}`;

  const analyses: CouponAnalysis[] = [];
  const sizeUpApplicable = canUseStarExchange && wantsSizeUp;
  const sizeUpDiscount = Math.min(sizeUpValue, drinkPrice);

  analyses.push({
    key: "size-up",
    name: t.couponSizeUp,
    summary: t.couponSizeUpSummary,
    scope: "beverage",
    starsRequired: 2,
    expectedDiscount: sizeUpDiscount,
    efficiency: sizeUpDiscount / 2,
    isApplicable: sizeUpApplicable,
    isAvailableNow: sizeUpApplicable && enoughStars(2),
    starsToEarn: sizeUpApplicable ? getStarShortage(2) : null,
    status: !canUseStarExchange
      ? t.notApplicable
      : !wantsSizeUp
        ? t.notApplicable
        : enoughStars(2)
          ? t.applicableNow
          : t.notEnoughStars,
    reason: !canUseStarExchange
      ? t.reasonWelcome
      : !wantsSizeUp
        ? t.reasonNeedSizeUp
        : enoughStars(2)
          ? t.couponSizeUpSummary
          : shortageReason(2),
  });

  const coffee8Applicable = canUseStarExchange && eightEligible;
  analyses.push({
    key: "coffee-8",
    name: t.couponCoffee8,
    summary: t.couponCoffee8Summary,
    scope: "beverage",
    starsRequired: 8,
    expectedDiscount: drinkPrice,
    efficiency: drinkPrice / 8,
    isApplicable: coffee8Applicable,
    isAvailableNow: coffee8Applicable && enoughStars(8),
    starsToEarn: coffee8Applicable ? getStarShortage(8) : null,
    status: !canUseStarExchange
      ? t.notApplicable
      : !eightEligible
        ? t.notApplicable
        : enoughStars(8)
          ? t.applicableNow
          : t.notEnoughStars,
    reason: !canUseStarExchange
      ? t.reasonWelcome
      : !eightEligible
        ? t.reasonEightEligible
        : enoughStars(8)
          ? t.couponCoffee8Summary
          : shortageReason(8),
  });

  const drink12Applicable = level === "gold";
  analyses.push({
    key: "drink-12",
    name: t.couponDrink12,
    summary: t.couponDrink12Summary,
    scope: "beverage",
    starsRequired: 12,
    expectedDiscount: drinkPrice,
    efficiency: drinkPrice / 12,
    isApplicable: drink12Applicable,
    isAvailableNow: drink12Applicable && enoughStars(12),
    starsToEarn: drink12Applicable ? getStarShortage(12) : null,
    status: !drink12Applicable
      ? t.notApplicable
      : enoughStars(12)
        ? t.applicableNow
        : t.notEnoughStars,
    reason: !drink12Applicable
      ? t.reasonGoldOnly
      : enoughStars(12)
        ? t.couponDrink12Summary
        : shortageReason(12),
  });

  const food15Applicable = level === "gold" && foodPrice !== null;
  const food15Discount = foodPrice === null ? 0 : Math.min(foodPrice, FOOD_VOUCHER_CAP);
  analyses.push({
    key: "food-15",
    name: t.couponFood15,
    summary: t.couponFood15Summary,
    scope: "food",
    starsRequired: 15,
    expectedDiscount: food15Discount,
    efficiency: food15Discount / 15,
    isApplicable: food15Applicable,
    isAvailableNow: food15Applicable && enoughStars(15),
    starsToEarn: food15Applicable ? getStarShortage(15) : null,
    status: level !== "gold"
      ? t.notApplicable
      : foodPrice === null
        ? t.notApplicable
        : enoughStars(15)
          ? t.applicableNow
          : t.notEnoughStars,
    reason: level !== "gold"
      ? t.reasonGoldOnly
      : foodPrice === null
        ? t.reasonNeedFoodPrice
        : enoughStars(15)
          ? t.couponFood15Summary
          : shortageReason(15),
  });

  const md50Applicable = level === "gold" && mdPrice !== null;
  const md50Discount = mdPrice === null ? 0 : Math.min(mdPrice, MD_VOUCHER_CAP);
  analyses.push({
    key: "md-50",
    name: t.couponMd50,
    summary: t.couponMd50Summary,
    scope: "md",
    starsRequired: 50,
    expectedDiscount: md50Discount,
    efficiency: md50Discount / 50,
    isApplicable: md50Applicable,
    isAvailableNow: md50Applicable && enoughStars(50),
    starsToEarn: md50Applicable ? getStarShortage(50) : null,
    status: level !== "gold"
      ? t.notApplicable
      : mdPrice === null
        ? t.notApplicable
        : enoughStars(50)
          ? t.applicableNow
          : t.notEnoughStars,
    reason: level !== "gold"
      ? t.reasonGoldOnly
      : mdPrice === null
        ? t.reasonNeedMdPrice
        : enoughStars(50)
          ? t.couponMd50Summary
          : shortageReason(50),
  });

  return analyses;
}

export default function StarbucksRewardClient() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [price, setPrice] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [mdPrice, setMdPrice] = useState("");
  const [starsOwned, setStarsOwned] = useState("");
  const [level, setLevel] = useState<MembershipLevel>("gold");
  const [eightEligible, setEightEligible] = useState(false);
  const [wantsSizeUp, setWantsSizeUp] = useState(false);
  const [sizeUpValue, setSizeUpValue] = useState("500");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("efficiency");
  const [error, setError] = useState("");
  const [analyses, setAnalyses] = useState<CouponAnalysis[] | null>(null);

  const selectedPreset = MENU_PRESETS.find((preset) => preset.id === selectedPresetId) ?? null;
  const relatedItems = ["/unit-price", "/loan", "/bmi", "/age"]
    .map((href) => tools.find((tool) => tool.href === href))
    .filter((tool): tool is NonNullable<(typeof tools)[number]> => Boolean(tool))
    .map((tool) => ({
      href: tool.href,
      icon: tool.icon,
      title: tool.title[lang],
      description: tool.description[lang],
      badge: tool.badge[lang],
    }));

  const applicableCoupons = analyses
    ? sortCoupons(analyses.filter((item) => item.isApplicable), comparisonMode)
    : [];
  const availableCoupons = analyses
    ? sortCoupons(analyses.filter((item) => item.isAvailableNow), comparisonMode)
    : [];
  const futureCoupons = analyses
    ? sortCoupons(
        analyses.filter((item) => item.isApplicable && !item.isAvailableNow),
        comparisonMode,
      )
    : [];
  const recommendation = availableCoupons[0] ?? futureCoupons[0] ?? applicableCoupons[0] ?? null;
  const bestNow = availableCoupons[0] ?? null;
  const bestLater = futureCoupons[0] ?? null;

  const parsedDrinkPrice = parsePositiveNumber(price);
  const parsedFoodPrice = parsePositiveNumber(foodPrice);
  const parsedMdPrice = parsePositiveNumber(mdPrice);
  const parsedSizeUpValue = parsePositiveNumber(sizeUpValue);
  const sizeUpThresholdFor8 = parsedDrinkPrice === null ? null : parsedDrinkPrice / 4;
  const sizeUpThresholdFor12 =
    parsedDrinkPrice === null || level !== "gold" ? null : parsedDrinkPrice / 6;
  const foodBenchmarkEfficiency = FOOD_VOUCHER_CAP / 15;
  const mdBenchmarkEfficiency = MD_VOUCHER_CAP / 50;

  function applyPreset(preset: MenuPreset) {
    setSelectedPresetId(preset.id);
    setEightEligible(preset.eightEligible);
    if (!preset.supportsSizeUp) {
      setWantsSizeUp(false);
    }
    setError("");
  }

  function compareCoupons() {
    const parsedPrice = parsePositiveNumber(price);

    if (parsedPrice === null) {
      setError(t.inputError);
      setAnalyses(null);
      return;
    }

    let parsedStars: number | null = null;
    if (starsOwned.trim()) {
      const numericStars = Number(starsOwned);
      if (!Number.isInteger(numericStars) || numericStars < 0) {
        setError(t.starsError);
        setAnalyses(null);
        return;
      }
      parsedStars = numericStars;
    }

    if (wantsSizeUp && parsePositiveNumber(sizeUpValue) === null) {
      setError(t.sizeUpError);
      setAnalyses(null);
      return;
    }

    setError("");
    setAnalyses(
      buildCouponAnalyses({
        lang,
        drinkPrice: parsedPrice,
        foodPrice: parsePositiveNumber(foodPrice),
        mdPrice: parsePositiveNumber(mdPrice),
        ownedStars: parsedStars,
        level,
        eightEligible,
        wantsSizeUp,
        sizeUpValue: parsePositiveNumber(sizeUpValue) ?? 0,
      }),
    );
  }

  return (
    <ToolPageShell
      breadcrumbs={t.breadcrumbs}
      icon="☕"
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
                <h3 className="text-sm font-semibold text-slate-800">{t.menuPresetTitle}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {t.menuPresetDescription}
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {MENU_PRESETS.map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          isSelected
                            ? "border-blue-300 bg-blue-50/80 shadow-sm"
                            : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="text-sm font-semibold text-slate-900">
                          {preset.label[lang]}
                        </div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">
                          {preset.description[lang]}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedPreset ? (
                  <p className="mt-3 text-xs font-medium text-slate-500">
                    {t.selectedPreset}: {selectedPreset.label[lang]}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800">{t.priceLabel}</label>
                <p className="mt-1 text-xs leading-5 text-slate-400">{t.priceHint}</p>
                <div className="mt-2 relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={price}
                    onChange={(event) => {
                      setPrice(event.target.value);
                      setError("");
                    }}
                    placeholder={t.pricePlaceholder}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-14 text-base text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                    {t.currencyUnit}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-800">{t.levelLabel}</label>
                  <select
                    value={level}
                    onChange={(event) => {
                      setLevel(event.target.value as MembershipLevel);
                      setError("");
                    }}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="welcome">{t.levelWelcome}</option>
                    <option value="green">{t.levelGreen}</option>
                    <option value="gold">{t.levelGold}</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-800">{t.starsLabel}</label>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{t.starsHint}</p>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    value={starsOwned}
                    onChange={(event) => {
                      setStarsOwned(event.target.value);
                      setError("");
                    }}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <input
                  type="checkbox"
                  checked={eightEligible}
                  onChange={(event) => setEightEligible(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-500 focus:ring-blue-200"
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    {t.eightEligibleLabel}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {t.eightEligibleHint}
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <input
                  type="checkbox"
                  checked={wantsSizeUp}
                  onChange={(event) => setWantsSizeUp(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-500 focus:ring-blue-200"
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    {t.sizeUpLabel}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {t.sizeUpHint}
                  </span>
                </span>
              </label>

              {wantsSizeUp ? (
                <div>
                  <label className="text-sm font-semibold text-slate-800">
                    {t.sizeUpValueLabel}
                  </label>
                  <div className="mt-2 relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="1"
                      value={sizeUpValue}
                      onChange={(event) => {
                        setSizeUpValue(event.target.value);
                        setError("");
                      }}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-14 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                      {t.currencyUnit}
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <h3 className="text-sm font-semibold text-slate-900">{t.voucherTitle}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{t.voucherDescription}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-800">
                      {t.foodPriceLabel}
                    </label>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{t.foodPriceHint}</p>
                    <div className="mt-2 relative">
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="1"
                        value={foodPrice}
                        onChange={(event) => setFoodPrice(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-14 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                        {t.currencyUnit}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-800">
                      {t.mdPriceLabel}
                    </label>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{t.mdPriceHint}</p>
                    <div className="mt-2 relative">
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="1"
                        value={mdPrice}
                        onChange={(event) => setMdPrice(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-14 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                        {t.currencyUnit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={compareCoupons}
                className="w-full rounded-2xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                {t.compare}
              </button>

              {error ? <p className="text-sm text-rose-500">{error}</p> : null}
            </div>
          </ToolPanel>

          <ToolPanel className="border-amber-200 bg-amber-50/80" title={t.officialNoteTitle}>
            <div className="space-y-2 text-sm leading-6 text-slate-700">
              {t.officialNotes.map((item) => (
                <p key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
            <a
              href="https://www.starbucks.co.kr/msr/msreward/level_benefit.do"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
            >
              <span>{t.officialLinkLabel}</span>
              <span aria-hidden>↗</span>
            </a>
          </ToolPanel>
        </div>

        <div className="space-y-6">
          {analyses ? (
            <>
              <ToolPanel
                title={t.recommendationModeTitle}
                description={
                  comparisonMode === "efficiency"
                    ? t.modeEfficiencyBody
                    : comparisonMode === "discount"
                      ? t.modeDiscountBody
                      : t.modeStarsBody
                }
              >
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["efficiency", t.modeEfficiency],
                      ["discount", t.modeDiscount],
                      ["stars", t.modeStars],
                    ] as const
                  ).map(([mode, label]) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setComparisonMode(mode)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        comparisonMode === mode
                          ? "bg-blue-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </ToolPanel>

              <ToolPanel
                title={t.resultTitle}
                description={t.resultDescription}
                className="border-emerald-200 bg-emerald-50/80"
              >
                {recommendation ? (
                  <div className="rounded-[24px] border border-emerald-200 bg-white px-5 py-6 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white">
                        {recommendation.isAvailableNow ? t.availableNow : t.bestLater}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {recommendation.scope === "beverage"
                          ? t.scopeBeverage
                          : recommendation.scope === "food"
                            ? t.scopeFood
                            : t.scopeMd}
                      </span>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-slate-950">
                      {t.recommendation}: {recommendation.name}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {recommendation.isAvailableNow ? t.reasonBestNow : t.reasonBestLater}
                    </p>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <div className="text-xs font-medium text-slate-400">
                          {t.expectedDiscount}
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900">
                          {formatCurrency(recommendation.expectedDiscount, lang)} {t.currencyUnit}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <div className="text-xs font-medium text-slate-400">{t.efficiency}</div>
                        <div className="mt-2 text-2xl font-bold text-slate-900">
                          {formatCurrency(recommendation.efficiency, lang)} {t.currencyUnit}/
                          {t.starsUnit}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-950">{t.noCoupon}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {t.noCouponDescription}
                    </p>
                  </div>
                )}

                <div className="mt-4 grid gap-3">
                  {sortCoupons(applicableCoupons, comparisonMode).length > 0 ? (
                    sortCoupons(applicableCoupons, comparisonMode).map((coupon) => {
                      const isRecommended = recommendation?.key === coupon.key;
                      return (
                        <div
                          key={coupon.key}
                          className={`rounded-2xl border px-4 py-4 ${
                            isRecommended
                              ? "border-blue-200 bg-blue-50/70"
                              : coupon.isAvailableNow
                                ? "border-emerald-200 bg-white"
                                : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-semibold text-slate-900">
                                  {coupon.name}
                                </h3>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                  {coupon.starsRequired} {t.starsUnit}
                                </span>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                  {coupon.scope === "beverage"
                                    ? t.scopeBeverage
                                    : coupon.scope === "food"
                                      ? t.scopeFood
                                      : t.scopeMd}
                                </span>
                                {isRecommended ? (
                                  <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                                    {t.recommendation}
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-1 text-sm text-slate-500">{coupon.summary}</p>
                            </div>
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                coupon.isAvailableNow
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {coupon.status}
                            </span>
                          </div>

                          <div className="mt-4 grid gap-3 md:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                              <div className="text-xs font-medium text-slate-400">
                                {t.expectedDiscount}
                              </div>
                              <div className="mt-2 text-lg font-bold text-slate-900">
                                {formatCurrency(coupon.expectedDiscount, lang)} {t.currencyUnit}
                              </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                              <div className="text-xs font-medium text-slate-400">
                                {t.efficiency}
                              </div>
                              <div className="mt-2 text-lg font-bold text-slate-900">
                                {formatCurrency(coupon.efficiency, lang)} {t.currencyUnit}/
                                {t.starsUnit}
                              </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                              <div className="text-xs font-medium text-slate-400">
                                {t.starsMoreNeeded}
                              </div>
                              <div className="mt-2 text-lg font-bold text-slate-900">
                                {coupon.starsToEarn === null ? "-" : coupon.starsToEarn}
                              </div>
                            </div>
                          </div>

                          <p className="mt-4 text-sm leading-6 text-slate-600">{coupon.reason}</p>
                        </div>
                      );
                    })
                  ) : (
                    <EmptyToolState
                      icon="☕"
                      title={t.noCoupon}
                      description={t.noCouponDescription}
                    />
                  )}
                </div>
              </ToolPanel>

              {starsOwned.trim() ? (
                <ToolPanel title={t.nowVsSaveTitle} description={t.nowVsSaveDescription}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 px-5 py-5">
                      <div className="text-sm font-semibold text-slate-900">{t.useNow}</div>
                      {bestNow ? (
                        <>
                          <div className="mt-3 text-xl font-bold text-slate-950">
                            {bestNow.name}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-500">{bestNow.reason}</p>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                              <div className="text-xs font-medium text-slate-400">
                                {t.expectedDiscount}
                              </div>
                              <div className="mt-2 text-lg font-bold text-slate-900">
                                {formatCurrency(bestNow.expectedDiscount, lang)} {t.currencyUnit}
                              </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                              <div className="text-xs font-medium text-slate-400">
                                {t.efficiency}
                              </div>
                              <div className="mt-2 text-lg font-bold text-slate-900">
                                {formatCurrency(bestNow.efficiency, lang)} {t.currencyUnit}/
                                {t.starsUnit}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="mt-3 text-sm leading-6 text-slate-500">{t.noAvailableNow}</p>
                      )}
                    </div>

                    <div className="rounded-[24px] border border-blue-200 bg-blue-50/70 px-5 py-5">
                      <div className="text-sm font-semibold text-blue-700">{t.saveForLater}</div>
                      {bestLater ? (
                        <>
                          <div className="mt-3 text-xl font-bold text-slate-950">
                            {bestLater.name}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{bestLater.reason}</p>
                          <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-blue-100 bg-white px-4 py-3">
                              <div className="text-xs font-medium text-slate-400">
                                {t.starsMoreNeeded}
                              </div>
                              <div className="mt-2 text-lg font-bold text-slate-900">
                                {bestLater.starsToEarn}
                              </div>
                            </div>
                            <div className="rounded-2xl border border-blue-100 bg-white px-4 py-3">
                              <div className="text-xs font-medium text-slate-400">
                                {t.expectedDiscount}
                              </div>
                              <div className="mt-2 text-lg font-bold text-slate-900">
                                {formatCurrency(bestLater.expectedDiscount, lang)} {t.currencyUnit}
                              </div>
                            </div>
                            <div className="rounded-2xl border border-blue-100 bg-white px-4 py-3">
                              <div className="text-xs font-medium text-slate-400">
                                {t.extraSavings}
                              </div>
                              <div className="mt-2 text-lg font-bold text-slate-900">
                                {bestNow
                                  ? `${formatCurrency(
                                      Math.max(bestLater.expectedDiscount - bestNow.expectedDiscount, 0),
                                      lang,
                                    )} ${t.currencyUnit}`
                                  : `${formatCurrency(bestLater.expectedDiscount, lang)} ${t.currencyUnit}`}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="mt-3 text-sm leading-6 text-slate-500">{t.noFutureTarget}</p>
                      )}
                    </div>
                  </div>
                </ToolPanel>
              ) : null}

              <ToolPanel
                title={t.breakEvenTitle}
                description={t.breakEvenDescription}
                className="border-amber-200 bg-amber-50/70"
              >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-amber-200 bg-white px-4 py-4">
                    <div className="text-xs font-medium text-slate-400">{t.breakEven8}</div>
                    <div className="mt-2 text-xl font-bold text-slate-900">
                      {sizeUpThresholdFor8 === null
                        ? "-"
                        : `${formatCurrency(sizeUpThresholdFor8, lang)} ${t.currencyUnit}`}
                    </div>
                    {wantsSizeUp && parsedSizeUpValue !== null && sizeUpThresholdFor8 !== null ? (
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {t.currentSizeUpValue}: {formatCurrency(parsedSizeUpValue, lang)}{" "}
                        {t.currencyUnit}
                        <br />
                        {parsedSizeUpValue >= sizeUpThresholdFor8
                          ? t.aboveBreakEven
                          : t.belowBreakEven}
                      </p>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-white px-4 py-4">
                    <div className="text-xs font-medium text-slate-400">{t.breakEven12}</div>
                    <div className="mt-2 text-xl font-bold text-slate-900">
                      {sizeUpThresholdFor12 === null
                        ? "-"
                        : `${formatCurrency(sizeUpThresholdFor12, lang)} ${t.currencyUnit}`}
                    </div>
                    {level === "gold" && wantsSizeUp && parsedSizeUpValue !== null && sizeUpThresholdFor12 !== null ? (
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {t.currentSizeUpValue}: {formatCurrency(parsedSizeUpValue, lang)}{" "}
                        {t.currencyUnit}
                        <br />
                        {parsedSizeUpValue >= sizeUpThresholdFor12
                          ? t.aboveBreakEven
                          : t.belowBreakEven}
                      </p>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-white px-4 py-4">
                    <div className="text-xs font-medium text-slate-400">{t.foodBenchmark}</div>
                    <div className="mt-2 text-xl font-bold text-slate-900">
                      {formatCurrency(
                        parsedFoodPrice === null
                          ? foodBenchmarkEfficiency
                          : Math.min(parsedFoodPrice, FOOD_VOUCHER_CAP) / 15,
                        lang,
                      )}{" "}
                      {t.currencyUnit}/{t.starsUnit}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{t.foodBenchmarkBody}</p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-white px-4 py-4">
                    <div className="text-xs font-medium text-slate-400">{t.mdBenchmark}</div>
                    <div className="mt-2 text-xl font-bold text-slate-900">
                      {formatCurrency(
                        parsedMdPrice === null
                          ? mdBenchmarkEfficiency
                          : Math.min(parsedMdPrice, MD_VOUCHER_CAP) / 50,
                        lang,
                      )}{" "}
                      {t.currencyUnit}/{t.starsUnit}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{t.mdBenchmarkBody}</p>
                  </div>
                </div>
              </ToolPanel>
            </>
          ) : (
            <EmptyToolState icon="☕" title={t.emptyTitle} description={t.emptyDescription} />
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
