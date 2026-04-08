import type { Metadata } from "next";
import BeerPriceClient from "../beer-price/beer-price-client";

export const metadata: Metadata = {
  title: "단위 가격 비교기",
  description:
    "L, ml, kg, g, 개 기준으로 묶음 상품까지 환산해서 단위 가격을 비교할 수 있습니다.",
};

export default function UnitPricePage() {
  return <BeerPriceClient />;
}
