import ashtonProfileVideo from "../../assets/ashton_profile.MOV";
import logoTechTacticsOy from "../../assets/logos/logoTechTacticsOy.png";
import { Tile, TileLabel, ArrowIcon } from "../../components/bento/Tile.js";
import { ModeToggle } from "../../components/bento/ModeToggle.js";
import { contactLinks, socialLinks } from "../../content/links.js";
import { VISITED_COUNTRIES } from "../../content/travel.js";
import { experienceItems } from "../../content/experience.js";
import { mediaItems } from "../../content/media.js";
import { useHelsinkiTime } from "../../hooks/useHelsinkiTime.js";
import { spokenLanguages } from "../../content/spokenLanguages.js";

const TAGLINES = {
  personal: "Building thoughtful products. Exploring the world through code and photography.",
  work: "Engineering leader and product builder. I scale teams and ship software people rely on.",
};

export function HeroBento({ isWorkMode }: { isWorkMode: boolean }) {
  return (
    <header id="top" className={"stagger grid grid-cols-2 md:grid-cols-4 gap-3"}>
      <NameTile isWorkMode={isWorkMode} />
      <PortraitTile />
      {isWorkMode ? <WorkTiles /> : <PersonalTiles />}
    </header>
  );
}

function NameTile({ isWorkMode }: { isWorkMode: boolean }) {
  return (
    <Tile tone="ink" className={"col-span-2 md:row-span-2 flex flex-col justify-between gap-10 min-h-[320px]"}>
      <div>
        <ModeToggle inverted />
      </div>
      <div>
        <h1 className={"text-6xl sm:text-7xl lg:text-8xl font-medium leading-[0.88] tracking-tight"}>
          Ashton
          <br />
          Spina
        </h1>
        <p className={"mt-5 max-w-md text-base sm:text-lg opacity-75"}>{isWorkMode ? TAGLINES.work : TAGLINES.personal}</p>
        <div className={"mt-6 flex flex-wrap gap-2"}>
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className={"inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ring-1 ring-current/25 hover:bg-coral hover:text-white hover:ring-coral transition-colors"}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </Tile>
  );
}

function PortraitTile() {
  return (
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
  );
}

function PersonalTiles() {
  // The language currently being learned is the strongest one that isn't native.
  const learning = spokenLanguages.find((l) => l.level !== "Native");

  return (
    <>
      <Tile tone="coral" href="#travel" className={"flex flex-col justify-between min-h-[150px]"}>
        <div className={"flex justify-between"}>
          <TileLabel>Countries</TileLabel>
          <ArrowIcon />
        </div>
        <div className={"text-6xl font-medium tracking-tight"}>{VISITED_COUNTRIES.length}</div>
      </Tile>
      <Tile tone="sun" href="#languages" className={"flex flex-col justify-between min-h-[150px]"}>
        <div className={"flex justify-between"}>
          <TileLabel>Learning</TileLabel>
          <ArrowIcon />
        </div>
        <div>
          <div className={"text-3xl font-medium tracking-tight"}>{learning?.native ?? "Languages"}</div>
          <div className={"text-sm opacity-75"}>{learning ? `${learning.level} and climbing` : "A work in progress"}</div>
        </div>
      </Tile>
      <Tile className={"col-span-2"}>
        <TileLabel className={"mb-3"}>Find me on</TileLabel>
        <div className={"flex flex-wrap gap-2"}>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={"rounded-full bg-black/5 dark:bg-white/10 px-3 py-1.5 text-sm hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors"}
            >
              {link.label}
            </a>
          ))}
        </div>
      </Tile>
      <Tile tone="sage" href="/recommendations" className={"flex flex-col justify-between min-h-[150px]"}>
        <div className={"flex justify-between"}>
          <TileLabel>Worth your time</TileLabel>
          <ArrowIcon />
        </div>
        <div className={"text-2xl font-medium leading-tight"}>Recommendations</div>
      </Tile>
      <TimeTile />
    </>
  );
}

function WorkTiles() {
  const current = experienceItems[0];
  const latestArticle = [...mediaItems]
    .filter((m) => m.category === "article")
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <>
      <Tile tone="coral" className={"flex flex-col justify-between gap-4 min-h-[150px]"}>
        <TileLabel>Company</TileLabel>
        <div className={"flex items-center gap-3"}>
          <img src={logoTechTacticsOy} alt="" className={"h-10 w-10 rounded-xl bg-white object-contain p-1"} />
          <div>
            <div className={"text-lg font-medium leading-tight"}>TechTactics Oy</div>
            <div className={"text-xs opacity-80"}>Consulting and development</div>
          </div>
        </div>
      </Tile>
      <Tile tone="sun" href="#experience" className={"flex flex-col justify-between gap-4 min-h-[150px]"}>
        <div className={"flex justify-between"}>
          <TileLabel>Currently</TileLabel>
          <ArrowIcon />
        </div>
        <div>
          <div className={"text-lg font-medium leading-tight"}>{current.role.split("·")[0].trim()}</div>
          <div className={"text-xs opacity-75"}>{current.company}</div>
        </div>
      </Tile>
      {latestArticle ? (
        <Tile tone="sage" href={`/media/${latestArticle.id}`} className={"col-span-2 flex flex-col justify-between gap-6"}>
          <div className={"flex justify-between"}>
            <TileLabel>Latest writing</TileLabel>
            <ArrowIcon />
          </div>
          <div className={"text-2xl font-medium leading-tight"}>{latestArticle.title}</div>
        </Tile>
      ) : null}
      <Tile href="/archive" className={"flex flex-col justify-between min-h-[150px]"}>
        <div className={"flex justify-between"}>
          <TileLabel>Since 2015</TileLabel>
          <ArrowIcon />
        </div>
        <div className={"text-2xl font-medium leading-tight"}>Project archive</div>
      </Tile>
      <TimeTile />
    </>
  );
}

function TimeTile() {
  const time = useHelsinkiTime();
  return (
    <Tile className={"flex flex-col justify-between min-h-[150px]"}>
      <TileLabel>Based in</TileLabel>
      <div>
        <div className={"text-2xl font-medium leading-tight"}>Helsinki</div>
        <div className={"text-sm opacity-60 tabular-nums"}>{time ? `${time} local time` : "Finland"}</div>
      </div>
    </Tile>
  );
}
