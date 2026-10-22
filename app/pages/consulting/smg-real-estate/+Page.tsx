import { Tile, TileLabel, ArrowIcon } from "../../../components/bento/Tile.js";
import { MergerStory } from "../../../components/sections/MergerStory.js";
import { ContactSection } from "../../../components/sections/ConsultingSections.js";
import { consultingServices } from "../../../content/consulting.js";

// Every claim here comes from content/experience.ts; extend both together.
const ROLES = [
  { years: "2019–2020", title: "Full-stack software engineer", where: "Homegate AG" },
  { years: "2020–2022", title: "Engineering manager", where: "Homegate AG" },
  { years: "2022–2026", title: "Head of Engineering, Real Estate B2B", where: "SMG Swiss Marketplace Group" },
];

const CHAPTERS: Array<{ label: string; title: string; points: string[] }> = [
  {
    label: "Homegate",
    title: "Building from inside one marketplace",
    points: [
      "Built analytics and reporting dashboards that helped customers trust the platform.",
      "Rebuilt the transaction service so billing was delivered more efficiently.",
      "As engineering manager, grew the team from 2 to 6 and moved it from onsite to remote working.",
      "Replaced legacy authentication with modern AuthN/AuthZ on AWS Cognito, raising conversion and de-risking the platform.",
      "Expanded the product ladder and targeted third-party services to grow revenue, and centralised customer data so legacy systems could be retired.",
    ],
  },
  {
    label: "The merger",
    title: "homegate.ch and immoscout24.ch become SMG Real Estate",
    points: [
      "Part of merging two of Switzerland's largest property marketplaces into one business.",
      "Worked on integrating the organisations and their processes, not just the platforms.",
    ],
  },
  {
    label: "Acquisitions",
    title: "flatfox and immoverkauf24.ch join",
    points: ["Part of SMG's acquisitions of flatfox and immoverkauf24.ch as SMG Real Estate grew."],
  },
  {
    label: "Leading B2B",
    title: "Head of Engineering for a line worth ~40% of group revenue",
    points: [
      "Led engineering for the Real Estate B2B business, contributing around 40% of SMG revenue.",
      "Coached engineering managers and established feedback, ownership and delivery practices.",
      "Partnered with sales, product, monetisation and marketing so engineering work turned into customer value.",
    ],
  },
];

export default function SmgCaseStudyPage() {
  return (
    <article className={"space-y-3"}>
      <header className={"rounded-[28px] bg-ink p-6 sm:p-12 text-paper dark:bg-paper dark:text-ink"}>
        <a
          href="/consulting"
          className={"group inline-flex items-center gap-2 rounded-full bg-white/10 dark:bg-black/10 px-4 py-2 text-sm hover:bg-coral hover:text-white transition-colors"}
        >
          <span aria-hidden className={"transition-transform group-hover:-translate-x-0.5"}>←</span>
          Consulting
        </a>
        <div className={"mt-10 text-sm opacity-60"}>Case study · 2019–2026</div>
        <h1 className={"mt-3 max-w-3xl text-4xl sm:text-6xl font-medium leading-[0.95] tracking-tight"}>
          Building SMG Real Estate
        </h1>
        <p className={"mt-5 max-w-2xl text-lg opacity-75"}>
          Seven years on Swiss property marketplaces: from engineer at homegate.ch, through the merger with immoscout24.ch and two acquisitions, to leading engineering for a B2B line worth around 40% of SMG revenue.
        </p>
      </header>

      <div className={"grid grid-cols-1 sm:grid-cols-3 gap-3"}>
        {ROLES.map((role, i) => (
          <Tile key={role.years} tone={i === ROLES.length - 1 ? "coral" : "plain"} className={"flex flex-col gap-2"}>
            <TileLabel>{role.years}</TileLabel>
            <div className={"text-xl font-medium leading-tight"}>{role.title}</div>
            <div className={"text-sm opacity-70"}>{role.where}</div>
          </Tile>
        ))}
      </div>

      <MergerStory showHeading={false} />

      <div className={"grid gap-3 pt-9"}>
        {CHAPTERS.map((chapter, i) => (
          <Tile key={chapter.label} className={"grid gap-4 sm:grid-cols-[14rem_1fr] sm:gap-10 sm:!p-10"}>
            <div>
              <div className={"text-sm tabular-nums opacity-50"}>0{i + 1}</div>
              <TileLabel className={"mt-1"}>{chapter.label}</TileLabel>
            </div>
            <div>
              <h2 className={"text-2xl sm:text-3xl font-medium leading-tight tracking-tight"}>{chapter.title}</h2>
              <ul className={"mt-4 space-y-2 list-disc pl-5 marker:text-coral opacity-85"}>
                {chapter.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </Tile>
        ))}
      </div>

      <section className={"pt-9"}>
        <h2 className={"mb-3 px-1 text-2xl sm:text-3xl font-medium tracking-tight"}>Where this helps you</h2>
        <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"}>
          {consultingServices.map((service) => (
            <Tile key={service.title} tone={service.tone} href="/consulting#services" className={"flex flex-col justify-between gap-6 min-h-[150px]"}>
              <div className={"flex justify-end"}>
                <ArrowIcon />
              </div>
              <div className={"text-lg font-medium leading-tight"}>{service.title}</div>
            </Tile>
          ))}
        </div>
      </section>

      <ContactSection />
    </article>
  );
}
