// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { geoNaturalEarth1, geoPath } from "d3-geo";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { feature } from "topojson-client";
import countries110m from "world-atlas/countries-110m.json";
import { useMemo } from "react";
import { primaryLanguageFor, type SpokenLanguage } from "../content/spokenLanguages.js";

const WIDTH = 800;
const HEIGHT = 400;

// Shades countries by their main language; when one language is focused,
// every country where it is spoken lights up in that language's colour.
export function LanguageWorldMap({ languages, focused }: { languages: SpokenLanguage[]; focused: SpokenLanguage | null }) {
  const shapes = useMemo(() => {
    const world = countries110m as any;
    const countries = feature(world, world.objects.countries) as any;
    const path = geoPath(geoNaturalEarth1().fitSize([WIDTH, HEIGHT], countries));
    return countries.features
      .filter((f: any) => f?.properties?.name !== "Antarctica")
      .map((f: any, i: number) => ({ key: String(f?.id ?? i), name: f?.properties?.name as string, d: path(f) || "" }));
  }, []);

  const fillFor = (name: string): string => {
    const base = "fill-black/10 dark:fill-white/10";
    if (focused) return focused.countries.includes(name) ? focused.fill : base;
    return primaryLanguageFor(name, languages)?.fill ?? base;
  };

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT - 40}`} role="img" aria-label="Countries where I speak the language" className="w-full h-auto">
      {shapes.map((shape: { key: string; name: string; d: string }) => (
        <path
          key={shape.key}
          d={shape.d}
          className={`stroke-white dark:stroke-tile-dark stroke-[0.4] transition-[fill] duration-300 ${fillFor(shape.name)}`}
        >
          <title>{shape.name}</title>
        </path>
      ))}
    </svg>
  );
}
