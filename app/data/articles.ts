export type Article = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string; // HTML string
};

export type Category = "stocks" | "bitcoin" | "social";

export const articles: Record<Category, Article[]> = {
  stocks: [],
  social: [],
  bitcoin: [
    {
      slug: "crypto-daily-2026-04-05",
      title: "코인 시황 2026.04.05 — 상승 Top 10 / 하락 Top 10",
      date: "2026-04-05",
      summary:
        "SIREN +282.9%, StakeStone +76.1% 등 급등 코인과 edgeX -25.4%, Cysic -20.7% 등 급락 코인 및 관련 투자 스토리를 정리합니다.",
      content: `
<h2 class="text-xl font-bold mb-3 mt-6">📈 오늘의 상승 코인 Top 10</h2>
<div class="overflow-x-auto mb-6">
  <table class="w-full text-sm border-collapse">
    <thead>
      <tr class="bg-green-50">
        <th class="border border-slate-200 px-3 py-2 text-left">순위</th>
        <th class="border border-slate-200 px-3 py-2 text-left">코인</th>
        <th class="border border-slate-200 px-3 py-2 text-left">심볼</th>
        <th class="border border-slate-200 px-3 py-2 text-right text-green-700">24h 등락률</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="border border-slate-200 px-3 py-2">1</td><td class="border border-slate-200 px-3 py-2">Siren</td><td class="border border-slate-200 px-3 py-2 font-mono">SIREN</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+282.9%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">2</td><td class="border border-slate-200 px-3 py-2">StakeStone</td><td class="border border-slate-200 px-3 py-2 font-mono">STO</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+76.1%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">3</td><td class="border border-slate-200 px-3 py-2">Janction</td><td class="border border-slate-200 px-3 py-2 font-mono">JCT</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+60.0%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">4</td><td class="border border-slate-200 px-3 py-2">Pippin</td><td class="border border-slate-200 px-3 py-2 font-mono">PIPPIN</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+37.7%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">5</td><td class="border border-slate-200 px-3 py-2">Arcblock</td><td class="border border-slate-200 px-3 py-2 font-mono">ABT</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+31.2%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">6</td><td class="border border-slate-200 px-3 py-2">Perle</td><td class="border border-slate-200 px-3 py-2 font-mono">PRL</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+21.1%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">7</td><td class="border border-slate-200 px-3 py-2">Yooldo Games</td><td class="border border-slate-200 px-3 py-2 font-mono">ESPORTS</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+20.8%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">8</td><td class="border border-slate-200 px-3 py-2">Polymesh</td><td class="border border-slate-200 px-3 py-2 font-mono">POLYX</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+16.1%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">9</td><td class="border border-slate-200 px-3 py-2">Sahara AI</td><td class="border border-slate-200 px-3 py-2 font-mono">SAHARA</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+15.1%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">10</td><td class="border border-slate-200 px-3 py-2">Core</td><td class="border border-slate-200 px-3 py-2 font-mono">CORE</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+14.7%</td></tr>
    </tbody>
  </table>
</div>

<h2 class="text-xl font-bold mb-3 mt-6">📉 오늘의 하락 코인 Top 10</h2>
<div class="overflow-x-auto mb-8">
  <table class="w-full text-sm border-collapse">
    <thead>
      <tr class="bg-red-50">
        <th class="border border-slate-200 px-3 py-2 text-left">순위</th>
        <th class="border border-slate-200 px-3 py-2 text-left">코인</th>
        <th class="border border-slate-200 px-3 py-2 text-left">심볼</th>
        <th class="border border-slate-200 px-3 py-2 text-right text-red-700">24h 등락률</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="border border-slate-200 px-3 py-2">1</td><td class="border border-slate-200 px-3 py-2">edgeX</td><td class="border border-slate-200 px-3 py-2 font-mono">EDGE</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-25.4%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">2</td><td class="border border-slate-200 px-3 py-2">Cysic</td><td class="border border-slate-200 px-3 py-2 font-mono">CYS</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-20.7%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">3</td><td class="border border-slate-200 px-3 py-2">TAGGER</td><td class="border border-slate-200 px-3 py-2 font-mono">TAG</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-14.8%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">4</td><td class="border border-slate-200 px-3 py-2">TRIA</td><td class="border border-slate-200 px-3 py-2 font-mono">TRIA</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-13.0%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">5</td><td class="border border-slate-200 px-3 py-2">Unibase</td><td class="border border-slate-200 px-3 py-2 font-mono">UB</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-11.3%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">6</td><td class="border border-slate-200 px-3 py-2">Stargate Finance</td><td class="border border-slate-200 px-3 py-2 font-mono">STG</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-10.2%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">7</td><td class="border border-slate-200 px-3 py-2">MEZO</td><td class="border border-slate-200 px-3 py-2 font-mono">MEZO</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-10.0%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">8</td><td class="border border-slate-200 px-3 py-2">Babylon</td><td class="border border-slate-200 px-3 py-2 font-mono">BABY</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-9.6%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">9</td><td class="border border-slate-200 px-3 py-2">Impossible Cloud Network</td><td class="border border-slate-200 px-3 py-2 font-mono">ICNT</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-8.9%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">10</td><td class="border border-slate-200 px-3 py-2">Audiera</td><td class="border border-slate-200 px-3 py-2 font-mono">BEAT</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-8.6%</td></tr>
    </tbody>
  </table>
</div>

<h2 class="text-xl font-bold mb-4 mt-8">💬 오늘의 급등 코인 관련 투자 이야기</h2>

<div class="space-y-5">
  <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
    <p class="font-semibold text-amber-800 mb-1">🔥 SIREN, 하루 만에 +282% — "한 달 치 월급이 하루 만에"</p>
    <p class="text-sm text-slate-700 leading-relaxed">SIREN은 2026년 3월 말부터 시장의 주목을 받기 시작했습니다. 3월 22일 역대 최고가 $3.61을 기록한 후 조정을 받았지만, 4월 5일 다시 폭발적인 상승세를 보이며 하루 만에 282%를 돌파했습니다. 해외 커뮤니티에서는 "3월 중순 $0.1대에 분할 매수한 후 오늘 일부를 정리했다. 초기 투자금 대비 20배 이상 수익"이라는 글이 화제가 됐습니다. 그러나 MEXC, WEEX 등 분석 기관들은 "단기 급등 이후 차익 실현 매물이 쏟아질 수 있다"며 신규 진입에 주의를 요구했습니다.</p>
  </div>

  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <p class="font-semibold text-blue-800 mb-1">📊 StakeStone(STO) +76% — 900% 급등 이후 재반등</p>
    <p class="text-sm text-slate-700 leading-relaxed">STO는 4월 2일 $1.74까지 900% 폭등했다가 60% 급락하는 극적인 흐름을 보였습니다. 오늘 다시 76% 반등하며 눈길을 끌었습니다. CryptoTimes 보도에 따르면, 당시 단기 트레이더 중 일부는 $0.25 매수 후 $1.5대에 매도해 "5배 수익을 챙겼다"는 증언이 있었습니다. 다만 고점 근처에서 진입한 투자자들은 큰 손실을 입은 것으로 알려졌으며, 전문가들은 "토큰 언락 물량이 남아 있어 추격 매수는 위험하다"고 경고하고 있습니다.</p>
  </div>

  <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
    <p class="font-semibold text-purple-800 mb-1">🎮 Yooldo Games(ESPORTS) +20% — 게임파이 섹터 동반 강세</p>
    <p class="text-sm text-slate-700 leading-relaxed">ESPORTS는 게임파이(GameFi) 섹터의 관심이 높아지면서 오늘 20.8% 상승했습니다. 소규모 투자자 커뮤니티에서는 "게임파이 테마 ETF처럼 분산해 ESPORTS·CORE 등을 소액 매수했는데 둘 다 10~20% 올라 하루에 포트 수익률이 크게 개선됐다"는 후기가 공유됐습니다. 단, 유동성이 낮은 소형 코인이라 변동성이 크고 주의가 필요합니다.</p>
  </div>
</div>

<p class="text-xs text-slate-400 mt-8">※ 데이터 출처: CoinGecko, CoinMarketCap (2026-04-05 기준). 본 내용은 투자 권유가 아니며 투자 손실에 대한 책임은 투자자 본인에게 있습니다.</p>
`,
    },
    {
      slug: "crypto-daily-2026-04-04",
      title: "코인 시황 2026.04.04 — 상승 Top 10 / 하락 Top 10",
      date: "2026-04-04",
      summary:
        "edgeX(EDGE) +34.7% 선두, ALGO·TRAC·THETA 동반 상승. 전체 시총 2.38조 달러 횡보 속 섹터별 차별화 장세.",
      content: `
<h2 class="text-xl font-bold mb-3 mt-6">📈 오늘의 상승 코인 Top 10</h2>
<div class="overflow-x-auto mb-6">
  <table class="w-full text-sm border-collapse">
    <thead>
      <tr class="bg-green-50">
        <th class="border border-slate-200 px-3 py-2 text-left">순위</th>
        <th class="border border-slate-200 px-3 py-2 text-left">코인</th>
        <th class="border border-slate-200 px-3 py-2 text-left">심볼</th>
        <th class="border border-slate-200 px-3 py-2 text-right text-green-700">24h 등락률</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="border border-slate-200 px-3 py-2">1</td><td class="border border-slate-200 px-3 py-2">edgeX</td><td class="border border-slate-200 px-3 py-2 font-mono">EDGE</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+34.70%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">2</td><td class="border border-slate-200 px-3 py-2">Algorand</td><td class="border border-slate-200 px-3 py-2 font-mono">ALGO</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+11.74%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">3</td><td class="border border-slate-200 px-3 py-2">OriginTrail</td><td class="border border-slate-200 px-3 py-2 font-mono">TRAC</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+11.17%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">4</td><td class="border border-slate-200 px-3 py-2">Theta Network</td><td class="border border-slate-200 px-3 py-2 font-mono">THETA</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+11.03%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">5</td><td class="border border-slate-200 px-3 py-2">Sei</td><td class="border border-slate-200 px-3 py-2 font-mono">SEI</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+5.81%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">6</td><td class="border border-slate-200 px-3 py-2">Bitcoin SV</td><td class="border border-slate-200 px-3 py-2 font-mono">BSV</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+5.30%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">7</td><td class="border border-slate-200 px-3 py-2">VeChain</td><td class="border border-slate-200 px-3 py-2 font-mono">VET</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+4.80%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">8</td><td class="border border-slate-200 px-3 py-2">PancakeSwap</td><td class="border border-slate-200 px-3 py-2 font-mono">CAKE</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+4.20%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">9</td><td class="border border-slate-200 px-3 py-2">NEAR Protocol</td><td class="border border-slate-200 px-3 py-2 font-mono">NEAR</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+3.90%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">10</td><td class="border border-slate-200 px-3 py-2">Zebec Network</td><td class="border border-slate-200 px-3 py-2 font-mono">ZBC</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+3.50%</td></tr>
    </tbody>
  </table>
</div>

<h2 class="text-xl font-bold mb-3 mt-6">📉 오늘의 하락 코인 Top 10</h2>
<div class="overflow-x-auto mb-8">
  <table class="w-full text-sm border-collapse">
    <thead>
      <tr class="bg-red-50">
        <th class="border border-slate-200 px-3 py-2 text-left">순위</th>
        <th class="border border-slate-200 px-3 py-2 text-left">코인</th>
        <th class="border border-slate-200 px-3 py-2 text-left">심볼</th>
        <th class="border border-slate-200 px-3 py-2 text-right text-red-700">24h 등락률</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="border border-slate-200 px-3 py-2">1</td><td class="border border-slate-200 px-3 py-2">ZeroLend</td><td class="border border-slate-200 px-3 py-2 font-mono">ZRO</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-8.49%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">2</td><td class="border border-slate-200 px-3 py-2">Fetch.ai</td><td class="border border-slate-200 px-3 py-2 font-mono">FET</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-6.00%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">3</td><td class="border border-slate-200 px-3 py-2">Hyperliquid</td><td class="border border-slate-200 px-3 py-2 font-mono">HYPE</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-5.05%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">4</td><td class="border border-slate-200 px-3 py-2">Hedera</td><td class="border border-slate-200 px-3 py-2 font-mono">HBAR</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-5.54%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">5</td><td class="border border-slate-200 px-3 py-2">Morpho</td><td class="border border-slate-200 px-3 py-2 font-mono">MORPHO</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-4.86%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">6</td><td class="border border-slate-200 px-3 py-2">Midnight</td><td class="border border-slate-200 px-3 py-2 font-mono">NIGHT</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-4.36%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">7</td><td class="border border-slate-200 px-3 py-2">JUST</td><td class="border border-slate-200 px-3 py-2 font-mono">JST</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-3.60%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">8</td><td class="border border-slate-200 px-3 py-2">Monero</td><td class="border border-slate-200 px-3 py-2 font-mono">XMR</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-3.48%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">9</td><td class="border border-slate-200 px-3 py-2">BNB</td><td class="border border-slate-200 px-3 py-2 font-mono">BNB</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-3.20%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">10</td><td class="border border-slate-200 px-3 py-2">StakeStone</td><td class="border border-slate-200 px-3 py-2 font-mono">STO</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-2.90%</td></tr>
    </tbody>
  </table>
</div>

<h2 class="text-xl font-bold mb-4 mt-8">💬 오늘의 급등 코인 관련 투자 이야기</h2>

<div class="space-y-5">
  <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
    <p class="font-semibold text-amber-800 mb-1">⚡ edgeX(EDGE) 3일 연속 급등 — "적립식 매수로 75% 수익"</p>
    <p class="text-sm text-slate-700 leading-relaxed">edgeX는 3월 31일 최저점에서 오늘까지 3거래일 연속 상승하며 누적 75.73%의 수익률을 기록했습니다. BlockchainMagazine 보도에 따르면 EDGE는 4월 1일 25%, 4월 2일 20.5%, 4월 3일 21.4%, 오늘 34.7%로 연속 강세를 보였습니다. 해외 트레이더 커뮤니티에서는 "3월 말 저점에서 분할 매수 후 오늘 절반 정리, 투자금 대비 60% 이상 수익 실현"이라는 후기가 공유되며 화제가 됐습니다. edgeX는 24/7 탈중앙화 거래 인프라를 제공하는 프로젝트로, 거래량 $8000억 돌파와 사용자 30만명 달성 소식이 상승 동력으로 작용했습니다.</p>
  </div>

  <div class="bg-green-50 border border-green-200 rounded-lg p-4">
    <p class="font-semibold text-green-800 mb-1">🔵 Algorand(ALGO) 이틀 연속 두 자릿수 상승 — "오래 기다린 보람"</p>
    <p class="text-sm text-slate-700 leading-relaxed">ALGO는 4월 3일 +7.68%에 이어 오늘 +11.74%로 이틀 연속 강세를 보였습니다. CoinGabbar 보도에 따르면 거래량 $215M을 기록하며 시장 전반이 약세인 가운데 역행 상승했습니다. 국내 커뮤니티에서는 "알고란드를 2년 넘게 홀딩했는데 드디어 움직인다. 오늘 일부 익절해서 수익 실현했다"는 글이 주목받았습니다. 알고란드는 최근 DeFi 생태계 확장과 기관 파트너십 소식이 이어지며 재평가받고 있습니다.</p>
  </div>
</div>

<p class="text-xs text-slate-400 mt-8">※ 데이터 출처: CoinGabbar, CoinCodex, CoinMarketCap (2026-04-04 기준). 본 내용은 투자 권유가 아니며 투자 손실에 대한 책임은 투자자 본인에게 있습니다.</p>
`,
    },
    {
      slug: "crypto-daily-2026-04-03",
      title: "코인 시황 2026.04.03 — 상승 Top 10 / 하락 Top 10",
      date: "2026-04-03",
      summary:
        "ZND +180%, Cartesi +88% 등 중소형 코인 강세. 전체 시총 2.38조 달러 -2.4% 하락 속 DRIFT 해킹 사태로 공포 지수 9 기록.",
      content: `
<h2 class="text-xl font-bold mb-3 mt-6">📈 오늘의 상승 코인 Top 10</h2>
<div class="overflow-x-auto mb-6">
  <table class="w-full text-sm border-collapse">
    <thead>
      <tr class="bg-green-50">
        <th class="border border-slate-200 px-3 py-2 text-left">순위</th>
        <th class="border border-slate-200 px-3 py-2 text-left">코인</th>
        <th class="border border-slate-200 px-3 py-2 text-left">심볼</th>
        <th class="border border-slate-200 px-3 py-2 text-right text-green-700">24h 등락률</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="border border-slate-200 px-3 py-2">1</td><td class="border border-slate-200 px-3 py-2">Zend</td><td class="border border-slate-200 px-3 py-2 font-mono">ZND</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+180.90%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">2</td><td class="border border-slate-200 px-3 py-2">Cartesi</td><td class="border border-slate-200 px-3 py-2 font-mono">CTSI</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+88.84%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">3</td><td class="border border-slate-200 px-3 py-2">Neutron</td><td class="border border-slate-200 px-3 py-2 font-mono">NTRN</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+47.19%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">4</td><td class="border border-slate-200 px-3 py-2">Solv Protocol</td><td class="border border-slate-200 px-3 py-2 font-mono">SOLV</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+37.06%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">5</td><td class="border border-slate-200 px-3 py-2">BR</td><td class="border border-slate-200 px-3 py-2 font-mono">BR</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+32.71%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">6</td><td class="border border-slate-200 px-3 py-2">REVU</td><td class="border border-slate-200 px-3 py-2 font-mono">REVU</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+26.84%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">7</td><td class="border border-slate-200 px-3 py-2">Algorand</td><td class="border border-slate-200 px-3 py-2 font-mono">ALGO</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+7.68%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">8</td><td class="border border-slate-200 px-3 py-2">MemeCore</td><td class="border border-slate-200 px-3 py-2 font-mono">M</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+7.51%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">9</td><td class="border border-slate-200 px-3 py-2">Quant</td><td class="border border-slate-200 px-3 py-2 font-mono">QNT</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+5.57%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">10</td><td class="border border-slate-200 px-3 py-2">Ethereum Classic</td><td class="border border-slate-200 px-3 py-2 font-mono">ETC</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-green-600">+4.20%</td></tr>
    </tbody>
  </table>
</div>

<h2 class="text-xl font-bold mb-3 mt-6">📉 오늘의 하락 코인 Top 10</h2>
<div class="overflow-x-auto mb-8">
  <table class="w-full text-sm border-collapse">
    <thead>
      <tr class="bg-red-50">
        <th class="border border-slate-200 px-3 py-2 text-left">순위</th>
        <th class="border border-slate-200 px-3 py-2 text-left">코인</th>
        <th class="border border-slate-200 px-3 py-2 text-left">심볼</th>
        <th class="border border-slate-200 px-3 py-2 text-right text-red-700">24h 등락률</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="border border-slate-200 px-3 py-2">1</td><td class="border border-slate-200 px-3 py-2">Drift Protocol</td><td class="border border-slate-200 px-3 py-2 font-mono">DRIFT</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-40.00%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">2</td><td class="border border-slate-200 px-3 py-2">Uniswap</td><td class="border border-slate-200 px-3 py-2 font-mono">UNI</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-10.74%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">3</td><td class="border border-slate-200 px-3 py-2">Ethena</td><td class="border border-slate-200 px-3 py-2 font-mono">ENA</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-9.35%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">4</td><td class="border border-slate-200 px-3 py-2">Midnight</td><td class="border border-slate-200 px-3 py-2 font-mono">NIGHT</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-6.87%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">5</td><td class="border border-slate-200 px-3 py-2">StakeStone</td><td class="border border-slate-200 px-3 py-2 font-mono">STO</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-49.80%*</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">6</td><td class="border border-slate-200 px-3 py-2">BNB</td><td class="border border-slate-200 px-3 py-2 font-mono">BNB</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-3.75%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">7</td><td class="border border-slate-200 px-3 py-2">XRP</td><td class="border border-slate-200 px-3 py-2 font-mono">XRP</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-1.57%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">8</td><td class="border border-slate-200 px-3 py-2">Bitcoin</td><td class="border border-slate-200 px-3 py-2 font-mono">BTC</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-0.82%</td></tr>
      <tr><td class="border border-slate-200 px-3 py-2">9</td><td class="border border-slate-200 px-3 py-2">Ethereum</td><td class="border border-slate-200 px-3 py-2 font-mono">ETH</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-0.75%</td></tr>
      <tr class="bg-slate-50"><td class="border border-slate-200 px-3 py-2">10</td><td class="border border-slate-200 px-3 py-2">Solana</td><td class="border border-slate-200 px-3 py-2 font-mono">SOL</td><td class="border border-slate-200 px-3 py-2 text-right font-semibold text-red-600">-0.60%</td></tr>
    </tbody>
  </table>
  <p class="text-xs text-slate-400 mt-1">* STO는 4월 2일 $1.74 고점 대비 기준</p>
</div>

<h2 class="text-xl font-bold mb-4 mt-8">💬 오늘의 급등 코인 관련 투자 이야기</h2>

<div class="space-y-5">
  <div class="bg-red-50 border border-red-200 rounded-lg p-4">
    <p class="font-semibold text-red-800 mb-1">⚠️ DRIFT 해킹 -40% 충격 — "시장 전체가 두려움에 빠졌다"</p>
    <p class="text-sm text-slate-700 leading-relaxed">오늘 가장 큰 이슈는 Drift Protocol이 해킹 공격을 받아 24시간 만에 40% 폭락한 사건입니다. 이로 인해 시장 전체의 공포 지수(Fear & Greed Index)가 9를 기록하며 '극단적 공포' 상태에 진입했습니다. CoinGabbar에 따르면 전체 암호화폐 시총이 2.38조 달러로 2.4% 하락했습니다. 해킹 피해를 입은 투자자들은 커뮤니티에서 "분산 투자와 하드웨어 지갑 보관의 중요성을 다시 느꼈다"는 반응을 보였습니다.</p>
  </div>

  <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
    <p class="font-semibold text-amber-800 mb-1">🚀 Cartesi(CTSI) +88% 급등 — "Rollups V2 기대감 폭발"</p>
    <p class="text-sm text-slate-700 leading-relaxed">CTSI는 오늘 하루 동안 88.84%라는 경이로운 상승률을 기록했습니다. 이는 카르테시의 Rollups V2, Node V2 등 기술 업그레이드 마일스톤이 임박했다는 소식이 촉매가 됐습니다. 해외 암호화폐 커뮤니티에서는 "수개월 전부터 조금씩 모아온 CTSI가 오늘 한 방에 터졌다. 연간 목표 수익률을 하루 만에 달성했다"는 글이 빠르게 퍼졌습니다. 다만 전문가들은 "개발 이슈나 일정 지연 시 급반락 가능성이 있으니 수익 실현 계획을 세워두는 것이 중요하다"고 조언했습니다.</p>
  </div>

  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <p class="font-semibold text-blue-800 mb-1">💡 Zend(ZND) +180% — "KuCoin 단독 급등, 유동성 함정 주의"</p>
    <p class="text-sm text-slate-700 leading-relaxed">ZND는 KuCoin 기준 180.90%라는 압도적 상승률을 기록했지만, 이는 주로 특정 거래소 내 유동성이 낮은 상황에서 발생한 급등입니다. 실제로 거래 가능한 물량이 적어 소수 매수만으로도 가격이 크게 움직일 수 있었습니다. 일부 투자자는 "소액으로 큰 수익을 봤다"고 전하지만, 분석가들은 "이런 패턴은 대규모 차익 실현 시 순식간에 원상복구될 위험이 크다"고 경고했습니다. Nestree 리포트에 따르면 공포 구간에서 DCA(분할 매수) 전략을 쓴 투자자들이 평균 202%의 수익을 기록했다는 통계도 있습니다.</p>
  </div>
</div>

<p class="text-xs text-slate-400 mt-8">※ 데이터 출처: KuCoin, CoinGabbar, CoinGecko (2026-04-03 기준). 본 내용은 투자 권유가 아니며 투자 손실에 대한 책임은 투자자 본인에게 있습니다.</p>
`,
    },
  ],
};

export function getArticle(category: Category, slug: string): Article | undefined {
  return articles[category]?.find((a) => a.slug === slug);
}
