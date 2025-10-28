import { observable } from "@legendapp/state";
import Constants from "expo-constants";
import environment from "@/config/environment";

const appState = observable({
  latestVersion: null as string | null,
  updateAvailable: false,
  updateRequired: false,
  lastChecked: 0,
  checking: false,
  optionalUpdateDismissed: false,
});

const toNumericParts = (value: string): number[] => {
  return value
    .split(".")
    .map((part) => parseInt(part, 10))
    .filter((num) => !isNaN(num));
};

/**
 * Compare two version strings
 * Returns:
 *   positive if v1 > v2
 *   negative if v1 < v2
 *   zero if v1 === v2
 */
const compareVersions = (v1: string, v2: string): number => {
  const parts1 = toNumericParts(v1);
  const parts2 = toNumericParts(v2);
  const maxLength = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLength; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 !== num2) {
      return num1 - num2;
    }
  }

  return 0;
};

/**
 * Check app version from backend using fetch (not axios)
 * This avoids global axios interceptors that show alerts
 */
export const checkAppVersion = async () => {
  // Prevent concurrent checks
  if (appState.checking.get()) {
    return;
  }

  try {
    appState.checking.set(true);

    // Use fetch instead of axios to avoid global interceptors
    // Add cache-busting headers to always get fresh version data
    const response = await fetch(`${environment.apiUrl}/version`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    if (!response.ok) {
      console.warn(`Version check failed with status: ${response.status}`);
      return;
    }

    const payload = await response.json();

    if (!payload || payload.success === false) {
      return;
    }

    const remoteVersion = payload.version || payload.latestVersion;
    const localVersion = Constants.expoConfig?.version;

    const isRemoteNewer =
      remoteVersion && localVersion
        ? compareVersions(remoteVersion, localVersion) > 0
        : false;

    const currentState = appState.get();

    appState.set({
      latestVersion: remoteVersion,
      updateAvailable: isRemoteNewer,
      updateRequired: Boolean(payload.updateRequired) && isRemoteNewer,
      lastChecked: Date.now(),
      checking: false,
      optionalUpdateDismissed: isRemoteNewer
        ? false
        : currentState.optionalUpdateDismissed,
    });
  } catch (error) {
    console.warn("Failed to fetch app version:", error);
  } finally {
    appState.checking.set(false);
  }
};

export const dismissOptionalUpdate = () => {
  appState.optionalUpdateDismissed.set(true);
};

export { appState };
