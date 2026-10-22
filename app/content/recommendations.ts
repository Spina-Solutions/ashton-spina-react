import { VISITED_COUNTRIES } from "./travel.js";

export type PlaceRecommendation = {
  title: string;
  // Natural Earth country name, so it lines up with the travel map and albums
  country: string;
  description: string;
};

// Only places I've actually been to. Tests only catch the country, so each entry needs a human check.
export const placeRecommendations: PlaceRecommendation[] = [
  {
    title: "Hoi An",
    country: "Vietnam",
    description: "An old town of lantern-lit streets, great street food and beautiful architecture.",
  },
  {
    title: "Santorini",
    country: "Greece",
    description: "White-washed villages on a volcanic caldera, with sunsets worth the crowds.",
  },
];

export function unvisitedRecommendations(places: PlaceRecommendation[] = placeRecommendations): string[] {
  return places.filter((p) => !VISITED_COUNTRIES.includes(p.country)).map((p) => p.title);
}
