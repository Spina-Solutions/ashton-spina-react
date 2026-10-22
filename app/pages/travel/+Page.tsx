import { PageHeader } from "../../components/bento/SectionHeader.js";
import { PhotographySection, TravelSection } from "../../components/sections/PhotoSections.js";
import { JourneySection } from "../../components/sections/JourneySection.js";
import { usePhotoAlbums } from "../../hooks/usePhotoAlbums.js";
import { VISITED_COUNTRIES } from "../../content/travel.js";

export default function TravelPage() {
  const albums = usePhotoAlbums();

  return (
    <div>
      <PageHeader
        title="Travel"
        intro={`${VISITED_COUNTRIES.length} countries so far, ${albums.groups.length} photo albums, and the places I've called home.`}
      />
      <PhotographySection albums={albums} />
      <TravelSection albums={albums} />
      <JourneySection />
    </div>
  );
}
