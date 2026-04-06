/**
 * 콘텐츠 강화 에이전트 (모듈 + 단독 실행 가능)
 * 역할: 시황 데이터 → narrative 분석 텍스트 생성
 * 단독 실행: node scripts/content-agent.js [bitcoin|stocks]
 * 모듈 사용: const { buildNarrative } = require('./content-agent')
 */

// ─── 섹터 감지 (주식) ──────────────────────────────────────────
const SECTOR_KEYWORDS = [
  { sector: "반도체·전자",   words: ["반도체", "전자", "칩", "마이크로", "실리콘", "디스플레이", "메모리"] },
  { sector: "제약·바이오",   words: ["바이오", "파마", "제약", "메디", "헬스", "셀", "진단", "의료"] },
  { sector: "에너지·소재",   words: ["에너지", "수소", "탄소", "윈드", "솔라", "태양", "전지", "배터리", "소재", "광통신", "카본"] },
  { sector: "건설·엔지니어링", words: ["건설", "엔지니어링", "건축", "인프라", "E&A", "씨에스"] },
  { sector: "IT·플랫폼",    words: ["IT", "소프트", "플랫폼", "테크", "시스템", "솔루션", "데이터", "클라우드", "AI"] },
  { sector: "금융·증권",    words: ["금융", "증권", "은행", "보험", "캐피탈", "투자"] },
  { sector: "자동차·기계",  words: ["자동차", "차량", "모빌리티", "기계", "부품"] },
  { sector: "우주·방산",    words: ["우주", "방산", "항공", "위성", "아이"] },
];

function detectSector(name) {
  const lower = name.toLowerCase();
  for (const { sector, words } of SECTOR_KEYWORDS) {
    if (words.some((w) => lower.includes(w.toLowerCase()))) return sector;
  }
  return null;
}

function avgChange(arr) {
  if (!arr.length) return 0;
  return arr.reduce((s, c) => s + c.change, 0) / arr.length;
}

// ─── 주식 narrative ────────────────────────────────────────────
function buildStocksNarrative(period, gainers, losers) {
  const topG = gainers[0];
  const topL = losers[0];
  const avgG = avgChange(gainers).toFixed(1);
  const avgL = avgChange(losers).toFixed(1);

  // 섹터 분포
  const sectorMap = {};
  gainers.forEach((s) => {
    const sec = detectSector(s.name) || "기타";
    sectorMap[sec] = (sectorMap[sec] || 0) + 1;
  });
  const topSector = Object.entries(sectorMap).sort((a, b) => b[1] - a[1])[0];

  const periodLabel = { daily: "오늘", weekly: "이번 주", monthly: "이번 달" }[period] || period;
  const g3 = gainers.slice(0, 3).map((s) => `<strong>${s.name}</strong>(+${s.change.toFixed(1)}%)`).join(", ");
  const l3 = losers.slice(0, 3).map((s) => `<strong>${s.name}</strong>(${s.change.toFixed(1)}%)`).join(", ");

  return `
<h2 class="text-xl font-bold mb-3 mt-8">📊 ${periodLabel} 시장 분석</h2>
<div class="bg-slate-50 rounded-lg p-4 mb-6 text-sm text-slate-700 leading-relaxed space-y-3">
  <p>
    ${periodLabel} 국내 증시(KOSPI·KOSDAQ)에서는 상위 400개 종목을 기준으로 분석한 결과,
    상승 Top 10의 <span class="font-semibold text-green-700">평균 상승률 +${avgG}%</span>,
    하락 Top 10의 <span class="font-semibold text-red-700">평균 하락률 ${avgL}%</span>를 기록했습니다.
  </p>
  <p>
    📈 <span class="font-semibold">상승 주도 종목:</span> ${g3}이 강세를 보이며 시장을 이끌었습니다.
    ${topSector ? `특히 <strong>${topSector[0]}</strong> 관련 종목이 ${topSector[1]}개 포함되며 섹터 강세를 나타냈습니다.` : ""}
  </p>
  <p>
    📉 <span class="font-semibold">하락 주의 종목:</span> ${l3}이 하락 마감하며 투자자 주의가 필요합니다.
  </p>
  <p class="text-xs text-slate-500 pt-1 border-t border-slate-200">
    ※ 본 분석은 자동 생성된 데이터 기반 요약이며 투자 권유가 아닙니다. 투자 결정은 본인 판단 하에 이루어져야 합니다.
  </p>
</div>`;
}

