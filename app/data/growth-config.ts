import growthConfigJson from "./growth-config.json";

export type GrowthHomepagePromotion = {
  route: string;
  experimentId: string;
  reason: string;
};

export type GrowthMetadataOverride = {
  title?: string;
  description?: string;
};

type GrowthConfig = {
  homepagePromotions?: GrowthHomepagePromotion[];
  metadataOverrides?: Record<string, GrowthMetadataOverride>;
};

const growthConfig = growthConfigJson as GrowthConfig;

export const growthHomepagePromotions = growthConfig.homepagePromotions ?? [];
export const growthMetadataOverrides = growthConfig.metadataOverrides ?? {};

export function resolveGrowthMetadata(
  route: string,
  fallback: { title: string; description: string },
) {
  const override = growthMetadataOverrides[route];

  if (!override) {
    return fallback;
  }

  return {
    title: override.title ?? fallback.title,
    description: override.description ?? fallback.description,
  };
}
