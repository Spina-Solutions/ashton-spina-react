import { useState } from "react";
import conjugr8Logo from "../../assets/logos/conjugr8_logo.svg";
import { Tile, TileLabel, ArrowIcon } from "../bento/Tile.js";
import { SectionHeader } from "../bento/SectionHeader.js";
import { LanguageWorldMap } from "../LanguageWorldMap.js";
import { spokenLanguages, type SpokenLanguage } from "../../content/spokenLanguages.js";
import { CEFR_STEPS, cefrLabel, cefrStepsReached } from "../../utils/cefr.js";

export function LanguagesSection() {
  const [focused, setFocused] = useState<SpokenLanguage | null>(null);

  return (
    <section id="languages" className={"pt-12"}>
      <SectionHeader title="Languages" />
      <div className={"grid grid-cols-1 lg:grid-cols-3 gap-3"}>
        <Tile className={"lg:col-span-2 flex flex-col gap-4"}>
          <div className={"flex items-center justify-between gap-3"}>
            <TileLabel>{focused ? `Where ${focused.name} gets me by` : "Where I can get by"}</TileLabel>
            {focused ? <span className={"text-sm opacity-60"}>{focused.countries.length} countries</span> : null}
          </div>
          <div className={"my-auto"}>
            <LanguageWorldMap languages={spokenLanguages} focused={focused} />
          </div>
        </Tile>

        <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3"}>
          <Tile className={"!p-2"}>
            <ul onMouseLeave={() => setFocused(null)}>
              {spokenLanguages.map((language) => (
                <LanguageRow
                  key={language.name}
                  language={language}
                  isFocused={focused?.name === language.name}
                  onFocus={() => setFocused(language)}
                  onBlur={() => setFocused(null)}
                />
              ))}
            </ul>
          </Tile>
          <Tile tone="ink" href="https://conjugr8.com" external className={"flex items-center gap-4"}>
            <img src={conjugr8Logo} alt="" className={"h-11 w-11 rounded-xl"} />
            <div className={"flex-1"}>
              <div className={"text-lg font-medium leading-tight"}>Practising with Conjugr8</div>
              <div className={"text-sm opacity-70"}>The verb trainer I built for it</div>
            </div>
            <ArrowIcon />
          </Tile>
        </div>
      </div>
    </section>
  );
}

function LanguageRow({
  language,
  isFocused,
  onFocus,
  onBlur,
}: {
  language: SpokenLanguage;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const reached = cefrStepsReached(language.level);

  return (
    <li>
      <button
        type="button"
        onMouseEnter={onFocus}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={isFocused ? onBlur : onFocus}
        aria-pressed={isFocused}
        className={`w-full rounded-[20px] px-4 py-3 text-left transition-colors ${isFocused ? "bg-paper dark:bg-white/10" : "hover:bg-paper/60 dark:hover:bg-white/5"}`}
      >
        <div className={"flex items-baseline justify-between gap-3"}>
          <span className={"flex items-center gap-2.5"}>
            <span className={`h-3 w-3 rounded-full ${language.swatch}`} aria-hidden />
            <span className={"text-lg font-medium"}>{language.native}</span>
          </span>
          <span className={"text-xs opacity-60"}>
            {language.level === "Native" ? "Native" : `${language.level} · ${cefrLabel(language.level)}`}
          </span>
        </div>
        <div className={"mt-2.5 grid grid-cols-6 gap-1"} aria-label={`${reached} of ${CEFR_STEPS.length} CEFR levels`}>
          {CEFR_STEPS.map((step, i) => (
            <span key={step} className={`h-1.5 rounded-full ${i < reached ? language.swatch : "bg-black/10 dark:bg-white/10"}`} />
          ))}
        </div>
      </button>
    </li>
  );
}
