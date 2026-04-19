import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "../../ts-rest/api-client.js";
import type { LedgerStatePayload } from "../../ts-rest/contract.js";

export type SyncStatus = "loading" | "idle" | "saving" | "saved" | "error";

export function useLedgerSync(
  payload: LedgerStatePayload,
  onLoad: (state: LedgerStatePayload) => void,
  userId = "ashton",
) {
  const [status, setStatus] = useState<SyncStatus>("loading");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  // Stays true until the initial load resolves — suppresses the save-on-change effect
  const initialising = useRef(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  // Tracks whether a save is queued or in-flight so a focus-refetch never clobbers
  // a local edit the user just made on this device.
  const hasPendingSave = useRef(false);
  const inFlightSave = useRef(false);
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;

  const persist = useCallback(async (data: LedgerStatePayload) => {
    setStatus("saving");
    inFlightSave.current = true;
    try {
      const res = await apiClient.saveLedgerState({ query: { userId }, body: data });
      if (res.status === 200) {
        setLastSaved(res.body.updatedAt);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2500);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      inFlightSave.current = false;
      hasPendingSave.current = false;
    }
  }, [userId]);

  const reload = useCallback(async () => {
    // Skip if a local save is pending / running — the server is about to be overwritten
    // with what this device has anyway, so pulling now would either lose edits or race.
    if (hasPendingSave.current || inFlightSave.current) return;
    try {
      const res = await apiClient.getLedgerState({ query: { userId } });
      if (res.status === 200 && res.body.state !== null) {
        onLoadRef.current(res.body.state);
        setLastSaved(res.body.updatedAt);
        setStatus("idle");
      }
    } catch {
      // network blip — ignore
    }
  }, [userId]);

  // Load on mount; if DB is empty, seed with the caller's current defaults
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await apiClient.getLedgerState({ query: { userId } });
        if (cancelled) return;
        if (res.status === 200) {
          if (res.body.state !== null) {
            onLoadRef.current(res.body.state);
            setLastSaved(res.body.updatedAt);
            setStatus("idle");
          } else {
            // First run — seed DB with default data.ts values
            await persist(payload);
          }
        } else {
          setStatus("error");
        }
      } catch {
        // API not reachable (local dev without AWS) — just continue with defaults
        setStatus("idle");
      } finally {
        if (!cancelled) initialising.current = false;
      }
    }
    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced auto-save whenever the payload changes after initial load
  useEffect(() => {
    if (initialising.current) return;
    hasPendingSave.current = true;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persist(payload), 2000);
    return () => clearTimeout(saveTimer.current);
  }, [payload, persist]);

  // Pull the latest server state when the tab regains focus / becomes visible again.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onVisible = () => {
      if (document.visibilityState === "visible" && !initialising.current) reload();
    };
    const onFocus = () => {
      if (!initialising.current) reload();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
    };
  }, [reload]);

  // Periodic background poll — catches changes made on another device while this tab stays open
  useEffect(() => {
    const id = setInterval(() => {
      if (!initialising.current && document.visibilityState === "visible") reload();
    }, 60_000);
    return () => clearInterval(id);
  }, [reload]);

  return { status, lastSaved, reload };
}
