export function SectionCard({ title, href, description }: { title: string; href: string; description: string }) {
  return (
    <a
      href={href}
      className={"group block p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50 transition-shadow hover:shadow-md"}
    >
      <div className={"flex items-start justify-between gap-3"}>
        <h3 className={"font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100"}>{title}</h3>
        <span
          aria-hidden
          className={
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 transition-transform group-hover:translate-x-0.5 dark:bg-blue-900/30 dark:text-blue-200"
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={"h-4 w-4"}>
            <path d="M5 10a1 1 0 011-1h5.586L9.293 6.707A1 1 0 1110.707 5.293l4 4a1 1 0 010 1.414l-4 4A1 1 0 019.293 13.293L11.586 11H6a1 1 0 01-1-1z" />
          </svg>
        </span>
      </div>
      <p className={"text-sm text-gray-600 dark:text-gray-300"}>{description}</p>
    </a>
  );
}


