"use client";

import { useState } from "react";

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function getDayOfWeek(date: Date): string {
  return ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
}

function getDaysFromNow(date: Date, today: Date): number {
  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function AnniversaryPage() {
  const [startDate, setStartDate] = useState("");
  const [result, setResult] = useState<null | {
    today: Date;
    start: Date;
    elapsedDays: number;
    milestones: { label: string; date: Date; daysFromNow: number }[];
  }>(null);

  function calculate() {
    if (!startDate) return;
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const elapsedDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const dayMilestones = [100, 200, 300, 365, 500, 600, 700, 730, 1000, 1095, 1461, 1825, 3650];
    const yearMilestones = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const milestones: { label: string; date: Date; daysFromNow: number }[] = [];

    for (const d of dayMilestones) {
      const date = addDays(start, d - 1);
      milestones.push({ label: `${d}일`, date, daysFromNow: getDaysFromNow(date, today) });
    }

    for (const y of yearMilestones) {
      const date = addYears(start, y);
      const label = `${y}주년`;
      if (!milestones.some((m) => m.label === label)) {
        milestones.push({ label, date, daysFromNow: getDaysFromNow(date, today) });
      }
    }

    milestones.sort((a, b) => a.date.getTime() - b.date.getTime());

    setResult({ today, start, elapsedDays, milestones });
  }

  const upcoming = result?.milestones.filter((m) => m.daysFromNow >= 0) ?? [];
  const passed = result?.milestones.filter((m) => m.daysFromNow < 0) ?? [];

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">기념일 계산기</h1>
      <p className="text-slate-500 mb-8 text-sm">
        시작일을 입력하면 100일, 1주년 등 주요 기념일을 모두 계산해드립니다.
      </p>

      {/* 광고 영역 */}
      <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl h-20 flex items-center justify-center text-slate-400 text-sm mb-8">
        광고 영역
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">시작일 (기준일)</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-400 mb-4"
        />
        <button
          onClick={calculate}
          disabled={!startDate}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          계산하기
        </button>
      </div>

      {result && (
        <>
          <div className="bg-pink-50 border border-pink-100 rounded-2xl p-6 mb-6 text-center">
            <div className="text-5xl font-bold text-pink-500 mb-1">
              {result.elapsedDays.toLocaleString()}일째
            </div>
            <div className="text-slate-500 text-sm">
              {formatDate(result.start)} 부터 오늘까지
            </div>
          </div>

          {upcoming.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-4">
              <h2 className="font-semibold text-slate-700 mb-4">다가오는 기념일</h2>
              <div className="space-y-3">
                {upcoming.slice(0, 10).map((m) => (
                  <div key={m.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-16 text-sm font-semibold text-pink-500">{m.label}</span>
                      <span className="text-sm text-slate-600">
                        {formatDate(m.date)} ({getDayOfWeek(m.date)}요일)
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                      {m.daysFromNow === 0 ? "오늘 🎉" : `D-${m.daysFromNow}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {passed.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-700 mb-4">지난 기념일</h2>
              <div className="space-y-3">
                {passed.slice(-5).reverse().map((m) => (
                  <div key={m.label} className="flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-3">
                      <span className="w-16 text-sm font-semibold text-slate-400">{m.label}</span>
                      <span className="text-sm text-slate-500">
                        {formatDate(m.date)} ({getDayOfWeek(m.date)}요일)
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                      {Math.abs(m.daysFromNow)}일 전
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 광고 영역 */}
          <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl h-20 flex items-center justify-center text-slate-400 text-sm mt-8">
            광고 영역
          </div>
        </>
      )}
    </div>
  );
}
