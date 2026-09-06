"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

export function useGsapContext(
  setup: (ctx: gsap.Context) => void,
  deps: React.DependencyList = [],
  scope?: React.RefObject<HTMLElement | null>,
) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    registerGsap();
    const element = scope?.current ?? undefined;
    if (scope && !element) return;

    const ctx = gsap.context(() => {
      setup(ctx);
    }, element);

    ctxRef.current = ctx;
    return () => {
      ctx.revert();
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional setup closure
  }, deps);

  return ctxRef;
}
