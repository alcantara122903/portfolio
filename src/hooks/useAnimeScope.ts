"use client";

import { useEffect, useRef } from "react";
import { createScope, type Scope } from "animejs";

export function useAnimeScope(
  setup: (scope: Scope) => void | (() => void),
  deps: React.DependencyList = [],
  root?: React.RefObject<HTMLElement | null>,
) {
  const scopeRef = useRef<Scope | null>(null);

  useEffect(() => {
    const element = root?.current ?? undefined;
    if (root && !element) return;

    const scope = createScope({ root: element }).add((self) => {
      if (self) setup(self);
    });

    scopeRef.current = scope;

    return () => {
      scope.revert();
      scopeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setup closure is intentional
  }, deps);

  return scopeRef;
}
