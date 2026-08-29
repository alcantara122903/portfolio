import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeviceMockupProps {
  variant?: "mobile" | "browser";
  size?: "default" | "compact" | "gallery";
  placeholder?: string;
  imageSrc?: string;
  imageAlt?: string;
  label?: string;
  className?: string;
}

const mobileSizes = {
  default: "w-48 sm:w-55 md:w-65",
  compact: "w-[6.75rem] min-[380px]:w-28 sm:w-32 md:w-36 lg:w-40",
  gallery: "w-[6.75rem] min-[380px]:w-28 sm:w-32 md:w-36 lg:w-40",
} as const;

export function DeviceMockup({
  variant = "mobile",
  size = "default",
  placeholder = "PROJECT SCREENSHOT",
  imageSrc,
  imageAlt = "Project screenshot",
  label,
  className,
}: DeviceMockupProps) {
  if (variant === "browser") {
    const isGallery = size === "gallery";

    return (
      <figure className={cn("w-full min-w-0", className)}>
        <div
          className={cn(
            "group overflow-hidden rounded-xl border bg-zinc-900/40 shadow-lg shadow-black/25 transition-all duration-300",
            isGallery
              ? "border-zinc-800/60 hover:border-zinc-700/80 hover:shadow-xl hover:shadow-sky-500/5"
              : "border-zinc-800 hover:border-zinc-700",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2 border-b border-zinc-800/80 bg-zinc-900/80 px-3",
              isGallery ? "py-2" : "py-2.5 sm:py-3",
            )}
          >
            <span className="h-2 w-2 rounded-full bg-red-500/35" />
            <span className="h-2 w-2 rounded-full bg-amber-400/35" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/35" />
            <div className="ml-2 h-4 flex-1 rounded-md border border-zinc-800/50 bg-zinc-950/60" />
          </div>
          {imageSrc ? (
            <div className="relative w-full overflow-hidden bg-zinc-950">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={1024}
                height={480}
                className="h-auto w-full object-contain object-top transition-transform duration-500 group-hover:scale-[1.01]"
                sizes={
                  isGallery
                    ? "(max-width: 1024px) 90vw, 42vw"
                    : "(max-width: 768px) 100vw, 50vw"
                }
              />
            </div>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center gap-3 p-8">
              <ImageIcon className="text-zinc-600" size={32} strokeWidth={1.5} />
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                {placeholder}
              </p>
            </div>
          )}
        </div>
        {label && (
          <figcaption className="mt-2.5 flex justify-center">
            <span className="rounded-full border border-zinc-800/80 bg-zinc-900/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
              {label}
            </span>
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className={cn("flex flex-col items-center", className)}>
      <div className="flex justify-center">
        <div
          className={cn(
            "relative rounded-4xl border-2 border-zinc-700/80 bg-zinc-900 p-1.5 shadow-lg shadow-black/40 sm:p-2",
            mobileSizes[size],
          )}
        >
          <div className="absolute left-1/2 top-2.5 z-10 h-1 w-8 -translate-x-1/2 rounded-full bg-zinc-800 sm:top-3 sm:w-10" />
          <div className="relative flex aspect-9/19 flex-col items-center justify-center overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover object-top"
                sizes={size === "compact" ? "160px" : "260px"}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 p-6">
                <ImageIcon className="text-zinc-600" size={28} strokeWidth={1.5} />
                <p className="text-center text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  {placeholder}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {label && (
        <figcaption className="mt-3 flex justify-center">
          <span className="rounded-full border border-zinc-800/80 bg-zinc-900/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
            {label}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
