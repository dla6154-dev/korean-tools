"use client";

import { useState } from "react";

type AgeGroup = "adult" | "child";

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "저체중", color: "text-blue-500", bg: "bg-blue-50" };
  if (bmi < 23) return { label: "정상", color: "text-green-500", bg: "bg-green-50" };
  if (bmi < 25) return { label: "과체중", color: "text-yellow-500", bg: "bg-yellow-50" };
  if (bmi < 30) return { label: "비만", color: "text-orange-500", bg: "bg-orange-50" };
  return { label: "고도비만", color: "text-red-500", bg: "bg-red-50" };
}

function getBmiBarPosition(bmi: number) {
  // 15 ~ 40 범위를 0~100%로 매핑
  return Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 100);
}

export default function BmiPage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityLevel, setActivityLevel] = useState("1.55");
  const [result, setResult] = useState<null | {
    bmi: number;
    bmr: number;
    tdee: number;
    idealWeightMin: number;
    idealWeightMax: number;
  }>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseFloat(age);
    if (!h || !w || !a || h <= 0 || w <= 0 || a <= 0) {
      setError("키, 몸무게, 나이를 모두 입력해주세요.");
      return;
    }
    if (h < 50 || h > 300) { setError("키를 올바르게 입력해주세요. (cm)"); return; }
    if (w < 10 || w > 500) { setError("몸무게를 올바르게 입력해주세요. (kg)"); return; }

    const hm = h / 100;
    const bmi = w / (hm * hm);

    // Harris-Benedict 기초대사량
    const bmr = gender === "male"
      ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
      : 447.593 + 9.247 * w + 3.098 * h - 4.330 * a;

    const tdee = bmr * parseFloat(activityLevel);

    // 정상 BMI(18.5~23) 기준 이상 체중
    const idealWeightMin = 18.5 * hm * hm;
    const idealWeightMax = 23 * hm * hm;

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      idealWeightMin: Math.round(idealWeightMin * 10) / 10,
      idealWeightMax: Math.round(idealWeightMax * 10) / 10,
    });
  }

  const category = result ? getBmiCategory(result.bmi) : null;

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">BMI · 칼로리 계산기</h1>
        <p className="text-slate-500 text-sm mt-1">체질량지수와 하루 필요 칼로리를 계산해드려요</p>
      </div>

      {/* 입력 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        {/* 성별 */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">성별</label>
          <div className="grid grid-cols-2 gap-2">
            {(["male", "female"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  gender === g
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {g === "male" ? "남성" : "여성"}
              </button>
            ))}
          </div>
        </div>

        {/* 키 / 몸무게 / 나이 */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "키", placeholder: "170", unit: "cm", value: height, set: setHeight },
            { label: "몸무게", placeholder: "65", unit: "kg", value: weight, set: setWeight },
            { label: "나이", placeholder: "30", unit: "세", value: age, set: setAge },
          ].map(({ label, placeholder, unit, value, set }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
              <div className="relative">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && calculate()}
                  placeholder={placeholder}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-8"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">{unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 활동량 */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">활동량</label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="1.2">거의 운동 안 함 (앉아서 생활)</option>
            <option value="1.375">가벼운 운동 (주 1~3회)</option>
            <option value="1.55">보통 운동 (주 3~5회)</option>
            <option value="1.725">활발한 운동 (주 6~7회)</option>
            <option value="1.9">매우 격렬한 운동 (하루 2회 이상)</option>
          </select>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button
          onClick={calculate}
          disabled={!height || !weight || !age}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          계산하기
        </button>
      </div>

      {/* 결과 */}
      {result && category && (
        <div className="space-y-4">
          {/* BMI */}
          <div className={`rounded-2xl p-6 ${category.bg}`}>
            <div className="text-center mb-4">
              <div className={`text-5xl font-bold ${category.color}`}>{result.bmi}</div>
              <div className={`text-lg font-semibold mt-1 ${category.color}`}>{category.label}</div>
              <div className="text-slate-400 text-sm mt-0.5">BMI (체질량지수)</div>
            </div>

            {/* BMI 바 */}
            <div className="relative mt-2">
              <div className="flex h-3 rounded-full overflow-hidden">
                <div className="bg-blue-300" style={{ width: "23.3%" }} />
                <div className="bg-green-300" style={{ width: "18.7%" }} />
                <div className="bg-yellow-300" style={{ width: "13.3%" }} />
                <div className="bg-orange-300" style={{ width: "20%" }} />
                <div className="bg-red-300" style={{ width: "24.7%" }} />
              </div>
              <div
                className="absolute top-0 w-3 h-3 bg-slate-700 rounded-full border-2 border-white shadow -translate-x-1/2"
                style={{ left: `${getBmiBarPosition(result.bmi)}%` }}
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                <span>저체중<br/>~18.5</span>
                <span className="text-center">정상<br/>18.5~23</span>
                <span className="text-center">과체중<br/>23~25</span>
                <span className="text-center">비만<br/>25~30</span>
                <span className="text-right">고도비만<br/>30~</span>
              </div>
            </div>
          </div>

          {/* 이상 체중 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 mb-3">정상 범위 체중 (BMI 18.5~23)</p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-700">
              <span>{result.idealWeightMin}kg</span>
              <span className="text-slate-300 text-lg">~</span>
              <span>{result.idealWeightMax}kg</span>
            </div>
          </div>

          {/* 칼로리 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{result.bmr.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">기초대사량 (kcal)</div>
              <div className="text-xs text-slate-300 mt-0.5">아무것도 안 해도 소모</div>
            </div>
            <div className="bg-blue-500 rounded-2xl p-4 text-center text-white">
              <div className="text-2xl font-bold">{result.tdee.toLocaleString()}</div>
              <div className="text-xs text-blue-100 mt-1">하루 필요 칼로리 (kcal)</div>
              <div className="text-xs text-blue-200 mt-0.5">활동량 반영</div>
            </div>
          </div>

          {/* 목적별 칼로리 */}
          <div className="bg-slate-50 rounded-2xl p-5">
            <p className="text-xs font-semibold text-slate-400 mb-3">목적별 권장 칼로리</p>
            <div className="space-y-2">
              {[
                { label: "체중 감량 (500kcal 적게)", kcal: result.tdee - 500, color: "text-blue-500" },
                { label: "체중 유지", kcal: result.tdee, color: "text-green-500" },
                { label: "근육 증가 (300kcal 더)", kcal: result.tdee + 300, color: "text-orange-500" },
              ].map(({ label, kcal, color }) => (
                <div key={label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className={`font-bold ${color}`}>{kcal.toLocaleString()} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
