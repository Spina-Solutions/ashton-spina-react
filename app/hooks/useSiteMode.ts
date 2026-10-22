import { useCallback, useEffect, useState } from "react";
import type { SiteMode } from "../types/bento.js";

const MODE_EVENT = "modeChanged";

export function readModeFromSearch(search: string): SiteMode {
  return new URLSearchParams(search).get("mode") === "work" ? "work" : "personal";
}

// Mode lives in the ?mode= URL param; every subscriber re-reads it on change.
export function useSiteMode() {
  const [mode, setModeState] = useState<SiteMode>("personal");

  useEffect(() => {
    const sync = () => setModeState(readModeFromSearch(window.location.search));
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener(MODE_EVENT, sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(MODE_EVENT, sync);
    };
  }, []);

  const setMode = useCallback((next: SiteMode) => {
    const url = new URL(window.location.href);
    url.searchParams.set("mode", next);
    window.history.pushState({}, "", url.toString());
    window.dispatchEvent(new CustomEvent(MODE_EVENT));
  }, []);

  return { mode, isWorkMode: mode === "work", setMode };
}
