import type { PageContext } from "vike/types";
import { ogImage } from "../../content/ogImages.js";

export default (pageContext: PageContext) => ogImage(pageContext.urlParsed.search.mode === "work" ? "work" : "home");
