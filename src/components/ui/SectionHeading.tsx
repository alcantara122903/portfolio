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
      data-anime="section-heading"
      data-gsap="heading"
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          data-anime="eyebrow"
          data-gsap="eyebrow"
          className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-sky-400/80"
        >
          {eyebrow}
        </p>
      )}
      <h2
        data-anime="title"
        data-gsap="title"
        className="font-display text-balance text-3xl font-semibold tracking-tight text-zinc-50 min-[380px]:text-4xl sm:text-[2.75rem] lg:text-5xl"
      >
        {title}
      </h2>
      {subtitle && (
        <p
          data-anime="subtitle"
          data-gsap="subtitle"
          className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
