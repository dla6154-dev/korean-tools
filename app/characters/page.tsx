import CharactersClient from "./characters-client";
import { resolveGrowthMetadata } from "../data/growth-config";
import { createToolMetadata, createToolStructuredData } from "../seo";

const defaults = {
  title: "글자수 세기 | 공백 포함, 공백 제외, 단어 수, 바이트 계산",
  description:
    "자기소개서, 이력서, 블로그, SNS 글의 글자 수를 공백 포함/제외, 단어 수, 바이트 기준으로 바로 확인하세요.",
};

const { title, description } = resolveGrowthMetadata("/characters", defaults);

export const metadata = createToolMetadata({
  title,
  description,
  path: "/characters",
  keywords: [
    "글자수 세기",
    "공백 포함 글자수",
    "공백 제외 글자수",
    "바이트 계산",
    "문자 수 계산기",
  ],
});

export default function CharactersPage() {
  const jsonLd = createToolStructuredData({
    title,
    description,
    path: "/characters",
    featureList: ["공백 포함 글자수", "공백 제외 글자수", "단어 수와 바이트 계산"],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CharactersClient />
    </>
  );
}
