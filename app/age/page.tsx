"use client";

import { useState } from "react";
import type { Metadata } from "next";

function calcAge(birthDate: Date, today: Date) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthday =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());
  if (!hasHadBirthday) age--;
  return age;
}

function getDaysUntilBirthday(birthDate: Date, today: Date) {
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
  const diff = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function getDayOfWeek(date: Date) {
  return ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
}

export default function AgePage() {
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
    const birthDayOfWeek = getDayOfWeek(birthDate);

    setResult({
      manAge,
      koreanAge,
      nextBirthdayDays,
      nextBirthdayDate: nextBirthday,
      birthDayOfWeek,
      totalDays,
    });
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">만 나이 계산기</h1>
      <p className="text-slate-500 mb-8 text-sm">
        2023년 6월부터 한국의 공식 나이 계산법이 <strong>만 나이</strong>로 통일되었습니다.
      </p>

      {/* 광고 영역 */}
      <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl h-20 flex items-center justify-center text-slate-400 text-sm mb-8">
        광고 영역
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">생년월일</label>
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
          계산하기
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="text-center pb-4 border-b border-slate-100">
            <div className="text-6xl font-bold text-blue-500 mb-1">{result.manAge}세</div>
            <div className="text-slate-500 text-sm">만 나이 (법적 공식 나이)</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{result.koreanAge}세</div>
              <div className="text-xs text-slate-400 mt-1">한국식 세는 나이</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{result.totalDays.toLocaleString()}일</div>
              <div className="text-xs text-slate-400 mt-1">태어난 지</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-sm text-slate-600">
              태어난 요일: <strong>{result.birthDayOfWeek}요일</strong>
            </div>
            <div className="text-sm text-slate-600 mt-1">
              다음 생일까지:{" "}
              <strong className="text-blue-600">
                {result.nextBirthdayDays === 0
                  ? "오늘이 생일입니다 🎉"
                  : `${result.nextBirthdayDays}일 남음`}
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

      {/* 광고 영역 */}
      <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl h-20 flex items-center justify-center text-slate-400 text-sm mt-8">
        광고 영역
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-700 mb-3">만 나이란?</h2>
        <ul className="text-sm text-slate-500 space-y-2 list-disc list-inside">
          <li>태어난 날을 0살로 시작, 생일이 지날 때마다 1살 증가</li>
          <li>2023년 6월 28일부터 한국의 법적 공식 나이</li>
          <li>세는 나이보다 1~2살 적습니다</li>
        </ul>
      </div>
    </div>
  );
}
