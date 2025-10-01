type Photo = { src: string; alt: string; w: number; h: number };

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  return (
    <div className={"grid grid-cols-2 sm:grid-cols-3 gap-2"}>
      {photos.map((p) => (
        <figure key={p.src} className={"group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"}>
          <img
            src={p.src}
            alt={p.alt}
            width={p.w}
            height={p.h}
            className={"w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"}
            loading="lazy"
          />
        </figure>
      ))}
    </div>
  );
}


