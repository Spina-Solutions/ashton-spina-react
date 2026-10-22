import { useSiteMode } from "../../hooks/useSiteMode.js";
import { HeroBento } from "./HeroBento.js";
import { ProjectsSection } from "../../components/sections/ProjectsSection.js";
import { ExperienceSection, WritingSection } from "../../components/sections/WorkSections.js";
import { ServicesSection, ContactSection } from "../../components/sections/ConsultingSections.js";
import { MergerStory } from "../../components/sections/MergerStory.js";
import { ExploreSection } from "./ExploreSection.js";

export default function Page() {
  const { isWorkMode } = useSiteMode();

  return (
    <div>
      <HeroBento isWorkMode={isWorkMode} />
      {isWorkMode ? (
        <>
          <ServicesSection />
          <MergerStory caseStudyHref="/consulting/smg-real-estate" />
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
