"use client";

import { useEffect, useRef, useState } from "react";
import { portfolio } from "@/data/portfolio";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const CLUSTERS = [
  {
    id: "web",
    title: "Web",
    nodes: ["TypeScript", "Next.js", "React"] as const,
    related: ["TypeScript", "Next.js", "React"] as const,
  },
  {
    id: "mobile",
    title: "Mobile",
    nodes: ["React Native", "Expo"] as const,
    related: ["React Native", "Expo", "TypeScript"] as const,
  },
  {
    id: "api",
    title: "API",
    nodes: ["Laravel", "PHP", "REST API"] as const,
    related: ["Laravel", "PHP", "REST API"] as const,
  },
  {
    id: "data",
    title: "Data",
    nodes: ["Supabase", "PostgreSQL", "SQL"] as const,
    related: ["Supabase", "PostgreSQL", "SQL"] as const,
  },
] as const;

const PRIMARY = new Set([
  ...CLUSTERS.flatMap((c) => [...c.nodes, ...c.related]),
  "REST APIs",
]);

function relatedFor(node: string | null): Set<string> {
  if (!node) return new Set();
  for (const cluster of CLUSTERS) {
    if (
      (cluster.nodes as readonly string[]).includes(node) ||
      (cluster.related as readonly string[]).includes(node)
    ) {
      return new Set(cluster.related);
    }
  }
  return new Set([node]);
}

/**
 * Skills network + proximity scale (GSAP “Proximity scale grid” idea,
 * restrained for editorial portfolio).
 */
export function SkillsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isCoarse = useMediaQuery("(hover: none), (pointer: coarse)");
  const [active, setActive] = useState<string | null>(null);
  const highlighted = relatedFor(active);

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const clusters = rootRef.current!.querySelectorAll("[data-skill-cluster]");
      gsap.fromTo(
        clusters,
        { autoAlpha: 0.35 },
        {
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const lines = rootRef.current!.querySelectorAll("[data-skill-line]");
      lines.forEach((line) => {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: line,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Proximity scale — desktop pointer only
  useEffect(() => {
    if (reducedMotion || isCoarse || !gridRef.current) return;
    registerGsap();

    const grid = gridRef.current;
    const nodes = Array.from(
      grid.querySelectorAll<HTMLElement>("[data-skill-node]"),
    );

    const scaleTos = nodes.map((node) =>
      gsap.quickTo(node, "scale", {
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      }),
    );

    gsap.set(nodes, { transformOrigin: "left center" });

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      nodes.forEach((node, i) => {
        const rect = node.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(event.clientX - cx, event.clientY - cy);
        const t = Math.max(0, 1 - dist / 140);
        scaleTos[i](1 + t * 0.08);
      });
    };

    const onLeave = () => {
      scaleTos.forEach((to) => to(1));
    };

    grid.addEventListener("pointermove", onMove);
    grid.addEventListener("pointerleave", onLeave);

    return () => {
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", onLeave);
      gsap.set(nodes, { scale: 1 });
    };
  }, [reducedMotion, isCoarse]);

  const also = portfolio.skills
    .flatMap((c) => c.items)
    .filter((item, i, arr) => arr.indexOf(item) === i && !PRIMARY.has(item))
    .slice(0, 10);

  return (
    <section
      id="skills"
      ref={rootRef}
      className="relative"
      data-gsap="section"
      data-story="network"
    >
      <Container className="relative">
        <SectionHeading
          eyebrow="Stack"
          title="How the tools connect."
          subtitle="Hover a technology to see what it relates to in real builds."
        />

        <div
          ref={gridRef}
          className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        >
          {CLUSTERS.map((cluster) => (
            <div
              key={cluster.id}
              data-skill-cluster
              className="relative border-t border-white/8 pt-5"
            >
              <p className="text-sm text-zinc-500">{cluster.title}</p>
              <div className="relative mt-5 space-y-0 pl-4">
                <div
                  data-skill-line
                  className="absolute bottom-3 left-0 top-3 w-px origin-top scale-y-0 bg-white/12"
                />
                {cluster.nodes.map((node) => {
                  const isLit = !active || highlighted.has(node);
                  return (
                    <button
                      key={node}
                      type="button"
                      data-skill-node
                      onMouseEnter={() => setActive(node)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(node)}
                      onBlur={() => setActive(null)}
                      className={cn(
                        "relative block w-full py-2.5 text-left text-sm transition-colors duration-200 will-change-transform",
                        isLit ? "text-zinc-100" : "text-zinc-600",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute -left-[3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full transition-colors",
                          isLit ? "bg-[var(--accent)]/70" : "bg-white/15",
                        )}
                      />
                      {node}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {also.length > 0 && (
          <p className="mt-12 max-w-2xl text-sm leading-relaxed text-zinc-500">
            Also comfortable with {also.join(" / ")}.
          </p>
        )}
      </Container>
    </section>
  );
}
