// https://vike.dev/Head

import faviconUrl from "../assets/logos/as.png";

export default function HeadDefault() {
  return (
    <>
      <link rel="icon" href={faviconUrl} />
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
      <meta property="og:site_name" content="Ashton Spina" />
      {/* title/description (and their og: twins) come from each page's config via vike-react */}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />

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
