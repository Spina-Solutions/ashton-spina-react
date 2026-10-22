import { ConsultingHero } from "./ConsultingHero.js";
import { ServicesSection, ContactSection } from "../../components/sections/ConsultingSections.js";
import { MergerStory } from "../../components/sections/MergerStory.js";
import { ExperienceSection, WritingSection } from "../../components/sections/WorkSections.js";
import { ProjectsSection } from "../../components/sections/ProjectsSection.js";

export default function ConsultingPage() {
  return (
    <div>
      <ConsultingHero />
      <ServicesSection />
      <MergerStory caseStudyHref="/consulting/smg-real-estate" />
      <ExperienceSection />
      <ProjectsSection title="Products I build and run" />
      <WritingSection />
      <ContactSection />
    </div>
  );
}
