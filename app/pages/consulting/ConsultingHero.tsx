import ashtonProfileVideo from "../../assets/ashton_profile.MOV";
import techTacticsMark from "../../assets/logos/techtactics_mark.svg";
import { Tile, TileLabel, ArrowIcon } from "../../components/bento/Tile.js";
import { CONSULTING_ENQUIRY_HREF } from "../../content/consulting.js";
import { contactLinks } from "../../content/links.js";
import { trackEvent } from "../../utils/analytics.js";

export function ConsultingHero() {
  const linkedIn = contactLinks.find((l) => l.label === "LinkedIn");

  return (
    <header className={"stagger grid grid-cols-2 md:grid-cols-4 gap-3"}>
      <Tile tone="ink" className={"col-span-2 md:row-span-2 flex flex-col justify-between gap-10 min-h-[360px] sm:!p-8"}>
        <div className={"flex items-center gap-3"}>
          <img src={techTacticsMark} alt="" className={"h-9 w-9 rounded-xl"} />
          <TileLabel>Consulting through TechTactics Oy</TileLabel>
        </div>
        <div>
          <h1 className={"text-5xl sm:text-6xl lg:text-7xl font-medium leading-[0.92] tracking-tight"}>
            Marketplace engineering, <span className={"text-coral"}>led.</span>
          </h1>
          <p className={"mt-5 max-w-md text-base sm:text-lg opacity-75"}>
            I help marketplaces scale their engineering teams, merge their platforms and grow B2B revenue, as a fractional Head of Engineering or on a focused project.
          </p>
          <div className={"mt-6 flex flex-wrap gap-2"}>
            <a
              href={CONSULTING_ENQUIRY_HREF}
              onClick={() => trackEvent("consulting_enquiry_click", { location: "consulting_hero" })}
              className={"inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-medium text-white hover:bg-coral-dark transition-colors"}
            >
              Work with me <span aria-hidden>→</span>
            </a>
            {linkedIn ? (
              <a
                href={linkedIn.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("linkedin_click", { location: "consulting_hero" })}
                className={"inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium ring-1 ring-current/25 hover:bg-white/10 transition-colors"}
              >
                LinkedIn
              </a>
            ) : null}
          </div>
        </div>
      </Tile>

      <Tile className={"row-span-2 !p-0 min-h-[260px]"}>
        <video
          src={ashtonProfileVideo}
          className={"absolute inset-0 h-full w-full object-cover"}
          autoPlay
          loop
          muted
          playsInline
          aria-label={"Portrait of Ashton Spina"}
        />
      </Tile>

      <Tile tone="sun" className={"flex flex-col justify-between gap-4 min-h-[170px]"}>
        <TileLabel>SMG Real Estate B2B</TileLabel>
        <div>
          <div className={"text-5xl font-medium tracking-tight"}>~40%</div>
          <div className={"text-xs opacity-75"}>of group revenue, from the line I led engineering for</div>
        </div>
      </Tile>

      <Tile tone="sage" href="/consulting/smg-real-estate" className={"flex flex-col justify-between gap-4 min-h-[170px]"}>
        <div className={"flex justify-between"}>
          <TileLabel>Case study</TileLabel>
          <ArrowIcon />
        </div>
        <div>
          <div className={"text-xl font-medium leading-tight"}>1 merger, 2 acquisitions</div>
          <div className={"text-xs opacity-85"}>Building SMG Real Estate</div>
        </div>
      </Tile>
    </header>
  );
}
