/**
 * 시황 자동 생성 스크립트
 * 실행: node scripts/generate-report.js [daily|weekly|monthly] [bitcoin|stocks]
 * 예시: node scripts/generate-report.js daily bitcoin
 *       node scripts/generate-report.js daily stocks
 */

const fs   = require("fs");
const path = require("path");
const https = require("https");
const { buildNarrative } = require("./content-agent");

const PERIOD = process.argv[2] || "daily";
const TYPE   = process.argv[3] || "bitcoin"; // "bitcoin" | "stocks"

const DATA_PATH = path.join(
  __dirname,
  `../app/data/${TYPE === "stocks" ? "stocks" : "bitcoin"}.json`
);

// ─── 공통 유틸 ───────────────────────────────────────────────

function today() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function fetchJSON(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json", ...headers } }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error("JSON parse error: " + data.substring(0, 200))); }
      });
    }).on("error", reject);
  });
}

function buildTable(rows, type, unit = "") {
  const isGainer = type === "gainer";
  const color    = isGainer ? "green" : "red";
  const hBg      = isGainer ? "bg-green-50" : "bg-red-50";
  const hColor   = isGainer ? "text-green-700" : "text-red-700";

  const trs = rows.map((row, i) => {
    const sign = row.change >= 0 ? "+" : "";
    const pct  = `${sign}${row.change.toFixed(2)}%`;
    const bg   = i % 2 === 1 ? ' class="bg-slate-50"' : "";
    const extra = unit ? `<td class="border border-slate-200 px-3 py-2 text-right">${row.price?.toLocaleString()}${unit}</td>` : "";
    return (
      `<tr${bg}>` +
      `<td class="border border-slate-200 px-3 py-2">${i + 1}</td>` +
      `<td class="border border-slate-200 px-3 py-2">${row.name}</td>` +
      `<td class="border border-slate-200 px-3 py-2 font-mono text-xs">${row.symbol}</td>` +
      extra +
      `<td class="border border-slate-200 px-3 py-2 text-right font-semibold text-${color}-600">${pct}</td>` +
      `</tr>`
    );
  }).join("\n      ");

  const priceHeader = unit ? `<th class="border border-slate-200 px-3 py-2 text-right">현재가</th>` : "";

  return `<div class="overflow-x-auto mb-8">
  <table class="w-full text-sm border-collapse">
    <thead>
      <tr class="${hBg}">
        <th class="border border-slate-200 px-3 py-2 text-left">순위</th>
        <th class="border border-slate-200 px-3 py-2 text-left">종목명</th>
        <th class="border border-slate-200 px-3 py-2 text-left">코드</th>
        ${priceHeader}
        <th class="border border-slate-200 px-3 py-2 text-right ${hColor}">등락률</th>
      </tr>
    </thead>
    <tbody>
      ${trs}
    </tbody>
  </table>
</div>`;
}

// ─── 비트코인 (CoinGecko) ─────────────────────────────────────

function getPriceChangeField(period) {
  return { daily: "price_change_percentage_24h", weekly: "price_change_percentage_7d", monthly: "price_change_percentage_30d" }[period];
}

async function fetchCryptoData(period) {
  const url =
    `https://api.coingecko.com/api/v3/coins/markets` +
    `?vs_currency=usd&order=market_cap_desc&per_page=250&page=1` +
    `&sparkline=false&price_change_percentage=24h,7d,30d`;

  console.log("CoinGecko API 호출 중...");
  const coins = await fetchJSON(url);
  if (!Array.isArray(coins) || coins.length === 0)
    throw new Error("코인 데이터 없음: " + JSON.stringify(coins));

  const getChange = (c) => {
    if (period === "daily")   return c.price_change_percentage_24h;
    if (period === "weekly")  return c.price_change_percentage_7d_in_currency ?? c.price_change_percentage_7d;
    if (period === "monthly") return c.price_change_percentage_30d_in_currency ?? c.price_change_percentage_30d;
    return c.price_change_percentage_24h;
  };

  const valid   = coins.filter((c) => getChange(c) != null);
  const gainers = [...valid].sort((a, b) => getChange(b) - getChange(a)).slice(0, 10)
    .map((c) => ({ name: c.name, symbol: c.symbol.toUpperCase(), change: getChange(c) }));
  const losers  = [...valid].sort((a, b) => getChange(a) - getChange(b)).slice(0, 10)
    .map((c) => ({ name: c.name, symbol: c.symbol.toUpperCase(), change: getChange(c) }));

  return { gainers, losers };
}

function buildCryptoContent(period, date, gainers, losers) {
  const label = { daily: "오늘", weekly: "이번 주", monthly: "이번 달" }[period];
  return `
<h2 class="text-xl font-bold mb-3 mt-6">📈 ${label}의 상승 코인 Top 10</h2>
${buildTable(gainers, "gainer")}

<h2 class="text-xl font-bold mb-3 mt-6">📉 ${label}의 하락 코인 Top 10</h2>
${buildTable(losers, "loser")}

<p class="text-xs text-slate-400 mt-8">※ 데이터 출처: CoinGecko (${date} 기준, 시총 상위 250개 기준). 본 내용은 투자 권유가 아니며 투자 손실에 대한 책임은 투자자 본인에게 있습니다.</p>
`;
}

// ─── 주식 (Naver Finance) ─────────────────────────────────────

