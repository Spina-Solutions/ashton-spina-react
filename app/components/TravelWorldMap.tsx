// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { geoNaturalEarth1, geoPath } from "d3-geo";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { feature } from "topojson-client";
import countries110m from "world-atlas/countries-110m.json";
import { VISITED_COUNTRIES, MICROSTATE_COORDS, countryToGroupId } from "../content/travel.js";
import { hasCountryPhotos } from "../utils/photography.js";

const visitedCountries = new Set(VISITED_COUNTRIES);

type CountryProps = { name?: string; NAME?: string; NAME_LONG?: string } | undefined;

function countryName(props: CountryProps): string | undefined {
  return props?.name || props?.NAME || props?.NAME_LONG;
}

export function TravelWorldMap({
  selectedGroupId,
  onCountryClick,
}: {
  selectedGroupId?: string;
  onCountryClick?: (groupId: string) => void;
}) {
  const width = 800;
  const height = 420;

  const world = countries110m as any;
  const countries = feature(world, world.objects.countries) as any; // GeoJSON FeatureCollection

  // Crop out oceans and Antarctica
  const projection = geoNaturalEarth1()
    .scale(165)
    .translate([width / 2, height / 2 + 30])
    .clipExtent([[0, 0], [width, height]]);
  const path = geoPath(projection);

  const fillClass = (name: string | undefined): string => {
    if (!name || !visitedCountries.has(name)) return "fill-black/10 dark:fill-white/10";
    const groupId = countryToGroupId(name);
    if (!hasCountryPhotos(groupId)) return "fill-sage";
    if (groupId === selectedGroupId) return "fill-coral cursor-pointer";
    return "fill-ink dark:fill-paper cursor-pointer hover:fill-coral transition-colors";
  };

  const handleClick = (name: string | undefined) => {
    if (!name || !onCountryClick) return;
    const groupId = countryToGroupId(name);
    if (hasCountryPhotos(groupId)) onCountryClick(groupId);
  };

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Map of countries visited" className="w-full h-auto">
        <g>
          {countries.features.map((f: any, i: number) => {
            const name = countryName(f?.properties);
            return (
              <path
                key={f?.id ?? name ?? i}
                d={path(f) || ""}
                className={`stroke-white dark:stroke-tile-dark stroke-[0.5] ${fillClass(name)}`}
                onClick={() => handleClick(name)}
              >
                {name ? <title>{name}</title> : null}
              </path>
            );
          })}
        </g>
        <g>
          {Object.entries(MICROSTATE_COORDS).map(([name, coords]) => {
            const point = projection(coords) as [number, number] | null;
            if (!point) return null;
            return (
              <circle
                key={name}
                cx={point[0]}
                cy={point[1]}
                r={3.5}
                className={`stroke-white dark:stroke-tile-dark stroke-1 ${fillClass(name)}`}
                onClick={() => handleClick(name)}
              >
                <title>{name}</title>
              </circle>
            );
          })}
        </g>
      </svg>

      <div className="mt-3 flex flex-wrap gap-4 text-xs opacity-80">
        <LegendDot className="bg-ink dark:bg-paper" label="Photo album (click)" />
        <LegendDot className="bg-sage" label="Visited" />
        <LegendDot className="bg-coral" label="Showing" />
      </div>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
      <span>{label}</span>
    </div>
  );
}
