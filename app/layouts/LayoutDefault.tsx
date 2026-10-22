import "./tailwind.css";
import { ThemeToggle } from "../components/ThemeToggle.js";
import { Footer } from "../components/Footer.js";
import { ModeToggle } from "../components/bento/ModeToggle.js";
import { BrandMark } from "../components/bento/BrandMark.js";
import { useSiteMode } from "../hooks/useSiteMode.js";
import { useScrolledPast } from "../hooks/useScrolledPast.js";
import type { ExternalLink } from "../content/links.js";

const PERSONAL_NAV: ExternalLink[] = [
  { label: "Consulting", href: "/consulting" },
  { label: "Projects", href: "/#projects" },
  { label: "Travel", href: "/travel" },
  { label: "Languages", href: "/languages" },
  { label: "Places", href: "/recommendations" },
  { label: "Writing", href: "/media" },
];

const WORK_NAV: ExternalLink[] = [
  { label: "Services", href: "/consulting#services" },
  { label: "Case study", href: "/consulting/smg-real-estate" },
  { label: "Track record", href: "/consulting#experience" },
  { label: "Writing", href: "/media" },
  { label: "Contact", href: "/consulting#contact" },
];

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <div className={"font-display min-h-screen flex flex-col bg-paper text-ink dark:bg-paper-dark dark:text-gray-100 antialiased"}>
      <TopNav />
      <main id="page-container" className={"flex-1"}>
        <div id="page-content" className={"mx-auto w-full max-w-6xl px-3 sm:px-6 pt-4 pb-12"}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function TopNav() {
  const { isWorkMode } = useSiteMode();
  const links = isWorkMode ? WORK_NAV : PERSONAL_NAV;
  // The home hero has its own toggle; only show this one once the hero is out of view.
  const pastHero = useScrolledPast(360);

  return (
    <div className={"sticky top-0 z-[110] px-3 sm:px-6 pt-3"} style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}>
      <nav
        aria-label="Primary"
        className={"mx-auto max-w-6xl rounded-full bg-white/80 dark:bg-tile-dark/80 backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10 shadow-sm"}
      >
        <div className={"flex items-center justify-between gap-3 pl-2 pr-2 py-2"}>
          <a href={isWorkMode ? "/?mode=work" : "/"} className={"group flex items-center gap-2 shrink-0 rounded-full"} aria-label="Ashton Spina, home">
            <BrandMark className={"transition-transform group-hover:-rotate-6"} />
            <span className={"hidden sm:inline text-sm font-medium"}>Ashton Spina</span>
          </a>
          <ul className={"flex min-w-0 items-center gap-1 overflow-x-auto text-sm [scrollbar-width:none]"}>
            {links.map((link) => (
              <li key={link.label} className={"shrink-0"}>
                <a href={link.href} className={"inline-flex h-9 items-center rounded-full px-3 opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition"}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className={"flex items-center gap-2 shrink-0"}>
            <div className={`hidden md:block transition-opacity duration-300 ${pastHero ? "opacity-100" : "opacity-0 pointer-events-none"}`} aria-hidden={!pastHero}>
              <ModeToggle />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </div>
  );
}
