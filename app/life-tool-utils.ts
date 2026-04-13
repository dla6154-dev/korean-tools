"use client";

export const OFFICIAL_KR_RATES_2026 = {
  minimumWage: 10320,
  nationalPensionEmployee: 0.045,
  healthInsuranceEmployee: 0.0719 / 2,
  longTermCareEmployee: 0.009448 / 2,
  employmentInsuranceEmployee: 0.018 / 2,
} as const;

export function formatKrw(value: number, locale = "ko-KR") {
  return new Intl.NumberFormat(locale).format(Math.round(value));
}

export function formatDecimal(value: number, digits = 1, locale = "ko-KR") {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function parsePositiveNumber(input: string) {
  const value = Number(input.replace(/,/g, "").trim());
  return Number.isFinite(value) ? value : NaN;
}

export function toDateInputValue(date: Date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export function addYears(date: Date, years: number) {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + years);
  return next;
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function diffCalendarYears(start: Date, end: Date) {
  let years = end.getFullYear() - start.getFullYear();
  const endMonthDay = end.getMonth() * 100 + end.getDate();
  const startMonthDay = start.getMonth() * 100 + start.getDate();

  if (endMonthDay < startMonthDay) {
    years -= 1;
  }

  return Math.max(years, 0);
}

export function diffCompletedMonths(start: Date, end: Date) {
  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (end.getDate() < start.getDate()) {
    months -= 1;
  }

  return Math.max(months, 0);
}

export function differenceInDays(start: Date, end: Date) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const startMs = startOfDay(start).getTime();
  const endMs = startOfDay(end).getTime();
  return Math.max(0, Math.floor((endMs - startMs) / msPerDay));
}

function earnedIncomeDeduction(annualGross: number) {
  if (annualGross <= 5_000_000) {
    return annualGross * 0.7;
  }

  if (annualGross <= 15_000_000) {
    return 3_500_000 + (annualGross - 5_000_000) * 0.4;
  }

  if (annualGross <= 45_000_000) {
    return 7_500_000 + (annualGross - 15_000_000) * 0.15;
  }

  if (annualGross <= 100_000_000) {
    return 12_000_000 + (annualGross - 45_000_000) * 0.05;
  }

  return Math.min(20_000_000, 14_750_000 + (annualGross - 100_000_000) * 0.02);
}

function basicIncomeTax(taxableIncome: number) {
  if (taxableIncome <= 14_000_000) {
    return taxableIncome * 0.06;
  }

  if (taxableIncome <= 50_000_000) {
    return 840_000 + (taxableIncome - 14_000_000) * 0.15;
  }

  if (taxableIncome <= 88_000_000) {
    return 6_240_000 + (taxableIncome - 50_000_000) * 0.24;
  }

  if (taxableIncome <= 150_000_000) {
    return 15_360_000 + (taxableIncome - 88_000_000) * 0.35;
  }

  if (taxableIncome <= 300_000_000) {
    return 37_060_000 + (taxableIncome - 150_000_000) * 0.38;
  }

  if (taxableIncome <= 500_000_000) {
    return 94_060_000 + (taxableIncome - 300_000_000) * 0.4;
  }

  if (taxableIncome <= 1_000_000_000) {
    return 174_060_000 + (taxableIncome - 500_000_000) * 0.42;
  }

  return 384_060_000 + (taxableIncome - 1_000_000_000) * 0.45;
}

function earnedIncomeTaxCreditLimit(annualGross: number) {
  if (annualGross <= 33_000_000) {
    return 740_000;
  }

  if (annualGross <= 70_000_000) {
    return Math.max(660_000, 740_000 - (annualGross - 33_000_000) * 0.008);
  }

  if (annualGross <= 120_000_000) {
    return Math.max(500_000, 660_000 - (annualGross - 70_000_000) * 0.5);
  }

  return Math.max(200_000, 500_000 - (annualGross - 120_000_000) * 0.5);
}

function earnedIncomeTaxCredit(calculatedTax: number, annualGross: number) {
  const raw =
    calculatedTax <= 1_300_000
      ? calculatedTax * 0.55
      : 715_000 + (calculatedTax - 1_300_000) * 0.3;

  return Math.min(raw, earnedIncomeTaxCreditLimit(annualGross));
}

function childTaxCredit(childrenCount: number) {
  if (childrenCount <= 0) {
    return 0;
  }

  if (childrenCount === 1) {
    return 150_000;
  }

  if (childrenCount === 2) {
    return 350_000;
  }

  return 350_000 + (childrenCount - 2) * 300_000;
}

export function estimateNetPay(inputs: {
  grossMonthly: number;
  nonTaxableMonthly: number;
  familyCount: number;
  childCount: number;
  withholdingRatio: 80 | 100 | 120;
}) {
  const taxableMonthly = Math.max(0, inputs.grossMonthly - inputs.nonTaxableMonthly);
  const annualGross = taxableMonthly * 12;
  const pensionMonthly = taxableMonthly * OFFICIAL_KR_RATES_2026.nationalPensionEmployee;
  const healthMonthly = taxableMonthly * OFFICIAL_KR_RATES_2026.healthInsuranceEmployee;
  const longTermCareMonthly = taxableMonthly * OFFICIAL_KR_RATES_2026.longTermCareEmployee;
  const employmentMonthly = taxableMonthly * OFFICIAL_KR_RATES_2026.employmentInsuranceEmployee;
  const annualInsuranceDeduction =
    (pensionMonthly + healthMonthly + longTermCareMonthly + employmentMonthly) * 12;
  const annualEarnedIncomeDeduction = earnedIncomeDeduction(annualGross);
  const annualBasicDeduction = Math.max(1, Math.floor(inputs.familyCount)) * 1_500_000;
  const annualTaxableIncome = Math.max(
    0,
    annualGross - annualEarnedIncomeDeduction - annualBasicDeduction - annualInsuranceDeduction,
  );
  const annualCalculatedIncomeTax = basicIncomeTax(annualTaxableIncome);
  const annualTaxCredit =
    earnedIncomeTaxCredit(annualCalculatedIncomeTax, annualGross) +
    childTaxCredit(Math.max(0, Math.floor(inputs.childCount)));
  const annualIncomeTax = Math.max(0, annualCalculatedIncomeTax - annualTaxCredit);
  const monthlyIncomeTax = Math.round((annualIncomeTax / 12) * (inputs.withholdingRatio / 100));
  const monthlyLocalIncomeTax = Math.round(monthlyIncomeTax * 0.1);
  const monthlyDeductions =
    pensionMonthly +
    healthMonthly +
    longTermCareMonthly +
    employmentMonthly +
    monthlyIncomeTax +
    monthlyLocalIncomeTax;
  const netMonthly = inputs.grossMonthly - monthlyDeductions;

  return {
    taxableMonthly,
    monthly: {
      pension: pensionMonthly,
      health: healthMonthly,
      longTermCare: longTermCareMonthly,
      employment: employmentMonthly,
      incomeTax: monthlyIncomeTax,
      localIncomeTax: monthlyLocalIncomeTax,
      totalDeductions: monthlyDeductions,
      net: netMonthly,
    },
    annual: {
      gross: annualGross,
      earnedIncomeDeduction: annualEarnedIncomeDeduction,
      insuranceDeduction: annualInsuranceDeduction,
      basicDeduction: annualBasicDeduction,
      taxableIncome: annualTaxableIncome,
      calculatedIncomeTax: annualCalculatedIncomeTax,
      earnedIncomeTaxCredit: Math.min(
        earnedIncomeTaxCredit(annualCalculatedIncomeTax, annualGross),
        annualCalculatedIncomeTax,
      ),
      childTaxCredit: childTaxCredit(Math.max(0, Math.floor(inputs.childCount))),
      finalIncomeTax: annualIncomeTax,
    },
  };
}

export function calculateWeeklyHolidayPay(inputs: {
  hourlyWage: number;
  weeklyHours: number;
  attendanceMet: boolean;
}) {
  const eligible = inputs.weeklyHours >= 15 && inputs.attendanceMet;
  const weeklyHolidayHours = eligible ? (inputs.weeklyHours / 40) * 8 : 0;
  const weeklyHolidayPay = weeklyHolidayHours * inputs.hourlyWage;
  const weeklyBasePay = inputs.weeklyHours * inputs.hourlyWage;
  const estimatedMonthlyHolidayPay = weeklyHolidayPay * 4.345;

  return {
    eligible,
    weeklyHolidayHours,
    weeklyHolidayPay,
    weeklyBasePay,
    estimatedMonthlyHolidayPay,
    estimatedMonthlyTotalPay: (weeklyBasePay + weeklyHolidayPay) * 4.345,
  };
}

export function calculateAnnualLeave(inputs: {
  hireDate: Date;
  referenceDate: Date;
  eligible: boolean;
  attendanceMet: boolean;
  belowEightyQualifyingMonths: number;
  usedDays: number;
}) {
  const hire = startOfDay(inputs.hireDate);
  const reference = startOfDay(inputs.referenceDate);

  if (!inputs.eligible || reference < hire) {
    return {
      eligible: false,
      serviceYears: 0,
      serviceDays: 0,
      firstYearMonthlyLeave: 0,
      currentGrantedLeave: 0,
      remainingLeave: 0,
      nextGrantDate: addYears(hire, 1),
    };
  }

  const serviceYears = diffCalendarYears(hire, reference);
  const serviceDays = differenceInDays(hire, reference) + 1;
  const firstAnniversary = addYears(hire, 1);
  const monthsBeforeFirstAnniversary = Math.min(
    11,
    diffCompletedMonths(hire, reference < firstAnniversary ? reference : firstAnniversary),
  );

  let currentGrantedLeave = 0;
  let nextGrantDate = firstAnniversary;

  if (reference < firstAnniversary) {
    currentGrantedLeave = monthsBeforeFirstAnniversary;
  } else {
    const lastAnniversary = addYears(hire, serviceYears);
    nextGrantDate = addYears(hire, serviceYears + 1);
    currentGrantedLeave = inputs.attendanceMet
      ? Math.min(25, 15 + Math.floor(Math.max(serviceYears - 1, 0) / 2))
      : clamp(Math.floor(inputs.belowEightyQualifyingMonths), 0, 11);

    if (reference < lastAnniversary) {
      nextGrantDate = lastAnniversary;
    }
  }

  return {
    eligible: true,
    serviceYears,
    serviceDays,
    firstYearMonthlyLeave: monthsBeforeFirstAnniversary,
    currentGrantedLeave,
    remainingLeave: Math.max(0, currentGrantedLeave - Math.max(0, inputs.usedDays)),
    nextGrantDate,
  };
}

export function calculateDiscount(inputs: {
  originalPrice?: number | null;
  salePrice?: number | null;
  discountRate?: number | null;
}) {
  const filledCount = [inputs.originalPrice, inputs.salePrice, inputs.discountRate].filter(
    (value) => value !== null && value !== undefined && Number.isFinite(value),
  ).length;

  if (filledCount < 2) {
    return null;
  }

  let originalPrice = inputs.originalPrice ?? null;
  let salePrice = inputs.salePrice ?? null;
  let discountRate = inputs.discountRate ?? null;

  if (originalPrice === null && salePrice !== null && discountRate !== null) {
    originalPrice = salePrice / (1 - discountRate / 100);
  } else if (salePrice === null && originalPrice !== null && discountRate !== null) {
    salePrice = originalPrice * (1 - discountRate / 100);
  } else if (discountRate === null && originalPrice !== null && salePrice !== null) {
    discountRate = originalPrice === 0 ? 0 : ((originalPrice - salePrice) / originalPrice) * 100;
  }

  if (
    originalPrice === null ||
    salePrice === null ||
    discountRate === null ||
    !Number.isFinite(originalPrice) ||
    !Number.isFinite(salePrice) ||
    !Number.isFinite(discountRate)
  ) {
    return null;
  }

  return {
    originalPrice,
    salePrice,
    discountRate,
    savedAmount: originalPrice - salePrice,
    effectiveMultiplier: salePrice / originalPrice,
  };
}
