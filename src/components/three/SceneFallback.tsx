export function SceneFallback() {
  return (
    <div
      className="relative flex h-[28rem] w-full flex-col justify-end overflow-hidden border border-white/10 p-6 sm:h-[32rem] lg:h-[min(36rem,70vh)]"
      role="img"
      aria-label="Device visualization"
    >
      <div className="absolute inset-0 bg-[var(--background)]" />
      <div className="absolute inset-x-8 top-10 bottom-16 border border-white/10 bg-white/[0.02] sm:inset-x-16" />
      <div className="relative space-y-2">
        <p className="font-mono text-[10px] text-zinc-600">01 → 02 → 03</p>
        <p className="text-sm text-zinc-400">Mobile / API / Database</p>
      </div>
    </div>
  );
}
