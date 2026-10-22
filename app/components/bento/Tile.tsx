import type { ReactNode } from "react";
import type { TileTone } from "../../types/bento.js";

const TONE_CLASSES: Record<TileTone, string> = {
  plain: "bg-white text-ink ring-1 ring-black/5 dark:bg-tile-dark dark:text-gray-100 dark:ring-white/5",
  ink: "bg-ink text-paper dark:bg-paper dark:text-ink",
  // Stays dark in both themes, for content designed on a dark canvas
  night: "bg-ink text-paper dark:bg-tile-dark dark:ring-1 dark:ring-white/10",
  coral: "bg-coral text-white dark:bg-coral-dark",
  sun: "bg-sun text-ink",
  sage: "bg-sage text-white dark:bg-sage-dark",
};

type TileProps = {
  tone?: TileTone;
  className?: string;
  children: ReactNode;
  href?: string;
  external?: boolean;
  id?: string;
  ariaLabel?: string;
};

export function Tile({ tone = "plain", className, children, href, external, id, ariaLabel }: TileProps) {
  const classes = ["relative rounded-[28px] p-5 sm:p-6 overflow-hidden", TONE_CLASSES[tone], className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a
        id={id}
        href={href}
        aria-label={ariaLabel}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={`group block transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral ${classes}`}
      >
        {children}
      </a>
    );
  }

  return (
    <div id={id} aria-label={ariaLabel} className={classes}>
      {children}
    </div>
  );
}

export function TileLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`text-xs font-medium uppercase tracking-[0.14em] opacity-70 ${className ?? ""}`}>{children}</div>;
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${className ?? ""}`}
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
