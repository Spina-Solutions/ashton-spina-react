import { useData } from "vike-react/useData";
import { Markdown } from "../../../components/Markdown.js";
import { Tile } from "../../../components/bento/Tile.js";
import { formatArticleDate } from "../../../utils/dates.js";
import type { Data } from "./+data.js";

export default function ArticlePage() {
  const { article } = useData<Data>();

  return (
    <article className={"space-y-3"}>
      <header className={"rounded-[28px] bg-ink p-6 sm:p-12 text-paper dark:bg-paper dark:text-ink"}>
        <BackLink />
        <div className={"mt-10 text-sm opacity-60 tabular-nums"}>
          {formatArticleDate(article.date)} · {article.readTime}
        </div>
        <h1 className={"mt-3 max-w-3xl text-4xl sm:text-6xl font-medium leading-[0.95] tracking-tight"}>{article.title}</h1>
        <p className={"mt-5 max-w-2xl text-lg opacity-75"}>{article.excerpt}</p>
      </header>

      <Tile className={"sm:!p-12"}>
        <div className={"mx-auto max-w-2xl"}>
          {article.content ? <Markdown source={article.content} skipTitle /> : null}
        </div>
      </Tile>

      <Tile tone="coral" href="/media" className={"flex items-center justify-between"}>
        <span className={"text-xl font-medium"}>More writing</span>
        <span aria-hidden className={"text-2xl transition-transform group-hover:translate-x-1"}>→</span>
      </Tile>
    </article>
  );
}

function BackLink() {
  return (
    <a href="/media" className={"group inline-flex items-center gap-2 rounded-full bg-white/10 dark:bg-black/10 px-4 py-2 text-sm hover:bg-coral hover:text-white transition-colors"}>
      <span aria-hidden className={"transition-transform group-hover:-translate-x-0.5"}>←</span>
      All writing
    </a>
  );
}
