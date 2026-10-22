import { useSiteMode } from "../../hooks/useSiteMode.js";
import { usePhotoAlbums } from "../../hooks/usePhotoAlbums.js";
import { HeroBento } from "./HeroBento.js";
import { ProjectsSection } from "./ProjectsSection.js";
import { JourneySection } from "./JourneySection.js";
import { PhotographySection, TravelSection } from "./PhotoSections.js";
import { ExperienceSection, WritingSection } from "./WorkSections.js";
import { LanguagesSection } from "./LanguagesSection.js";
import { ServicesSection, ContactSection } from "./ConsultingSections.js";

export default function Page() {
  const { isWorkMode } = useSiteMode();
  const albums = usePhotoAlbums();

  return (
    <div>
      <HeroBento isWorkMode={isWorkMode} />
      {isWorkMode ? (
        <>
          <ServicesSection />
          <ExperienceSection />
          <ProjectsSection title="Products I build and run" />
          <WritingSection />
          <ContactSection />
        </>
      ) : (
        <>
          <ProjectsSection title="Projects" />
          <PhotographySection albums={albums} />
          <TravelSection albums={albums} />
          <JourneySection />
          <LanguagesSection />
        </>
      )}
    </div>
  );
}
