import { archiveProjects, type ArchiveProject } from "../../content/archive.js";
import { Tile } from "../../components/bento/Tile.js";
import { PageHeader } from "../../components/bento/SectionHeader.js";

export default function ArchivePage() {
  return (
    <div className={"space-y-3"}>
      <PageHeader title="Archive" intro="Everything I've built or led, from university research apps to marketplace platforms." />
      <Tile className={"!p-2 sm:!p-4"}>
        <ul>
          {archiveProjects.map((project) => (
            <ArchiveRow key={`${project.year}-${project.name}`} project={project} />
          ))}
        </ul>
      </Tile>
    </div>
  );
}

function ArchiveRow({ project }: { project: ArchiveProject }) {
  const content = (
    <div className={"grid gap-x-6 gap-y-2 md:grid-cols-[5rem_1fr_14rem]"}>
      <div className={"text-sm tabular-nums opacity-60 md:pt-1"}>{project.year}</div>
      <div>
        <div className={"flex items-center gap-2 text-lg font-medium leading-snug"}>
          {project.name}
          {project.link ? <span aria-hidden className={"text-sm opacity-40 transition group-hover:opacity-100 group-hover:text-coral"}>↗</span> : null}
        </div>
        {project.description ? <p className={"mt-1 text-sm opacity-70"}>{project.description}</p> : null}
        <div className={"mt-3 flex flex-wrap gap-1.5"}>
          {project.builtWith.map((tech) => (
            <span key={tech} className={"rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-1 text-xs"}>
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className={"text-sm opacity-70 md:pt-1 md:text-right"}>{project.madeAt}</div>
    </div>
  );

  return (
    <li className={"border-t border-black/5 dark:border-white/10 first:border-t-0"}>
      {project.link ? (
        <a href={project.link} target="_blank" rel="noreferrer" className={"group block rounded-2xl px-3 py-4 sm:px-4 hover:bg-paper dark:hover:bg-white/5 transition-colors"}>
          {content}
        </a>
      ) : (
        <div className={"px-3 py-4 sm:px-4"}>{content}</div>
      )}
    </li>
  );
}
