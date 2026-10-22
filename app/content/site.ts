export const SITE_URL = "https://www.ashtonspina.com";
export const SITE_NAME = "Ashton Spina";

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

// Query params never make a different page; the home page's work mode is a preview of /consulting.
export function canonicalUrl(pathname: string, search: Record<string, string>): string {
  if (pathname === "/" && search.mode === "work") return absoluteUrl("/consulting");
  return absoluteUrl(pathname);
}

// Breadcrumb names by path; the current page falls back to its own title.
export const PAGE_NAMES: Record<string, string> = {
  "/consulting": "Consulting",
  "/consulting/smg-real-estate": "Building SMG Real Estate",
  "/travel": "Travel",
  "/languages": "Languages",
  "/media": "Writing",
  "/archive": "Archive",
  "/recommendations": "Worth the trip",
};

export const SEO = {
  home: {
    title: "Ashton Spina · Marketplace engineering leader and builder",
    description:
      "Ashton Spina builds and leads marketplace engineering from Helsinki. Projects like JobCrawls and Conjugr8, travel photography from 31 countries, and the languages he's learning.",
  },
  work: {
    title: "Ashton Spina · Marketplace engineering consultant and fractional Head of Engineering",
    description:
      "Fractional Head of Engineering for marketplaces. Former Head of Engineering for SMG Real Estate B2B (~40% of group revenue); part of the homegate.ch and immoscout24.ch merger and the flatfox and immoverkauf24.ch acquisitions.",
  },
} as const;
