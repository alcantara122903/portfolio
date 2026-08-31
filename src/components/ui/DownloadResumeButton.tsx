"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { RESUME_PDF_FILENAME } from "@/lib/contact";
import { Button } from "@/components/ui/Button";

interface DownloadResumeButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  className?: string;
}

async function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function DownloadResumeButton({
  variant = "ghost",
  className,
}: DownloadResumeButtonProps) {
  const [loading, setLoading] = useState(false);
  const pdfPath = portfolio.personal.resumePdfPath;

  const handleDownload = async () => {
    setLoading(true);

    try {
      // Prefer API route for correct Content-Disposition on all browsers.
      const apiResponse = await fetch("/api/resume", { cache: "no-store" });
      if (apiResponse.ok) {
        const blob = await apiResponse.blob();
        if (blob.type.includes("pdf") || blob.size > 0) {
          await triggerBlobDownload(blob, RESUME_PDF_FILENAME);
          return;
        }
      }

      const direct = await fetch(pdfPath, { cache: "no-store" });
      if (direct.ok) {
        await triggerBlobDownload(await direct.blob(), RESUME_PDF_FILENAME);
        return;
      }
    } catch {
      // Fall through to printable résumé page.
    } finally {
      setLoading(false);
    }

    window.open(
      `${portfolio.personal.resumePath}?download=1`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      disabled={loading}
      onClick={handleDownload}
      aria-busy={loading}
    >
      <Download size={16} />
      {loading ? "Preparing…" : "Download Résumé"}
    </Button>
  );
}
