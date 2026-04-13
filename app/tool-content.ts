export type LangText = {
  ko: string;
  en: string;
};

export type ToolCategoryId =
  | "date-tools"
  | "text-tools"
  | "image-tools"
  | "life-tools"
  | "random-tools";

export type ToolAccent = "blue" | "green" | "orange" | "violet";

export type ToolDefinition = {
  href: string;
  icon: string;
  categoryId: ToolCategoryId;
  title: LangText;
  description: LangText;
  badge: LangText;
  keywords: string[];
  featured?: boolean;
  discover?: boolean;
};

export type CategoryDefinition = {
  id: ToolCategoryId;
  href: string;
  icon: string;
  accent: ToolAccent;
  title: LangText;
  description: LangText;
  countLabel: LangText;
  examples: LangText[];
};

export const categories: CategoryDefinition[] = [
  {
    id: "date-tools",
    href: "/#date-tools",
    icon: "🗓️",
    accent: "blue",
    title: { ko: "날짜 · 기간", en: "Dates & Time" },
    description: {
      ko: "날짜 계산과 기간 측정을 빠르게 처리합니다.",
      en: "Quick tools for dates, durations, and milestones.",
    },
    countLabel: { ko: "6개 도구", en: "6 tools" },
    examples: [
      { ko: "만 나이 계산기", en: "Korean age calculator" },
      { ko: "날짜 더하기/빼기", en: "Add / subtract days" },
      { ko: "날짜 차이 계산기", en: "Date difference" },
      { ko: "요일 계산기", en: "Day of week" },
      { ko: "디데이 계산기", en: "D-Day calculator" },
      { ko: "기념일 계산기", en: "Anniversary calculator" },
    ],
  },
  {
    id: "text-tools",
    href: "/#text-tools",
    icon: "✏️",
    accent: "green",
    title: { ko: "텍스트 도구", en: "Text Tools" },
    description: {
      ko: "글자 수, 변환, 한글 입력 보정에 집중합니다.",
      en: "Text counting, conversion, and Korean typing helpers.",
    },
    countLabel: { ko: "11개 도구", en: "11 tools" },
    examples: [
      { ko: "QR코드 생성기", en: "QR code generator" },
      { ko: "글자수 세기", en: "Character counter" },
      { ko: "줄바꿈 제거기", en: "Line break remover" },
      { ko: "JSON 포매터", en: "JSON formatter" },
      { ko: "URL 인코더/디코더", en: "URL encoder / decoder" },
    ],
  },
  {
    id: "image-tools",
    href: "/#image-tools",
    icon: "🖼️",
    accent: "orange",
    title: { ko: "이미지 도구", en: "Image Tools" },
    description: {
      ko: "브라우저에서 바로 이미지 최적화를 처리합니다.",
      en: "In-browser image optimization without extra setup.",
    },
    countLabel: { ko: "8개 도구", en: "8 tools" },
    examples: [
      { ko: "이미지 압축기", en: "Image compressor" },
      { ko: "이미지 → WebP 변환", en: "Image to WebP" },
      { ko: "이미지 리사이즈", en: "Image resize" },
      { ko: "색상 팔레트 추출", en: "Color palette extractor" },
      { ko: "HEX ↔ RGB 변환기", en: "HEX / RGB converter" },
    ],
  },
  {
    id: "life-tools",
    href: "/#life-tools",
    icon: "🧮",
    accent: "violet",
    title: { ko: "생활 계산", en: "Life Calculators" },
    description: {
      ko: "건강, 금융, 생활 계산을 한곳에 모았습니다.",
      en: "Everyday health and finance calculations in one place.",
    },
    countLabel: { ko: "10개 도구", en: "10 tools" },
    examples: [
      { ko: "실수령액 계산기", en: "Net pay calculator" },
      { ko: "주휴수당 계산기", en: "Weekly holiday pay calculator" },
      { ko: "연차 계산기", en: "Annual leave calculator" },
      { ko: "할인율 계산기", en: "Discount calculator" },
      { ko: "스타벅스 별 쿠폰 비교기", en: "Starbucks rewards coupon picker" },
    ],
  },
  {
    id: "random-tools",
    href: "/#random-tools",
    icon: "🎲",
    accent: "orange",
    title: { ko: "랜덤 · 결정", en: "Random & Decide" },
    description: {
      ko: "사다리타기, 메뉴 고르기, 랜덤 뽑기로 빠르게 결정하세요.",
      en: "Ladder game, meal picker, and random draws for quick decisions.",
    },
    countLabel: { ko: "3개 도구", en: "3 tools" },
    examples: [
      { ko: "사다리타기", en: "Ladder game" },
      { ko: "오늘 뭐 먹지?", en: "What to eat?" },
      { ko: "랜덤 뽑기 / 복불복", en: "Random picker" },
    ],
  },
];

