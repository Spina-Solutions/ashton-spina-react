import { recommendations, type Recommendation, type RecommendationCategory } from "../../content/recommendations.js";
import { Tile, TileLabel } from "../../components/bento/Tile.js";
import { PageHeader } from "../../components/bento/SectionHeader.js";
import type { TileTone } from "../../types/bento.js";

const CATEGORIES: Array<{ id: RecommendationCategory; label: string; tone: TileTone; wide?: boolean }> = [
  { id: "travel", label: "Places", tone: "coral" },
  { id: "film-tv", label: "Film and TV", tone: "plain" },
  { id: "books", label: "Books", tone: "sun" },
  { id: "restaurants", label: "Restaurants", tone: "plain" },
  { id: "albums", label: "Albums", tone: "sage", wide: true },
];

export default function RecommendationsPage() {
  return (
    <div className={"space-y-3"}>
      <PageHeader title="Recommendations" intro="Places, stories, food and music I keep telling people about." />
      <div className={"stagger grid gap-3 md:grid-cols-2"}>
        {CATEGORIES.map((category) => (
          <Tile key={category.id} tone={category.tone} className={category.wide ? "md:col-span-2" : ""}>
            <TileLabel className={"mb-4"}>{category.label}</TileLabel>
            <ul className={`grid gap-1 ${category.wide ? "sm:grid-cols-2 gap-x-6" : ""}`}>
              {recommendations
                .filter((rec) => rec.category === category.id)
                .map((rec) => (
                  <RecommendationRow key={rec.title} rec={rec} />
                ))}
            </ul>
          </Tile>
        ))}
      </div>
    </div>
  );
}

function RecommendationRow({ rec }: { rec: Recommendation }) {
  const body = (
    <>
      <div className={"flex items-baseline justify-between gap-3"}>
        <span className={"text-lg font-medium leading-snug"}>{rec.title}</span>
        <span className={"shrink-0 text-xs tabular-nums opacity-60"}>
          {rec.link ? `${rec.linkText ?? "Link"} ↗` : rec.year}
        </span>
      </div>
      {rec.description ? <p className={"mt-1 text-sm opacity-75"}>{rec.description}</p> : null}
    </>
  );

  return (
    <li className={"border-t border-current/10 first:border-t-0"}>
      {rec.link ? (
        <a href={rec.link} target="_blank" rel="noreferrer" className={"block -mx-3 rounded-2xl px-3 py-3 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"}>
          {body}
        </a>
      ) : (
        <div className={"py-3"}>{body}</div>
      )}
    </li>
  );
}
