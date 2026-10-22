import { useCallback } from "react";

type PhotoGroup = {
  id: string;
  title: string;
  thumbnail: string;
  photos: Array<{ src: string; alt: string; w?: number; h?: number }>;
};

export function PhotoGroupSelector({
  groups,
  selectedId,
  onSelect,
  className,
}: {
  groups: PhotoGroup[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const handleSelect = useCallback((id: string) => onSelect(id), [onSelect]);

  return (
    <div className={["flex gap-3 overflow-x-auto px-1 pt-1 pb-2 [scrollbar-width:thin]", className].filter(Boolean).join(" ")}>
      {groups.map((group) => {
        const isSelected = group.id === selectedId;
        return (
          <button
            key={group.id}
            type="button"
            onClick={() => handleSelect(group.id)}
            className={"group shrink-0 w-24 text-left"}
            aria-pressed={isSelected}
            aria-label={`Show ${group.title} photos`}
          >
            <div
              className={[
                "h-24 w-24 overflow-hidden rounded-2xl transition duration-200",
                isSelected ? "ring-3 ring-coral ring-offset-2 ring-offset-white dark:ring-offset-tile-dark" : "opacity-80 group-hover:opacity-100",
              ].join(" ")}
            >
              <img
                src={group.thumbnail}
                alt=""
                className={"h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"}
                loading="lazy"
              />
            </div>
            <div className={`mt-2 truncate text-sm ${isSelected ? "font-medium text-coral" : "opacity-70 group-hover:opacity-100"}`}>
              {group.title}
            </div>
          </button>
        );
      })}
    </div>
  );
}
