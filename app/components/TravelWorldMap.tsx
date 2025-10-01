// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { geoNaturalEarth1, geoPath } from "d3-geo";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { feature } from "topojson-client";
import countries110m from "world-atlas/countries-110m.json";

const visitedCountries = new Set([
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
  "Czech Republic",
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
  "Thailand"
]);

const countriesWithPhotos = new Set([
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
  "Czech Republic",
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
  "Thailand"
]);

export function TravelWorldMap({ 
  selectedCountry,
  onCountryClick
}: { 
  selectedCountry?: string;
  onCountryClick?: (country: string) => void;
}) {
  const width = 800;
  const height = 500;

  const world = countries110m as any;
  const countries = feature(world, world.objects.countries) as any; // GeoJSON FeatureCollection

  // Create a projection that focuses on landmasses and cuts off oceans/antarctica
  const projection = geoNaturalEarth1()
    .scale(180)
    .translate([width / 2, height / 2 + 20])
    .clipExtent([[0, 0], [width, height]]);
  const path = geoPath(projection);

  const getCountryFill = (props: any): string => {
    const name = props?.name || props?.NAME || props?.NAME_LONG;
    if (!name) return "#e5e7eb"; // gray-200
    
    if (countriesWithPhotos.has(name)) {
      return selectedCountry === name ? "#3b82f6" : "#10b981"; // blue-500 or emerald-500
    }
    
    if (visitedCountries.has(name)) {
      return "#10b981"; // emerald-500
    }
    
    return "#e5e7eb"; // gray-200
  };

  const getCountryClassName = (props: any): string => {
    const name = props?.name || props?.NAME || props?.NAME_LONG;
    if (!name) return "";
    
    if (visitedCountries.has(name)) {
      return "cursor-pointer hover:opacity-80 transition-opacity";
    }
    
    return "";
  };

  const handleCountryClick = (props: any) => {
    const name = props?.name || props?.NAME || props?.NAME_LONG;
    if (name && countriesWithPhotos.has(name) && onCountryClick) {
      onCountryClick(name);
    }
  };

  return (
    <div className="relative bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Travel world map" className="w-full h-80 sm:h-96">
        <g>
          {countries.features.map((f: any, i: number) => {
            const name = f?.properties?.name || f?.properties?.NAME || f?.properties?.NAME_LONG;
            const key = f?.id ?? name ?? i;
            return (
              <path 
                key={key} 
                d={path(f) || ""} 
                fill={getCountryFill(f.properties)} 
                className={`stroke-white dark:stroke-gray-700 stroke-[0.5] ${getCountryClassName(f.properties)}`}
                onClick={() => handleCountryClick(f.properties)}
              />
            );
          })}
        </g>
      </svg>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Has photo albums</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Countries visited</span>
        </div>
      </div>
    </div>
  );
}
