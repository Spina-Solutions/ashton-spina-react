import type { PageContext } from "vike/types";
import type { Data } from "./+data.js";

export default function description(pageContext: PageContext<Data>): string {
  return pageContext.data.article.excerpt;
}
