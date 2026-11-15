import * as Linking from "expo-linking";
import { router } from "expo-router";
import { DATA_REGULASI } from "@/data/regulasiData";
import {
  APP_SCHEME,
  MenuDeeplinkResolution,
  resolveMenuDeeplink,
  UNIVERSAL_ORIGIN,
} from "@/utils/menuDeeplinkParser";

const VALID_REGULASI_SLUGS = Object.keys(DATA_REGULASI);

/**
 * Mem-parsing URL deeplink menu (`/docs/*` dan `/about`) dengan validasi data regulasi.
 */
export function parseMenuDeeplink(rawUrl: string): MenuDeeplinkResolution {
  return resolveMenuDeeplink(rawUrl, VALID_REGULASI_SLUGS);
}

/**
 * Membangun tautan deeplink lintas platform (Custom Scheme, Universal Link, dan Runtime URL).
 */
export function buildMenuDeeplinkUrls(
  routePath: string,
  queryParams?: Record<string, string | undefined>
): {
  customSchemeUrl: string;
  universalUrl: string;
  runtimeUrl: string;
} {
  const cleanPath = routePath.startsWith("/") ? routePath : `/${routePath}`;
  const cleanParams: Record<string, string> = {};
  if (queryParams) {
    for (const [k, v] of Object.entries(queryParams)) {
      if (v) cleanParams[k] = v;
    }
  }

  const sp = new URLSearchParams(cleanParams);
  const queryStr = sp.toString() ? `?${sp.toString()}` : "";

  return {
    customSchemeUrl: `${APP_SCHEME}://${cleanPath.replace(/^\//, "")}${queryStr}`,
    universalUrl: `${UNIVERSAL_ORIGIN}${cleanPath}${queryStr}`,
    runtimeUrl: Linking.createURL(cleanPath, { queryParams: cleanParams }),
  };
}

/**
 * Menjalankan navigasi deeplink warm-start dengan reset stack yang bersih
 * (`[Beranda -> Target]`) sesuai prinsip state management pada Bab 4 buku.
 */
export function openMenuDeeplinkWithReset(rawUrl: string): MenuDeeplinkResolution {
  const resolution = parseMenuDeeplink(rawUrl);

  if (router.canDismiss()) {
    router.dismissAll();
  } else {
    router.replace("/");
  }

  setTimeout(() => {
    router.push(resolution.targetWithQuery as never);
  }, 0);

  return resolution;
}
