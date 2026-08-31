import { DeviceMockup } from "@/components/projects/DeviceMockup";
import { ArchitectureFlow } from "@/components/projects/ArchitectureFlow";
import type { Project } from "@/types/portfolio";

interface ProjectScreenshotsProps {
  project: Project;
  featured?: boolean;
  section?: "mobile" | "web" | "single";
}

export function ProjectScreenshots({
  project,
  featured,
  section = "single",
}: ProjectScreenshotsProps) {
  const hasMobileGallery =
    project.screenshotSrc &&
    project.additionalScreenshots &&
    project.additionalScreenshots.length > 0;

  if (section === "mobile" && hasMobileGallery) {
    const mobileShots = [
      {
        src: project.screenshotSrc!,
        alt: `${project.title} — Guard Portal`,
        label: "Guard Portal",
      },
      ...project.additionalScreenshots!.map((shot) => ({
        src: shot.src,
        alt: shot.alt,
        label: shot.label,
      })),
    ];

    return (
      <div>
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          Mobile Application
        </p>
        <div className="-mx-1 flex items-end justify-start gap-4 overflow-x-auto pb-1 snap-x snap-mandatory sm:mx-0 sm:justify-center sm:gap-5 sm:overflow-visible md:gap-6">
          {mobileShots.map((shot) => (
            <DeviceMockup
              key={shot.src}
              variant="mobile"
              size="compact"
              imageSrc={shot.src}
              imageAlt={shot.alt}
              label={shot.label}
              className="shrink-0 snap-center"
            />
          ))}
        </div>
      </div>
    );
  }

  if (section === "web" && project.webScreenshot) {
    const webShots = [
      {
        src: project.webScreenshot.src,
        alt: project.webScreenshot.alt,
        label: project.webScreenshot.label,
      },
      ...(project.additionalWebScreenshots ?? []).map((shot) => ({
        src: shot.src,
        alt: shot.alt,
        label: shot.label,
      })),
    ];

    return (
      <div className="space-y-10">
        <div>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Web Platform
          </p>
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
            {webShots.map((shot) => (
              <DeviceMockup
                key={shot.src}
                variant="browser"
                size="gallery"
                imageSrc={shot.src}
                imageAlt={shot.alt}
                label={shot.label}
              />
            ))}
          </div>
        </div>

        {project.webStackLayers && project.webStackLayers.length > 0 && (
          <div className="max-w-xl">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              Web Stack
            </p>
            <ArchitectureFlow
              flowId={`${project.id}-web-stack`}
              steps={project.webStackLayers.map((item) => ({
                label: `${item.layer} · ${item.technology}`,
              }))}
            />
          </div>
        )}
      </div>
    );
  }

  if (hasMobileGallery && section === "single") {
    return (
      <div className="space-y-10">
        <ProjectScreenshots project={project} section="mobile" />
        {project.webScreenshot && (
          <ProjectScreenshots project={project} section="web" />
        )}
      </div>
    );
  }

  return (
    <>
      <DeviceMockup
        variant={featured ? "mobile" : "browser"}
        placeholder="PROJECT SCREENSHOT"
        imageSrc={project.screenshotSrc}
        imageAlt={`${project.title} screenshot`}
      />
      {!project.screenshotSrc && (
        <p className="mt-3 text-center text-xs text-zinc-600">
          {project.screenshotPlaceholder}
        </p>
      )}
    </>
  );
}
