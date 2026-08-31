import { Award } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CertificationSection() {
  const cert = portfolio.certification;

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Credentials" title="Certification" />

        <Reveal delay={0.1} className="mt-10 max-w-2xl">
          <GlassCard scrollAnime className="relative overflow-hidden">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-sky-500/5 blur-2xl" />
            <div className="flex items-start gap-4">
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3">
                <Award className="text-sky-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold uppercase tracking-wide text-zinc-100">
                  {cert.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">{cert.issuer}</p>

                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-zinc-500">
                      Issued
                    </dt>
                    <dd className="mt-1 text-sm text-zinc-300">{cert.issued}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-zinc-500">
                      Valid until
                    </dt>
                    <dd className="mt-1 text-sm text-zinc-300">
                      {cert.validUntil}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[10px] uppercase tracking-widest text-zinc-500">
                      Credential ID
                    </dt>
                    <dd className="mt-1 font-mono text-sm text-zinc-300">
                      {cert.credentialId}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </Container>
    </section>
  );
}
