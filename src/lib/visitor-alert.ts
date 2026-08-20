const ID_KEY = "jp-visitor-id";
const FIRST_SEEN_KEY = "jp-first-seen";
const LAST_SEEN_KEY = "jp-last-seen";
const VISIT_COUNT_KEY = "jp-visit-count";
const TOPIC = "jaikar-portfolio-live-7fq2xk93";
const SERVER = "https://ntfy.sh";

/** Fires a static GitHub Pages compatible visitor alert. Client-only. */
export function pingVisitorAlert() {
  if (typeof window === "undefined") return;
  try {
    let id = localStorage.getItem(ID_KEY);
    if (!id) {
      id = `UID-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(ID_KEY, id);
    }

    const visits = Number.parseInt(localStorage.getItem(VISIT_COUNT_KEY) ?? "0", 10) + 1;
    const returning = visits > 1;
    const firstSeen = localStorage.getItem(FIRST_SEEN_KEY) ?? new Date().toISOString();
    const lastSeen = localStorage.getItem(LAST_SEEN_KEY) ?? "first time";
    localStorage.setItem(VISIT_COUNT_KEY, String(visits));
    localStorage.setItem(FIRST_SEEN_KEY, firstSeen);
    localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());

    const ua = navigator.userAgent || "unknown";
    const mobile = /iPhone|iPad|Android|Mobile/i.test(ua);
    const os = /iPhone|iPad|iOS/i.test(ua)
      ? "iOS"
      : /Android/i.test(ua)
        ? "Android"
        : /Windows/i.test(ua)
          ? "Windows"
          : /Mac OS X/i.test(ua)
            ? "macOS"
            : /Linux/i.test(ua)
              ? "Linux"
              : "Other OS";
    const browser = /Edg\//i.test(ua)
      ? "Edge"
      : /OPR\//i.test(ua)
        ? "Opera"
        : /Firefox/i.test(ua)
          ? "Firefox"
          : /Chrome/i.test(ua)
            ? "Chrome"
            : /Safari/i.test(ua)
              ? "Safari"
              : "Unknown";
    const nav = navigator as Navigator & { connection?: { effectiveType?: string } };
    const screen = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const referrer = document.referrer || "Direct / Bookmark";
    const page = window.location.pathname + window.location.search;

    const send = (location: string, network: string, ip: string) => {
      const title = returning ? `Returning Visitor - visit #${visits}` : "New Visitor on Portfolio!";
      const body = [
        `Status: ${returning ? `Returning visitor (visit #${visits})` : "New visitor"}`,
        `First seen: ${firstSeen}`,
        `Previous visit: ${lastSeen}`,
        `Local time there: ${new Date().toLocaleString()}`,
        `Location: ${location}`,
        `Network: ${network}`,
        `Public IP: ${ip}`,
        `Device: ${mobile ? "Mobile" : "Desktop"} - ${os} - ${browser}`,
        `Screen: ${screen} - ${navigator.language}`,
        `Timezone: ${timezone}`,
        `Connection: ${nav.connection?.effectiveType ?? "Unknown"}`,
        `Source: ${referrer}`,
        `Visitor ID: ${id}`,
        `Page: ${page}`,
        `Environment: ${window.location.hostname || "unknown"}`,
      ].join("\n");

      void fetch(`${SERVER}/${TOPIC}`, {
        method: "POST",
        headers: {
          Title: title,
          Tags: returning ? "eyes" : "rocket",
          Priority: returning ? "default" : "high",
        },
        body,
      }).catch(() => {});
    };

    void fetch("https://ipwho.is/")
      .then((response) => response.json())
      .then((geo) => {
        if (geo?.success) {
          const location = [geo.city, geo.region, geo.country].filter(Boolean).join(", ");
          const network = geo.connection?.isp
            ? `AS${geo.connection.asn ?? "?"} ${geo.connection.isp}`
            : "Unknown network";
          send(location || "Unknown location", network, geo.ip ?? "unknown");
          return;
        }
        send("Unknown location", "Unknown network", geo?.ip ?? "unknown");
      })
      .catch(() => send("Unknown location", "Unknown network", "unknown"));
  } catch {
    /* storage blocked — skip */
  }
}
