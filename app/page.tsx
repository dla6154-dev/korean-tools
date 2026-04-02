"use client";

import { useState } from "react";

// ── 만 나이 계산 ──────────────────────────────
function calcManAge(birth: Date, today: Date) {
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasHadBirthday) age--;
  return age;
}

function getDayOfWeek(date: Date) {
  return ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
}

// ── 기념일 계산 ───────────────────────────────
function formatDate(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function getDaysFromNow(date: Date, today: Date) {
  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getAnniversaries(start: Date, today: Date) {
  const milestones: { label: string; date: Date; daysFromNow: number }[] = [];
  const dayMilestones = [100, 200, 300, 365, 500, 600, 700, 730, 1000, 1095, 1461, 1825, 3650];
  const yearMilestones = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  for (const d of dayMilestones) {
    const date = new Date(start);
    date.setDate(date.getDate() + d - 1);
    milestones.push({ label: `${d}일`, date, daysFromNow: getDaysFromNow(date, today) });
  }
  for (const y of yearMilestones) {
    const date = new Date(start);
    date.setFullYear(date.getFullYear() + y);
    milestones.push({ label: `${y}주년`, date, daysFromNow: getDaysFromNow(date, today) });
  }
  return milestones.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export default function Home() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 기념일 상태
  const [annivDate, setAnnivDate] = useState("");
  const [annivError, setAnnivError] = useState("");
  const [annivResult, setAnnivResult] = useState<null | {
    elapsedDays: number;
    start: Date;
    upcoming: { label: string; date: Date; daysFromNow: number }[];
    passed: { label: string; date: Date; daysFromNow: number }[];
  }>(null);

  // 만 나이 상태
  const [birthDate, setBirthDate] = useState("");
  const [ageError, setAgeError] = useState("");
  const [ageResult, setAgeResult] = useState<null | {
    manAge: number;
    koreanAge: number;
    totalDays: number;
    birthDayOfWeek: string;
    nextBirthdayDays: number;
    nextBirthdayDate: Date;
  }>(null);

  function parseDate(str: string): Date | null {
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const [, y, m, d] = match.map(Number);
    const date = new Date(y, m - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
    return date;
  }

  function calcAnniv() {
    setAnnivError("");
    const start = parseDate(annivDate);
    if (!start) { setAnnivError("날짜 형식을 확인해주세요. 예) 2024-01-01"); return; }
    start.setHours(0, 0, 0, 0);
    const elapsedDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const all = getAnniversaries(start, today);
    setAnnivResult({
      elapsedDays,
      start,
      upcoming: all.filter((m) => m.daysFromNow >= 0),
      passed: all.filter((m) => m.daysFromNow < 0),
    });
  }

  function calcAge() {
    setAgeError("");
    const birth = parseDate(birthDate);
    if (!birth) { setAgeError("날짜 형식을 확인해주세요. 예) 1995-05-15"); return; }
    birth.setHours(0, 0, 0, 0);
    const manAge = calcManAge(birth, today);
    const koreanAge = today.getFullYear() - birth.getFullYear() + 1;
    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const birthDayOfWeek = getDayOfWeek(birth);
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
    const nextBirthdayDays = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setAgeResult({ manAge, koreanAge, totalDays, birthDayOfWeek, nextBirthdayDays, nextBirthdayDate: nextBirthday });
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold text-slate-800">Korean Tools</h1>
        <p className="text-slate-500 text-sm mt-1">생활에 유용한 계산 도구 모음</p>
      </div>

      {/* 광고 */}
      <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl h-16 flex items-center justify-center text-slate-400 text-sm">
        광고 영역
      </div>

      {/* ── 기념일 계산기 ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">💑 기념일 계산기</h2>
        <label className="block text-sm font-medium text-slate-600 mb-1">시작일 (기준일)</label>
        <input
          type="text"
          value={annivDate}
          onChange={(e) => setAnnivDate(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && calcAnniv()}
          placeholder="2024-01-01"
          maxLength={10}
          className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-400 mb-1 placeholder-slate-300"
        />
        {annivError && <p className="text-red-400 text-xs mb-2">{annivError}</p>}
        {!annivError && <div className="mb-2" />}
        <button
          onClick={calcAnniv}
          disabled={!annivDate}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          계산하기
        </button>

        {annivResult && (
          <div className="mt-5 space-y-4">
            <div className="bg-pink-50 rounded-xl p-4 text-center">
              <div className="text-4xl font-bold text-pink-500">{annivResult.elapsedDays.toLocaleString()}일째</div>
              <div className="text-slate-500 text-sm mt-1">{formatDate(annivResult.start)} 부터 오늘까지</div>
            </div>

            {annivResult.upcoming.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-2">다가오는 기념일</p>
                <div className="space-y-2">
                  {annivResult.upcoming.slice(0, 8).map((m) => (
                    <div key={m.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-14 font-semibold text-pink-500">{m.label}</span>
                        <span className="text-slate-600">{formatDate(m.date)} ({getDayOfWeek(m.date)}요일)</span>
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {m.daysFromNow === 0 ? "오늘 🎉" : `D-${m.daysFromNow}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {annivResult.passed.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-400 mb-2">지난 기념일</p>
                <div className="space-y-2 opacity-50">
                  {annivResult.passed.slice(-4).reverse().map((m) => (
                    <div key={m.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-14 font-semibold text-slate-400">{m.label}</span>
                        <span className="text-slate-500">{formatDate(m.date)} ({getDayOfWeek(m.date)}요일)</span>
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {Math.abs(m.daysFromNow)}일 전
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 만 나이 계산기 ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">🎂 만 나이 계산기</h2>
        <label className="block text-sm font-medium text-slate-600 mb-1">생년월일</label>
        <input
          type="text"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && calcAge()}
          placeholder="1995-05-15"
          maxLength={10}
          className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 mb-1 placeholder-slate-300"
        />
        {ageError && <p className="text-red-400 text-xs mb-2">{ageError}</p>}
        {!ageError && <div className="mb-2" />}
        <button
          onClick={calcAge}
          disabled={!birthDate}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          계산하기
        </button>

        {ageResult && (
          <div className="mt-5 space-y-3">
            <div className="text-center pb-3 border-b border-slate-100">
              <div className="text-5xl font-bold text-blue-500">{ageResult.manAge}세</div>
              <div className="text-slate-400 text-sm mt-1">만 나이 (법적 공식 나이)</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-slate-700">{ageResult.koreanAge}세</div>
                <div className="text-xs text-slate-400 mt-1">한국식 세는 나이</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-slate-700">{ageResult.totalDays.toLocaleString()}일</div>
                <div className="text-xs text-slate-400 mt-1">태어난 지</div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-sm text-slate-600 space-y-1">
              <div>태어난 요일: <strong>{ageResult.birthDayOfWeek}요일</strong></div>
              <div>
                다음 생일까지:{" "}
                <strong className="text-blue-600">
                  {ageResult.nextBirthdayDays === 0 ? "오늘이 생일입니다 🎉" : `${ageResult.nextBirthdayDays}일 남음`}
                </strong>
                {ageResult.nextBirthdayDays > 0 && (
                  <span className="text-slate-400 text-xs ml-1">
                    ({formatDate(ageResult.nextBirthdayDate)})
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 광고 */}
      <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl h-16 flex items-center justify-center text-slate-400 text-sm">
        광고 영역
      </div>
    </div>
  );
}
