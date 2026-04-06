"use client";

import { useState } from "react";
import { useLanguage } from "./language-context";

const T = {
  ko: {
    title: "Korean Tools",
    sub: "생활에 유용한 계산 도구 모음",
    adZone: "광고 영역",
    annivTitle: "💑 기념일 계산기",
    annivLabel: "시작일 (기준일)",
    annivPlaceholder: "2024-01-01",
    annivError: "날짜 형식을 확인해주세요. 예) 2024-01-01",
    calculate: "계산하기",
    elapsedSuffix: "일째",
    elapsedFrom: " 부터 오늘까지",
    upcomingTitle: "다가오는 기념일",
    passedTitle: "지난 기념일",
    today: "오늘 🎉",
    daysAgo: "일 전",
    ageTitle: "🎂 만 나이 계산기",
    birthLabel: "생년월일",
    birthPlaceholder: "1995-05-15",
    birthError: "날짜 형식을 확인해주세요. 예) 1995-05-15",
    manAgeLabel: "만 나이 (법적 공식 나이)",
    koreanAgeLabel: "한국식 세는 나이",
    totalDaysLabel: "태어난 지 (총 일수)",
    unitsTitle: "다양한 단위로 보기",
    totalWeeks: "총 주수",
    totalMonths: "총 개월수",
    yearMonth: "년 + 개월",
    yearDay: "년 + 일",
    yearWeek: "년 + 주",
    birthDayLabel: "태어난 요일",
    dayPostfix: "요일",
    nextBirthday: "다음 생일까지",
    birthdayToday: "오늘이 생일입니다 🎉",
    daysLeft: "일 남음",
    ageUnit: "세",
    dayUnit: "일",
    weekUnit: "주",
    monthUnit: "개월",
    days: ["일", "월", "화", "수", "목", "금", "토"],
    dayLabel: (n: number) => `${n}일`,
    yearLabel: (n: number) => `${n}주년`,
  },
  en: {
    title: "Korean Tools",
    sub: "A collection of useful everyday calculators",
    adZone: "Ad space",
    annivTitle: "💑 Anniversary Calculator",
    annivLabel: "Start date",
    annivPlaceholder: "2024-01-01",
    annivError: "Invalid date format. e.g. 2024-01-01",
    calculate: "Calculate",
    elapsedSuffix: " days",
    elapsedFrom: " since ",
    upcomingTitle: "Upcoming anniversaries",
    passedTitle: "Past anniversaries",
    today: "Today 🎉",
    daysAgo: " days ago",
    ageTitle: "🎂 Age Calculator",
    birthLabel: "Date of birth",
    birthPlaceholder: "1995-05-15",
    birthError: "Invalid date format. e.g. 1995-05-15",
    manAgeLabel: "International Age (Official)",
    koreanAgeLabel: "Korean Counting Age",
    totalDaysLabel: "Days Alive",
    unitsTitle: "View in different units",
    totalWeeks: "Total weeks",
    totalMonths: "Total months",
    yearMonth: "Years + months",
    yearDay: "Years + days",
    yearWeek: "Years + weeks",
    birthDayLabel: "Day of birth",
    dayPostfix: "",
    nextBirthday: "Next birthday",
    birthdayToday: "Today is your birthday! 🎉",
    daysLeft: " days left",
    ageUnit: " yrs",
    dayUnit: " days",
    weekUnit: " wks",
    monthUnit: " mo",
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayLabel: (n: number) => `Day ${n}`,
    yearLabel: (n: number) => `${n} Year${n > 1 ? "s" : ""}`,
  },
};

function calcManAge(birth: Date, today: Date) {
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthday = today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasHadBirthday) age--;
  return age;
}

