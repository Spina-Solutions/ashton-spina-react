import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Photo = { src: string; alt: string; w?: number; h?: number };

export function StackedCarousel({ 
  photos, 
  className,
  onAlbumEnd,
  onAlbumStart,
  resetKey
}: { 
  photos: Photo[]; 
  className?: string;
  onAlbumEnd?: () => void;
  onAlbumStart?: () => void;
  resetKey?: string | number;
}) {
  const [index, setIndex] = useState(0);
  const [currentOrientation, setCurrentOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  const total = photos.length;
  
  // Reset index when resetKey changes (album changes)
  useEffect(() => {
    setIndex(0);
  }, [resetKey]);
  
  // Ensure index is valid whenever photo set changes
  useEffect(() => {
    if (total === 0) {
      setIndex(0);
      return;
    }
    if (index > total - 1) setIndex(total - 1);
  }, [total]);
  // Album callbacks update parent state, so they must run outside the setIndex updater.
  const goNext = useCallback(() => {
    if (index < total - 1) setIndex(index + 1);
    else onAlbumEnd?.();
  }, [index, total, onAlbumEnd]);
  const goPrev = useCallback(() => {
    if (index > 0) setIndex(index - 1);
    else onAlbumStart?.();
  }, [index, onAlbumStart]);

  // Detect orientation when index changes
  useEffect(() => {
    if (photos[index] && photos[index].w && photos[index].h) {
      const isPortrait = photos[index].h! > photos[index].w!;
      setCurrentOrientation(isPortrait ? 'portrait' : 'landscape');
    }
  }, [index, photos]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    const dx = touchDeltaX.current;
    touchStartX.current = null;
    touchDeltaX.current = 0;
    if (Math.abs(dx) > 40) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  // Detect orientation from the actual image dimensions when it loads
  const onActiveImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (w && h) {
      setCurrentOrientation(h > w ? 'portrait' : 'landscape');
    }
  };

  const visible = useMemo(() => {
    if (total === 0 || !photos[index]) {
      return { prev: [] as any[], active: undefined as any, next: [] as any[] };
    }
    const maxDepth = 4;
    const prev = photos.slice(Math.max(0, index - maxDepth), index);
    const next = photos.slice(index + 1, Math.min(total, index + 1 + maxDepth));
    // Annotate with depth from 1..N (1 is closest to active)
    const prevAnnotated = prev.map((p, idx) => ({
      photo: p,
      key: `p${index - prev.length + idx}`,
      side: "left" as const,
      depth: prev.length - idx, // farthest has largest depth
    }));
    const nextAnnotated = next.map((p, idx) => ({
      photo: p,
      key: `n${index + 1 + idx}`,
      side: "right" as const,
      depth: idx + 1,
    }));
    return {
      prev: prevAnnotated, // render farthest first for stacking
      active: { photo: photos[index], key: `a${index}` },
      next: nextAnnotated,
    };
  }, [index, photos, total]);

  return (
    <div className={["relative", className].filter(Boolean).join(" ")}>
      <div
        ref={containerRef}
        className="relative transition-all duration-500 h-[340px] sm:h-[480px] lg:h-[540px]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {total === 0 ? (
          <div className={"absolute inset-0 flex items-center justify-center rounded-[20px] border border-dashed border-black/15 dark:border-white/15"}>
            <span className={"text-sm opacity-60"}>No photos yet</span>
          </div>
        ) : null}
        {/* Left stack (previous images) */}
        {visible.prev.map(({ photo, key, depth }) => {
          const scale = 1 - depth * 0.05;
          const translateY = depth * 14;
          const translateX = -1 * (20 + depth * 8);
          const rotate = -1 * (3 + depth * 0.8);
          const z = 50 - depth; // behind active
          const opacity = 0.9 - depth * 0.06;
          return (
            <img
              key={key}
              src={photo.src}
              alt={photo.alt}
              className={"absolute top-1/2 left-1/2 max-w-[88%] max-h-full object-contain select-none rounded-[20px] ring-1 ring-black/10 shadow-xl"}
              style={{
                zIndex: z,
                transform: `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale}) rotate(${rotate}deg)`,
                opacity,
                transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease",
              }}
              loading={"lazy"}
              aria-hidden
            />
          );
        })}

        {/* Active image */}
        {visible.active && (
          <img
            key={visible.active.key}
            src={visible.active.photo.src}
            alt={visible.active.photo.alt}
            className={"absolute top-1/2 left-1/2 max-w-[88%] max-h-full object-contain select-none rounded-[20px] ring-1 ring-black/10 shadow-2xl"}
            style={{ 
              zIndex: 100,
              transform: "translate(-50%, -50%)"
            }}
            onLoad={onActiveImageLoad}
            loading={"eager"}
            aria-current="true"
          />
        )}

        {/* Right stack (next images) */}
        {visible.next.map(({ photo, key, depth }) => {
          const scale = 1 - depth * 0.05;
          const translateY = depth * 14;
          const translateX = 20 + depth * 8;
          const rotate = 3 + depth * 0.8;
          const z = 50 - depth; // behind active
          const opacity = 0.9 - depth * 0.06;
          return (
            <img
              key={key}
              src={photo.src}
              alt={photo.alt}
              className={"absolute top-1/2 left-1/2 max-w-[88%] max-h-full object-contain select-none rounded-[20px] ring-1 ring-black/10 shadow-xl"}
              style={{
                zIndex: z,
                transform: `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale}) rotate(${rotate}deg)`,
                opacity,
                transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease",
              }}
              loading={"lazy"}
              aria-hidden
            />
          );
        })}
      </div>

      <div className={"mt-4 flex items-center justify-between"}>
        <CarouselButton onClick={goPrev} label={index === 0 ? "Previous album" : "Previous photo"} direction="left" />
        <div className={"text-sm tabular-nums opacity-70"}>
          {total > 0 ? `${index + 1} / ${total}` : null}
          {total > 0 && index === total - 1 ? <span className={"ml-2 text-coral"}>Next album →</span> : null}
          {total > 0 && index === 0 ? <span className={"ml-2 text-coral"}>← Previous album</span> : null}
        </div>
        <CarouselButton onClick={goNext} label={index === total - 1 ? "Next album" : "Next photo"} direction="right" />
      </div>
    </div>
  );
}



function CarouselButton({ onClick, label, direction }: { onClick: () => void; label: string; direction: "left" | "right" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={"grid h-11 w-11 place-items-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-coral hover:text-white active:scale-95 transition"}
    >
      <svg viewBox="0 0 24 24" className={"h-5 w-5"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
  );
}
