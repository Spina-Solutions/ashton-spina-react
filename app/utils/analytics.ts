// Sends a named event to whichever analytics are loaded (Google Analytics via gtag, Ahrefs).
// Never throws: tracking must not break a click.
type EventParams = Record<string, string>;

type AnalyticsWindow = Window & {
  gtag?: (command: "event", name: string, params?: EventParams) => void;
  AhrefsAnalytics?: { sendEvent?: (name: string) => void };
};

export function trackEvent(name: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  try {
    w.gtag?.("event", name, params);
  } catch {}
  try {
    w.AhrefsAnalytics?.sendEvent?.(name);
  } catch {}
}
