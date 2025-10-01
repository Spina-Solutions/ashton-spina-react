// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { geoNaturalEarth1, geoPath } from "d3-geo";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { feature } from "topojson-client";
import countries110m from "world-atlas/countries-110m.json";
import conjugr8Logo from "../assets/logos/conjugr8.svg";

export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";

export type LanguageData = {
  name: string;
  level: LanguageLevel;
  countries: string[];
  color: string;
};

const languageData: LanguageData[] = [
  {
    name: "English",
    level: "Native",
    countries: ["United States of America", "United Kingdom", "Canada", "Australia", "New Zealand", "Ireland", "South Africa"],
    color: "#3B82F6" // blue-500
  },
  {
    name: "Spanish", 
    level: "A2",
    countries: ["Spain", "Mexico", "Argentina", "Colombia", "Peru", "Venezuela", "Chile", "Guatemala", "Ecuador", "Bolivia", "Cuba", "Dominican Republic", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Uruguay", "Equatorial Guinea", "Puerto Rico"],
    color: "#F59E0B" // amber-500
  },
  {
    name: "Italian",
    level: "A1", 
    countries: ["Italy", "San Marino", "Vatican City", "Switzerland"],
    color: "#10B981" // emerald-500
  },
  {
    name: "French",
    level: "A1",
    countries: ["France", "Canada", "Belgium", "Switzerland", "Monaco", "Luxembourg", "Madagascar", "Cameroon", "Ivory Coast", "Burkina Faso", "Mali", "Niger", "Senegal", "Guinea", "Benin", "Togo", "Central African Republic", "Chad", "Republic of the Congo", "Democratic Republic of the Congo", "Gabon", "Equatorial Guinea", "Comoros", "Seychelles", "Djibouti", "Lebanon", "Haiti", "Vanuatu"],
    color: "#8B5CF6" // violet-500
  },
  {
    name: "German",
    level: "A1",
    countries: ["Germany", "Austria", "Switzerland", "Liechtenstein", "Luxembourg", "Belgium"],
    color: "#EF4444" // red-500
  }
];

function levelToIntensity(level: LanguageLevel): number {
  switch (level) {
    case "A1":
      return 0.3;
    case "A2":
      return 0.5;
    case "B1":
      return 0.6;
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

function getCountryLanguage(countryName: string): LanguageData | null {
  for (const language of languageData) {
    if (language.countries.includes(countryName)) {
      return language;
    }
  }
  return null;
}

function getCountryColor(countryName: string): string {
  const language = getCountryLanguage(countryName);
  if (!language) return "#E5E7EB"; // slate-200
  
  const intensity = levelToIntensity(language.level);
  return adjustColorIntensity(language.color, intensity);
}

function adjustColorIntensity(color: string, intensity: number): string {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Mix with white based on intensity
  const mixWithWhite = (component: number) => Math.round(component + (255 - component) * (1 - intensity));
  
  const newR = mixWithWhite(r);
  const newG = mixWithWhite(g);
  const newB = mixWithWhite(b);
  
  return `rgb(${newR}, ${newG}, ${newB})`;
}

export function UnifiedLanguageMap() {
  const width = 800;
  const height = 400;

  const world = countries110m as any;
  const countries = feature(world, world.objects.countries) as any; // GeoJSON FeatureCollection

  const projection = geoNaturalEarth1().fitSize([width, height], countries);
  const path = geoPath(projection);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Language Learning Progress</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">My journey with languages through Conjugr8</p>
      </div>
      
      <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50">
        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">Your Language World</div>
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="World map showing language learning progress" className="w-full h-auto">
          <g>
            {countries.features.map((f: any, i: number) => {
              const name = f?.properties?.name || f?.properties?.NAME || f?.properties?.NAME_LONG;
              const key = f?.id ?? name ?? i;
              const fillColor = name ? getCountryColor(name) : "#E5E7EB";
              
              return (
                <path 
                  key={key} 
                  d={path(f) || ""} 
                  fill={fillColor} 
                  className="stroke-white dark:stroke-gray-800" 
                  strokeWidth={0.25} 
                />
              );
            })}
          </g>
        </svg>
        
        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {languageData.map((language) => (
            <div key={language.name} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-sm border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: language.color }}
              />
              <div className="text-xs">
                <div className="font-medium text-gray-900 dark:text-gray-100">{language.name}</div>
                <div className="text-gray-600 dark:text-gray-400">{language.level}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <a 
          href="https://conjugr8.com" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
        >
          <img src={conjugr8Logo} alt="Conjugr8" className="h-4 w-4" />
          Learn with Conjugr8
        </a>
      </div>
    </div>
  );
}
