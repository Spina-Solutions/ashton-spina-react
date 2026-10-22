// The "AS" mark, matching the favicon and app icon (assets/icons): paper A, coral S on ink.
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink text-[15px] font-medium tracking-[-0.06em] ring-1 ring-transparent dark:ring-white/15 ${className ?? ""}`}
    >
      <span>
        <span className={"text-paper"}>A</span>
        <span className={"text-coral"}>S</span>
      </span>
    </span>
  );
}
