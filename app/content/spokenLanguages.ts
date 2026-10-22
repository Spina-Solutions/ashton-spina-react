import type { LanguageLevel } from "../utils/cefr.js";

export type SpokenLanguage = {
  name: string;
  native: string;
  level: LanguageLevel;
  // Tailwind classes for the swatch and map fill; tokens live in layouts/tailwind.css
  swatch: string;
  fill: string;
  countries: string[];
};

// Country names as they appear in world-atlas (Natural Earth) features.
export const spokenLanguages: SpokenLanguage[] = [
  {
    name: "English",
    native: "English",
    level: "Native",
    swatch: "bg-ink dark:bg-paper",
    fill: "fill-ink dark:fill-paper",
    countries: ["United States of America", "United Kingdom", "Canada", "Australia", "New Zealand", "Ireland", "South Africa"],
  },
  {
    name: "Spanish",
    native: "Español",
    level: "A2",
    swatch: "bg-coral",
    fill: "fill-coral",
    countries: [
      "Spain", "Mexico", "Argentina", "Colombia", "Peru", "Venezuela", "Chile", "Guatemala", "Ecuador", "Bolivia", "Cuba",
      "Dominican Rep.", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Uruguay",
      "Eq. Guinea", "Puerto Rico",
    ],
  },
  {
    name: "Italian",
    native: "Italiano",
    level: "A1",
    swatch: "bg-sage",
    fill: "fill-sage",
    countries: ["Italy", "San Marino", "Vatican City", "Switzerland"],
  },
  {
    name: "French",
    native: "Français",
    level: "A1",
    swatch: "bg-sun",
    fill: "fill-sun",
    countries: [
      "France", "Canada", "Belgium", "Switzerland", "Luxembourg", "Madagascar", "Cameroon", "Côte d'Ivoire", "Burkina Faso",
      "Mali", "Niger", "Senegal", "Guinea", "Benin", "Togo", "Central African Rep.", "Chad", "Congo", "Dem. Rep. Congo",
      "Gabon", "Haiti", "Vanuatu", "Lebanon", "Djibouti",
    ],
  },
  {
    name: "German",
    native: "Deutsch",
    level: "A1",
    swatch: "bg-sky",
    fill: "fill-sky",
    countries: ["Germany", "Austria", "Switzerland", "Liechtenstein", "Luxembourg", "Belgium"],
  },
];

// First language in list order wins where several are spoken.
export function primaryLanguageFor(country: string, languages: SpokenLanguage[] = spokenLanguages): SpokenLanguage | null {
  return languages.find((l) => l.countries.includes(country)) ?? null;
}
