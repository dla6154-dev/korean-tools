/**
 * 뉴스 수집 에이전트
 * 역할: Google News RSS → 사회 정세 글 자동 생성
 * 실행: node scripts/news-agent.js [daily|weekly|monthly]
 */

const fs   = require("fs");
const path = require("path");
const https = require("https");
const http  = require("http");

const PERIOD    = process.argv[2] || "daily";
const DATA_PATH = path.join(__dirname, "../app/data/social.json");

// ─── 유틸 ─────────────────────────────────────────────────────
function today() {
  return new Date().toISOString().split("T")[0];
}
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function fetchURL(url, redirectCount = 0) {
  if (redirectCount > 5) return Promise.reject(new Error("리다이렉트 초과"));
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
          Accept: "application/rss+xml, application/xml, text/xml, */*",
          "Accept-Language": "ko-KR,ko;q=0.9",
        },
        timeout: 10000,
      },
      (res) => {
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
          const loc = res.headers.location;
          res.resume();
          return fetchURL(loc, redirectCount + 1).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        }
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (c) => (data += c));
        res.on("end",  () => resolve(data));
      }
    );
    req.on("error",   reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("타임아웃")); });
  });
}

// ─── RSS XML 파서 ─────────────────────────────────────────────
function parseRSS(xml, maxItems = 5) {
  const items = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];

  for (const block of blocks.slice(0, maxItems)) {
    // title: CDATA 또는 일반
    const titleM =
      block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) ||
      block.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (!titleM) continue;

    const raw = titleM[1]
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    // Google News 형식: "제목 - 출처" → 출처 분리
    const dashIdx = raw.lastIndexOf(" - ");
    const title  = dashIdx > 0 ? raw.slice(0, dashIdx).trim()  : raw;
    const source = dashIdx > 0 ? raw.slice(dashIdx + 3).trim() : "";

    const linkM = block.match(/<link>([\s\S]*?)<\/link>/i);
    const link  = linkM ? linkM[1].trim() : "";

    items.push({ title, source, link });
  }
  return items;
}

// ─── 뉴스 카테고리 정의 ────────────────────────────────────────
const CATEGORIES = [
  { key: "politics", icon: "🏛", label: "정치",  query: "한국 정치 뉴스" },
  { key: "economy",  icon: "💰", label: "경제",  query: "한국 경제 뉴스" },
  { key: "society",  icon: "📰", label: "사회",  query: "한국 사회 뉴스" },
  { key: "world",    icon: "🌍", label: "국제",  query: "국제 뉴스 한국" },
];

async function fetchCategory(cat) {
  const url =
    `https://news.google.com/rss/search?q=${encodeURIComponent(cat.query)}` +
    `&hl=ko&gl=KR&ceid=KR:ko`;
  console.log(`[${cat.label}] 수집 중...`);
  try {
    const xml   = await fetchURL(url);
    const items = parseRSS(xml, 5);
    console.log(`[${cat.label}] ${items.length}개`);
    return items;
  } catch (e) {
    console.warn(`[${cat.label}] 실패: ${e.message}`);
    return [];
  }
}

// ─── HTML 빌더 ────────────────────────────────────────────────
function buildSection(cat, items) {
  if (!items.length) return "";

  const rows = items
    .map((item, i) => {
      const bg    = i % 2 === 1 ? ' class="bg-slate-50"' : "";
      const title = item.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const src   = item.source
        ? `<span class="text-slate-400 text-xs ml-2">${item.source.replace(/</g, "&lt;")}</span>`
        : "";
      return `<tr${bg}>
        <td class="border border-slate-200 px-3 py-2 text-slate-500 text-center w-8">${i + 1}</td>
        <td class="border border-slate-200 px-3 py-2">${title}${src}</td>
      </tr>`;
    })
    .join("\n      ");

  return `
<h2 class="text-xl font-bold mb-3 mt-6">${cat.icon} ${cat.label} 주요 뉴스</h2>
<div class="overflow-x-auto mb-8">
  <table class="w-full text-sm border-collapse">
    <thead>
      <tr class="bg-slate-100">
        <th class="border border-slate-200 px-3 py-2 text-center w-8">#</th>
        <th class="border border-slate-200 px-3 py-2 text-left">헤드라인</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</div>`;
}

// ─── 메인 ─────────────────────────────────────────────────────
async function main() {
  const date   = today();
  const slug   = `social-${PERIOD}-${date}`;
  const fmtDate = formatDate(date);
  const label  = { daily: "오늘", weekly: "이번 주", monthly: "이번 달" }[PERIOD] || PERIOD;

  console.log(`사회 정세 뉴스 수집 | 기간: ${PERIOD} | 날짜: ${date}`);

  const results = await Promise.all(CATEGORIES.map(fetchCategory));

  let content = "";
  CATEGORIES.forEach((cat, i) => { content += buildSection(cat, results[i]); });

  const totalItems  = results.reduce((s, r) => s + r.length, 0);
  const topHeadlines = results
    .flat()
    .slice(0, 2)
    .map((i) => i.title.substring(0, 20))
    .join(", ");

  content += `\n<p class="text-xs text-slate-400 mt-8">※ 데이터 출처: Google News (${date} 기준). 본 내용은 정보 제공 목적이며 특정 의견을 대변하지 않습니다.</p>`;

  if (!totalItems) {
    console.error("❌ 수집된 뉴스 없음 — 저장 건너뜀");
    process.exit(1);
  }

  const newArticle = {
    slug,
    title:   `사회 정세 ${fmtDate} — 정치·경제·사회·국제 주요 뉴스`,
    date,
    period:  PERIOD,
    summary: topHeadlines || `${label}의 국내외 주요 뉴스 ${totalItems}건`,
    content,
  };

  let existing = [];
  if (fs.existsSync(DATA_PATH)) {
    existing = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  }

  const idx = existing.findIndex((a) => a.slug === slug);
  if (idx >= 0) {
    existing[idx] = newArticle;
    console.log("기존 글 업데이트");
  } else {
    existing.unshift(newArticle);
    console.log("새 글 추가");
  }

  existing = existing.slice(0, 90);
  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2), "utf-8");
  console.log(`✅ ${DATA_PATH} 저장 완료 (${totalItems}개 뉴스)`);
}

main().catch((err) => {
  console.error("❌ 오류:", err.message);
  process.exit(1);
});
