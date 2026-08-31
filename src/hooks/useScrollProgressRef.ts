"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRef } from "react";

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

const DEFAULT_OFFSET: ScrollOffset = ["start end", "end start"];

export function useScrollProgressRef(
  target?: React.RefObject<HTMLElement | null>,
  offset: ScrollOffset = DEFAULT_OFFSET,
) {
  const progressRef = useRef(0);
  const { scrollYProgress } = useScroll(
    target ? { target, offset } : undefined,
  );

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progressRef.current = value;
  });

  return { scrollYProgress, progressRef };
}
