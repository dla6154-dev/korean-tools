import type { Metadata } from "next";
import HomePageClient from "./home-page-client";

export const metadata: Metadata = {
  title: "Korean Tools",
  description:
    "留??섏씠 怨꾩궛湲? ?붾뜲??怨꾩궛湲? 湲?먯닔 ?멸린, ?대?吏 ?뺤텞湲????쒓뎅???ㅼ슜 ?꾧뎄瑜?臾대즺濡?鍮좊Ⅴ寃??ъ슜?????덉뒿?덈떎.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
