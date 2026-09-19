"use client";

import { useEffect, useRef } from "react";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { portfolio } from "@/data/portfolio";
import { GMAIL_COMPOSE_URL, LINKEDIN_URL } from "@/lib/contact";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { DownloadResumeButton } from "@/components/ui/DownloadResumeButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const RESOLVE = ["Build", "Connect", "Ship"] as const;

export function ContactSection() {
  const { contact, personal } = portfolio;
  const rootRef = useRef<HTMLElement>(null);
  const signalRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const nodes = rootRef.current!.querySelectorAll("[data-resolve-node]");
      const lines = rootRef.current!.querySelectorAll("[data-resolve-line]");

      gsap.set(nodes, { autoAlpha: 0.25 });
      gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      nodes.forEach((node, i) => {
        tl.to(node, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, i * 0.18);
        if (lines[i]) {
          tl.to(
            lines[i],
            { scaleX: 1, duration: 0.45, ease: "power2.inOut" },
            i * 0.18 + 0.1,
          );
        }
      });

      if (signalRef.current) {
        tl.fromTo(
          signalRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, ease: "power2.out" },
          "-=0.2",
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="contact"
      ref={rootRef}
      data-gsap="section"
      data-story="contact"
    >
      <Container>
        <div className="mb-10 flex flex-wrap items-center gap-3">
          {RESOLVE.map((word, i) => (
            <div key={word} className="flex items-center gap-3">
              <span
                data-resolve-node
                className="font-mono text-[11px] tracking-[0.2em] text-zinc-400"
              >
                {word}
              </span>
              {i < RESOLVE.length - 1 && (
                <span
                  data-resolve-line
                  className="hidden h-px w-10 origin-left scale-x-0 bg-white/20 sm:block"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>

        <SectionHeading
          eyebrow="Contact"
          title="Let's talk"
          subtitle={`${personal.availability}. Prefer ${personal.focusAreas.join(", ").toLowerCase()}.`}
        />

        <MaskReveal className="mt-12 max-w-xl">
          <dl className="divide-y divide-white/8 border-y border-white/8">
            <div className="grid gap-1 py-5 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-6">
              <dt className="font-mono text-[10px] tracking-[0.18em] text-zinc-500">
                Email
              </dt>
              <dd>
                <a
                  href={GMAIL_COMPOSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sm text-zinc-200 transition-colors hover:text-[var(--accent)] sm:break-normal sm:text-base"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
            <div className="grid gap-1 py-5 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-6">
              <dt className="font-mono text-[10px] tracking-[0.18em] text-zinc-500">
                LinkedIn
              </dt>
              <dd>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-200 transition-colors hover:text-[var(--accent)] sm:text-base"
                >
                  /in/ivan-alcantara
                </a>
              </dd>
            </div>
            <div className="grid gap-1 py-5 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-6">
              <dt className="font-mono text-[10px] tracking-[0.18em] text-zinc-500">
                GitHub
              </dt>
              <dd>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-200 transition-colors hover:text-[var(--accent)] sm:text-base"
                >
                  @alcantara122903
                </a>
              </dd>
            </div>
          </dl>
        </MaskReveal>

        <div className="mt-10">
          <div
            ref={signalRef}
            className="mb-6 h-px max-w-xs origin-left scale-x-0 bg-[var(--accent)]"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <MagneticButton>
              <Button
                href={GMAIL_COMPOSE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail size={16} />
                Email Me
              </Button>
            </MagneticButton>
            <MagneticButton strength={0.22}>
              <Button
                href={LINKEDIN_URL}
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon size={16} />
                LinkedIn
              </Button>
            </MagneticButton>
            <MagneticButton strength={0.2}>
              <Button
                href={contact.github}
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon size={16} />
                GitHub
              </Button>
            </MagneticButton>
            <MagneticButton strength={0.18}>
              <DownloadResumeButton variant="ghost" />
            </MagneticButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
