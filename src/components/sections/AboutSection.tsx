"use client";

import { portfolio } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { MaskReveal } from "@/components/motion/MaskReveal";

const profileFields = [
  { label: "Role", value: portfolio.personal.role },
  { label: "Education", value: portfolio.personal.education },
  { label: "Focus", value: portfolio.personal.specialization },
  { label: "Location", value: portfolio.personal.location },
  { label: "Status", value: portfolio.personal.status },
];

const LAYERS = ["Interface", "Logic", "Data"] as const;

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative"
      data-gsap="section"
      data-story="about"
    >
      <Container>
        <SectionHeading
          eyebrow="About"
          title="IT student building mobile and web systems end to end."
        />

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
          {LAYERS.map((layer, i) => (
            <MaskReveal key={layer} delay={i * 0.08} className="py-1">
              <p className="font-mono text-[11px] tracking-[0.18em] text-zinc-600">
                {String(i + 1).padStart(2, "0")} {layer}
              </p>
            </MaskReveal>
          ))}
        </div>

        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="space-y-5 lg:col-span-7">
            <MaskReveal>
              <p className="max-w-xl text-base leading-[1.75] text-zinc-400 sm:text-lg">
                Fourth-year BS Information Technology at National University
                Lipa. Capstone work on NU-SECURE spans React Native, Laravel
                APIs, QR and OCR flows, and a shared PostgreSQL database.
              </p>
            </MaskReveal>
            <MaskReveal delay={0.08}>
              <p className="max-w-xl text-base leading-[1.75] text-zinc-400 sm:text-lg">
                I care about the full path: what people touch, the API that
                moves the request, and the data that keeps campus workflows
                consistent.
              </p>
            </MaskReveal>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button href="#projects">Selected work</Button>
              <Button href="#contact" variant="outline">
                Contact
              </Button>
            </div>
          </div>

          <dl className="divide-y divide-white/8 border-y border-white/8 lg:col-span-5">
            {profileFields.map((field) => (
              <div
                key={field.label}
                className="grid grid-cols-[6.5rem_1fr] gap-4 py-4 sm:grid-cols-[7.5rem_1fr]"
              >
                <dt className="text-sm text-zinc-500">{field.label}</dt>
                <dd className="text-sm font-medium leading-snug text-zinc-200">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
