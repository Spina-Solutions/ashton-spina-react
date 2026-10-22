import logoTechTacticsOy from "../../assets/logos/techtactics_mark.svg";
import { Tile, TileLabel, ArrowIcon } from "../bento/Tile.js";
import { SectionHeader } from "../bento/SectionHeader.js";
import { consultingServices, CONSULTING_ENQUIRY_HREF, type ConsultingService } from "../../content/consulting.js";
import { contactLinks } from "../../content/links.js";
import { trackEvent } from "../../utils/analytics.js";

export function ServicesSection() {
  return (
    <section id="services" className={"pt-12"}>
      <SectionHeader
        title="How I can help"
        action={<span className={"hidden sm:inline text-sm opacity-60"}>Consulting through TechTactics Oy</span>}
      />
      <div className={"grid grid-cols-1 md:grid-cols-2 gap-3"}>
        {consultingServices.map((service, i) => (
          <ServiceTile key={service.title} service={service} index={i} />
        ))}
      </div>
    </section>
  );
}

function ServiceTile({ service, index }: { service: ConsultingService; index: number }) {
  return (
    <Tile tone={service.tone} className={"flex flex-col gap-5 min-h-[300px]"}>
      <div className={"flex items-start justify-between gap-4"}>
        <span className={"text-sm tabular-nums opacity-60"}>0{index + 1}</span>
      </div>
      <div>
        <h3 className={"text-3xl font-medium leading-[1.05] tracking-tight"}>{service.title}</h3>
        <p className={"mt-3 max-w-md opacity-80"}>{service.summary}</p>
      </div>
      <ul className={"flex flex-wrap gap-2"}>
        {service.includes.map((item) => (
          <li key={item} className={"rounded-full bg-current/10 px-3 py-1.5 text-sm"}>
            <span className={"opacity-90"}>{item}</span>
          </li>
        ))}
      </ul>
      <p className={"mt-auto border-t border-current/15 pt-4 text-sm opacity-80"}>
        <span className={"font-medium"}>Done before: </span>
        {service.proof}
      </p>
    </Tile>
  );
}

export function ContactSection() {
  const linkedIn = contactLinks.find((l) => l.label === "LinkedIn");

  return (
    <section id="contact" className={"pt-12"}>
      <div className={"grid grid-cols-1 md:grid-cols-3 gap-3"}>
        <Tile tone="coral" href={CONSULTING_ENQUIRY_HREF} onClick={() => trackEvent("consulting_enquiry_click", { location: "contact_section" })} className={"md:col-span-2 flex flex-col justify-between gap-10 min-h-[260px] sm:!p-10"}>
          <div className={"flex justify-between"}>
            <TileLabel>Start a conversation</TileLabel>
            <ArrowIcon className={"h-7 w-7"} />
          </div>
          <div>
            <h2 className={"text-4xl sm:text-6xl font-medium leading-[0.95] tracking-tight"}>
              Got a marketplace
              <br />
              problem?
            </h2>
            <p className={"mt-4 max-w-md opacity-85"}>Tell me where you're stuck: the team, the platform or the revenue.</p>
          </div>
        </Tile>
        <div className={"grid gap-3"}>
          <Tile className={"flex items-center gap-4"}>
            <img src={logoTechTacticsOy} alt="" className={"h-12 w-12 rounded-xl"} />
            <div>
              <div className={"text-lg font-medium leading-tight"}>TechTactics Oy</div>
              <div className={"text-sm opacity-65"}>Marketplace engineering consulting · Helsinki</div>
            </div>
          </Tile>
          {linkedIn ? (
            <Tile tone="ink" href={linkedIn.href} external onClick={() => trackEvent("linkedin_click", { location: "contact_section" })} className={"flex items-center justify-between"}>
              <span className={"text-xl font-medium"}>Full history on LinkedIn</span>
              <ArrowIcon />
            </Tile>
          ) : null}
        </div>
      </div>
    </section>
  );
}
