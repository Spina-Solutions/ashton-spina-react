import { usePageContext } from "vike-react/usePageContext";
import { Tile, TileLabel, ArrowIcon } from "../../components/bento/Tile.js";
import { VISITED_COUNTRIES } from "../../content/travel.js";

const SUGGESTIONS = [
  { label: "Home", href: "/", tone: "coral" as const },
  { label: "Writing", href: "/media", tone: "sun" as const },
  { label: "Archive", href: "/archive", tone: "sage" as const },
];

export default function ErrorPage() {
  const { is404 } = usePageContext();

  return (
    <div className={"stagger grid gap-3 md:grid-cols-3"}>
      <Tile tone="ink" className={"md:col-span-3 flex flex-col justify-between gap-12 min-h-[320px] sm:!p-10"}>
        <TileLabel>{is404 ? "Error 404" : "Error 500"}</TileLabel>
        <div>
          <h1 className={"text-6xl sm:text-8xl font-medium leading-[0.9] tracking-tight"}>
            {is404 ? "Off the map." : "Something broke."}
          </h1>
          <p className={"mt-5 max-w-lg text-lg opacity-75"}>
            {is404
              ? `This page doesn't exist, or it moved. Even after ${VISITED_COUNTRIES.length} countries I still take wrong turns.`
              : "That's on me, not you. Try again in a moment."}
          </p>
        </div>
      </Tile>
      {SUGGESTIONS.map((s) => (
        <Tile key={s.href} tone={s.tone} href={s.href} className={"flex items-center justify-between"}>
          <span className={"text-2xl font-medium"}>{s.label}</span>
          <ArrowIcon className={"h-6 w-6"} />
        </Tile>
      ))}
    </div>
  );
}
