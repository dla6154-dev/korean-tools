import type { Lang } from "./language-context";
import { tools } from "./tool-content";

export function buildRelatedToolItems(lang: Lang, hrefs: string[]) {
  return hrefs
    .map((href) => tools.find((tool) => tool.href === href))
    .filter((tool): tool is NonNullable<(typeof tools)[number]> => Boolean(tool))
    .map((tool) => ({
      href: tool.href,
      icon: tool.icon,
      title: tool.title[lang],
      description: tool.description[lang],
      badge: tool.badge[lang],
    }));
}
