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
  const { contact } = portfolio;

  return (
    <section id="contact" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
            eyebrow="Contact"
            title="LET'S BUILD SOMETHING THAT WORKS."
            subtitle="I'm currently looking for internship opportunities in software development, mobile development, web development, and related IT roles. If you're building something interesting, I'd love to hear about it."
          />

        <Reveal delay={0.1} className="mt-10 max-w-xl space-y-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Email
            </p>
            <a
              href={GMAIL_COMPOSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block break-all text-sm text-zinc-200 transition-colors hover:text-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 sm:break-normal sm:text-base"
            >
              {contact.email}
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              LinkedIn
            </p>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block break-all text-sm text-zinc-200 transition-colors hover:text-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 sm:break-normal sm:text-base"
            >
              linkedin.com/in/ivan-alcantara-9265903b5
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              GitHub
            </p>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block break-all text-sm text-zinc-200 transition-colors hover:text-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 sm:break-normal sm:text-base"
            >
              github.com/alcantara122903
            </a>
          </div>
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
              <DownloadResumeButton />
            </MagneticButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
