import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

const profileFields = [
  { label: "Role", value: portfolio.personal.role },
  { label: "Education", value: portfolio.personal.education },
  { label: "Specialization", value: portfolio.personal.specialization },
  { label: "Location", value: "Lipa City, Batangas" },
  { label: "Status", value: portfolio.personal.status },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="About"
            title="I BUILD MORE THAN INTERFACES. I BUILD THE SYSTEM BEHIND THEM."
          />
        </Reveal>

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
                Through my academic development projects, I&apos;ve gained
                hands-on experience working across mobile interfaces, backend
                APIs, databases, authentication, QR-based workflows, OCR
                integration, and responsive web applications.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-base leading-relaxed text-zinc-400">
                I enjoy understanding how the different parts of a system work
                together — from what users interact with on screen to the APIs,
                logic, and databases behind the experience.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="text-base leading-relaxed text-zinc-400">
                I&apos;m currently looking for an internship where I can
                contribute to real development projects, learn from experienced
                engineers, and continue strengthening my software development
                skills.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.3} className="lg:col-span-2">
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
        </div>
      </Container>
    </section>
  );
}
