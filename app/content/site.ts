export const SITE_URL = "https://www.ashtonspina.com";
export const SITE_NAME = "Ashton Spina";

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

// Canonical keeps ?mode=work (a different page) and drops every other query param.
export function canonicalUrl(pathname: string, search: Record<string, string>): string {
  const mode = search.mode === "work" && pathname === "/" ? "?mode=work" : "";
  return absoluteUrl(`${pathname}${mode}`);
}

export const SEO = {
  home: {
    title: "Ashton Spina · Marketplace engineering leader and builder",
    description:
      "Ashton Spina builds and leads marketplace engineering from Helsinki. Projects like JobCrawls and Conjugr8, travel photography from 31 countries, and the languages he's learning.",
  },
  work: {
    title: "Ashton Spina · Marketplace engineering consultant and fractional Head of Engineering",
    description:
      "Fractional Head of Engineering for marketplaces. Former Head of Engineering for SMG Real Estate B2B (~40% of group revenue); part of the homegate.ch and immoscout24.ch merger and the flatfox acquisition.",
  },
} as const;
