"use client";

import { useState } from "react";

interface Result {
  severancePay: number;
  avgDailyWage: number;
  workingDays: number;
  years: number;
  months: number;
  days: number;
}

function formatKRW(n: number) {
  if (n >= 100000000) {
    const eok = Math.floor(n / 100000000);
    const man = Math.round((n % 100000000) / 10000);
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`;
  }
  if (n >= 10000) {
    return `${Math.round(n / 10000).toLocaleString()}만원`;
  }
  return `${Math.round(n).toLocaleString()}원`;
}

export default function SeverancePage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyWage, setMonthlyWage] = useState("");
  const [bonus, setBonus] = useState("");
  const [annualLeave, setAnnualLeave] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    if (!startDate || !endDate || !monthlyWage) {
      setError("입사일, 퇴사일, 월 급여를 모두 입력해주세요.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      setError("퇴사일은 입사일 이후여야 합니다.");
      return;
    }

    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (totalDays < 365) {
      setError("퇴직금은 1년(365일) 이상 근무해야 발생합니다.");
      return;
    }

    const wage = parseFloat(monthlyWage.replace(/,/g, "")) * 10000;
    const bonusAmt = parseFloat(bonus.replace(/,/g, "") || "0") * 10000;
    const leaveAmt = parseFloat(annualLeave.replace(/,/g, "") || "0") * 10000;

    // 평균임금 계산: 최근 3개월 임금 / 3개월 일수(89~92일, 통상 91일 사용)
    const last3MonthsDays = 91;
    const monthlyBonusPortion = bonusAmt / 12; // 연간 상여금의 1/12
    const monthlyLeavePortion = leaveAmt / 12;  // 연차수당의 1/12

    const total3MonthsWage = wage * 3 + monthlyBonusPortion * 3 + monthlyLeavePortion * 3;
    const avgDailyWage = total3MonthsWage / last3MonthsDays;

    // 퇴직금 = 평균임금 × 30일 × 근무연수
    const workingYears = totalDays / 365;
    const severancePay = avgDailyWage * 30 * workingYears;

    // 연/월/일 분해
    let y = end.getFullYear() - start.getFullYear();
    let m = end.getMonth() - start.getMonth();
    let d = end.getDate() - start.getDate();
    if (d < 0) { m--; d += 30; }
    if (m < 0) { y--; m += 12; }

    setResult({
      severancePay,
      avgDailyWage,
      workingDays: totalDays,
      years: y,
      months: m,
      days: d,
    });
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">퇴직금 계산기</h1>
        <p className="text-slate-500 text-sm mt-1">근무 기간과 급여를 입력하면 예상 퇴직금을 계산해드려요</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">입사일</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">퇴사일</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">월 기본급</label>
          <div className="relative">
            <input
              type="number"
              value={monthlyWage}
              onChange={(e) => setMonthlyWage(e.target.value)}
              placeholder="300"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">만원</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">연간 상여금 <span className="text-slate-400 font-normal">(선택)</span></label>
            <div className="relative">
              <input
                type="number"
                value={bonus}
                onChange={(e) => setBonus(e.target.value)}
                placeholder="0"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">만원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">연차수당 <span className="text-slate-400 font-normal">(선택)</span></label>
            <div className="relative">
              <input
                type="number"
                value={annualLeave}
                onChange={(e) => setAnnualLeave(e.target.value)}
                placeholder="0"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">만원</span>
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button
          onClick={calculate}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          계산하기
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* 예상 퇴직금 */}
          <div className="bg-blue-500 rounded-2xl p-6 text-center text-white">
            <p className="text-blue-100 text-sm mb-1">예상 퇴직금</p>
            <p className="text-3xl font-bold">{formatKRW(result.severancePay)}</p>
            <p className="text-blue-200 text-xs mt-1">{Math.round(result.severancePay).toLocaleString()}원</p>
          </div>

          {/* 근무 기간 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 mb-3">근무 기간</p>
            <div className="flex justify-around text-center">
              <div>
                <div className="text-2xl font-bold text-slate-700">{result.years}</div>
                <div className="text-xs text-slate-400">년</div>
              </div>
              <div className="text-slate-300 text-xl">·</div>
              <div>
                <div className="text-2xl font-bold text-slate-700">{result.months}</div>
                <div className="text-xs text-slate-400">개월</div>
              </div>
              <div className="text-slate-300 text-xl">·</div>
              <div>
                <div className="text-2xl font-bold text-slate-700">{result.days}</div>
                <div className="text-xs text-slate-400">일</div>
              </div>
              <div className="text-slate-300 text-xl">·</div>
              <div>
                <div className="text-2xl font-bold text-slate-700">{result.workingDays.toLocaleString()}</div>
                <div className="text-xs text-slate-400">총 일수</div>
              </div>
            </div>
          </div>

          {/* 상세 계산 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
            <p className="text-xs font-semibold text-slate-400">계산 근거</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">1일 평균임금</span>
                <span className="font-medium text-slate-700">{Math.round(result.avgDailyWage).toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">근무 연수</span>
                <span className="font-medium text-slate-700">{(result.workingDays / 365).toFixed(4)}년</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-slate-500">산식</span>
                <span className="font-medium text-slate-500 text-xs">1일 평균임금 × 30 × 근무연수</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center">※ 본 계산기는 참고용입니다. 실제 퇴직금은 회사 규정 및 세금에 따라 달라질 수 있습니다.</p>
        </div>
      )}
    </div>
  );
}
