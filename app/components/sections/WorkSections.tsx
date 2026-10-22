import { Experience } from "../Experience.js";
import { Tile, TileLabel, ArrowIcon } from "../bento/Tile.js";
import { SectionHeader } from "../bento/SectionHeader.js";
import { experienceItems } from "../../content/experience.js";
import { mediaItems } from "../../content/media.js";

export function ExperienceSection() {
  return (
    <section id="experience" className={"pt-12"}>
      <SectionHeader
        title="Track record"
        action={<a href="/archive" className={"text-sm opacity-70 hover:opacity-100 underline-offset-4 hover:underline"}>Project archive</a>}
      />
      <Experience items={experienceItems} />
    </section>
  );
}

export function WritingSection() {
  const items = [...mediaItems].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section id="writing" className={"pt-12"}>
      <SectionHeader
        title="Writing"
        action={<a href="/media" className={"text-sm opacity-70 hover:opacity-100 underline-offset-4 hover:underline"}>All writing</a>}
      />
      <div className={"grid grid-cols-1 md:grid-cols-2 gap-3"}>
        {items.map((item, index) => {
          const external = item.category === "podcast" && item.url;
          return (
            <Tile
              key={item.id}
              tone={index === 0 ? "sun" : "plain"}
              href={external ? item.url : `/media/${item.id}`}
              external={Boolean(external)}
              className={`flex flex-col gap-4 ${items.length === 1 ? "md:col-span-2" : ""}`}
            >
              <div className={"flex justify-between"}>
                <TileLabel>{item.category === "podcast" ? "Podcast" : "Article"} · {item.readTime}</TileLabel>
                <ArrowIcon />
              </div>
              <div className={"text-2xl font-medium leading-tight"}>{item.title}</div>
              <p className={"text-sm opacity-75"}>{item.excerpt}</p>
            </Tile>
          );
        })}
      </div>
    </section>
  );
}