export const tools: ToolDefinition[] = [
  {
    href: "/age",
    icon: "🎂",
    categoryId: "date-tools",
    title: { ko: "만 나이 계산기", en: "Korean Age Calculator" },
    description: {
      ko: "생년월일을 기준으로 만 나이와 관련 정보를 계산합니다.",
      en: "Calculate international age and related details from your birth date.",
    },
    badge: { ko: "날짜", en: "Date" },
    keywords: ["만나이", "만 나이", "생년월일", "age", "birthday"],
    featured: true,
  },
  {
    href: "/date-calc",
    icon: "📅",
    categoryId: "date-tools",
    title: { ko: "날짜 더하기/빼기", en: "Date Add / Subtract" },
    description: {
      ko: "기준 날짜에 원하는 일수를 더하거나 빼서 결과 날짜를 계산합니다.",
      en: "Add or subtract days from any date to find the result date.",
    },
    badge: { ko: "날짜", en: "Date" },
    keywords: ["날짜 계산", "100일", "일수 계산", "date add", "date subtract", "days from date"],
    featured: true,
  },
  {
    href: "/date-diff",
    icon: "📆",
    categoryId: "date-tools",
    title: { ko: "날짜 차이 계산기", en: "Date Difference Calculator" },
    description: {
      ko: "두 날짜 사이가 며칠인지, 몇 주인지, 몇 개월인지 바로 계산합니다.",
      en: "Find out how many days, weeks, or months lie between two dates.",
    },
    badge: { ko: "날짜", en: "Date" },
    keywords: ["날짜 차이", "기간 계산", "며칠", "date difference", "days between"],
    discover: true,
  },
  {
    href: "/weekday",
    icon: "🗓️",
    categoryId: "date-tools",
    title: { ko: "요일 계산기", en: "Day of Week Calculator" },
    description: {
      ko: "특정 날짜가 무슨 요일인지, 올해 몇 주차인지 바로 확인합니다.",
      en: "Check what day of the week any date falls on.",
    },
    badge: { ko: "날짜", en: "Date" },
    keywords: ["요일", "무슨 요일", "주차", "day of week", "weekday calculator"],
    discover: true,
  },
  {
    href: "/dday",
    icon: "🎯",
    categoryId: "date-tools",
    title: { ko: "디데이 계산기", en: "D-Day Calculator" },
    description: {
      ko: "목표일까지 남은 날짜를 빠르게 확인할 수 있습니다.",
      en: "Track days left until an important date.",
    },
    badge: { ko: "날짜", en: "Date" },
    keywords: ["디데이", "d-day", "countdown", "날짜"],
    featured: true,
  },
  {
    href: "/anniversary",
    icon: "💍",
    categoryId: "date-tools",
    title: { ko: "기념일 계산기", en: "Anniversary Calculator" },
    description: {
      ko: "100일, 1주년 같은 기념일을 자동으로 계산합니다.",
      en: "Calculate milestone anniversaries such as day 100 and yearly dates.",
    },
    badge: { ko: "날짜", en: "Date" },
    keywords: ["기념일", "100일", "anniversary", "date milestone"],
    featured: true,
  },
  {
    href: "/characters",
    icon: "🔤",
    categoryId: "text-tools",
    title: { ko: "글자수 세기", en: "Character Counter" },
    description: {
      ko: "글자수, 단어 수, 줄 수를 바로 확인할 수 있습니다.",
      en: "Instantly count characters, words, and lines.",
    },
    badge: { ko: "텍스트", en: "Text" },
    keywords: ["글자수", "텍스트", "문자수", "character", "word count"],
    featured: true,
  },
  {
    href: "/image-compress",
    icon: "🗜️",
    categoryId: "image-tools",
    title: { ko: "이미지 압축기", en: "Image Compressor" },
    description: {
      ko: "브라우저에서 바로 이미지 용량을 줄입니다.",
      en: "Compress image files directly in your browser.",
    },
    badge: { ko: "이미지", en: "Image" },
    keywords: ["이미지", "압축", "jpg", "png", "compress"],
    featured: true,
  },
  {
    href: "/complementary-color",
    icon: "🎨",
    categoryId: "image-tools",
    title: { ko: "보색 찾기", en: "Complementary Color Finder" },
    description: {
      ko: "화면이나 이미지에서 색을 선택하고 보색, HEX, RGB를 확인합니다.",
      en: "Pick a color from your screen or an image and get its complementary color.",
    },
    badge: { ko: "이미지", en: "Image" },
    keywords: ["보색", "색상", "컬러", "스포이드", "eyedropper", "complementary color"],
    discover: true,
  },
  {
    href: "/image-to-webp",
    icon: "🪄",
    categoryId: "image-tools",
    title: { ko: "이미지 → WebP 변환", en: "Image to WebP" },
    description: {
      ko: "JPG와 PNG 이미지를 WebP로 변환해 용량과 포맷을 정리합니다.",
      en: "Convert JPG and PNG images into WebP directly in the browser.",
    },
    badge: { ko: "이미지", en: "Image" },
    keywords: ["webp", "image to webp", "jpg webp", "png webp", "이미지 변환"],
    featured: true,
  },
  {
    href: "/image-resize",
    icon: "📐",
    categoryId: "image-tools",
    title: { ko: "이미지 리사이즈", en: "Image Resize" },
    description: {
      ko: "이미지 크기를 픽셀 또는 비율 기준으로 조절합니다.",
      en: "Resize images by exact pixels or by scale percentage.",
    },
    badge: { ko: "이미지", en: "Image" },
    keywords: ["image resize", "resize image", "픽셀 조절", "이미지 크기 변경", "리사이즈"],
    featured: true,
  },
  {
    href: "/image-to-base64",
    icon: "🧬",
    categoryId: "image-tools",
    title: { ko: "이미지 → Base64", en: "Image to Base64" },
    description: {
      ko: "이미지를 Data URL과 Base64 문자열로 변환합니다.",
      en: "Convert image files into Data URLs and raw Base64 strings.",
    },
    badge: { ko: "이미지", en: "Image" },
    keywords: ["image base64", "data url", "이미지 base64", "base64 image", "img to base64"],
    discover: true,
  },
  {
    href: "/color-palette",
    icon: "🧪",
    categoryId: "image-tools",
    title: { ko: "색상 팔레트 추출", en: "Color Palette Extractor" },
    description: {
      ko: "이미지에서 주요 색상을 뽑아 HEX와 RGB로 확인합니다.",
      en: "Extract the main colors from an image and inspect them in HEX and RGB.",
    },
    badge: { ko: "색상", en: "Color" },
    keywords: ["palette", "color palette", "색상 추출", "dominant colors", "컬러 팔레트"],
    featured: true,
  },
  {
    href: "/hex-rgb",
    icon: "🎯",
    categoryId: "image-tools",
    title: { ko: "HEX ↔ RGB 변환기", en: "HEX / RGB Converter" },
    description: {
      ko: "HEX 코드와 RGB 값을 양방향으로 변환합니다.",
      en: "Convert HEX color codes and RGB values in both directions.",
    },
    badge: { ko: "색상", en: "Color" },
    keywords: ["hex rgb", "rgb hex", "color converter", "색상 코드", "hex 변환"],
    featured: true,
  },
  {
    href: "/image-to-pdf",
    icon: "📄",
    categoryId: "image-tools",
    title: { ko: "이미지 → PDF", en: "Image to PDF" },
    description: {
      ko: "여러 이미지를 한 개의 PDF 문서로 묶어서 저장합니다.",
      en: "Bundle several images into one PDF document.",
    },
    badge: { ko: "이미지", en: "Image" },
    keywords: ["image pdf", "jpg to pdf", "png to pdf", "이미지 pdf", "사진 pdf"],
    discover: true,
  },
  {
    href: "/bmi",
    icon: "⚖️",
    categoryId: "life-tools",
    title: { ko: "BMI 계산기", en: "BMI Calculator" },
    description: {
      ko: "체질량지수와 기초 칼로리 정보를 함께 확인합니다.",
      en: "Check BMI together with basic calorie estimates.",
    },
    badge: { ko: "생활 계산", en: "Life" },
    keywords: ["bmi", "체질량지수", "칼로리", "health", "weight"],
    featured: true,
  },
  {
    href: "/loan",
    icon: "🏦",
    categoryId: "life-tools",
    title: { ko: "대출 이자 계산기", en: "Loan Interest Calculator" },
    description: {
      ko: "월 상환액과 총 이자를 간단히 계산합니다.",
      en: "Estimate monthly payments and total interest.",
    },
    badge: { ko: "생활 계산", en: "Life" },
    keywords: ["대출", "이자", "loan", "interest", "mortgage"],
    featured: true,
  },
  {
    href: "/severance",
    icon: "💼",
    categoryId: "life-tools",
    title: { ko: "퇴직금 계산기", en: "Severance Pay Calculator" },
    description: {
      ko: "근속기간과 급여를 기준으로 퇴직금을 계산합니다.",
      en: "Calculate severance pay from salary and tenure.",
    },
    badge: { ko: "생활 계산", en: "Life" },
    keywords: ["퇴직금", "severance", "salary", "tenure"],
    featured: true,
  },
  {
    href: "/net-pay",
    icon: "💰",
    categoryId: "life-tools",
    title: { ko: "실수령액 계산기", en: "Net Pay Calculator" },
    description: {
      ko: "세전 월급과 비과세 금액을 기준으로 예상 실수령액을 계산합니다.",
      en: "Estimate monthly take-home pay from gross salary and non-taxable income.",
    },
    badge: { ko: "생활 계산", en: "Life" },
    keywords: ["실수령액", "월급 계산", "세후 월급", "net pay", "salary calculator"],
    featured: true,
  },
  {
    href: "/weekly-holiday-pay",
    icon: "🗓️",
    categoryId: "life-tools",
    title: { ko: "주휴수당 계산기", en: "Weekly Holiday Pay Calculator" },
    description: {
      ko: "시급과 주 근무시간으로 주휴수당 지급 여부와 예상 금액을 계산합니다.",
      en: "Check eligibility and estimate weekly holiday pay from hourly wage and weekly hours.",
    },
    badge: { ko: "생활 계산", en: "Life" },
    keywords: ["주휴수당", "시급 계산", "알바 급여", "weekly holiday pay", "part-time pay"],
    featured: true,
  },
  {
    href: "/annual-leave",
    icon: "📆",
    categoryId: "life-tools",
    title: { ko: "연차 계산기", en: "Annual Leave Calculator" },
    description: {
      ko: "입사일과 기준일을 기준으로 부여 연차와 잔여 연차를 계산합니다.",
      en: "Estimate granted and remaining annual leave from hire date and reference date.",
    },
    badge: { ko: "생활 계산", en: "Life" },
    keywords: ["연차 계산", "연차휴가", "입사일 연차", "annual leave", "vacation days"],
    featured: true,
  },
  {
    href: "/discount",
    icon: "🏷️",
    categoryId: "life-tools",
    title: { ko: "할인율 계산기", en: "Discount Calculator" },
    description: {
      ko: "정가, 할인가, 할인율 중 두 값을 넣으면 나머지 하나를 계산합니다.",
      en: "Calculate the missing value from original price, sale price, and discount rate.",
    },
    badge: { ko: "생활 계산", en: "Life" },
    keywords: ["할인율", "할인 계산", "세일 계산", "discount calculator", "sale price"],
    discover: true,
  },
  {
    href: "/chosung",
    icon: "ㄱ",
    categoryId: "text-tools",
    title: { ko: "초성 추출기", en: "Initial Consonant Extractor" },
    description: {
      ko: "한글 초성을 빠르게 추출해 검색이나 정리에 활용합니다.",
      en: "Extract Korean initial consonants for search and organization.",
    },
    badge: { ko: "텍스트", en: "Text" },
    keywords: ["초성", "한글", "chosung", "extractor"],
    discover: true,
  },
  {
    href: "/keyboard",
    icon: "⌨️",
    categoryId: "text-tools",
    title: { ko: "키보드 오타 변환기", en: "Keyboard Typo Converter" },
    description: {
      ko: "영문/한글 입력이 엇갈린 텍스트를 빠르게 교정합니다.",
      en: "Fix text typed with the wrong Korean or English keyboard layout.",
    },
    badge: { ko: "텍스트", en: "Text" },
    keywords: ["키보드", "오타", "영타", "한영", "keyboard typo"],
    discover: true,
  },
  {
    href: "/line-break-remover",
    icon: "🧹",
    categoryId: "text-tools",
    title: { ko: "줄바꿈 제거기", en: "Line Break Remover" },
    description: {
      ko: "복사한 텍스트의 줄바꿈을 한 줄 또는 깔끔한 문단으로 정리합니다.",
      en: "Remove unwanted line breaks from copied text in one step.",
    },
    badge: { ko: "텍스트", en: "Text" },
    keywords: ["줄바꿈 제거", "줄바꿈", "개행 제거", "line break remover", "newline"],
    featured: true,
  },
  {
    href: "/case-converter",
    icon: "🔤",
    categoryId: "text-tools",
    title: { ko: "대소문자 변환기", en: "Case Converter" },
    description: {
      ko: "영문 텍스트를 대문자, 소문자, Title Case로 변환합니다.",
      en: "Convert English text into uppercase, lowercase, and title case.",
    },
    badge: { ko: "텍스트", en: "Text" },
    keywords: ["대소문자 변환", "upper lower", "title case", "case converter"],
    discover: true,
  },
  {
    href: "/json-formatter",
    icon: "🧾",
    categoryId: "text-tools",
    title: { ko: "JSON 포매터", en: "JSON Formatter" },
    description: {
      ko: "JSON 들여쓰기, 압축, 오류 확인을 한 번에 처리합니다.",
      en: "Pretty-print, minify, and validate JSON quickly.",
    },
    badge: { ko: "텍스트", en: "Text" },
    keywords: ["json formatter", "json 정렬", "json 압축", "json pretty print"],
    featured: true,
  },
  {
    href: "/base64",
    icon: "🔐",
    categoryId: "text-tools",
    title: { ko: "Base64 인코더/디코더", en: "Base64 Encoder / Decoder" },
    description: {
      ko: "텍스트와 Base64 문자열을 안전하게 상호 변환합니다.",
      en: "Encode text to Base64 or decode Base64 back into text.",
    },
    badge: { ko: "텍스트", en: "Text" },
    keywords: ["base64", "인코더", "디코더", "base64 encode", "base64 decode"],
    discover: true,
  },
  {
    href: "/url-encoder",
    icon: "🔗",
    categoryId: "text-tools",
    title: { ko: "URL 인코더/디코더", en: "URL Encoder / Decoder" },
    description: {
      ko: "한글 URL과 쿼리 문자열을 인코딩하거나 다시 복원합니다.",
      en: "Encode or decode Korean URLs and query strings.",
    },
    badge: { ko: "텍스트", en: "Text" },
    keywords: ["url encode", "url decode", "url 인코딩", "query string", "퍼센트 인코딩"],
    discover: true,
  },
  {
    href: "/markdown-to-html",
    icon: "🧩",
    categoryId: "text-tools",
    title: { ko: "마크다운 → HTML", en: "Markdown to HTML" },
    description: {
      ko: "마크다운을 HTML로 변환하고 실시간 미리보기로 확인합니다.",
      en: "Convert markdown into HTML with a live preview.",
    },
    badge: { ko: "텍스트", en: "Text" },
    keywords: ["markdown", "html 변환", "markdown preview", "markdown to html"],
    discover: true,
  },
  {
    href: "/lorem-ipsum",
    icon: "📄",
    categoryId: "text-tools",
    title: { ko: "Lorem Ipsum 생성기", en: "Lorem Ipsum Generator" },
    description: {
      ko: "한국어 또는 영문 더미 문단을 빠르게 생성합니다.",
      en: "Generate Korean or Latin filler paragraphs for mockups.",
    },
    badge: { ko: "텍스트", en: "Text" },
    keywords: ["lorem ipsum", "더미 텍스트", "샘플 문장", "filler text"],
    discover: true,
  },
  {
    href: "/alcohol",
    icon: "🍺",
    categoryId: "life-tools",
    title: { ko: "음주 계산기", en: "Alcohol Calculator" },
    description: {
      ko: "음주량과 체형 정보를 바탕으로 예상 수치를 계산합니다.",
      en: "Estimate alcohol-related values from intake and body data.",
    },
    badge: { ko: "생활 계산", en: "Life" },
    keywords: ["음주", "알코올", "bac", "alcohol"],
    discover: true,
  },
  {
    href: "/unit-price",
    icon: "🧮",
    categoryId: "life-tools",
    title: { ko: "단위 가격 비교기", en: "Unit Price Comparator" },
    description: {
      ko: "L, ml, kg, g, 개 기준으로 묶음 상품의 단위 가격을 비교합니다.",
      en: "Compare bundled products by unit price across volume, weight, and piece counts.",
    },
    badge: { ko: "생활 계산", en: "Life" },
    keywords: ["단위 가격", "가격 비교", "100ml", "100g", "개당", "unit price", "price compare"],
    discover: true,
  },
  {
    href: "/starbucks-reward",
    icon: "☕",
    categoryId: "life-tools",
    title: { ko: "스타벅스 별 쿠폰 비교기", en: "Starbucks Rewards Coupon Picker" },
    description: {
      ko: "커피 가격과 별 조건을 넣으면 가장 효율적인 스타벅스 별 쿠폰을 골라줍니다.",
      en: "Compare Starbucks star coupons against your drink price and pick the most efficient one.",
    },
    badge: { ko: "리워드", en: "Rewards" },
    keywords: [
      "스타벅스",
      "스벅",
      "별 쿠폰",
      "별교환",
      "리워드",
      "커피 쿠폰",
      "starbucks",
      "reward",
    ],
    discover: true,
  },
  // Utility tools
  {
    href: "/qr-code",
    icon: "📷",
    categoryId: "text-tools",
    title: { ko: "QR코드 생성기", en: "QR Code Generator" },
    description: {
      ko: "URL, 텍스트, 전화번호를 QR코드로 변환합니다. 크기·색상·오류 복구 수준을 설정할 수 있습니다.",
      en: "Convert URLs, text, and phone numbers into QR codes with custom size and color.",
    },
    badge: { ko: "텍스트", en: "Text" },
    keywords: ["qr코드", "qr code", "qr 생성", "qr 만들기", "qrcode generator"],
    featured: true,
  },
  // Random tools
  {
    href: "/what-to-eat",
    icon: "🍽️",
    categoryId: "random-tools",
    title: { ko: "오늘 뭐 먹지?", en: "What to Eat Today?" },
    description: {
      ko: "메뉴를 고르지 못할 때 랜덤으로 오늘 먹을 음식을 골라드립니다.",
      en: "Can't decide what to eat? Let us pick a random meal for you.",
    },
    badge: { ko: "랜덤", en: "Random" },
    keywords: ["오늘 뭐 먹지", "메뉴 추천", "랜덤 메뉴", "점심 메뉴", "what to eat", "meal picker"],
    featured: true,
  },
  {
    href: "/random-picker",
    icon: "🎲",
    categoryId: "random-tools",
    title: { ko: "랜덤 뽑기 / 복불복", en: "Random Picker" },
    description: {
      ko: "이름, 순서, 팀을 랜덤으로 뽑아드립니다. 당번 정하기, 팀 나누기에 바로 활용하세요.",
      en: "Randomly pick names, order, or split teams. Perfect for deciding turns or groups.",
    },
    badge: { ko: "랜덤", en: "Random" },
    keywords: ["랜덤 뽑기", "제비뽑기", "복불복", "팀 나누기", "random picker", "name draw"],
    featured: true,
  },
  {
    href: "/ladder",
    icon: "🪜",
    categoryId: "random-tools",
    title: { ko: "사다리타기", en: "Ladder Game" },
    description: {
      ko: "공정한 사다리타기로 결과를 정해보세요. 경로 애니메이션으로 결과를 확인합니다.",
      en: "Play a fair ladder game with animated path tracing.",
    },
    badge: { ko: "게임", en: "Game" },
    keywords: ["사다리타기", "사다리 게임", "제비뽑기", "ladder game", "random draw"],
    featured: true,
  },
];

