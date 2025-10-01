// Removed custom CSS in favor of Tailwind utility classes

import "./tailwind.css";
import { Link } from "../components/Link.js";
import { ThemeToggle } from "../components/ThemeToggle.js";
import { Footer } from "../components/Footer.js";
import { useEffect, useState } from "react";
import ashtonProfileVideo from "../assets/ashton_profile.MOV";

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <div className={"min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col"}>
      <TopNav />
      <Content>{children}</Content>
      <Footer />
    </div>
  );
}

function TopNav() {
  const [showMini, setShowMini] = useState(false);
  const [isWorkMode, setIsWorkMode] = useState(false);

  useEffect(() => {
    function onScroll() {
      try {
        const hero = document.querySelector("header");
        const threshold = 120;
        const y = window.scrollY || 0;
        setShowMini(y > threshold && !!hero);
      } catch {}
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const getCurrentMode = () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('mode') === 'work';
      }
      return false;
    };
    
    const updateMode = () => {
      setIsWorkMode(getCurrentMode());
    };
    
    // Initial check
    updateMode();
    
    // Listen for URL changes (including back/forward navigation)
    window.addEventListener('popstate', updateMode);
    
    // Listen for custom mode change events
    window.addEventListener('modeChanged', updateMode);
    
    return () => {
      window.removeEventListener('popstate', updateMode);
      window.removeEventListener('modeChanged', updateMode);
    };
  }, []);

  return (
    <div
      className={
        "sticky top-0 z-[110] backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 border-b border-gray-200/70 dark:border-gray-800/70"
      }
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className={"mx-auto max-w-3xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-4"}>
        <div className={"flex items-center gap-3 min-w-0"}>
          {showMini ? (
            <a href="/" className={"flex items-center gap-2 shrink-0"} aria-label="Home">
              <div className={"h-7 w-7 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 ring-1 ring-gray-300/60 dark:ring-gray-700/60"}>
                <video
                  src={ashtonProfileVideo}
                  className={"h-full w-full object-cover"}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-hidden
                />
              </div>
              <span className={"text-sm font-medium truncate max-w-[10rem]"}>Ashton Spina</span>
            </a>
          ) : (
            <div className={"flex items-center gap-2 shrink-0 opacity-0 pointer-events-none"}>
              <div className={"h-7 w-7"} aria-hidden />
              <span className={"text-sm font-medium truncate max-w-[10rem]"} aria-hidden>Ashton Spina</span>
            </div>
          )}
        </div>
        <nav className={"hidden sm:block"} aria-label="Primary">
          <ul className={"flex items-center gap-2 text-xs font-medium"}>
            <li>
              <a href="/#projects" className={"inline-flex items-center h-9 px-2 rounded-lg text-gray-700 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5"}>Projects</a>
            </li>
            {isWorkMode ? (
              <>
                <li>
                  <a href="/#experience" className={"inline-flex items-center h-9 px-2 rounded-lg text-gray-700 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5"}>Experience</a>
                </li>
                <li>
                  <a href="/#content" className={"inline-flex items-center h-9 px-2 rounded-lg text-gray-700 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5"}>Content</a>
                </li>
                <li>
                  <a href="/#languages" className={"inline-flex items-center h-9 px-2 rounded-lg text-gray-700 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5"}>Languages</a>
                </li>
                <li>
                  <a href="/media" className={"inline-flex items-center h-9 px-2 rounded-lg text-gray-700 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5"}>Media</a>
                </li>
                <li>
                  <a href="/archive" className={"inline-flex items-center h-9 px-2 rounded-lg text-gray-700 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5"}>Archive</a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href="/#photos" className={"inline-flex items-center h-9 px-2 rounded-lg text-gray-700 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5"}>Photos</a>
                </li>
                <li>
                  <a href="/#travel" className={"inline-flex items-center h-9 px-2 rounded-lg text-gray-700 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5"}>Travel</a>
                </li>
                <li>
                  <a href="/#languages" className={"inline-flex items-center h-9 px-2 rounded-lg text-gray-700 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5"}>Languages</a>
                </li>
                <li>
                  <a href="/recommendations" className={"inline-flex items-center h-9 px-2 rounded-lg text-gray-700 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5"}>Recommendations</a>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className={"justify-self-end"}>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <main id="page-container" className={"flex-1"}>
      <div id="page-content" className={"mx-auto max-w-3xl px-4 py-6 pb-10"}>
        {children}
      </div>
    </main>
  );
}
