import type { PageContextServer } from "vike/types";
import { render } from "vike/abort";
import { mediaItems, type Article } from "../../../content/media.js";

export type Data = { article: Article };

export default function data(pageContext: PageContextServer): Data {
  const { id } = pageContext.routeParams;
  const article = mediaItems.find((item) => item.id === id && item.category === "article");
  if (!article) throw render(404, `Article "${id}" not found`);
  return { article };
}
