// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { geoNaturalEarth1, geoPath } from "d3-geo";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { feature } from "topojson-client";
import countries110m from "world-atlas/countries-110m.json";

const spanishCountries = new Set([
  "Spain",
  "Mexico",
  "Argentina",
  "Colombia",
  "Peru",
  "Venezuela",
  "Chile",
  "Guatemala",
  "Ecuador",
  "Bolivia",
  "Cuba",
  "Dominican Republic",
  "Honduras",
  "Paraguay",
  "El Salvador",
  "Nicaragua",
  "Costa Rica",
  "Panama",
  "Uruguay",
  "Equatorial Guinea",
  "Puerto Rico",
]);

const englishCountries = new Set([
  "United States of America",
  "United Kingdom", 
  "Canada",
  "Australia",
  "New Zealand",
  "Ireland",
  "South Africa"
]);

const italianCountries = new Set([
  "Italy",
  "San Marino",
  "Vatican City",
  "Switzerland"
]);

const frenchCountries = new Set([
  "France",
  "Canada",
  "Belgium", 
  "Switzerland",
  "Monaco",
  "Luxembourg",
  "Madagascar",
  "Cameroon",
  "Ivory Coast",
  "Burkina Faso",
  "Mali",
  "Niger",
  "Senegal",
  "Guinea",
  "Benin",
  "Togo",
  "Central African Republic",
  "Chad",
  "Republic of the Congo",
  "Democratic Republic of the Congo",
  "Gabon",
  "Equatorial Guinea",
  "Comoros",
  "Seychelles",
  "Djibouti",
  "Lebanon",
  "Haiti",
  "Vanuatu"
]);

export function LanguageWorldMap({ 
  level, 
  language = "spanish" 
}: { 
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";
  language?: "spanish" | "english" | "italian" | "french";
}) {
  const width = 800;
  const height = 220;

  const world = countries110m as any;
  const countries = feature(world, world.objects.countries) as any; // GeoJSON FeatureCollection

  const projection = geoNaturalEarth1().fitSize([width, height], countries);
  const path = geoPath(projection);

  const intensity = levelToIntensity(level);
  const fillFor = (props: any): string => {
    const name = props?.name || props?.NAME || props?.NAME_LONG;
    if (!name) return "#e5e7eb"; // slate-200
    
    let isTargetLanguage = false;
    switch (language) {
      case "spanish":
        isTargetLanguage = spanishCountries.has(name);
        break;
      case "english":
        isTargetLanguage = englishCountries.has(name);
        break;
      case "italian":
        isTargetLanguage = italianCountries.has(name);
        break;
      case "french":
        isTargetLanguage = frenchCountries.has(name);
        break;
    }
    
    return isTargetLanguage ? shadeForIntensity(intensity) : "#e5e7eb"; // slate-200
  };

  return (
    <div className="card p-3">
      <div className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"}>Your Language World</div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${language}-speaking world map`} className="w-full h-auto">
        <g>
          {countries.features.map((f: any, i: number) => {
            const name = f?.properties?.name || f?.properties?.NAME || f?.properties?.NAME_LONG;
            const key = f?.id ?? name ?? i;
            return (
              <path key={key} d={path(f) || ""} fill={fillFor(f.properties)} className={"stroke-white"} strokeWidth={0.25} />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

function levelToIntensity(label: LanguageWorldMapProps["level"]): number {
  switch (label) {
    case "A1":
      return 0.2;
    case "A2":
      return 0.35;
    case "B1":
      return 0.5;
    case "B2":
      return 0.7;
    case "C1":
      return 0.85;
    case "C2":
      return 0.95;
    case "Native":
      return 1;
  }
}

function shadeForIntensity(i: number): string {
  const min = [203, 213, 225]; // slate-300
  const max = [37, 99, 235]; // blue-600
  const mix = (a: number, b: number) => Math.round(a + (b - a) * i);
  const [r, g, b] = [mix(min[0], max[0]), mix(min[1], max[1]), mix(min[2], max[2])];
  return `rgb(${r}, ${g}, ${b})`;
}

type LanguageWorldMapProps = Parameters<typeof LanguageWorldMap>[0];

// Backward compatibility export
export const SpanishWorldMap = LanguageWorldMap;


