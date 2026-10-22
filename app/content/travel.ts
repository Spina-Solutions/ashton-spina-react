// Country names as they appear in world-atlas (Natural Earth) features.
export const VISITED_COUNTRIES: readonly string[] = [
  "Canada",
  "United States of America",
  "United Kingdom",
  "Ireland",
  "Norway",
  "Sweden",
  "Finland",
  "Netherlands",
  "Belgium",
  "France",
  "Spain",
  "Portugal",
  "Italy",
  "Vatican City",
  "San Marino",
  "Switzerland",
  "Austria",
  "Germany",
  "Poland",
  "Czechia",
  "Croatia",
  "Hungary",
  "Serbia",
  "Greece",
  "Turkey",
  "Malta",
  "Cambodia",
  "Vietnam",
  "China",
  "Singapore",
  "Thailand",
];

// Map country names to photo album ids where they differ from a simple slug.
const COUNTRY_GROUP_OVERRIDES: Record<string, string> = {
  "United States of America": "united_states",
  "United Kingdom": "united_kingdom",
  "San Marino": "san_marino",
  "Vatican City": "vatican",
};

// Too small to appear in the 110m atlas, so the map draws them as dots: [longitude, latitude].
export const MICROSTATE_COORDS: Record<string, [number, number]> = {
  Malta: [14.4, 35.9],
  Singapore: [103.82, 1.35],
  "Vatican City": [12.45, 41.9],
  "San Marino": [12.46, 43.94],
};

export function countryToGroupId(country: string): string {
  return COUNTRY_GROUP_OVERRIDES[country] ?? country.toLowerCase().replace(/\s+/g, "_");
}
