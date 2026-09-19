"use client";

import { gsap, registerGsap } from "@/lib/gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";

let scrollToRegistered = false;

function ensureScrollTo() {
  registerGsap();
  if (scrollToRegistered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollToPlugin, ScrollSmoother);
  scrollToRegistered = true;
}

const NAV_OFFSET = 88;

/**
 * Smooth in-page navigation that works with ScrollSmoother + native scroll.
 */
export function scrollToSection(
  href: string,
  options?: { instant?: boolean },
) {
  if (typeof window === "undefined") return;

  const id = href.startsWith("#") ? href.slice(1) : href;
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;

  ensureScrollTo();

  const preferReduced =
    options?.instant ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const smoother = ScrollSmoother.get();

  if (smoother) {
    smoother.scrollTo(target, !preferReduced, `top ${NAV_OFFSET}px`);
    return;
  }

  if (preferReduced) {
    const top =
      target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo(0, top);
    return;
  }

  gsap.to(window, {
    duration: 0.95,
    ease: "power3.inOut",
    scrollTo: { y: target, offsetY: NAV_OFFSET, autoKill: true },
    overwrite: true,
  });
}

/** Click handler for hash links — prevents jump, scrolls smoothly. */
export function handleHashNavClick(
  event: React.MouseEvent<HTMLAnchorElement>,
) {
  const href = event.currentTarget.getAttribute("href");
  if (!href || !href.startsWith("#")) return;

  event.preventDefault();
  scrollToSection(href);

  if (href.length > 1) {
    window.history.pushState(null, "", href);
  }
}
