import type { ReactNode } from "react";

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className={"mb-3 flex items-end justify-between gap-4 px-1"}>
      <h2 className={"text-2xl sm:text-3xl font-medium tracking-tight"}>{title}</h2>
      {action}
    </div>
  );
}

export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <header className={"rounded-[28px] bg-ink p-6 sm:p-10 text-paper dark:bg-paper dark:text-ink"}>
      <h1 className={"text-4xl sm:text-6xl font-medium leading-[0.95] tracking-tight"}>{title}</h1>
      {intro ? <p className={"mt-4 max-w-xl opacity-75"}>{intro}</p> : null}
    </header>
  );
}
