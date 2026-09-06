import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
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
    <section id="about" className="relative" data-gsap="reveal">
      <Container>
        <SectionHeading
          eyebrow="About"
          title="I build more than interfaces — I build the system behind them."
        />

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="space-y-6 lg:col-span-7">
            <Reveal delay={0.1}>
              <p className="text-base leading-[1.75] text-zinc-400 sm:text-lg">
                I&apos;m a fourth-year BS Information Technology student at
                National University – Lipa, specializing in Mobile and Web
                Applications.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-base leading-[1.75] text-zinc-400 sm:text-lg">
                Through academic projects — especially NU-SECURE — I&apos;ve
                worked across mobile interfaces, Laravel APIs, databases,
                authentication, QR workflows, OCR, and responsive web apps.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-base leading-[1.75] text-zinc-400 sm:text-lg">
                I care about how the full system fits together: what users see,
                the APIs behind it, and the data that keeps everything
                consistent.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button href="#projects">See Projects</Button>
                <Button href="#contact" variant="outline">
                  Get in Touch
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="lg:col-span-5">
            <dl className="divide-y divide-white/8 border-y border-white/8">
              {profileFields.map((field) => (
                <div
                  key={field.label}
                  className="grid grid-cols-[7.5rem_1fr] gap-4 py-4 sm:grid-cols-[8.5rem_1fr]"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    {field.label}
                  </dt>
                  <dd className="text-sm font-medium leading-snug text-zinc-200">
                    {field.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
