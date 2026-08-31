import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/animations/Reveal";
import { ScrollReveal3D } from "@/components/animations/ScrollReveal3D";
import { Container } from "@/components/layout/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const profileFields = [
  { label: "Role", value: portfolio.personal.role },
  { label: "Education", value: portfolio.personal.education },
  { label: "Specialization", value: portfolio.personal.specialization },
  { label: "Location", value: "Lipa City, Batangas" },
  { label: "Status", value: portfolio.personal.status },
  {
    label: "Focus",
    value: portfolio.personal.focusAreas.join(" · "),
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="About"
          title="I BUILD MORE THAN INTERFACES. I BUILD THE SYSTEM BEHIND THEM."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="space-y-5 lg:col-span-3">
            <Reveal delay={0.1}>
              <p className="text-base leading-relaxed text-zinc-400">
                I&apos;m a fourth-year Bachelor of Science in Information
                Technology student at National University – Lipa, specializing
                in Mobile and Web Applications.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-base leading-relaxed text-zinc-400">
                Through academic projects — especially NU-SECURE — I&apos;ve
                worked across mobile interfaces, Laravel APIs, databases,
                authentication, QR workflows, OCR, and responsive web apps.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-base leading-relaxed text-zinc-400">
                I care about how the full system fits together: what users see,
                the APIs behind it, and the data that keeps everything consistent.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="text-base leading-relaxed text-zinc-400">
                {portfolio.personal.availability}. Ideal roles:{" "}
                {portfolio.personal.focusAreas.join(", ").toLowerCase()}.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button href="#projects">See Projects</Button>
                <Button href="#contact" variant="outline">
                  Get in Touch
                </Button>
              </div>
            </Reveal>
          </div>

          <ScrollReveal3D className="lg:col-span-2" depth="subtle">
            <Reveal delay={0.3}>
              <GlassCard className="space-y-5">
                {profileFields.map((field) => (
                  <div key={field.label}>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      {field.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-200">
                      {field.value}
                    </p>
                  </div>
                ))}
              </GlassCard>
            </Reveal>
          </ScrollReveal3D>
        </div>
      </Container>
    </section>
  );
}
