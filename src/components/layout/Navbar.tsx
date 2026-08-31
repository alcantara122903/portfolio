"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export function Navbar() {
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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8"
        aria-label="Main navigation"
      >
        <a
          href="#home"
          className="inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          <span
            className="inline-block h-2.5 w-2.5 rotate-45 bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.7)]"
            aria-hidden="true"
          />
          IVAN<span className="text-sky-400">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {portfolio.navigation.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm text-zinc-400 transition-colors hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Badge variant="accent">Open to Internship · 2026</Badge>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-700/70 p-2 text-zinc-300 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur-xl md:hidden"
        >
          <ul className="flex flex-col gap-1 px-4 py-4 sm:px-5">
            {portfolio.navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-lg px-3 py-3 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="px-3 pt-2">
              <Badge variant="accent">{portfolio.personal.status}</Badge>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