export const trustHighlights = [
  {
    icon: "⚡",
    title: { ko: "빠른 속도", en: "Fast" },
    description: {
      ko: "입력 직후 결과를 확인할 수 있게 설계했습니다.",
      en: "Designed to give results immediately after input.",
    },
  },
  {
    icon: "🆓",
    title: { ko: "완전 무료", en: "Free" },
    description: {
      ko: "회원가입이나 결제 없이 바로 사용할 수 있습니다.",
      en: "Use every tool without sign-up or payment.",
    },
  },
  {
    icon: "🔓",
    title: { ko: "로그인 불필요", en: "No Login" },
    description: {
      ko: "필요한 순간에 바로 열고 바로 계산합니다.",
      en: "Open a tool and use it right away when needed.",
    },
  },
  {
    icon: "🛡️",
    title: { ko: "개인정보 보호", en: "Privacy-Friendly" },
    description: {
      ko: "가능한 한 브라우저 안에서 처리하는 방향을 우선합니다.",
      en: "Tools are designed to process data locally whenever possible.",
    },
  },
  {
    icon: "📱",
    title: { ko: "모바일 최적화", en: "Mobile First" },
    description: {
      ko: "휴대폰에서도 답답하지 않게 바로 사용할 수 있습니다.",
      en: "Built for quick use on mobile screens as well as desktop.",
    },
  },
  {
    icon: "🇰🇷",
    title: { ko: "국내 사용자 중심", en: "Built for Korean Users" },
    description: {
      ko: "국내 사용 흐름에 맞는 도구 구성을 우선합니다.",
      en: "Prioritizes Korean-first utility needs and workflows.",
    },
  },
];

