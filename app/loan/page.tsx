"use client";

import { useState } from "react";

type RepaymentType = "equal_payment" | "equal_principal" | "bullet";

const REPAYMENT_LABELS: Record<RepaymentType, string> = {
  equal_payment: "원리금균등상환",
  equal_principal: "원금균등상환",
  bullet: "만기일시상환",
};

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

interface Result {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[];
}

export default function LoanPage() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [repayment, setRepayment] = useState<RepaymentType>("equal_payment");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);

  function calculate() {
    setError("");
    const P = parseFloat(principal.replace(/,/g, "")) * 10000; // 만원 단위 입력
    const annualRate = parseFloat(rate);
    const N = parseInt(months);

    if (!P || !annualRate || !N || P <= 0 || annualRate <= 0 || N <= 0) {
      setError("모든 항목을 올바르게 입력해주세요.");
      return;
    }
    if (annualRate > 100) { setError("금리를 확인해주세요. (연 %)"); return; }
    if (N > 600) { setError("대출 기간은 최대 50년(600개월)입니다."); return; }

    const r = annualRate / 100 / 12; // 월 이율
    const schedule: Result["schedule"] = [];
    let totalPayment = 0;
    let totalInterest = 0;

    if (repayment === "equal_payment") {
      // 원리금균등 - 고정 월납부액
      const monthly = P * r * Math.pow(1 + r, N) / (Math.pow(1 + r, N) - 1);
      let balance = P;
      for (let m = 1; m <= N; m++) {
        const interest = balance * r;
        const principalPart = monthly - interest;
        balance -= principalPart;
        schedule.push({ month: m, payment: Math.round(monthly), principal: Math.round(principalPart), interest: Math.round(interest), balance: Math.max(0, Math.round(balance)) });
        totalPayment += Math.round(monthly);
        totalInterest += Math.round(interest);
      }
      setResult({ monthlyPayment: Math.round(monthly), totalPayment, totalInterest, schedule });

    } else if (repayment === "equal_principal") {
      // 원금균등 - 매달 동일 원금 + 이자
      const principalPerMonth = P / N;
      let balance = P;
      let firstMonthly = 0;
      for (let m = 1; m <= N; m++) {
        const interest = balance * r;
        const payment = principalPerMonth + interest;
        if (m === 1) firstMonthly = Math.round(payment);
        balance -= principalPerMonth;
        schedule.push({ month: m, payment: Math.round(payment), principal: Math.round(principalPerMonth), interest: Math.round(interest), balance: Math.max(0, Math.round(balance)) });
        totalPayment += Math.round(payment);
        totalInterest += Math.round(interest);
      }
      setResult({ monthlyPayment: firstMonthly, totalPayment, totalInterest, schedule });

    } else {
      // 만기일시 - 매달 이자만, 만기에 원금
      const monthlyInterest = P * r;
      for (let m = 1; m <= N; m++) {
        const payment = m === N ? monthlyInterest + P : monthlyInterest;
        schedule.push({ month: m, payment: Math.round(payment), principal: m === N ? Math.round(P) : 0, interest: Math.round(monthlyInterest), balance: m === N ? 0 : Math.round(P) });
        totalPayment += Math.round(payment);
        totalInterest += Math.round(monthlyInterest);
      }
      setResult({ monthlyPayment: Math.round(monthlyInterest), totalPayment, totalInterest, schedule });
    }

    setShowSchedule(false);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">대출 이자 계산기</h1>
        <p className="text-slate-500 text-sm mt-1">상환 방식별 월 납부액과 총 이자를 계산해드려요</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        {/* 상환 방식 */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">상환 방식</label>
          <div className="grid grid-cols-3 gap-2">
            {(["equal_payment", "equal_principal", "bullet"] as RepaymentType[]).map((type) => (
              <button
                key={type}
                onClick={() => setRepayment(type)}
                className={`py-2 rounded-lg text-xs font-semibold transition-colors ${
                  repayment === type
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {REPAYMENT_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {/* 입력 필드 */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">대출 금액</label>
            <div className="relative">
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && calculate()}
                placeholder="3000"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">만원</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">연 금리</label>
              <div className="relative">
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && calculate()}
                  placeholder="3.5"
                  step="0.1"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">대출 기간</label>
              <div className="relative">
                <input
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && calculate()}
                  placeholder="240"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">개월</span>
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button
          onClick={calculate}
          disabled={!principal || !rate || !months}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          계산하기
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* 핵심 요약 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-500 rounded-2xl p-4 text-center text-white">
              <div className="text-xs text-blue-100 mb-1">
                {repayment === "bullet" ? "월 이자" : repayment === "equal_payment" ? "월 납부액" : "첫달 납부액"}
              </div>
              <div className="text-lg font-bold">{result.monthlyPayment.toLocaleString()}</div>
              <div className="text-xs text-blue-200">원</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
              <div className="text-xs text-slate-400 mb-1">총 상환액</div>
              <div className="text-lg font-bold text-slate-700">{formatKRW(result.totalPayment)}</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
              <div className="text-xs text-slate-400 mb-1">총 이자</div>
              <div className="text-lg font-bold text-orange-500">{formatKRW(result.totalInterest)}</div>
            </div>
          </div>

          {/* 이자 비율 바 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 mb-3">원금 vs 이자 비율</p>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div
                className="bg-blue-400"
                style={{ width: `${(parseFloat(principal.replace(/,/g, "")) * 10000 / result.totalPayment) * 100}%` }}
              />
              <div className="bg-orange-300 flex-1" />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />원금 {((parseFloat(principal.replace(/,/g, "")) * 10000 / result.totalPayment) * 100).toFixed(1)}%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-300 inline-block" />이자 {((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* 상환 스케줄 */}
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            {showSchedule ? "▲ 상환 스케줄 닫기" : "▼ 상환 스케줄 보기"}
          </button>

          {showSchedule && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">회차</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">납부액</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">원금</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">이자</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">잔액</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.schedule.map((row) => (
                      <tr key={row.month} className="hover:bg-slate-50">
                        <td className="px-4 py-2 text-slate-600">{row.month}회</td>
                        <td className="px-4 py-2 text-right text-slate-700 font-medium">{row.payment.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right text-blue-600">{row.principal.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right text-orange-500">{row.interest.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right text-slate-400">{row.balance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
