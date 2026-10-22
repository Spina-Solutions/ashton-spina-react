// https://vike.dev/Head

import { usePageContext } from "vike-react/usePageContext";
import faviconUrl from "../assets/icons/favicon-48.png";
import appleTouchIconUrl from "../assets/icons/apple-touch-icon.png";
import portraitUrl from "../assets/ashton_profile_still.jpg";
import { SITE_NAME, canonicalUrl } from "../content/site.js";
import { buildStructuredData, serializeJsonLd } from "../utils/structuredData.js";
import { ogImage } from "../content/ogImages.js";
import type { Article } from "../content/media.js";

// Breadcrumb names for top-level pages; articles use their own title.
const PAGE_NAMES: Record<string, string> = {
  "/travel": "Travel",
  "/languages": "Languages",
  "/media": "Writing",
  "/archive": "Archive",
  "/recommendations": "Worth the trip",
};

export default function HeadDefault() {
  const pageContext = usePageContext();
  const { pathname, search } = pageContext.urlParsed;
  const isWorkMode = search.mode === "work";
  const article = (pageContext.data as { article?: Article } | undefined)?.article;
  // Error pages and the private ledger stay out of search indexes
  const noIndex = Boolean(pageContext.is404 || pageContext.errorWhileRendering) || pathname.startsWith("/ledger");
  const canonical = canonicalUrl(pathname, search);

  const structuredData = buildStructuredData({
    pathname,
    pageTitle: article?.title ?? PAGE_NAMES[pathname],
    portraitUrl,
    imageUrl: article ? ogImage(`article-${article.id}`) : undefined,
    article,
  });

  return (
    <>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href={faviconUrl} type="image/png" sizes="48x48" />
      <link rel="apple-touch-icon" href={appleTouchIconUrl} sizes="180x180" />
      {/* Apply Tailwind dark mode early: default to system, override with cookie when set */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{var c=document.cookie||'';var m=/(?:^|; )theme=([^;]+)/.exec(c);var v=m? decodeURIComponent(m[1]) : '';var d=v==='dark' ? true : v==='light' ? false : (window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark', d);}catch(e){}})();",
        }}
      />
      <meta name="theme-color" content="#0f0f0e" media="(prefers-color-scheme: dark)" />
      <meta name="theme-color" content="#f2f0ea" media="(prefers-color-scheme: light)" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap"
      />

      {/* title, description, og:title/description/image and twitter:card come from each page via vike-react */}
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : <link rel="canonical" href={canonical} />}
      <meta name="author" content={SITE_NAME} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:type" content={article ? "article" : isWorkMode || pathname === "/" ? "profile" : "website"} />
      {!article && (isWorkMode || pathname === "/") ? <meta property="profile:first_name" content="Ashton" /> : null}
      {!article && (isWorkMode || pathname === "/") ? <meta property="profile:last_name" content="Spina" /> : null}
      {article ? <meta property="article:published_time" content={article.date} /> : null}
      {article ? <meta property="article:author" content={SITE_NAME} /> : null}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={article ? article.title : `${SITE_NAME}${isWorkMode ? " · marketplace engineering consulting" : ""}`} />
      <link rel="alternate" type="text/plain" title="LLM-friendly summary" href="/llms.txt" />
      {noIndex ? null : (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      )}

      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${import.meta.env.PUBLIC_ENV__GOOGLE_ANALYTICS}`}
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${import.meta.env.PUBLIC_ENV__GOOGLE_ANALYTICS}');`,
        }}
      ></script>
      <script
        async
        src="https://analytics.ahrefs.com/analytics.js"
        data-key="7ZS+wdwfaGmBFVx/JZtmLg"
      />
    </>
  );
}
