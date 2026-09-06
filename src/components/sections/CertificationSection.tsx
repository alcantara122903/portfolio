import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CertificationSection() {
  const cert = portfolio.certification;

  return (
    <section data-gsap="section">
      <Container>
        <SectionHeading eyebrow="Credentials" title="Certification." />

        <Reveal delay={0.1} className="mt-12 max-w-2xl border-t border-white/8 pt-8">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-zinc-100">
            {cert.title}
          </h3>
          <p className="mt-2 text-sm text-zinc-400">{cert.issuer}</p>

          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Issued
              </dt>
              <dd className="mt-2 text-sm text-zinc-300">{cert.issued}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Valid until
              </dt>
              <dd className="mt-2 text-sm text-zinc-300">{cert.validUntil}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Credential
              </dt>
              <dd className="mt-2 font-mono text-sm text-zinc-300">
                {cert.credentialId}
              </dd>
            </div>
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
