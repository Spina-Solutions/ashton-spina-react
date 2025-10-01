import type { Data } from "vike/types";
import { mediaItems } from "../../../content/media.js";

export default function data(pageContext: { routeParams: { id: string } }): Data {
  const { id } = pageContext.routeParams;
  const article = mediaItems.find(item => item.id === id && item.category === 'article');
  
  if (!article) {
    throw new Error(`Article with id "${id}" not found`);
  }
  
  return {
    article
  };
}