function formatDate(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function getDaysFromNow(date: Date, today: Date) {
  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getAnniversaries(start: Date, today: Date, t: typeof T.ko) {
  const milestones: { label: string; date: Date; daysFromNow: number }[] = [];
  const dayNums = [22, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 2000, 3000];
  for (const d of dayNums) {
    const date = new Date(start);
    date.setDate(date.getDate() + d - 1);
    milestones.push({ label: t.dayLabel(d), date, daysFromNow: getDaysFromNow(date, today) });
  }
  for (let y = 1; y <= 10; y++) {
    const date = new Date(start);
    date.setFullYear(date.getFullYear() + y);
    milestones.push({ label: t.yearLabel(y), date, daysFromNow: getDaysFromNow(date, today) });
  }
  return milestones.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export default function Home() {
  const { lang } = useLanguage();
  const t = T[lang];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [annivDate, setAnnivDate] = useState("");
  const [annivError, setAnnivError] = useState("");
  const [annivResult, setAnnivResult] = useState<null | {
    elapsedDays: number; start: Date;
    upcoming: { label: string; date: Date; daysFromNow: number }[];
    passed: { label: string; date: Date; daysFromNow: number }[];
  }>(null);

  const [birthDate, setBirthDate] = useState("");
  const [ageError, setAgeError] = useState("");
  const [ageResult, setAgeResult] = useState<null | {
    manAge: number; koreanAge: number; totalDays: number;
    totalWeeks: number; remainingDaysAfterWeeks: number; totalMonths: number;
    monthsSinceLastBirthday: number; daysSinceLastBirthday: number; weeksAfterBirthday: number;
    birthDayOfWeek: string; nextBirthdayDays: number; nextBirthdayDate: Date;
  }>(null);

  function parseDate(str: string): Date | null {
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const [, y, m, d] = match.map(Number);
    const date = new Date(y, m - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
    return date;
  }

  function getDayOfWeek(date: Date) {
    return t.days[date.getDay()] + t.dayPostfix;
  }

  function calcAnniv() {
    setAnnivError("");
    const start = parseDate(annivDate);
    if (!start) { setAnnivError(t.annivError); return; }
    start.setHours(0, 0, 0, 0);
    const elapsedDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const all = getAnniversaries(start, today, t);
    setAnnivResult({ elapsedDays, start, upcoming: all.filter((m) => m.daysFromNow >= 0), passed: all.filter((m) => m.daysFromNow < 0) });
  }

  function calcAge() {
    setAgeError("");
    const birth = parseDate(birthDate);
    if (!birth) { setAgeError(t.birthError); return; }
    birth.setHours(0, 0, 0, 0);
    const manAge = calcManAge(birth, today);
    const koreanAge = today.getFullYear() - birth.getFullYear() + 1;
    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDaysAfterWeeks = totalDays % 7;
    let totalMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    if (today.getDate() < birth.getDate()) totalMonths--;
    const lastBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (lastBirthday > today) lastBirthday.setFullYear(today.getFullYear() - 1);
    const daysSinceLastBirthday = Math.floor((today.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24));
    let monthsSinceLastBirthday = today.getMonth() - birth.getMonth();
    if (today.getDate() < birth.getDate()) monthsSinceLastBirthday--;
    if (monthsSinceLastBirthday < 0) monthsSinceLastBirthday += 12;
    const weeksAfterBirthday = Math.floor(daysSinceLastBirthday / 7);
    const birthDayOfWeek = getDayOfWeek(birth);
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
    const nextBirthdayDays = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setAgeResult({ manAge, koreanAge, totalDays, totalWeeks, remainingDaysAfterWeeks, totalMonths, monthsSinceLastBirthday, daysSinceLastBirthday, weeksAfterBirthday, birthDayOfWeek, nextBirthdayDays, nextBirthdayDate: nextBirthday });
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold text-slate-800">{t.title}</h1>
        <p className="text-slate-500 text-sm mt-1">{t.sub}</p>
      </div>

      {/* 기념일 계산기 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">{t.annivTitle}</h2>
        <label className="block text-sm font-medium text-slate-600 mb-1">{t.annivLabel}</label>
        <input type="text" value={annivDate} onChange={(e) => setAnnivDate(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && calcAnniv()} placeholder={t.annivPlaceholder} maxLength={10}
          className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-400 mb-1 placeholder-slate-300" />
        {annivError && <p className="text-red-400 text-xs mb-2">{annivError}</p>}
        {!annivError && <div className="mb-2" />}
        <button onClick={calcAnniv} disabled={!annivDate}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition-colors">
          {t.calculate}
        </button>

        {annivResult && (
          <div className="mt-5 space-y-4">
            <div className="bg-pink-50 rounded-xl p-4 text-center">
              <div className="text-4xl font-bold text-pink-500">{annivResult.elapsedDays.toLocaleString()}{t.elapsedSuffix}</div>
              <div className="text-slate-500 text-sm mt-1">
                {lang === "ko" ? `${formatDate(annivResult.start)}${t.elapsedFrom}` : `${t.elapsedFrom}${formatDate(annivResult.start)}`}
              </div>
            </div>

            {annivResult.upcoming.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-2">{t.upcomingTitle}</p>
                <div className="space-y-2">
                  {annivResult.upcoming.slice(0, 8).map((m) => (
                    <div key={m.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-16 font-semibold text-pink-500">{m.label}</span>
                        <span className="text-slate-600">{formatDate(m.date)} ({getDayOfWeek(m.date)})</span>
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {m.daysFromNow === 0 ? t.today : `D-${m.daysFromNow}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {annivResult.passed.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-400 mb-2">{t.passedTitle}</p>
                <div className="space-y-2 opacity-50">
                  {annivResult.passed.slice(-4).reverse().map((m) => (
                    <div key={m.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-16 font-semibold text-slate-400">{m.label}</span>
                        <span className="text-slate-500">{formatDate(m.date)} ({getDayOfWeek(m.date)})</span>
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {Math.abs(m.daysFromNow)}{t.daysAgo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 만 나이 계산기 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">{t.ageTitle}</h2>
        <label className="block text-sm font-medium text-slate-600 mb-1">{t.birthLabel}</label>
        <input type="text" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && calcAge()} placeholder={t.birthPlaceholder} maxLength={10}
          className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 mb-1 placeholder-slate-300" />
        {ageError && <p className="text-red-400 text-xs mb-2">{ageError}</p>}
        {!ageError && <div className="mb-2" />}
        <button onClick={calcAge} disabled={!birthDate}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition-colors">
          {t.calculate}
        </button>

        {ageResult && (
          <div className="mt-5 space-y-3">
            <div className="text-center pb-3 border-b border-slate-100">
              <div className="text-5xl font-bold text-blue-500">{ageResult.manAge}{t.ageUnit}</div>
              <div className="text-slate-400 text-sm mt-1">{t.manAgeLabel}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-slate-700">{ageResult.koreanAge}{t.ageUnit}</div>
                <div className="text-xs text-slate-400 mt-1">{t.koreanAgeLabel}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-slate-700">{ageResult.totalDays.toLocaleString()}{t.dayUnit}</div>
                <div className="text-xs text-slate-400 mt-1">{t.totalDaysLabel}</div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 space-y-2 text-sm">
              <p className="text-xs font-semibold text-slate-400 mb-1">{t.unitsTitle}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.totalWeeks}</span>
                  <span className="font-semibold text-slate-700">{ageResult.totalWeeks.toLocaleString()}{t.weekUnit} {ageResult.remainingDaysAfterWeeks}{t.dayUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.totalMonths}</span>
                  <span className="font-semibold text-slate-700">{ageResult.totalMonths.toLocaleString()}{t.monthUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.yearMonth}</span>
                  <span className="font-semibold text-slate-700">{ageResult.manAge}{lang === "ko" ? "년" : "y"} {ageResult.monthsSinceLastBirthday}{t.monthUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.yearDay}</span>
                  <span className="font-semibold text-slate-700">{ageResult.manAge}{lang === "ko" ? "년" : "y"} {ageResult.daysSinceLastBirthday}{t.dayUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.yearWeek}</span>
                  <span className="font-semibold text-slate-700">{ageResult.manAge}{lang === "ko" ? "년" : "y"} {ageResult.weeksAfterBirthday}{t.weekUnit}</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-sm text-slate-600 space-y-1">
              <div>{t.birthDayLabel}: <strong>{ageResult.birthDayOfWeek}</strong></div>
              <div>
                {t.nextBirthday}:{" "}
                <strong className="text-blue-600">
                  {ageResult.nextBirthdayDays === 0 ? t.birthdayToday : `${ageResult.nextBirthdayDays}${t.daysLeft}`}
                </strong>
                {ageResult.nextBirthdayDays > 0 && (
                  <span className="text-slate-400 text-xs ml-1">({formatDate(ageResult.nextBirthdayDate)})</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
