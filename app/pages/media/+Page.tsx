import { mediaItems } from "../../content/media.js";
import { Tile, TileLabel, ArrowIcon } from "../../components/bento/Tile.js";
import { PageHeader } from "../../components/bento/SectionHeader.js";
import { formatArticleDate } from "../../utils/dates.js";
import type { TileTone } from "../../types/bento.js";

const TONES: TileTone[] = ["sun", "plain", "sage", "plain"];

export default function MediaPage() {
  const items = [...mediaItems].sort((a, b) => b.date.localeCompare(a.date));
  // Feature the newest piece full-width only when the rest still pair up evenly.
  const featureFirst = items.length % 2 === 1;

  return (
    <div className={"space-y-3"}>
      <PageHeader title="Writing" intro="Essays and notes on cities, travel, and building things." />
      <div className={"stagger grid gap-3 md:grid-cols-2"}>
        {items.map((item, i) => {
          const external = item.category === "podcast" && item.url;
          return (
            <Tile
              key={item.id}
              tone={TONES[i % TONES.length]}
              href={external ? item.url : `/media/${item.id}`}
              external={Boolean(external)}
              className={`flex flex-col gap-6 min-h-[260px] ${featureFirst && i === 0 ? "md:col-span-2" : ""}`}
            >
              <div className={"flex justify-between gap-4"}>
                <TileLabel>
                  {formatArticleDate(item.date)} · {item.readTime}
                </TileLabel>
                <ArrowIcon />
              </div>
              <div className={"mt-auto"}>
                <h2 className={`${featureFirst && i === 0 ? "text-4xl sm:text-5xl" : "text-3xl"} font-medium leading-[1.02] tracking-tight`}>{item.title}</h2>
                <p className={"mt-3 max-w-xl opacity-75"}>{item.excerpt}</p>
              </div>
            </Tile>
          );
        })}
      </div>
    </div>
  );
}