async function fetchStocksPage(sosok, page) {
  const url = `https://m.stock.naver.com/api/json/sise/siseListJson.nhn?sosok=${sosok}&page=${page}&pageSize=50&_callback=`;
  const data = await fetchJSON(url, { Referer: "https://m.stock.naver.com" });
  return data?.result?.itemList || [];
}

async function fetchStocksData(period) {
  console.log("네이버 금융 API 호출 중 (KOSPI + KOSDAQ)...");

  // KOSPI(0) + KOSDAQ(1) 각 4페이지 = 최대 400종목
  const pages = await Promise.all([
    fetchStocksPage(0, 1), fetchStocksPage(0, 2),
    fetchStocksPage(0, 3), fetchStocksPage(0, 4),
    fetchStocksPage(1, 1), fetchStocksPage(1, 2),
    fetchStocksPage(1, 3), fetchStocksPage(1, 4),
  ]);
  const all = pages.flat();
  console.log(`총 ${all.length}개 종목 수집`);

  // cr: 등락률, nv: 현재가, cd: 종목코드, nm: 종목명
  // 주간/월간은 일간 데이터만 있으므로 24h 기준으로 통일
  const valid   = all.filter((s) => s.cr != null && s.nm);
  const gainers = [...valid].sort((a, b) => b.cr - a.cr).slice(0, 10)
    .map((s) => ({ name: s.nm, symbol: s.cd, price: s.nv, change: s.cr }));
  const losers  = [...valid].sort((a, b) => a.cr - b.cr).slice(0, 10)
    .map((s) => ({ name: s.nm, symbol: s.cd, price: s.nv, change: s.cr }));

  return { gainers, losers };
}

function buildStocksContent(period, date, gainers, losers) {
  const label = { daily: "오늘", weekly: "이번 주", monthly: "이번 달" }[period];
  return `
<h2 class="text-xl font-bold mb-3 mt-6">📈 ${label}의 상승 종목 Top 10 (KOSPI·KOSDAQ)</h2>
${buildTable(gainers, "gainer", "원")}

<h2 class="text-xl font-bold mb-3 mt-6">📉 ${label}의 하락 종목 Top 10 (KOSPI·KOSDAQ)</h2>
${buildTable(losers, "loser", "원")}

<p class="text-xs text-slate-400 mt-8">※ 데이터 출처: 네이버 금융 (${date} 기준, KOSPI·KOSDAQ 상위 400개 기준). 본 내용은 투자 권유가 아니며 투자 손실에 대한 책임은 투자자 본인에게 있습니다.</p>
`;
}

// ─── 공통 메타 ────────────────────────────────────────────────

function buildTitle(type, period, date) {
  const d = formatDate(date);
  if (type === "stocks") {
    return { daily: `주식 시황 ${d} — 상승 Top 10 / 하락 Top 10`, weekly: `주식 주간 시황 ${d}`, monthly: `주식 월간 시황 ${d}` }[period];
  }
  return { daily: `코인 시황 ${d} — 상승 Top 10 / 하락 Top 10`, weekly: `코인 주간 시황 ${d}`, monthly: `코인 월간 시황 ${d}` }[period];
}

function buildSummary(type, gainers, losers) {
  const t3g = gainers.slice(0, 3).map((c) => `${c.name} +${c.change.toFixed(1)}%`).join(", ");
  const t3l = losers.slice(0, 3).map((c) => `${c.name} ${c.change.toFixed(1)}%`).join(", ");
  return `상승: ${t3g} / 하락: ${t3l}`;
}

// ─── 메인 ─────────────────────────────────────────────────────

async function main() {
  const date        = today();
  const articleSlug = `${TYPE === "stocks" ? "stock" : "crypto"}-${PERIOD}-${date}`;

  console.log(`타입: ${TYPE} | 기간: ${PERIOD} | 날짜: ${date}`);

  // 데이터 수집
  let gainers, losers, content;
  if (TYPE === "stocks") {
    ({ gainers, losers } = await fetchStocksData(PERIOD));
    content = buildStocksContent(PERIOD, date, gainers, losers);
  } else {
    ({ gainers, losers } = await fetchCryptoData(PERIOD));
    content = buildCryptoContent(PERIOD, date, gainers, losers);
  }

  console.log(`상승 1위: ${gainers[0].name} +${gainers[0].change.toFixed(1)}%`);
  console.log(`하락 1위: ${losers[0].name} ${losers[0].change.toFixed(1)}%`);

  // 콘텐츠 에이전트: narrative 분석 텍스트 추가
  const narrative = buildNarrative(TYPE, PERIOD, gainers, losers);
  const richContent = content + narrative;

  const newArticle = {
    slug:    articleSlug,
    title:   buildTitle(TYPE, PERIOD, date),
    date,
    period:  PERIOD,
    summary: buildSummary(TYPE, gainers, losers),
    content: richContent,
  };

  // 기존 데이터 로드
  let existing = [];
  if (fs.existsSync(DATA_PATH)) {
    existing = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  }

  // 같은 날짜+기간이면 덮어쓰기, 없으면 맨 앞에 추가
  const idx = existing.findIndex((a) => a.slug === articleSlug);
  if (idx >= 0) {
    existing[idx] = newArticle;
    console.log("기존 글 업데이트");
  } else {
    existing.unshift(newArticle);
    console.log("새 글 추가");
  }

  // 최대 90개 유지
  existing = existing.slice(0, 90);
  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2), "utf-8");
  console.log(`✅ ${DATA_PATH} 저장 완료`);
}

main().catch((err) => {
  console.error("❌ 오류:", err.message);
  process.exit(1);
});
