"use client";

import { useState } from "react";
import type { Metadata } from "next";

function calcManAge(birth: Date, today: Date) {
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasHadBirthday) age--;
  return age;
}

function getDayOfWeek(date: Date) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
}

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
    milestones.push({ label: `Day ${d}`, date, daysFromNow: getDaysFromNow(date, today) });
  }
  for (const y of yearMilestones) {
    const date = new Date(start);
    date.setFullYear(date.getFullYear() + y);
    milestones.push({ label: `${y}yr`, date, daysFromNow: getDaysFromNow(date, today) });
  }
  return milestones.sort((a, b) => a.date.getTime() - b.date.getTime());
}

function parseDate(str: string): Date | null {
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

export default function EnPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [annivDate, setAnnivDate] = useState("");
  const [annivError, setAnnivError] = useState("");
  const [annivResult, setAnnivResult] = useState<null | {
    elapsedDays: number;
    start: Date;
    upcoming: { label: string; date: Date; daysFromNow: number }[];
    passed: { label: string; date: Date; daysFromNow: number }[];
  }>(null);

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

  function calcAnniv() {
    setAnnivError("");
    const start = parseDate(annivDate);
    if (!start) { setAnnivError("Invalid format. Example: 2024-01-01"); return; }
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
    if (!birth) { setAgeError("Invalid format. Example: 1995-05-15"); return; }
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
        <p className="text-slate-500 text-sm mt-1">Useful calculators for everyday life</p>
      </div>

      {/* 광고 */}
      <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl h-16 flex items-center justify-center text-slate-400 text-sm">
        Ad
      </div>

      {/* Anniversary Calculator */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">💑 Anniversary Calculator</h2>
        <label className="block text-sm font-medium text-slate-600 mb-1">Start Date</label>
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
          Calculate
        </button>

        {annivResult && (
          <div className="mt-5 space-y-4">
            <div className="bg-pink-50 rounded-xl p-4 text-center">
              <div className="text-4xl font-bold text-pink-500">Day {annivResult.elapsedDays.toLocaleString()}</div>
              <div className="text-slate-500 text-sm mt-1">From {formatDate(annivResult.start)} to today</div>
            </div>

            {annivResult.upcoming.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-2">Upcoming Anniversaries</p>
                <div className="space-y-2">
                  {annivResult.upcoming.slice(0, 8).map((m) => (
                    <div key={m.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-14 font-semibold text-pink-500">{m.label}</span>
                        <span className="text-slate-600">{formatDate(m.date)} ({getDayOfWeek(m.date)})</span>
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {m.daysFromNow === 0 ? "Today 🎉" : `D-${m.daysFromNow}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {annivResult.passed.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-400 mb-2">Past Anniversaries</p>
                <div className="space-y-2 opacity-50">
                  {annivResult.passed.slice(-4).reverse().map((m) => (
                    <div key={m.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-14 font-semibold text-slate-400">{m.label}</span>
                        <span className="text-slate-500">{formatDate(m.date)} ({getDayOfWeek(m.date)})</span>
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {Math.abs(m.daysFromNow)}d ago
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Korean Age Calculator */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-1">🎂 Korean Age Calculator</h2>
        <p className="text-xs text-slate-400 mb-4">Since June 2023, Korea officially uses the international age system.</p>
        <label className="block text-sm font-medium text-slate-600 mb-1">Date of Birth</label>
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
          Calculate
        </button>

        {ageResult && (
          <div className="mt-5 space-y-3">
            <div className="text-center pb-3 border-b border-slate-100">
              <div className="text-5xl font-bold text-blue-500">{ageResult.manAge}</div>
              <div className="text-slate-400 text-sm mt-1">International Age (Official)</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-slate-700">{ageResult.koreanAge}</div>
                <div className="text-xs text-slate-400 mt-1">Korean Traditional Age</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-slate-700">{ageResult.totalDays.toLocaleString()}</div>
                <div className="text-xs text-slate-400 mt-1">Days Alive</div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-sm text-slate-600 space-y-1">
              <div>Born on: <strong>{ageResult.birthDayOfWeek}</strong></div>
              <div>
                Next birthday:{" "}
                <strong className="text-blue-600">
                  {ageResult.nextBirthdayDays === 0 ? "Today is your birthday 🎉" : `${ageResult.nextBirthdayDays} days left`}
                </strong>
                {ageResult.nextBirthdayDays > 0 && (
                  <span className="text-slate-400 text-xs ml-1">({formatDate(ageResult.nextBirthdayDate)})</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 광고 */}
      <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl h-16 flex items-center justify-center text-slate-400 text-sm">
        Ad
      </div>
    </div>
  );
}
