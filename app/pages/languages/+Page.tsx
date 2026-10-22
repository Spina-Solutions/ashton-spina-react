import { PageHeader } from "../../components/bento/SectionHeader.js";
import { LanguagesSection } from "../../components/sections/LanguagesSection.js";

export default function LanguagesPage() {
  return (
    <div>
      <PageHeader title="Languages" intro="Where I can get by, and how far along each language is." />
      <LanguagesSection />
    </div>
  );
}
