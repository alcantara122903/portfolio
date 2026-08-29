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
      <div className="h-full">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
          Mobile Application
        </p>
        <div className="flex h-full min-h-[320px] flex-col rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 sm:min-h-[360px] sm:p-5">
          <div className="flex flex-1 items-end justify-center gap-4 sm:gap-6">
            {mobileShots.map((shot) => (
              <DeviceMockup
                key={shot.src}
                variant="mobile"
                size="compact"
                imageSrc={shot.src}
                imageAlt={shot.alt}
                label={shot.label}
                className="shrink-0"
              />
            ))}
          </div>
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
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
          Web Platform
        </p>
        <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch lg:gap-8">
          <div className="flex flex-col rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 sm:p-5">
            <div className="flex flex-1 flex-col justify-center gap-4 sm:gap-5">
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
            <div className="flex flex-col rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 sm:p-6">
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-500">
                Web Stack
              </p>
              <div className="flex flex-1 items-center">
                <ArchitectureFlow
                  flowId={`${project.id}-web-stack`}
                  steps={project.webStackLayers.map((item) => ({
                    label: `${item.layer} · ${item.technology}`,
                  }))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (hasMobileGallery && section === "single") {
    return (
      <div className="space-y-6">
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
