import { Smartphone } from "lucide-react";

export function SceneFallback() {
  return (
    <div
      className="relative flex h-80 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-zinc-800/70 sm:h-100 lg:h-130"
      role="img"
      aria-label="Abstract device visualization fallback"
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-sky-950/50 via-zinc-950 to-indigo-950/40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(56,189,248,0.12)_0%,transparent_55%)]" />

      <div className="relative flex h-48 w-24 items-center justify-center rounded-2xl border-2 border-sky-500/20 bg-zinc-900/80 shadow-[0_0_40px_-12px_rgba(56,189,248,0.25)]">
        <Smartphone className="text-sky-400/40" size={32} strokeWidth={1.5} />
        <div className="absolute inset-x-3 top-4 space-y-2">
          <div className="h-2 rounded bg-sky-500/50" />
          <div className="h-6 rounded bg-sky-950/80" />
          <div className="h-6 rounded bg-zinc-800/80" />
          <div className="mx-auto mt-3 h-10 w-10 rounded border border-sky-400/50 bg-sky-950/50" />
          <div className="h-2 rounded bg-sky-500/40" />
        </div>
      </div>
      <p className="relative mt-6 text-xs uppercase tracking-widest text-sky-400/60">
        App → API → Database
      </p>
    </div>
  );
}
