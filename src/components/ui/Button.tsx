"use client";

import { cn } from "@/lib/utils";
import { handleHashNavClick } from "@/lib/scrollToSection";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-zinc-100 text-zinc-950 hover:bg-white border border-transparent",
  secondary:
    "bg-transparent text-zinc-100 border border-white/12 hover:border-white/25 hover:bg-white/[0.03]",
  ghost: "bg-transparent text-zinc-400 hover:text-white",
  outline:
    "bg-transparent text-zinc-200 border border-white/12 hover:border-[var(--accent)]/45 hover:text-white",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] px-4 py-2.5 text-sm font-medium tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50";

type SharedProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type AnchorButtonProps = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    download?: string;
  };

type NativeButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export function Button(props: AnchorButtonProps | NativeButtonProps) {
  const { variant = "primary", className, children, href, ...rest } = props;
  const classes = cn(baseStyles, variants[variant], className);

  if (href) {
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    const isHash = href.startsWith("#");

    return (
      <a
        href={href}
        className={classes}
        {...anchorRest}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          if (isHash) handleHashNavClick(event);
          anchorRest.onClick?.(event);
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
