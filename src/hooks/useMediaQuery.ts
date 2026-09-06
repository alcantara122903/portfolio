"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

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
 * Locks the first client media-query value after mount.
 * Use for WebGL / GSAP pin trees so resizing the window does not
 * tear down canvases and crash the tab.
 */
export function useStableMediaQuery(query: string): boolean {
  const live = useMediaQuery(query);
  const [stable, setStable] = useState<boolean | null>(null);

  useEffect(() => {
    setStable((prev) => (prev === null ? live : prev));
  }, [live]);

  return stable ?? live;
}
