import type { ReactNode } from "react";
import homegateLogo from "../../assets/logos/homegate_logo.svg";
import flatfoxLogo from "../../assets/logos/flatfox_logo.svg";
import smgLogo from "../../assets/logos/smg_logo.png";
import { Tile, TileLabel } from "../bento/Tile.js";

// Drop the official logo in as assets/logos/immoscout24_logo.(svg|png|webp) and it is picked up here.
const immoscoutLogo = Object.values(
  import.meta.glob<string>("../../assets/logos/immoscout24_logo.{svg,png,webp}", { eager: true, import: "default" }),
)[0];

// Visual case study: homegate.ch and immoscout24.ch merge into SMG Real Estate, which then acquires flatfox and immoverkauf24.ch.
export function MergerStory({ caseStudyHref, showHeading = true }: { caseStudyHref?: string; showHeading?: boolean }) {
  return (
    <section id="case-study" className={"pt-12"}>
      <Tile tone="night" className={"sm:!p-8"}>
        {showHeading ? (
          <div className={"flex flex-wrap items-end justify-between gap-3"}>
            <div>
              <TileLabel>Case study</TileLabel>
              <h2 className={"mt-2 text-3xl sm:text-5xl font-medium leading-[1] tracking-tight"}>Building SMG Real Estate</h2>
            </div>
            <p className={"max-w-sm text-sm opacity-70"}>I was part of the merger that formed SMG Real Estate, and of its acquisitions of flatfox and immoverkauf24.ch.</p>
          </div>
        ) : null}

        <ol className={`stagger ${showHeading ? "mt-8" : ""} grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]`}>
          <li className={"grid gap-2"}>
            <StageLabel step={1}>Two marketplaces</StageLabel>
            <BrandChip>
              <img src={homegateLogo} alt="homegate.ch" className={"h-7 w-auto"} />
            </BrandChip>
            <BrandChip>
              {immoscoutLogo ? (
                <img src={immoscoutLogo} alt="immoscout24.ch" className={"h-10 w-auto"} />
              ) : (
                <>
                  <span className={"grid h-7 w-7 place-items-center rounded-md bg-ink text-xs font-medium text-paper"} aria-hidden>
                    i
                  </span>
                  <span className={"font-medium"}>immoscout24.ch</span>
                </>
              )}
            </BrandChip>
          </li>

          <Connector label="Merger" />

          <li className={"grid gap-2"}>
            <StageLabel step={2}>One company</StageLabel>
            <div className={"flex items-center gap-4 rounded-2xl bg-white/10 px-5 py-5 ring-1 ring-white/15"}>
              <img src={smgLogo} alt="" className={"h-12 w-12 rounded-xl bg-white object-contain"} />
              <div>
                <div className={"text-xl font-medium leading-tight"}>SMG Real Estate</div>
                <div className={"text-xs opacity-60"}>homegate.ch and immoscout24.ch, one organisation</div>
              </div>
            </div>
          </li>

          <Connector label="Acquisitions" />

          <li className={"grid gap-2"}>
            <StageLabel step={3}>Growing it</StageLabel>
            <div className={"rounded-2xl bg-coral p-4 text-white"}>
              <div className={"mb-3 text-sm opacity-90"}>Acquired by SMG and brought into SMG Real Estate</div>
              <div className={"grid gap-2"}>
                <BrandChip>
                  <img src={flatfoxLogo} alt="" className={"h-8 w-8"} />
                  <span className={"font-medium"}>flatfox</span>
                </BrandChip>
                <BrandChip>
                  <span className={"grid h-8 w-8 place-items-center rounded-md bg-ink text-xs font-medium text-paper"} aria-hidden>
                    i
                  </span>
                  <span className={"font-medium"}>immoverkauf24.ch</span>
                </BrandChip>
              </div>
            </div>
          </li>
        </ol>
        {caseStudyHref ? (
          <a
            href={caseStudyHref}
            className={"group mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium hover:bg-coral hover:text-white transition-colors"}
          >
            Read the full case study
            <span aria-hidden className={"transition-transform group-hover:translate-x-0.5"}>→</span>
          </a>
        ) : null}
      </Tile>
    </section>
  );
}

function StageLabel({ step, children }: { step: number; children: ReactNode }) {
  return (
    <div className={"flex items-center gap-2 text-xs uppercase tracking-[0.14em] opacity-60"}>
      <span className={"grid h-5 w-5 place-items-center rounded-full bg-white/15 text-[10px] tabular-nums"}>{step}</span>
      {children}
    </div>
  );
}

function BrandChip({ children }: { children: ReactNode }) {
  return <div className={"flex h-14 items-center gap-3 rounded-2xl bg-white px-4 text-ink"}>{children}</div>;
}

// Horizontal arrow on wide screens, vertical on narrow ones.
function Connector({ label }: { label: string }) {
  return (
    <li aria-hidden className={"flex items-center justify-center gap-2 py-1 lg:flex-col lg:px-2"}>
      <span className={"text-xs font-medium uppercase tracking-[0.14em] text-coral"}>{label}</span>
      <svg viewBox="0 0 48 24" className={"h-6 w-12 rotate-90 lg:rotate-0 text-coral"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h42M36 4l8 8-8 8" />
      </svg>
    </li>
  );
}
