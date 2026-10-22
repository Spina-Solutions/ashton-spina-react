import type { PageContext } from "vike/types";
import type { Data } from "./+data.js";

export default function title(pageContext: PageContext<Data>): string {
  return `${pageContext.data.article.title} · Ashton Spina`;
}