export const faqItems = [
  {
    question: {
      ko: "모든 도구를 무료로 사용할 수 있나요?",
      en: "Are all tools free to use?",
    },
    answer: {
      ko: "네. 현재 공개된 도구는 회원가입이나 결제 없이 바로 사용할 수 있습니다.",
      en: "Yes. The published tools can be used immediately without sign-up or payment.",
    },
  },
  {
    question: {
      ko: "계산 결과는 어떻게 확인해야 하나요?",
      en: "How should I interpret the results?",
    },
    answer: {
      ko: "도구별 계산 기준과 안내 문구를 계속 보강하고 있으며, 중요한 결정 전에는 공식 자료를 함께 확인하는 것을 권장합니다.",
      en: "We continue improving calculation notes for each tool, and recommend cross-checking with official sources before making important decisions.",
    },
  },
  {
    question: {
      ko: "입력한 정보가 저장되나요?",
      en: "Is my input data stored?",
    },
    answer: {
      ko: "도구 특성상 브라우저에서 바로 처리하는 흐름을 우선합니다. 서버 처리가 필요한 기능은 별도로 명확하게 안내합니다.",
      en: "We prioritize in-browser processing whenever possible. Any feature requiring server-side handling should be clearly disclosed.",
    },
  },
  {
    question: {
      ko: "모바일에서도 문제없이 사용할 수 있나요?",
      en: "Do the tools work well on mobile?",
    },
    answer: {
      ko: "네. 자주 쓰는 도구를 모바일에서도 빠르게 찾고 사용할 수 있게 구성하고 있습니다.",
      en: "Yes. The interface is designed so frequently used tools remain easy to find and use on mobile.",
    },
  },
  {
    question: {
      ko: "새로운 도구도 계속 추가되나요?",
      en: "Will more tools be added?",
    },
    answer: {
      ko: "네. 날짜, 텍스트, 이미지, 생활 계산 영역을 중심으로 계속 확장할 예정입니다.",
      en: "Yes. The library will continue growing across date, text, image, and everyday calculator categories.",
    },
  },
];
