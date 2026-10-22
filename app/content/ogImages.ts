import { absoluteUrl } from "./site.js";

// Cards are rendered by `npm run og` (scripts/generate-og.ts) into assets/og/.
const cards = import.meta.glob<string>("../assets/og/*.jpg", { eager: true, import: "default" });

export function ogImage(name: string): string | undefined {
  const url = cards[`../assets/og/${name}.jpg`];
  return url ? absoluteUrl(url) : undefined;
}
