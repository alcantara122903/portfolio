"use client";

import { useSyncExternalStore } from "react";

function subscribeMediaQuery(
  query: string,
  callback: () => void,
): () => void {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getMediaQuerySnapshot(query: string): boolean {
  return window.matchMedia(query).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => subscribeMediaQuery(query, callback),
    () => getMediaQuerySnapshot(query),
    getServerSnapshot,
  );
}

/**
 * Alias for useMediaQuery.
 * Kept for call sites that previously locked viewport mode;
 * canvas remounts are avoided elsewhere so live queries are safe.
 */
export function useStableMediaQuery(query: string): boolean {
  return useMediaQuery(query);
}
