import { SITE_URL, SITE_NAME, PAGE_NAMES, absoluteUrl } from "../content/site.js";
import { consultingServices } from "../content/consulting.js";
import { contactLinks, socialLinks, EMAIL } from "../content/links.js";
import type { Article } from "../content/media.js";

type JsonLd = Record<string, unknown>;

const PERSON_ID = `${SITE_URL}/#person`;
const ORG_ID = `${SITE_URL}/#techtactics`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export type StructuredDataInput = {
  pathname: string;
  pageTitle?: string;
  portraitUrl?: string;
  imageUrl?: string;
  article?: Article;
};

function person(portraitUrl?: string): JsonLd {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    url: SITE_URL,
    ...(portraitUrl ? { image: absoluteUrl(portraitUrl) } : {}),
    jobTitle: "Marketplace engineering consultant",
    worksFor: { "@id": ORG_ID },
    email: `mailto:${EMAIL}`,
    address: { "@type": "PostalAddress", addressLocality: "Helsinki", addressCountry: "FI" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "University of Groningen" },
    knowsAbout: [
      "Online marketplaces",
      "Engineering leadership",
      "Platform mergers and integration",
      "B2B monetisation",
      "AWS serverless architecture",
    ],
    sameAs: [...contactLinks, ...socialLinks].map((l) => l.href).filter((href) => href.startsWith("http")),
  };
}

function organization(): JsonLd {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "TechTactics Oy",
    url: `${SITE_URL}/consulting`,
    founder: { "@id": PERSON_ID },
    address: { "@type": "PostalAddress", addressLocality: "Helsinki", addressCountry: "FI" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Marketplace engineering consulting",
      itemListElement: consultingServices.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.summary, provider: { "@id": ORG_ID } },
      })),
    },
  };
}

function website(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
  };
}

// Home, then one crumb per path segment: /consulting/smg-real-estate -> Home › Consulting › Building SMG Real Estate
export function breadcrumbTrail(pathname: string, pageTitle: string): Array<{ name: string; path: string }> {
  const segments = pathname.split("/").filter(Boolean);
  const trail = [{ name: "Home", path: "/" }];
  segments.forEach((_, i) => {
    const path = `/${segments.slice(0, i + 1).join("/")}`;
    const isLast = i === segments.length - 1;
    trail.push({ name: isLast ? pageTitle : (PAGE_NAMES[path] ?? segments[i]), path });
  });
  return trail;
}

function breadcrumbs(pathname: string, pageTitle: string): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbTrail(pathname, pageTitle).map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

function articleLd(article: Article, pathname: string, imageUrl?: string): JsonLd {
  return {
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    mainEntityOfPage: absoluteUrl(pathname),
    ...(imageUrl ? { image: imageUrl } : {}),
  };
}

// One @graph per page: identity on every page, plus whatever the page is about.
export function buildStructuredData(input: StructuredDataInput): JsonLd {
  const graph: JsonLd[] = [website(), person(input.portraitUrl), organization()];
  if (input.pathname !== "/" && input.pageTitle) graph.push(breadcrumbs(input.pathname, input.pageTitle));
  if (input.article) graph.push(articleLd(input.article, input.pathname, input.imageUrl));
  return { "@context": "https://schema.org", "@graph": graph };
}

// Safe to inline in <script type="application/ld+json">: no closing tags can break out.
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
