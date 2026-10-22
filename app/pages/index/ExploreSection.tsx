import { Tile, TileLabel, ArrowIcon } from "../../components/bento/Tile.js";
import { SectionHeader } from "../../components/bento/SectionHeader.js";
import { VISITED_COUNTRIES } from "../../content/travel.js";
import { journey } from "../../content/journey.js";
import { spokenLanguages } from "../../content/spokenLanguages.js";
import { placeRecommendations } from "../../content/recommendations.js";
import { generatePhotoGroups } from "../../utils/photography.js";

// Personal-mode doorway to the travel, languages and places pages.
export function ExploreSection() {
  const albums = generatePhotoGroups();
  const cover = albums.find((a) => a.id === "vietnam") ?? albums[0];
  const learning = spokenLanguages.filter((l) => l.level !== "Native");

  return (
    <section id="explore" className={"pt-12"}>
      <SectionHeader title="Off the clock" />
      <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"}>
        <Tile href="/travel" className={"!p-0 sm:col-span-2 md:row-span-2 min-h-[320px]"} ariaLabel="Travel and photography">
          {cover ? (
            <img
              src={cover.thumbnail}
              alt=""
              loading="lazy"
              className={"absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"}
            />
          ) : null}
          <div className={"absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"} />
          <div className={"relative flex h-full flex-col justify-between p-5 sm:p-6 text-white"}>
            <div className={"flex justify-between"}>
              <TileLabel>Travel and photography</TileLabel>
              <ArrowIcon />
            </div>
            <div>
              <div className={"text-4xl sm:text-5xl font-medium tracking-tight"}>{VISITED_COUNTRIES.length} countries</div>
              <div className={"mt-1 opacity-85"}>{albums.length} photo albums and a map of every trip</div>
            </div>
          </div>
        </Tile>
        <Tile tone="sun" href="/languages" className={"flex flex-col justify-between gap-6 min-h-[150px]"}>
          <div className={"flex justify-between"}>
            <TileLabel>Languages</TileLabel>
            <ArrowIcon />
          </div>
          <div>
            <div className={"text-2xl font-medium leading-tight"}>{spokenLanguages.length} languages</div>
            <div className={"text-sm opacity-75"}>Learning {learning.map((l) => l.native).join(", ")}</div>
          </div>
        </Tile>
        <Tile tone="night" href="/travel#journey" className={"flex flex-col justify-between gap-6 min-h-[150px]"}>
          <div className={"flex justify-between"}>
            <TileLabel>Journey</TileLabel>
            <ArrowIcon />
          </div>
          <div>
            <div className={"text-2xl font-medium leading-tight"}>{journey.length} homes</div>
            <div className={"text-sm opacity-70"}>{journey.map((s) => s.flag).join(" ")}</div>
          </div>
        </Tile>
        <Tile tone="sage" href="/recommendations" className={"sm:col-span-2 flex items-end justify-between gap-6 min-h-[150px]"}>
          <div>
            <TileLabel>Worth the trip</TileLabel>
            <div className={"mt-3 text-2xl font-medium leading-tight"}>{placeRecommendations.map((p) => p.title).join(" · ")}</div>
          </div>
          <ArrowIcon />
        </Tile>
      </div>
    </section>
  );
}
