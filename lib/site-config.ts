export type SiteConfig = { origin: string; indexable: boolean };
type SiteEnvironment = Partial<Record<"AVONA_SITE_URL" | "SITE_INDEXABLE", string>>;

function booleanSetting(value: string | undefined, name: string): boolean {
  if (value === undefined) return false;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${name} must be true or false`);
}

function localHostname(hostname: string): boolean {
  hostname = hostname.replace(/\.+$/, "");
  return hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "[::1]" || /^127\./.test(hostname);
}

export function resolveSiteConfig(env: SiteEnvironment): SiteConfig {
  const indexable = booleanSetting(env.SITE_INDEXABLE, "SITE_INDEXABLE");
  const configured = env.AVONA_SITE_URL;
  let url: URL;
  try {
    url = new URL(configured ?? "http://localhost:3200");
  } catch {
    throw new Error("AVONA_SITE_URL must be an explicit origin");
  }
  const local = localHostname(url.hostname);
  if (configured !== undefined && (!/^https?:\/\/[^/?#]+\/?$/.test(configured) || url.username || url.password || url.search || url.hash || url.pathname !== "/")) {
    throw new Error("AVONA_SITE_URL must be an origin without credentials, path, query, or fragment");
  }
  if (url.protocol !== "https:" && !(url.protocol === "http:" && local)) {
    throw new Error("AVONA_SITE_URL requires HTTPS except on localhost");
  }
  if (indexable && (!configured || local || url.protocol !== "https:")) {
    throw new Error("SITE_INDEXABLE requires a configured non-local HTTPS origin");
  }
  return { origin: url.origin, indexable };
}

export function getSiteConfig(): SiteConfig {
  return resolveSiteConfig({ AVONA_SITE_URL: process.env.AVONA_SITE_URL, SITE_INDEXABLE: process.env.SITE_INDEXABLE });
}
