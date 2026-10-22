import React, { useMemo } from "react";
import type { ExperienceItem } from "../content/experience.js";

type Group = {
  company: string;
  logo?: string;
  brandColor?: string;
  link?: string;
  cover?: string;
  coverPosition?: ExperienceItem["coverPosition"];
  roles: ExperienceItem[];
};

function parseDateLoose(label?: string): Date {
  if (!label) return new Date(0);
  const s = label.trim();
  if (/present/i.test(s)) return new Date();
  const months: Record<string, number> = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, sept: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11,
  };
  const parts = s.split(/\s+/);
  if (parts.length >= 2) {
    const m = months[parts[0].toLowerCase()];
    const y = Number(parts[1].replace(/[^0-9]/g, ""));
    if (!Number.isNaN(m) && !Number.isNaN(y)) return new Date(y, m, 1);
  }
  const yOnly = Number(s.replace(/[^0-9]/g, ""));
  if (!Number.isNaN(yOnly) && yOnly > 1900 && yOnly < 3000) return new Date(yOnly, 0, 1);
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d;
  return new Date(0);
}

function normalizeCompanyName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("homegate") || n.includes("immoscout24") || n.includes("smg")) {
    return "SMG Swiss Marketplace Group";
  }
  if (n.includes("belsimpel") || n.includes("gomibo")) {
    return "Belsimpel (Gomibo)";
  }
  return name;
}

const COVER_POSITION = { left: "object-left", center: "object-center", right: "object-right" } as const;

export function Experience({ items }: { items: ExperienceItem[] }) {
  const groups = useMemo<Group[]>(() => {
    const byCompany = new Map<string, Group>();
    for (const item of items) {
      const key = normalizeCompanyName(item.company);
      const existing = byCompany.get(key);
      if (!existing) {
        byCompany.set(key, {
          company: key,
          logo: item.logo,
          brandColor: item.brandColor,
          link: item.link,
          cover: item.cover,
          coverPosition: item.coverPosition,
          roles: [item],
        });
      } else {
        existing.roles.push(item);
        existing.logo = item.logo || existing.logo;
        existing.brandColor = item.brandColor || existing.brandColor;
        existing.cover = item.cover || existing.cover;
        existing.coverPosition = item.coverPosition || existing.coverPosition;
        existing.link = item.link || existing.link;
      }
    }
    // Sort roles within a group from most recent to least recent
    for (const g of byCompany.values()) {
      g.roles.sort((a, b) => parseDateLoose(b.start).getTime() - parseDateLoose(a.start).getTime());
    }
    const groupNewestTime = (g: Group) => {
      const times = g.roles.map((r) => {
        const end = parseDateLoose(r.end);
        const start = parseDateLoose(r.start);
        return Math.max(end.getTime(), start.getTime());
      });
      return Math.max(...times, 0);
    };
    return Array.from(byCompany.values()).sort((a, b) => groupNewestTime(b) - groupNewestTime(a));
  }, [items]);

  return (
    <div className={"grid grid-cols-1 gap-3"}>
      {groups.map((g) => (
        <section key={g.company} className={"rounded-[28px] overflow-hidden bg-white ring-1 ring-black/5 dark:bg-tile-dark dark:ring-white/5"}>
          {g.cover ? (
            <div className={"h-28 sm:h-36 w-full overflow-hidden"} aria-hidden>
              <img src={g.cover} alt="" className={`w-full h-full object-cover ${COVER_POSITION[g.coverPosition ?? "center"]}`} />
            </div>
          ) : null}
          <div className={"p-5 sm:p-6"}>
            <div className={"flex items-center gap-3 mb-4"}>
              <div
                className={"shrink-0 w-11 h-11 rounded-xl overflow-hidden bg-white ring-1 ring-black/5 flex items-center justify-center"}
                aria-hidden
              >
                {g.logo ? (
                  <img src={g.logo} alt="" className={"w-full h-full object-contain"} />
                ) : (
                  <span className={"text-xs font-semibold text-gray-700 dark:text-gray-200"}>
                    {g.company.substring(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <div className={"flex-1 min-w-0"}>
                <a href={g.link} target="_blank" rel="noreferrer" className={"text-xl font-medium hover:text-coral transition-colors"}>
                  {g.company}
                </a>
              </div>
            </div>

            {/* Roles */}
            <ul className={"space-y-4"}>
              {g.roles.map((r) => (
                <li key={`${r.role}-${r.start}`}>
                  <div className={"flex items-center justify-between gap-3"}>
                    <div>
                      <div className={"font-medium"}>{r.role}</div>
                      <div className={"text-xs tabular-nums opacity-60"}>{r.start} – {r.end}</div>
                    </div>
                  </div>
                  {r.highlights && r.highlights.length > 0 ? (
                    <ul className={"mt-2 list-disc pl-5 text-sm opacity-80 space-y-1 marker:text-coral"}>
                      {r.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}
