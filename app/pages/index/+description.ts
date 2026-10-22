import type { PageContext } from "vike/types";
import { SEO } from "../../content/site.js";

export default (pageContext: PageContext) => (pageContext.urlParsed.search.mode === "work" ? SEO.work : SEO.home).description;
