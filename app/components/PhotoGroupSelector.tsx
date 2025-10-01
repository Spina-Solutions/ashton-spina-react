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
    <div className={["flex gap-4 overflow-x-auto py-2 px-1", className].filter(Boolean).join(" ")}>
      {groups.map((group) => {
        const isSelected = group.id === selectedId;
        return (
          <button
            key={group.id}
            type="button"
            onClick={() => handleSelect(group.id)}
            className={[
              "group relative shrink-0 w-24 h-32 rounded-lg overflow-hidden transition-all duration-200",
              "bg-white dark:bg-gray-800 border-2 shadow-lg p-1",
              isSelected
                ? "border-blue-500 scale-105 shadow-xl"
                : "border-gray-200 dark:border-gray-700 hover:scale-102 hover:shadow-md",
            ].join(" ")}
            aria-pressed={isSelected}
            aria-label={`Select ${group.title} photos`}
          >
            {/* Polaroid photo area */}
            <div className={"absolute inset-x-2 top-2 bottom-8 rounded-sm overflow-hidden"}>
              <img
                src={group.thumbnail}
                alt={group.title}
                className={"w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"}
                loading="lazy"
              />
            </div>

            {/* Polaroid white space with handwritten title */}
            <div className={"absolute inset-x-2 bottom-2 h-6 flex items-center justify-center"}>
              <span
                className={[
                  "text-xs font-medium text-gray-800 dark:text-gray-200",
                  "transform -rotate-1 font-handwriting",
                  isSelected ? "text-blue-600 dark:text-blue-400" : "",
                ].join(" ")}
                style={{
                  fontFamily: "'Kalam', 'Bradley Hand', 'Brush Script MT', cursive",
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                {group.title}
              </span>
            </div>

            {/* Selection indicator */}
            {isSelected && (
              <div className={"absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900"} />
            )}
          </button>
        );
      })}
    </div>
  );
}
