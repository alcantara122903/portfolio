import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      data-gsap="heading"
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          data-gsap="eyebrow"
          className="mb-3 text-sm font-medium text-[var(--muted)]"
        >
          {eyebrow}
        </p>
      )}
      <h2
        data-gsap="title"
        className="font-display text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-[var(--foreground)] min-[380px]:text-4xl sm:text-[2.6rem] lg:text-[2.85rem]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {title}
      </h2>
      <div
        data-gsap="rule"
        className="mt-5 h-px w-12 origin-left bg-[var(--border)]"
        aria-hidden="true"
      />
      {subtitle && (
        <p
          data-gsap="subtitle"
          className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-[1.05rem]"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
