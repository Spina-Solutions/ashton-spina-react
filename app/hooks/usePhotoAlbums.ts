import { useMemo, useState } from "react";
import { generatePhotoGroups, type PhotoGroup } from "../utils/photography.js";

export function stepAlbum(groups: PhotoGroup[], currentId: string, delta: 1 | -1): string {
  if (groups.length === 0) return "";
  const index = groups.findIndex((g) => g.id === currentId);
  const next = (Math.max(index, 0) + delta + groups.length) % groups.length;
  return groups[next].id;
}

export function usePhotoAlbums() {
  const groups = useMemo(() => generatePhotoGroups(), []);
  const [selectedId, setSelectedId] = useState<string>(groups[0]?.id ?? "");
  const selected = groups.find((g) => g.id === selectedId);

  return {
    groups,
    selected,
    selectedId,
    select: setSelectedId,
    next: () => setSelectedId((id) => stepAlbum(groups, id, 1)),
    prev: () => setSelectedId((id) => stepAlbum(groups, id, -1)),
  };
}
