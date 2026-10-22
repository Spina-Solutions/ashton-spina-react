import type { PageContext } from "vike/types";
import type { Data } from "./+data.js";
import { ogImage } from "../../../content/ogImages.js";

export default (pageContext: PageContext<Data>) => ogImage(`article-${pageContext.data.article.id}`) ?? ogImage("writing");
