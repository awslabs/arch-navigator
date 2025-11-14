import type { AWSCredentials } from "./credentials";

declare global {
  interface Window {
    electronAPI?: {
      getAwsCredentials: (profile?: string) => Promise<AWSCredentials>;
    };
  }
}

export function isElectron(): boolean {
  return typeof window !== "undefined" && "electronAPI" in window;
}

export async function loadElectronCredentials(
  profile?: string,
): Promise<AWSCredentials> {
  if (!isElectron()) {
    throw new Error("Not running in Electron environment");
  }
  const creds = await window.electronAPI?.getAwsCredentials(profile);
  if (!creds) {
    throw new Error("Failed to load credentials from Electron");
  }
  return creds;
}
