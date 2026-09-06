import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { portfolio } from "@/data/portfolio";
import { GMAIL_COMPOSE_URL, LINKEDIN_URL } from "@/lib/contact";
import { Reveal } from "@/components/animations/Reveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { DownloadResumeButton } from "@/components/ui/DownloadResumeButton";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ContactSection() {
  const { contact, personal } = portfolio;

  return (
    <section id="contact" data-gsap="section">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something that works."
          subtitle={`${personal.availability}. Prefer ${personal.focusAreas.join(", ").toLowerCase()}.`}
        />

        <Reveal delay={0.1} className="mt-12 max-w-xl">
          <dl className="divide-y divide-white/8 border-y border-white/8">
            <div className="grid gap-1 py-5 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-6">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Email
              </dt>
              <dd>
                <a
                  href={GMAIL_COMPOSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sm text-zinc-200 transition-colors hover:text-sky-400 sm:break-normal sm:text-base"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
            <div className="grid gap-1 py-5 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-6">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                LinkedIn
              </dt>
              <dd>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-200 transition-colors hover:text-sky-400 sm:text-base"
                >
                  /in/ivan-alcantara
                </a>
              </dd>
            </div>
            <div className="grid gap-1 py-5 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-6">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                GitHub
              </dt>
              <dd>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-200 transition-colors hover:text-sky-400 sm:text-base"
                >
                  @alcantara122903
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
            <MagneticButton>
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
            <MagneticButton>
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
            <MagneticButton>
              <DownloadResumeButton variant="ghost" />
            </MagneticButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
