/**
 * Pure URL parser & backward-compatibility mapper untuk rute menu:
 * - `/docs/[...slug]` (SOP & Regulasi)
 * - `/about` (Profil Tim)
 */

export const APP_SCHEME = "petarasa";
export const UNIVERSAL_ORIGIN = "https://petarasa.id";
export const TRUSTED_HOSTS = [
  "petarasa.id",
  "www.petarasa.id",
  "localhost",
  "127.0.0.1",
] as const;

export const LEGACY_REGULASI_SLUG_MAP: Readonly<Record<string, string>> = {
  "sertifikasi-halal": "halal",
  "sertifikat-halal": "halal",
  mui: "halal",
  "izin-pirt": "pirt",
  "izin-edar": "pirt",
  bpom: "pirt",
  higienitas: "higiene",
  sanitasi: "higiene",
  "kebersihan-dapur": "higiene",
  slhs: "higiene",
};

const DOCS_ROUTE_ALIASES = new Set(["docs", "sop", "regulasi", "panduan"]);
const ABOUT_ROUTE_ALIASES = new Set(["about", "tim", "tentang", "profil"]);

export interface MenuDeeplinkResolution {
  matched: boolean;
  targetPath: string;
  targetWithQuery: string;
  queryParams: Record<string, string>;
  docsSlug?: string;
  wasLegacyMapped: boolean;
  notFound: boolean;
  reason?: string;
}

function normalizeSlashPath(pathname: string): string {
  const collapsed = pathname.replace(/\/+/g, "/");
  if (collapsed === "/") return "/";
  return collapsed.replace(/\/+$/, "") || "/";
}

function parseQuery(search: string): Record<string, string> {
  const query: Record<string, string> = {};
  const cleaned = search.startsWith("?") ? search.slice(1) : search;
  if (!cleaned) return query;
  new URLSearchParams(cleaned).forEach((val, key) => {
    query[key] = val;
  });
  return query;
}

function formatQuery(params: Record<string, string>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) sp.set(k, v);
  }
  const str = sp.toString();
  return str ? `?${str}` : "";
}

export function extractMenuPathAndQuery(rawUrl: string): {
  pathname: string;
  queryParams: Record<string, string>;
  trusted: boolean;
} {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { pathname: "/", queryParams: {}, trusted: true };
  }

  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) {
    const [pathPart, ...queryParts] = trimmed.split("?");
    return {
      pathname: normalizeSlashPath(pathPart.startsWith("/") ? pathPart : `/${pathPart}`),
      queryParams: parseQuery(queryParts.join("?")),
      trusted: true,
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { pathname: "/not-found", queryParams: {}, trusted: false };
  }

  const protocol = parsed.protocol.replace(/:$/, "").toLowerCase();
  const queryParams = parseQuery(parsed.search);

  if (protocol === APP_SCHEME) {
    const hostSeg = parsed.hostname ? `/${parsed.hostname}` : "";
    const pathSeg = parsed.pathname && parsed.pathname !== "/" ? parsed.pathname : "";
    return {
      pathname: normalizeSlashPath(`${hostSeg}${pathSeg}` || "/"),
      queryParams,
      trusted: true,
    };
  }

  if (protocol === "exp" || protocol === "exps") {
    const marker = parsed.pathname.indexOf("/--/");
    const innerPath = marker >= 0 ? parsed.pathname.slice(marker + 3) : parsed.pathname;
    return {
      pathname: normalizeSlashPath(innerPath || "/"),
      queryParams,
      trusted: true,
    };
  }

  if (protocol === "http" || protocol === "https") {
    const host = parsed.hostname.toLowerCase();
    const trusted = (TRUSTED_HOSTS as readonly string[]).includes(host);
    return {
      pathname: normalizeSlashPath(parsed.pathname || "/"),
      queryParams,
      trusted,
    };
  }

  return { pathname: "/not-found", queryParams: {}, trusted: false };
}

/**
 * Menyelesaikan alias slug lama untuk dokumentasi SOP (`/docs/[...slug]`).
 */
export function resolveLegacyRegulasiSlug(rawSlug: string): {
  slug: string;
  wasMapped: boolean;
} {
  const key = rawSlug.trim().toLowerCase();
  const mapped = LEGACY_REGULASI_SLUG_MAP[key];
  if (mapped) {
    return { slug: mapped, wasMapped: true };
  }
  return { slug: key, wasMapped: key !== rawSlug };
}

/**
 * Memetakan URL deeplink yang mengarah ke `/docs/*` atau `/about`
 * (termasuk alias lama seperti `/sop/higienitas` dan `/tim`).
 */
export function resolveMenuDeeplink(
  rawUrl: string,
  validDocsSlugs?: readonly string[]
): MenuDeeplinkResolution {
  const extracted = extractMenuPathAndQuery(rawUrl);

  if (!extracted.trusted) {
    return {
      matched: true,
      targetPath: "/not-found",
      targetWithQuery: "/not-found",
      queryParams: {},
      wasLegacyMapped: false,
      notFound: true,
      reason: "Origin URL tidak dipercaya.",
    };
  }

  const segments =
    extracted.pathname === "/" ? [] : extracted.pathname.slice(1).split("/");
  const firstSegment = (segments[0] || "").toLowerCase();

  // 1. Rute SOP / Regulasi (/docs/* dan alias /sop/*, /regulasi/*, /panduan/*)
  if (DOCS_ROUTE_ALIASES.has(firstSegment)) {
    const isRouteAlias = firstSegment !== "docs";
    const lastRaw = segments.length >= 2 ? segments[segments.length - 1] : "halal";
    const { slug, wasMapped } = resolveLegacyRegulasiSlug(lastRaw);
    const hasUnknownSlug =
      Boolean(validDocsSlugs) && !validDocsSlugs!.includes(slug);

    if (hasUnknownSlug) {
      return {
        matched: true,
        targetPath: `/docs/${slug}`,
        targetWithQuery: `/docs/${slug}`,
        queryParams: extracted.queryParams,
        docsSlug: slug,
        wasLegacyMapped: isRouteAlias || wasMapped,
        notFound: true,
        reason: `Dokumen SOP "${lastRaw}" tidak ditemukan.`,
      };
    }

    const targetPath = `/docs/${slug}`;
    const queryStr = formatQuery(extracted.queryParams);
    return {
      matched: true,
      targetPath,
      targetWithQuery: `${targetPath}${queryStr}`,
      queryParams: extracted.queryParams,
      docsSlug: slug,
      wasLegacyMapped: isRouteAlias || wasMapped || segments.length < 2,
      notFound: false,
    };
  }

  // 2. Rute Profil Tim (/about dan alias /tim, /tentang, /profil)
  if (ABOUT_ROUTE_ALIASES.has(firstSegment)) {
    const isAlias = extracted.pathname.toLowerCase() !== "/about";
    const queryStr = formatQuery(extracted.queryParams);
    return {
      matched: true,
      targetPath: "/about",
      targetWithQuery: `/about${queryStr}`,
      queryParams: extracted.queryParams,
      wasLegacyMapped: isAlias,
      notFound: false,
    };
  }

  return {
    matched: false,
    targetPath: extracted.pathname,
    targetWithQuery: `${extracted.pathname}${formatQuery(extracted.queryParams)}`,
    queryParams: extracted.queryParams,
    wasLegacyMapped: false,
    notFound: false,
  };
}
