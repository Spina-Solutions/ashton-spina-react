import { Tile, ArrowIcon } from "../../components/bento/Tile.js";
import { SectionHeader } from "../../components/bento/SectionHeader.js";
import { featuredProjects, type FeaturedProject } from "../../content/projects.js";

export function ProjectsSection({ title }: { title: string }) {
  const [featured, ...rest] = featuredProjects;

  return (
    <section id="projects" className={"pt-12"}>
      <SectionHeader title={title} />
      <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"}>
        <ProjectTile project={featured} featured />
        {rest.map((project) => (
          <ProjectTile key={project.name} project={project} />
        ))}
        <Tile tone="ink" href="/archive" className={"sm:col-span-2 md:col-span-2 flex items-end justify-between gap-4 min-h-[140px]"}>
          <div className={"text-2xl font-medium leading-tight"}>Every project,<br />since 2015</div>
          <ArrowIcon className={"h-7 w-7"} />
        </Tile>
      </div>
    </section>
  );
}

function ProjectTile({ project, featured = false }: { project: FeaturedProject; featured?: boolean }) {
  return (
    <Tile
      tone={project.tone}
      href={project.href}
      external
      className={`flex flex-col gap-4 ${featured ? "sm:col-span-2 md:row-span-2" : ""}`}
    >
      <div className={"flex items-start justify-between gap-3"}>
        <div className={"flex items-center gap-3"}>
          <img src={project.logo} alt="" className={"h-10 w-10 rounded-xl bg-white object-contain ring-1 ring-black/5"} />
          <div>
            <div className={`${featured ? "text-2xl" : "text-lg"} font-medium leading-tight`}>{project.name}</div>
            <StatusBadge status={project.status} />
          </div>
        </div>
        <ArrowIcon />
      </div>
      <p className={`text-sm leading-relaxed opacity-80 ${featured ? "max-w-md" : ""}`}>{project.description}</p>
      {project.screenshot ? (
        <div className={`mt-auto overflow-hidden rounded-2xl ring-1 ring-black/10 ${featured ? "aspect-[1200/630]" : "hidden md:block"}`}>
          <img
            src={project.screenshot}
            alt={`${project.name} screenshot`}
            loading="lazy"
            className={`w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] ${featured ? "h-full" : "h-28"}`}
          />
        </div>
      ) : null}
    </Tile>
  );
}

function StatusBadge({ status }: { status: FeaturedProject["status"] }) {
  return (
    <span className={"inline-flex items-center gap-1.5 text-xs opacity-75"}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === "live" ? "bg-emerald-500" : "bg-current opacity-50"}`} />
      {status === "live" ? "Live" : "Archived"}
    </span>
  );
}
