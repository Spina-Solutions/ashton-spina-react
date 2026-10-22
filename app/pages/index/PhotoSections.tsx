import { StackedCarousel } from "../../components/StackedCarousel.js";
import { PhotoGroupSelector } from "../../components/PhotoGroupSelector.js";
import { TravelWorldMap } from "../../components/TravelWorldMap.js";
import { Tile, TileLabel } from "../../components/bento/Tile.js";
import { SectionHeader } from "../../components/bento/SectionHeader.js";
import { VISITED_COUNTRIES } from "../../content/travel.js";
import type { usePhotoAlbums } from "../../hooks/usePhotoAlbums.js";

type Albums = ReturnType<typeof usePhotoAlbums>;

export function PhotographySection({ albums }: { albums: Albums }) {
  return (
    <section id="photos" className={"pt-12"}>
      <SectionHeader
        title="Photography"
        action={albums.selected ? <span className={"text-sm opacity-60"}>{albums.selected.title}</span> : null}
      />
      <Tile className={"!p-3 sm:!p-4"}>
        <StackedCarousel
          photos={albums.selected?.photos ?? []}
          onAlbumEnd={albums.next}
          onAlbumStart={albums.prev}
          resetKey={albums.selectedId}
        />
        <div className={"mt-4"}>
          <PhotoGroupSelector groups={albums.groups} selectedId={albums.selectedId} onSelect={albums.select} />
        </div>
      </Tile>
    </section>
  );
}

export function TravelSection({ albums }: { albums: Albums }) {
  return (
    <section id="travel" className={"pt-12"}>
      <SectionHeader title="Travel" />
      <div className={"grid grid-cols-1 md:grid-cols-3 gap-3"}>
        <Tile className={"md:col-span-2"}>
          <TravelWorldMap
            selectedGroupId={albums.selectedId}
            onCountryClick={(groupId) => {
              albums.select(groupId);
              document.getElementById("photos")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </Tile>
        <div className={"grid grid-cols-2 md:grid-cols-1 gap-3"}>
          <Tile tone="coral" className={"flex flex-col justify-between gap-6"}>
            <TileLabel>Visited</TileLabel>
            <div>
              <div className={"text-5xl font-medium tracking-tight"}>{VISITED_COUNTRIES.length}</div>
              <div className={"text-sm opacity-80"}>countries so far</div>
            </div>
          </Tile>
          <Tile tone="ink" className={"flex flex-col justify-between gap-6"}>
            <TileLabel>Albums</TileLabel>
            <div>
              <div className={"text-5xl font-medium tracking-tight"}>{albums.groups.length}</div>
              <div className={"text-sm opacity-70"}>Click a dark country on the map to open it</div>
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
}
