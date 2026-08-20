import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

type VisitInput = {
  visitorId: string;
  returning: boolean;
  page: string;
  screen: string;
  language: string;
  timezone: string;
  connection: string;
  referrer: string;
};

const clean = (s: string, max = 120) => s.replace(/[\r\n]+/g, " ").slice(0, max);

export const notifyVisit = createServerFn({ method: "POST" })
  .inputValidator((input: VisitInput) => ({
    visitorId: clean(String(input.visitorId ?? ""), 40),
    returning: Boolean(input.returning),
    page: clean(String(input.page ?? "/"), 200),
    screen: clean(String(input.screen ?? "unknown"), 40),
    language: clean(String(input.language ?? "unknown"), 20),
    timezone: clean(String(input.timezone ?? "unknown"), 60),
    connection: clean(String(input.connection ?? "unknown"), 20),
    referrer: clean(String(input.referrer ?? "Direct / Bookmark"), 200),
  }))
  .handler(async ({ data }) => {
    const topic = process.env["NTFY_TOPIC"];
    const server = process.env["NTFY_SERVER"] ?? "https://ntfy.sh";
    if (!topic) return { sent: false };

    const ip =
      (getRequestHeader("cf-connecting-ip") ??
        getRequestHeader("x-forwarded-for")?.split(",")[0] ??
        getRequestHeader("x-real-ip") ??
        "").trim();
    const ua = getRequestHeader("user-agent") ?? "unknown";
    const host = getRequestHeader("host") ?? "unknown";

    let location = "Unknown location";
    let network = "Unknown network";
    if (ip) {
      try {
        const geo = (await (
          await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`)
        ).json()) as {
          success?: boolean;
          city?: string;
          region?: string;
          country?: string;
          connection?: { isp?: string; asn?: number };
        };
        if (geo.success) {
          location = [geo.city, geo.region, geo.country].filter(Boolean).join(", ");
          network = geo.connection?.isp
            ? `AS${geo.connection.asn ?? "?"} ${geo.connection.isp}`
            : network;
        }
      } catch {
        /* geo lookup best-effort */
      }
    }

    const device = (() => {
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
      return `${mobile ? "Mobile" : "Desktop"} · ${os} · ${browser}`;
    })();

    const title = data.returning
      ? "Returning Visitor on Portfolio!"
      : "New Visitor on Portfolio!";
    const body = [
      `Status: ${data.returning ? "Returning visitor" : "New visitor"}`,
      `Location: ${location}`,
      `Network: ${network}`,
      `Public IP: ${ip || "unknown"}`,
      `Device: ${device}`,
      `Screen: ${data.screen} · ${data.language}`,
      `Timezone: ${data.timezone}`,
      `Connection: ${data.connection}`,
      `Source: ${data.referrer}`,
      `Visitor ID: ${data.visitorId}`,
      `Page: ${data.page}`,
      `Environment: ${host}`,
    ].join("\n");

    try {
      await fetch(`${server}/${topic}`, {
        method: "POST",
        headers: {
          Title: title,
          Tags: data.returning ? "eyes" : "rocket",
          Priority: data.returning ? "default" : "high",
        },
        body,
      });
    } catch {
      return { sent: false };
    }
    return { sent: true };
  });