// ─── 코인 narrative ────────────────────────────────────────────
function buildCryptoNarrative(period, gainers, losers) {
  const topG = gainers[0];
  const topL = losers[0];
  const avgG = avgChange(gainers).toFixed(1);
  const avgL = avgChange(losers).toFixed(1);

  const periodLabel = { daily: "오늘", weekly: "이번 주", monthly: "이번 달" }[period] || period;
  const g3 = gainers.slice(0, 3).map((c) => `<strong>${c.name}</strong>(+${c.change.toFixed(1)}%)`).join(", ");
  const l3 = losers.slice(0, 3).map((c) => `<strong>${c.name}</strong>(${c.change.toFixed(1)}%)`).join(", ");

  const bullBear = parseFloat(avgG) > Math.abs(parseFloat(avgL)) ? "강세(Bull)" : "약세(Bear)";

  return `
<h2 class="text-xl font-bold mb-3 mt-8">📊 ${periodLabel} 코인 시장 분석</h2>
<div class="bg-slate-50 rounded-lg p-4 mb-6 text-sm text-slate-700 leading-relaxed space-y-3">
  <p>
    시총 상위 250개 코인을 분석한 결과, ${periodLabel} 암호화폐 시장은 전반적으로
    <span class="font-semibold ${parseFloat(avgG) > 5 ? "text-green-700" : "text-red-700"}">${bullBear}</span>
    분위기를 나타냈습니다.
    급등 Top 10 평균 <span class="font-semibold text-green-700">+${avgG}%</span>,
    급락 Top 10 평균 <span class="font-semibold text-red-700">${avgL}%</span>입니다.
  </p>
  <p>
    🚀 <span class="font-semibold">급등 코인:</span> ${g3}이 큰 폭으로 상승하며 투자자들의 주목을 받았습니다.
    특히 <strong>${topG.name}(${topG.symbol})</strong>은 +${topG.change.toFixed(2)}%로 가장 높은 수익률을 기록했습니다.
  </p>
  <p>
    ⚠️ <span class="font-semibold">급락 코인:</span> ${l3}은 큰 폭으로 하락해 주의가 필요합니다.
    <strong>${topL.name}(${topL.symbol})</strong>은 ${topL.change.toFixed(2)}%로 가장 큰 낙폭을 기록했습니다.
  </p>
  <p class="text-xs text-slate-500 pt-1 border-t border-slate-200">
    ※ 암호화폐는 변동성이 매우 크며, 본 내용은 투자 권유가 아닙니다. 투자 손실에 대한 책임은 투자자 본인에게 있습니다.
  </p>
</div>`;
}

// ─── 공개 API ─────────────────────────────────────────────────
function buildNarrative(type, period, gainers, losers) {
  if (type === "stocks") return buildStocksNarrative(period, gainers, losers);
  return buildCryptoNarrative(period, gainers, losers);
}

module.exports = { buildNarrative };

// ─── 단독 실행 모드 ───────────────────────────────────────────
if (require.main === module) {
  const fs = require("fs");
  const path = require("path");
  const TYPE = process.argv[2] || "stocks";
  const DATA_PATH = path.join(__dirname, `../app/data/${TYPE === "stocks" ? "stocks" : "bitcoin"}.json`);

  if (!fs.existsSync(DATA_PATH)) {
    console.error(`❌ 파일 없음: ${DATA_PATH}`);
    process.exit(1);
  }

  const articles = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  if (!articles.length) {
    console.log("ℹ️  데이터 없음");
    process.exit(0);
  }

  const latest = articles[0];
  if (latest.content.includes("시장 분석")) {
    console.log("ℹ️  이미 narrative 포함됨 — 건너뜀");
    process.exit(0);
  }

  // summary에서 데이터 재구성 (단독 실행 시 간단 파싱)
  // summary 형식: "상승: A +25.9%, B +24.0%, C +18.5% / 하락: X -13.5%, Y -8.3%, Z -7.9%"
  const summaryParts = latest.summary.split(" / ");
  const parseGroup = (str) =>
    (str || "").replace(/^(상승|하락):?\s*/, "").split(", ").map((item) => {
      const m = item.match(/^(.+?)\s+([+-][\d.]+)%$/);
      if (!m) return null;
      return { name: m[1], symbol: "", change: parseFloat(m[2]) };
    }).filter(Boolean);

  const gainers = parseGroup(summaryParts[0]);
  const losers = parseGroup(summaryParts[1]);

  if (!gainers.length) {
    console.log("ℹ️  summary 파싱 실패 — 건너뜀");
    process.exit(0);
  }

  const narrative = buildNarrative(TYPE, latest.period || "daily", gainers, losers);
  articles[0].content = articles[0].content + narrative;
  fs.writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2), "utf-8");
  console.log(`✅ narrative 추가 완료: ${latest.slug}`);
}
