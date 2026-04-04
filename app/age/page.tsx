"use client";

import { useState } from "react";
import { useLanguage } from "../language-context";

const T = {
  ko: {
    title: "만 나이 계산기",
    sub: "2023년 6월부터 한국의 공식 나이 계산법이 만 나이로 통일되었습니다.",
    subBold: "만 나이",
    birthLabel: "생년월일",
    calculate: "계산하기",
    manAge: "만 나이 (법적 공식 나이)",
    koreanAge: "한국식 세는 나이",
    totalDays: "태어난 지",
    dayUnit: "일",
    ageUnit: "세",
    birthDayLabel: "태어난 요일: ",
    dayOfWeek: "요일",
    nextBirthday: "다음 생일까지: ",
    today: "오늘이 생일입니다 🎉",
    daysLeft: "일 남음",
    adZone: "광고 영역",
    infoTitle: "만 나이란?",
    infoItems: [
      "태어난 날을 0살로 시작, 생일이 지날 때마다 1살 증가",
      "2023년 6월 28일부터 한국의 법적 공식 나이",
      "세는 나이보다 1~2살 적습니다",
    ],
    days: ["일", "월", "화", "수", "목", "금", "토"],
    dayPostfix: "요일",
  },
  en: {
    title: "Korean Age Calculator",
    sub: "Since June 2023, Korea officially uses ",
    subBold: "international age",
    birthLabel: "Date of Birth",
    calculate: "Calculate",
    manAge: "International Age (Official)",
    koreanAge: "Korean Counting Age",
    totalDays: "Days Alive",
    dayUnit: " days",
    ageUnit: " yrs",
    birthDayLabel: "Day of birth: ",
    dayOfWeek: "",
    nextBirthday: "Next birthday: ",
    today: "Today is your birthday! 🎉",
    daysLeft: " days left",
    adZone: "Ad space",
    infoTitle: "What is International Age?",
    infoItems: [
      "Start at 0 on birth date, add 1 on each birthday",
      "Officially adopted in Korea from June 28, 2023",
      "Usually 1–2 years less than the Korean counting age",
    ],
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayPostfix: "",
  },
};

function calcAge(birthDate: Date, today: Date) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthday =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hasHadBirthday) age--;
  return age;
}

function getDaysUntilBirthday(birthDate: Date, today: Date) {
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
  return Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function AgePage() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [birth, setBirth] = useState("");
  const [result, setResult] = useState<null | {
    manAge: number;
    koreanAge: number;
    nextBirthdayDays: number;
    nextBirthdayDate: Date;
    birthDayOfWeek: string;
    totalDays: number;
  }>(null);

  function calculate() {
    if (!birth) return;
    const birthDate = new Date(birth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const manAge = calcAge(birthDate, today);
    const koreanAge = today.getFullYear() - birthDate.getFullYear() + 1;
    const nextBirthdayDays = getDaysUntilBirthday(birthDate, today);
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
    const totalDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    const birthDayOfWeek = t.days[birthDate.getDay()] + t.dayPostfix;
    setResult({ manAge, koreanAge, nextBirthdayDays, nextBirthdayDate: nextBirthday, birthDayOfWeek, totalDays });
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">{t.title}</h1>
      <p className="text-slate-500 mb-8 text-sm">
        {t.sub}<strong>{t.subBold}</strong>{lang === "en" ? " as the standard." : "로 통일되었습니다."}
      </p>

      <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl h-20 flex items-center justify-center text-slate-400 text-sm mb-8">
        {t.adZone}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">{t.birthLabel}</label>
        <input
          type="date"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        />
        <button
          onClick={calculate}
          disabled={!birth}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {t.calculate}
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="text-center pb-4 border-b border-slate-100">
            <div className="text-6xl font-bold text-blue-500 mb-1">{result.manAge}{t.ageUnit}</div>
            <div className="text-slate-500 text-sm">{t.manAge}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{result.koreanAge}{t.ageUnit}</div>
              <div className="text-xs text-slate-400 mt-1">{t.koreanAge}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{result.totalDays.toLocaleString()}{t.dayUnit}</div>
              <div className="text-xs text-slate-400 mt-1">{t.totalDays}</div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-sm text-slate-600">
              {t.birthDayLabel}<strong>{result.birthDayOfWeek}</strong>
            </div>
            <div className="text-sm text-slate-600 mt-1">
              {t.nextBirthday}
              <strong className="text-blue-600">
                {result.nextBirthdayDays === 0
                  ? t.today
                  : `${result.nextBirthdayDays}${t.daysLeft}`}
              </strong>
              {result.nextBirthdayDays > 0 && (
                <span className="text-slate-400 text-xs ml-1">
                  ({result.nextBirthdayDate.getFullYear()}.
                  {String(result.nextBirthdayDate.getMonth() + 1).padStart(2, "0")}.
                  {String(result.nextBirthdayDate.getDate()).padStart(2, "0")})
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl h-20 flex items-center justify-center text-slate-400 text-sm mt-8">
        {t.adZone}
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-700 mb-3">{t.infoTitle}</h2>
        <ul className="text-sm text-slate-500 space-y-2 list-disc list-inside">
          {t.infoItems.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
    </div>
  );
}
