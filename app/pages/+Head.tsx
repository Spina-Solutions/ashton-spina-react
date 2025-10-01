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
      <meta name="theme-color" content="#0b1220" media="(prefers-color-scheme: dark)" />
      <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
      <meta property="og:site_name" content="Ashton Spina" />
      <meta property="og:title" content="Ashton Spina — Living for the world's experiences" />
      <meta
        property="og:description"
        content="Building thoughtful products. Exploring the world through code and photography. Full-stack developer with a passion for creating meaningful digital experiences."
      />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Ashton Spina — Living for the world's experiences" />
      <meta
        name="twitter:description"
        content="Building thoughtful products. Exploring the world through code and photography. Full-stack developer with a passion for creating meaningful digital experiences."
      />

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
    </>
  );
}
