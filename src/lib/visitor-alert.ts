import { notifyVisit } from "./visitor-alert.functions";

const ID_KEY = "jp-visitor-id";
const SEEN_KEY = "jp-visitor-seen";
const SESSION_KEY = "jp-visit-pinged";

/** Fires one live-visit alert per browser session. Client-only. */
export function pingVisitorAlert() {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    sessionStorage.setItem(SESSION_KEY, "1");

    let id = localStorage.getItem(ID_KEY);
    const returning = localStorage.getItem(SEEN_KEY) === "1";
    if (!id) {
      id = `UID-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(ID_KEY, id);
    }
    localStorage.setItem(SEEN_KEY, "1");

    const nav = navigator as Navigator & { connection?: { effectiveType?: string } };
    void notifyVisit({
      data: {
        visitorId: id,
        returning,
        page: window.location.pathname + window.location.search,
        screen: `${window.screen.width}×${window.screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        connection: nav.connection?.effectiveType ?? "Unknown",
        referrer: document.referrer || "Direct / Bookmark",
      },
    }).catch(() => {});
  } catch {
    /* storage blocked — skip */
  }
}
