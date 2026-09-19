"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { onPortfolioReady } from "@/lib/portfolioReady";
import { handleHashNavClick } from "@/lib/scrollToSection";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const reducedMotion = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (reducedMotion || !headerRef.current) return;
    registerGsap();

    let ctx: gsap.Context | null = null;

    const start = () => {
      if (!headerRef.current) return;

      ctx = gsap.context(() => {
        const links = linksRef.current
          ? Array.from(linksRef.current.querySelectorAll("a"))
          : [];

        gsap.set(headerRef.current, { y: -28, autoAlpha: 0 });
        if (brandRef.current) gsap.set(brandRef.current, { y: -10, autoAlpha: 0 });
        if (links.length) gsap.set(links, { y: -8, autoAlpha: 0 });
        if (ctaRef.current) gsap.set(ctaRef.current, { y: -8, autoAlpha: 0 });
        if (menuBtnRef.current) gsap.set(menuBtnRef.current, { autoAlpha: 0 });
        if (lineRef.current) {
          gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
        }

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: 0.05,
        });

        tl.to(headerRef.current, {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
        });

        if (brandRef.current) {
          tl.to(
            brandRef.current,
            { y: 0, autoAlpha: 1, duration: 0.55 },
            0.15,
          );
        }

        if (links.length) {
          tl.to(
            links,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.45,
              stagger: 0.06,
            },
            0.28,
          );
        }

        if (ctaRef.current) {
          tl.to(
            ctaRef.current,
            { y: 0, autoAlpha: 1, duration: 0.5 },
            0.45,
          );
        }

        if (menuBtnRef.current) {
          tl.to(menuBtnRef.current, { autoAlpha: 1, duration: 0.4 }, 0.35);
        }

        if (lineRef.current) {
          tl.to(
            lineRef.current,
            { scaleX: 1, duration: 0.85, ease: "power2.inOut" },
            0.35,
          );
        }

        // Hover underline draw on desktop links
        links.forEach((link) => {
          const underline = link.querySelector("[data-nav-underline]");
          if (!underline) return;

          gsap.set(underline, { scaleX: 0, transformOrigin: "left center" });

          link.addEventListener("pointerenter", () => {
            gsap.to(underline, {
              scaleX: 1,
              duration: 0.35,
              ease: "power2.out",
              overwrite: true,
            });
          });
          link.addEventListener("pointerleave", () => {
            gsap.to(underline, {
              scaleX: 0,
              transformOrigin: "right center",
              duration: 0.3,
              ease: "power2.in",
              overwrite: true,
              onComplete: () => {
                gsap.set(underline, { transformOrigin: "left center" });
              },
            });
          });
        });

        // Active section indicator (desktop)
        if (indicatorRef.current && linksRef.current) {
          const indicator = indicatorRef.current;

          const moveTo = (link: HTMLElement | null) => {
            if (!link || !linksRef.current) {
              gsap.to(indicator, { autoAlpha: 0, duration: 0.2 });
              return;
            }
            const listBox = linksRef.current.getBoundingClientRect();
            const linkBox = link.getBoundingClientRect();
            gsap.to(indicator, {
              autoAlpha: 1,
              x: linkBox.left - listBox.left,
              width: linkBox.width,
              duration: 0.45,
              ease: "power3.out",
              overwrite: true,
            });
          };

          portfolio.navigation.forEach((item, index) => {
            const id = item.href.replace("#", "");
            const section = document.getElementById(id);
            const link = links[index] as HTMLElement | undefined;
            if (!section || !link) return;

            ScrollTrigger.create({
              trigger: section,
              start: "top 35%",
              end: "bottom 35%",
              onEnter: () => moveTo(link),
              onEnterBack: () => moveTo(link),
            });
          });
        }
      }, headerRef);
    };

    const stop = onPortfolioReady(start);
    return () => {
      stop();
      ctx?.revert();
    };
  }, [reducedMotion]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        scrolled
          ? "border-b border-white/8 bg-[var(--background)]/94 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
        reducedMotion ? "opacity-100" : "opacity-0",
      )}
    >
      <nav
        className="relative mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 py-4 sm:px-6 md:grid-cols-[auto_1fr_auto] lg:px-8"
        aria-label="Main navigation"
      >
        <a
          ref={brandRef}
          href="#home"
          onClick={handleHashNavClick}
          className="font-display text-[15px] font-semibold tracking-tight text-zinc-50"
        >
          Ivan Alcantara
        </a>

        <div className="relative hidden md:block">
          <ul
            ref={linksRef}
            className="relative flex items-center justify-center gap-1"
          >
            <div
              ref={indicatorRef}
              className="pointer-events-none absolute bottom-0 left-0 h-px bg-[var(--accent)] opacity-0"
              aria-hidden="true"
            />
            {portfolio.navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={handleHashNavClick}
                  className="relative inline-block px-3 py-1.5 text-[13px] text-zinc-500 transition-colors hover:text-zinc-100"
                >
                  {item.label}
                  <span
                    data-nav-underline
                    className="absolute inset-x-3 bottom-0.5 h-px origin-left scale-x-0 bg-zinc-300"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <a
          ref={ctaRef}
          href="#contact"
          onClick={handleHashNavClick}
          className="hidden border border-white/12 px-3 py-1.5 text-[13px] text-zinc-200 transition-colors hover:border-white/25 hover:text-white md:inline-flex"
        >
          Hire me
        </a>

        <button
          ref={menuBtnRef}
          type="button"
          className="inline-flex items-center justify-center justify-self-end rounded-[var(--radius-control)] border border-white/10 p-2 text-zinc-300 md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <div
        ref={lineRef}
        className="h-px w-full origin-left scale-x-0 bg-linear-to-r from-transparent via-[var(--accent)]/50 to-transparent"
        aria-hidden="true"
      />

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/8 bg-[var(--background)] md:hidden"
        >
          <ul className="flex flex-col gap-1 px-4 py-4">
            {portfolio.navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-[var(--radius-control)] px-3 py-3 text-sm text-zinc-300 hover:bg-white/4 hover:text-white"
                  onClick={(event) => {
                    handleHashNavClick(event);
                    setMobileOpen(false);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="px-3 pt-2">
              <a
                href="#contact"
                className="text-sm text-[var(--accent)]"
                onClick={(event) => {
                  handleHashNavClick(event);
                  setMobileOpen(false);
                }}
              >
                Hire me
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
