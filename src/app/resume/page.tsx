import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { GMAIL_COMPOSE_URL, LINKEDIN_URL } from "@/lib/contact";
import { ResumePrintTrigger } from "@/components/resume/ResumePrintTrigger";
import { DownloadResumeButton } from "@/components/ui/DownloadResumeButton";

export const metadata: Metadata = {
  title: "Résumé | Ivan Alcantara",
  description: "Résumé of Ivan Vasquez Alcantara — Mobile & Web Developer",
  robots: { index: false, follow: false },
};

export default function ResumePage() {
  const { personal, contact, education, certification, projects, skills } =
    portfolio;
  const primaryEducation = education[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 print:bg-white print:text-black">
      <Suspense fallback={null}>
        <ResumePrintTrigger />
      </Suspense>
      <div className="mx-auto max-w-3xl px-6 py-10 print:max-w-none print:px-8 print:py-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>
          <DownloadResumeButton variant="secondary" />
        </div>

        <header className="border-b border-zinc-800 pb-6 print:border-zinc-300">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 print:text-black">
            {personal.fullName}
          </h1>
          <p className="mt-1 text-lg text-sky-400 print:text-sky-700">
            {personal.role}
          </p>
          <p className="mt-2 text-sm text-zinc-400 print:text-zinc-600">
            {personal.location} · {personal.status}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400 print:text-zinc-600">
            <a href={GMAIL_COMPOSE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400">
              {contact.email}
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400"
            >
              LinkedIn
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400"
            >
              GitHub
            </a>
          </div>
        </header>

        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-sky-400 print:text-sky-700">
            Summary
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300 print:text-zinc-700">
            {personal.bio}
          </p>
        </section>

        {primaryEducation && (
          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-sky-400 print:text-sky-700">
              Education
            </h2>
            <div className="mt-2">
              <p className="font-medium text-zinc-100 print:text-black">
                {primaryEducation.degree}
              </p>
              <p className="text-sm text-zinc-400 print:text-zinc-600">
                {primaryEducation.institution} · {primaryEducation.period}
              </p>
              {primaryEducation.specialization && (
                <p className="text-sm text-zinc-500">
                  Specialization: {primaryEducation.specialization}
                </p>
              )}
            </div>
          </section>
        )}

        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-sky-400 print:text-sky-700">
            Projects
          </h2>
          <div className="mt-3 space-y-4">
            {projects.map((project) => (
              <article key={project.id}>
                <h3 className="font-medium text-zinc-100 print:text-black">
                  {project.title}
                </h3>
                <p className="text-sm text-zinc-500">{project.subtitle}</p>
                <p className="text-xs text-zinc-600">{project.role}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400 print:text-zinc-700">
                  {project.summary}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {project.technologies.join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-sky-400 print:text-sky-700">
            Skills
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {skills.map((category) => (
              <div key={category.title}>
                <p className="text-xs font-medium text-zinc-300 print:text-zinc-700">
                  {category.title}
                </p>
                <p className="text-sm text-zinc-500 print:text-zinc-600">
                  {category.items.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-sky-400 print:text-sky-700">
            Certification
          </h2>
          <div className="mt-2">
            <p className="font-medium text-zinc-100 print:text-black">
              {certification.title}
            </p>
            <p className="text-sm text-zinc-400 print:text-zinc-600">
              {certification.issuer}
            </p>
            <p className="text-sm text-zinc-500">
              Issued {certification.issued} · Valid until {certification.validUntil}
            </p>
            <p className="text-xs text-zinc-600">
              Credential ID: {certification.credentialId}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
