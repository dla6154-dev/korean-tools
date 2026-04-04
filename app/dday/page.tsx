"use client";

import { useState } from "react";

function formatDate(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function getDayOfWeek(date: Date) {
  return ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
}

export default function DdayPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [list, setList] = useState<{ title: string; date: Date; diff: number }[]>([]);
  const [error, setError] = useState("");

  function parseDate(str: string): Date | null {
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const [, y, m, d] = match.map(Number);
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
    return dt;
  }

  function addDday() {
    setError("");
    const dt = parseDate(date);
    if (!dt) { setError("날짜 형식을 확인해주세요. 예) 2025-12-25"); return; }
    const diff = Math.ceil((dt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setList((prev) => [...prev, { title: title || "이벤트", date: dt, diff }]);
    setTitle("");
    setDate("");
  }

  function remove(idx: number) {
    setList((prev) => prev.filter((_, i) => i !== idx));
  }

  function getDdayLabel(diff: number) {
    if (diff === 0) return { text: "D-Day", color: "text-pink-500 bg-pink-50" };
    if (diff > 0) return { text: `D-${diff}`, color: "text-blue-500 bg-blue-50" };
    return { text: `D+${Math.abs(diff)}`, color: "text-slate-500 bg-slate-100" };
  }

  const sorted = [...list].sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">디데이 계산기</h1>
        <p className="text-slate-500 text-sm mt-1">중요한 날까지 며칠 남았는지 확인하세요</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">이벤트 이름 (선택)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예) 수능, 여행, 생일"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-slate-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">날짜</label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addDday()}
            placeholder="2025-12-25"
            maxLength={10}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-slate-300"
          />
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          onClick={addDday}
          disabled={!date}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          추가하기
        </button>
      </div>

      {sorted.length > 0 && (
        <div className="space-y-3">
          {sorted.map((item, idx) => {
            const { text, color } = getDdayLabel(item.diff);
            return (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-700">{item.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{formatDate(item.date)} ({getDayOfWeek(item.date)}요일)</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xl font-bold px-3 py-1 rounded-xl ${color}`}>{text}</span>
                  <button onClick={() => remove(idx)} className="text-slate-300 hover:text-slate-500 text-lg">×</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {list.length === 0 && (
        <div className="text-center py-10 text-slate-300 text-sm">
          날짜를 추가하면 여기에 표시됩니다
        </div>
      )}
    </div>
  );
}
