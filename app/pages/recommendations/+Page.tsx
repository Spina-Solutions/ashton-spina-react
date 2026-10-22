import { placeRecommendations, type PlaceRecommendation } from "../../content/recommendations.js";
import { countryToGroupId } from "../../content/travel.js";
import { generatePhotoGroups, type PhotoGroup } from "../../utils/photography.js";
import { Tile, TileLabel, ArrowIcon } from "../../components/bento/Tile.js";
import { PageHeader } from "../../components/bento/SectionHeader.js";

export default function RecommendationsPage() {
  const albums = generatePhotoGroups();

  return (
    <div className={"space-y-3"}>
      <PageHeader title="Worth the trip" intro="Places I keep telling people to visit. Only ones I've been to myself." />
      <div className={`stagger grid gap-3 ${placeRecommendations.length % 3 === 0 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {placeRecommendations.map((place) => (
          <PlaceTile key={place.title} place={place} album={albums.find((a) => a.id === countryToGroupId(place.country))} />
        ))}
      </div>
    </div>
  );
}

function PlaceTile({ place, album }: { place: PlaceRecommendation; album?: PhotoGroup }) {
  const cover = album?.thumbnail;
  return (
    <Tile href={album ? `/travel?album=${album.id}#photos` : undefined} ariaLabel={album ? `${place.title}: see photos from ${place.country}` : undefined} className={"!p-0 flex flex-col"}>
      {cover ? (
        <div className={"relative aspect-[4/3] overflow-hidden"}>
          <img src={cover} alt={`From my ${place.country} album`} loading="lazy" className={"h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"} />
          {/* The cover is the country album's photo, not necessarily this exact place */}
          <span className={"absolute left-3 bottom-3 rounded-full bg-ink/70 px-3 py-1 text-xs text-paper backdrop-blur"}>
            From my {place.country} album
          </span>
        </div>
      ) : null}
      <div className={"flex flex-1 flex-col gap-2 p-5 sm:p-6"}>
        <div className={"flex items-center justify-between"}>
          <TileLabel>{place.country}</TileLabel>
          {cover ? <ArrowIcon /> : null}
        </div>
        <h2 className={"text-2xl font-medium tracking-tight"}>{place.title}</h2>
        <p className={"text-sm opacity-75"}>{place.description}</p>
      </div>
    </Tile>
  );
}
