export type LangText = {
  ko: string;
  en: string;
};

export type ToolCategoryId =
  | "date-tools"
  | "text-tools"
  | "image-tools"
  | "life-tools";

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
    icon: "📅",
    accent: "blue",
    title: { ko: "날짜 · 기간", en: "Dates & Time" },
    description: {
      ko: "날짜 계산과 기간 측정을 빠르게 처리합니다.",
      en: "Quick tools for dates, durations, and milestones.",
    },
    countLabel: { ko: "3개 도구", en: "3 tools" },
    examples: [
      { ko: "만 나이 계산기", en: "Korean age calculator" },
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
    countLabel: { ko: "3개 도구", en: "3 tools" },
    examples: [
      { ko: "글자수 세기", en: "Character counter" },
      { ko: "초성 추출기", en: "Choseong extractor" },
      { ko: "키보드 오타 변환기", en: "Keyboard typo converter" },
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
    countLabel: { ko: "2개 도구", en: "2 tools" },
    examples: [
      { ko: "이미지 압축기", en: "Image compressor" },
      { ko: "보색 찾기", en: "Complementary color finder" },
      { ko: "업로드 없이 처리", en: "No upload processing" },
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
    countLabel: { ko: "5개 도구", en: "5 tools" },
    examples: [
      { ko: "BMI 계산기", en: "BMI calculator" },
      { ko: "대출 이자 계산기", en: "Loan calculator" },
      { ko: "단위 가격 비교기", en: "Unit price comparator" },
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
    keywords: ["나이", "만나이", "생년월일", "age", "birthday"],
    featured: true,
  },
  {
    href: "/dday",
    icon: "⏳",
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
    icon: "✍️",
    categoryId: "text-tools",
    title: { ko: "글자수 세기", en: "Character Counter" },
    description: {
      ko: "글자수, 단어수, 줄 수를 바로 확인할 수 있습니다.",
      en: "Instantly count characters, words, and lines.",
    },
    badge: { ko: "텍스트", en: "Text" },
    keywords: ["글자수", "텍스트", "문자수", "character", "word count"],
    featured: true,
  },
  {
    href: "/image-compress",
    icon: "📸",
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
      ko: "영문/한글 입력이 뒤바뀐 텍스트를 빠르게 교정합니다.",
      en: "Fix text typed with the wrong Korean or English keyboard layout.",
    },
    badge: { ko: "텍스트", en: "Text" },
    keywords: ["키보드", "오타", "영타", "한영", "keyboard typo"],
    discover: true,
  },
  {
    href: "/alcohol",
    icon: "🍺",
    categoryId: "life-tools",
    title: { ko: "음주 계산기", en: "Alcohol Calculator" },
    description: {
      ko: "음주량과 체중 정보를 바탕으로 예상 수치를 계산합니다.",
      en: "Estimate alcohol-related values from intake and body data.",
    },
    badge: { ko: "생활 계산", en: "Life" },
    keywords: ["음주", "알코올", "bac", "alcohol"],
    discover: true,
  },
  {
    href: "/unit-price",
    icon: "💸",
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
    icon: "🔒",
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
    title: { ko: "한국형 사용성", en: "Built for Korean Users" },
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
      ko: "도구별 계산 기준과 안내 문구를 점차 보강하고 있으며, 중요한 결정 전에는 공식 자료와 함께 확인하는 것을 권장합니다.",
      en: "We continue improving calculation notes for each tool, and recommend cross-checking with official sources before making important decisions.",
    },
  },
  {
    question: {
      ko: "입력한 정보가 저장되나요?",
      en: "Is my input data stored?",
    },
    answer: {
      ko: "도구 특성상 브라우저에서 바로 처리하는 흐름을 우선합니다. 서버 저장이 필요한 기능은 별도로 명확하게 안내합니다.",
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
