import { usePageContext } from "vike-react/usePageContext";

export function Link({
  href,
  children,
  className,
  activeClassName = "is-active",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const isActive = href === "/" ? urlPathname === href : urlPathname.startsWith(href);
  const classes = [className, isActive ? activeClassName : undefined].filter(Boolean).join(" ") || undefined;
  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}
