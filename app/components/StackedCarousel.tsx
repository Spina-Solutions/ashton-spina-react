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
  const goNext = useCallback(() => {
    setIndex((i) => {
      if (i < total - 1) {
        return i + 1;
      } else {
        // At the end of current album, trigger album progression
        if (onAlbumEnd) {
          onAlbumEnd();
        }
        return i; // Stay at current index
      }
    });
  }, [total, onAlbumEnd]);
  const goPrev = useCallback(() => {
    setIndex((i) => {
      if (i > 0) {
        return i - 1;
      } else {
        // At the start of current album, trigger previous album
        if (onAlbumStart) {
          onAlbumStart();
        }
        return i; // Stay at current index
      }
    });
  }, [onAlbumStart]);

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
        className="relative transition-all duration-500 h-[500px] sm:h-[600px]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {total === 0 ? (
          <div className={"absolute inset-0 flex items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"}>
            <span className={"text-sm text-gray-500 dark:text-gray-400"}>No photos yet</span>
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
              className={"absolute top-1/2 left-1/2 max-w-3xl max-h-full object-contain select-none rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl"}
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
            className={"absolute top-1/2 left-1/2 max-w-3xl max-h-full object-contain select-none rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl"}
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
              className={"absolute top-1/2 left-1/2 max-w-3xl max-h-full object-contain select-none rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl"}
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

      <div className={"mt-3 flex items-center justify-between"}>
        <button
          type="button"
          onClick={goPrev}
          className={"inline-flex items-center justify-center h-9 w-9 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-black/5 dark:hover:bg-white/5"}
          aria-label={index === 0 ? "Previous album" : "Previous photo"}
        >
          ‹
        </button>
        <div className={"text-xs text-gray-600 dark:text-gray-400"}>
          {index + 1} / {total}
          {index === 0 && total > 0 && (
            <span className={"ml-1 text-blue-600 dark:text-blue-400"}>• Previous album</span>
          )}
          {index === total - 1 && total > 0 && (
            <span className={"ml-1 text-blue-600 dark:text-blue-400"}>• Next album</span>
          )}
        </div>
        <button
          type="button"
          onClick={goNext}
          className={"inline-flex items-center justify-center h-9 w-9 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-black/5 dark:hover:bg-white/5"}
          aria-label={index === total - 1 ? "Next album" : "Next photo"}
        >
          ›
        </button>
      </div>
    </div>
  );
}


