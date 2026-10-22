import { useSiteMode } from "../../hooks/useSiteMode.js";
import { HeroBento } from "./HeroBento.js";
import { ProjectsSection } from "./ProjectsSection.js";
import { ExperienceSection, WritingSection } from "./WorkSections.js";
import { ServicesSection, ContactSection } from "./ConsultingSections.js";
import { MergerStory } from "./MergerStory.js";
import { ExploreSection } from "./ExploreSection.js";

export default function Page() {
  const { isWorkMode } = useSiteMode();

  return (
    <div>
      <HeroBento isWorkMode={isWorkMode} />
      {isWorkMode ? (
        <>
          <ServicesSection />
          <MergerStory />
          <ExperienceSection />
          <ProjectsSection title="Products I build and run" />
          <WritingSection />
          <ContactSection />
        </>
      ) : (
        <>
          <ProjectsSection title="Projects" />
          <ExploreSection />
        </>
      )}
    </div>
  );
}
