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

  const persist = useCallback(async (data: LedgerStatePayload) => {
    setStatus("saving");
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
            onLoad(res.body.state);
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
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persist(payload), 2000);
    return () => clearTimeout(saveTimer.current);
  }, [payload, persist]);

  return { status, lastSaved };
}
