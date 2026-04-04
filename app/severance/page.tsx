"use client";

import { useState } from "react";
import { useLanguage } from "../language-context";

const T = {
  ko: {
    title: "퇴직금 계산기",
    sub: "근무 기간과 급여를 입력하면 예상 퇴직금을 계산해드려요",
    startDate: "입사일", endDate: "퇴사일",
    monthlyWage: "월 기본급", wageUnit: "만원",
    bonus: "연간 상여금", bonusHint: "(선택)",
    annualLeave: "연차수당", leaveHint: "(선택)",
    calculate: "계산하기",
    errors: {
      missing: "입사일, 퇴사일, 월 급여를 모두 입력해주세요.",
      order: "퇴사일은 입사일 이후여야 합니다.",
      period: "퇴직금은 1년(365일) 이상 근무해야 발생합니다.",
    },
    resultTitle: "예상 퇴직금",
    workPeriod: "근무 기간",
    year: "년", month: "개월", day: "일", totalDays: "총 일수",
    calcBasis: "계산 근거",
    avgDailyWage: "1일 평균임금",
    workYears: "근무 연수",
    formula: "산식",
    formulaText: "1일 평균임금 × 30 × 근무연수",
    disclaimer: "※ 본 계산기는 참고용입니다. 실제 퇴직금은 회사 규정 및 세금에 따라 달라질 수 있습니다.",
  },
  en: {
    title: "Severance Pay Calculator",
    sub: "Estimate your severance pay based on tenure and salary",
    startDate: "Start date", endDate: "End date",
    monthlyWage: "Monthly base pay", wageUnit: "만원",
    bonus: "Annual bonus", bonusHint: "(optional)",
    annualLeave: "Annual leave pay", leaveHint: "(optional)",
    calculate: "Calculate",
    errors: {
      missing: "Please fill in start date, end date, and monthly salary.",
      order: "End date must be after start date.",
      period: "Severance pay requires at least 1 year (365 days) of employment.",
    },
    resultTitle: "Estimated Severance Pay",
    workPeriod: "Work period",
    year: "yr", month: "mo", day: "d", totalDays: "Total days",
    calcBasis: "Calculation basis",
    avgDailyWage: "Avg. daily wage",
    workYears: "Work years",
    formula: "Formula",
    formulaText: "Avg. daily wage × 30 × work years",
    disclaimer: "※ This is an estimate only. Actual severance pay may vary based on company policy and taxes.",
  },
};

function formatKRW(n: number) {
  if (n >= 100000000) {
    const eok = Math.floor(n / 100000000);
    const man = Math.round((n % 100000000) / 10000);
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`;
  }
  if (n >= 10000) return `${Math.round(n / 10000).toLocaleString()}만원`;
  return `${Math.round(n).toLocaleString()}원`;
}

interface Result { severancePay: number; avgDailyWage: number; workingDays: number; years: number; months: number; days: number; }

export default function SeverancePage() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyWage, setMonthlyWage] = useState("");
  const [bonus, setBonus] = useState("");
  const [annualLeave, setAnnualLeave] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    if (!startDate || !endDate || !monthlyWage) { setError(t.errors.missing); return; }
    const start = new Date(startDate), end = new Date(endDate);
    if (end <= start) { setError(t.errors.order); return; }
    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (totalDays < 365) { setError(t.errors.period); return; }

    const wage = parseFloat(monthlyWage.replace(/,/g, "")) * 10000;
    const bonusAmt = parseFloat(bonus.replace(/,/g, "") || "0") * 10000;
    const leaveAmt = parseFloat(annualLeave.replace(/,/g, "") || "0") * 10000;

    const total3MonthsWage = wage * 3 + (bonusAmt / 12) * 3 + (leaveAmt / 12) * 3;
    const avgDailyWage = total3MonthsWage / 91;
    const severancePay = avgDailyWage * 30 * (totalDays / 365);

    let y = end.getFullYear() - start.getFullYear();
    let m = end.getMonth() - start.getMonth();
    let d = end.getDate() - start.getDate();
    if (d < 0) { m--; d += 30; }
    if (m < 0) { y--; m += 12; }

    setResult({ severancePay, avgDailyWage, workingDays: totalDays, years: y, months: m, days: d });
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">{t.title}</h1>
        <p className="text-slate-500 text-sm mt-1">{t.sub}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t.startDate}</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t.endDate}</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">{t.monthlyWage}</label>
          <div className="relative">
            <input type="number" value={monthlyWage} onChange={(e) => setMonthlyWage(e.target.value)} placeholder="300"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{t.wageUnit}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t.bonus} <span className="text-slate-400 font-normal">{t.bonusHint}</span></label>
            <div className="relative">
              <input type="number" value={bonus} onChange={(e) => setBonus(e.target.value)} placeholder="0"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{t.wageUnit}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t.annualLeave} <span className="text-slate-400 font-normal">{t.leaveHint}</span></label>
            <div className="relative">
              <input type="number" value={annualLeave} onChange={(e) => setAnnualLeave(e.target.value)} placeholder="0"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{t.wageUnit}</span>
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button onClick={calculate}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors">
          {t.calculate}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-blue-500 rounded-2xl p-6 text-center text-white">
            <p className="text-blue-100 text-sm mb-1">{t.resultTitle}</p>
            <p className="text-3xl font-bold">{formatKRW(result.severancePay)}</p>
            <p className="text-blue-200 text-xs mt-1">{Math.round(result.severancePay).toLocaleString()}원</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 mb-3">{t.workPeriod}</p>
            <div className="flex justify-around text-center">
              {[
                { val: result.years, label: t.year },
                { val: result.months, label: t.month },
                { val: result.days, label: t.day },
                { val: result.workingDays.toLocaleString(), label: t.totalDays },
              ].map(({ val, label }, i) => (
                <div key={i} className="flex items-center gap-3">
                  {i > 0 && <div className="text-slate-300 text-xl">·</div>}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-700">{val}</div>
                    <div className="text-xs text-slate-400">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
            <p className="text-xs font-semibold text-slate-400">{t.calcBasis}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.avgDailyWage}</span>
                <span className="font-medium text-slate-700">{Math.round(result.avgDailyWage).toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.workYears}</span>
                <span className="font-medium text-slate-700">{(result.workingDays / 365).toFixed(4)}년</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-slate-500">{t.formula}</span>
                <span className="font-medium text-slate-500 text-xs">{t.formulaText}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center">{t.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
