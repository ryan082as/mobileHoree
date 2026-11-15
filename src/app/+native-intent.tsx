import { openMenuDeeplinkWithReset, parseMenuDeeplink } from "@/utils/deeplink";

/**
 * Menangani deeplink masuk di Native (iOS Universal Links / Custom Scheme & Android Intents)
 * khususnya untuk rute menu `/docs/...` dan `/about` beserta alias kompatibilitasnya.
 */
export function redirectSystemPath({
  path,
  initial,
}: {
  path: string;
  initial: boolean;
}): string {
  const resolution = parseMenuDeeplink(path);

  if (!resolution.matched) {
    return path;
  }

  // Pada warm-start (aplikasi sudah berjalan), reset stack lama secara deterministik
  if (!initial) {
    setTimeout(() => {
      openMenuDeeplinkWithReset(path);
    }, 0);
  }

  return resolution.targetWithQuery;
}
