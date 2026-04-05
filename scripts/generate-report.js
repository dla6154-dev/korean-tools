/**
 * 코인 시황 자동 생성 스크립트
 * 실행: node scripts/generate-report.js [daily|weekly|monthly]
 * 예시: node scripts/generate-report.js daily
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const PERIOD = process.argv[2] || "daily";
const DATA_PATH = path.join(__dirname, "../app/data/bitcoin.json");

// 날짜 포맷
function today() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function slug(period, date) {
  const map = { daily: "daily", weekly: "weekly", monthly: "monthly" };
  return `crypto-${map[period]}-${date}`;
}

function periodLabel(period) {
  return { daily: "오늘", weekly: "이번 주", monthly: "이번 달" }[period];
}

function periodTitle(period, date) {
  const d = formatDate(date);
  return {
    daily: `코인 시황 ${d} — 상승 Top 10 / 하락 Top 10`,
    weekly: `코인 주간 시황 ${d} — 상승 Top 10 / 하락 Top 10`,
    monthly: `코인 월간 시황 ${d} — 상승 Top 10 / 하락 Top 10`,
  }[period];
}

// CoinGecko API 호출
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent": "korean-tools-bot/1.0",
        "Accept": "application/json",
      },
    };
    https.get(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error("JSON parse error: " + data.substring(0, 200)));
        }
      });
    }).on("error", reject);
  });
}

// 기간별 CoinGecko 파라미터
function getPriceChangeField(period) {
  return {
    daily: "price_change_percentage_24h",
    weekly: "price_change_percentage_7d",
    monthly: "price_change_percentage_30d",
  }[period];
}

async function fetchTopCoins(period) {
  const priceChangeField = getPriceChangeField(period);
  const extraFields = period === "daily"
    ? ""
    : `,price_change_percentage_7d_in_currency,price_change_percentage_30d_in_currency`;

  // 상위 250개 코인 가져오기 (시총 기준)
  const url =
    `https://api.coingecko.com/api/v3/coins/markets` +
    `?vs_currency=usd&order=market_cap_desc&per_page=250&page=1` +
    `&sparkline=false&price_change_percentage=24h,7d,30d`;

  console.log("CoinGecko API 호출 중...");
  const coins = await fetchJSON(url);

  if (!Array.isArray(coins) || coins.length === 0) {
    throw new Error("코인 데이터를 가져오지 못했습니다: " + JSON.stringify(coins));
  }

  // 기간별 변화율 필드 선택
  const getChange = (coin) => {
    if (period === "daily") return coin.price_change_percentage_24h;
    if (period === "weekly") return coin.price_change_percentage_7d_in_currency ?? coin.price_change_percentage_7d;
    if (period === "monthly") return coin.price_change_percentage_30d_in_currency ?? coin.price_change_percentage_30d;
    return coin.price_change_percentage_24h;
  };

  // 변화율 있는 것만 필터
  const valid = coins.filter((c) => getChange(c) !== null && getChange(c) !== undefined);

  // 상승 Top 10
  const gainers = [...valid]
    .sort((a, b) => getChange(b) - getChange(a))
    .slice(0, 10)
    .map((c) => ({ name: c.name, symbol: c.symbol.toUpperCase(), change: getChange(c) }));

  // 하락 Top 10
  const losers = [...valid]
    .sort((a, b) => getChange(a) - getChange(b))
    .slice(0, 10)
    .map((c) => ({ name: c.name, symbol: c.symbol.toUpperCase(), change: getChange(c) }));

  return { gainers, losers };
}

// HTML 표 생성
function buildTable(rows, type) {
  const isGainer = type === "gainer";
  const color = isGainer ? "green" : "red";
  const headerBg = isGainer ? "bg-green-50" : "bg-red-50";
  const headerColor = isGainer ? "text-green-700" : "text-red-700";

  const trs = rows
    .map((row, i) => {
      const sign = row.change >= 0 ? "+" : "";
      const pct = `${sign}${row.change.toFixed(1)}%`;
      const bg = i % 2 === 1 ? ' class="bg-slate-50"' : "";
      return (
        `<tr${bg}>` +
        `<td class="border border-slate-200 px-3 py-2">${i + 1}</td>` +
        `<td class="border border-slate-200 px-3 py-2">${row.name}</td>` +
        `<td class="border border-slate-200 px-3 py-2 font-mono">${row.symbol}</td>` +
        `<td class="border border-slate-200 px-3 py-2 text-right font-semibold text-${color}-600">${pct}</td>` +
        `</tr>`
      );
    })
    .join("\n      ");

  return `<div class="overflow-x-auto mb-8">
  <table class="w-full text-sm border-collapse">
    <thead>
      <tr class="${headerBg}">
        <th class="border border-slate-200 px-3 py-2 text-left">순위</th>
        <th class="border border-slate-200 px-3 py-2 text-left">코인</th>
        <th class="border border-slate-200 px-3 py-2 text-left">심볼</th>
        <th class="border border-slate-200 px-3 py-2 text-right ${headerColor}">등락률</th>
      </tr>
    </thead>
    <tbody>
      ${trs}
    </tbody>
  </table>
</div>`;
}

// 전체 HTML 콘텐츠 생성
function buildContent(period, date, gainers, losers) {
  const label = periodLabel(period);
  const gainerTable = buildTable(gainers, "gainer");
  const loserTable = buildTable(losers, "loser");

  return `
<h2 class="text-xl font-bold mb-3 mt-6">📈 ${label}의 상승 코인 Top 10</h2>
${gainerTable}

<h2 class="text-xl font-bold mb-3 mt-6">📉 ${label}의 하락 코인 Top 10</h2>
${loserTable}

<p class="text-xs text-slate-400 mt-8">※ 데이터 출처: CoinGecko (${date} 기준, 시총 상위 250개 기준). 본 내용은 투자 권유가 아니며 투자 손실에 대한 책임은 투자자 본인에게 있습니다.</p>
`;
}

// 요약문 생성
function buildSummary(period, gainers, losers) {
  const top3Gainers = gainers
    .slice(0, 3)
    .map((c) => `${c.symbol} +${c.change.toFixed(1)}%`)
    .join(", ");
  const top3Losers = losers
    .slice(0, 3)
    .map((c) => `${c.symbol} ${c.change.toFixed(1)}%`)
    .join(", ");
  const label = { daily: "오늘", weekly: "이번 주", monthly: "이번 달" }[period];
  return `${label} 상위 상승: ${top3Gainers} / 상위 하락: ${top3Losers}`;
}

// 메인
async function main() {
  const date = today();
  const articleSlug = slug(PERIOD, date);

  // 기존 데이터 로드
  let existing = [];
  if (fs.existsSync(DATA_PATH)) {
    existing = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  }

  // 같은 slug가 이미 있으면 덮어쓰기, 없으면 맨 앞에 추가
  const alreadyExists = existing.findIndex((a) => a.slug === articleSlug);

  console.log(`기간: ${PERIOD} | 날짜: ${date}`);

  // 데이터 수집
  const { gainers, losers } = await fetchTopCoins(PERIOD);

  console.log(`상승 1위: ${gainers[0].name} +${gainers[0].change.toFixed(1)}%`);
  console.log(`하락 1위: ${losers[0].name} ${losers[0].change.toFixed(1)}%`);

  const newArticle = {
    slug: articleSlug,
    title: periodTitle(PERIOD, date),
    date,
    period: PERIOD,
    summary: buildSummary(PERIOD, gainers, losers),
    content: buildContent(PERIOD, date, gainers, losers),
  };

  if (alreadyExists >= 0) {
    existing[alreadyExists] = newArticle;
    console.log("기존 글 업데이트 완료");
  } else {
    existing.unshift(newArticle); // 최신 글이 맨 위
    console.log("새 글 추가 완료");
  }

  // 최대 90개만 유지 (너무 오래된 글 자동 삭제)
  existing = existing.slice(0, 90);

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2), "utf-8");
  console.log(`✅ ${DATA_PATH} 저장 완료`);
}

main().catch((err) => {
  console.error("❌ 오류:", err.message);
  process.exit(1);
});
