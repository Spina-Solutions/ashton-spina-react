import { EMAIL, contactLinks } from "../content/links.js";
import { featuredProjects } from "../content/projects.js";
import type { ExternalLink } from "../content/links.js";

const SITE_LINKS: ExternalLink[] = [
  { label: "Projects", href: "/#projects" },
  { label: "Photography", href: "/#photos" },
  { label: "Writing", href: "/media" },
  { label: "Archive", href: "/archive" },
  { label: "Places", href: "/recommendations" },
];

export function Footer() {
  const liveProjects = featuredProjects.filter((p) => p.status === "live");

  return (
    <footer className="px-3 sm:px-6 pb-6">
      <div className="mx-auto max-w-6xl rounded-[28px] bg-ink text-paper dark:bg-tile-dark dark:text-gray-100 p-6 sm:p-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm opacity-60">Got an idea, a role, or a travel tip?</p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-2 inline-block text-3xl sm:text-5xl font-medium tracking-tight underline decoration-coral decoration-4 underline-offset-8 hover:text-coral transition-colors break-all"
            >
              Say hello
            </a>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <FooterColumn title="Site" links={SITE_LINKS} />
            <FooterColumn
              title="Elsewhere"
              links={[...contactLinks, ...liveProjects.map((p) => ({ label: p.name, href: p.href }))]}
            />
          </div>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row justify-between gap-2 text-xs opacity-50">
          <span>© {new Date().getFullYear()} Ashton Spina</span>
          <span>Helsinki · Built with React, Vike and Tailwind</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: ExternalLink[] }) {
  return (
    <div>
      <h3 className="mb-3 text-xs uppercase tracking-[0.14em] opacity-50">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <li key={link.label}>
              <a
                href={link.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="opacity-80 hover:opacity-100 hover:text-coral transition"
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
