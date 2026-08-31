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

export function DownloadResumeButton({
  variant = "ghost",
  className,
}: DownloadResumeButtonProps) {
  const [loading, setLoading] = useState(false);
  const pdfPath = portfolio.personal.resumePdfPath;

  const handleDownload = async () => {
    setLoading(true);

    try {
      const response = await fetch(pdfPath);

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = RESUME_PDF_FILENAME;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // Fall through to print fallback.
    } finally {
      setLoading(false);
    }

    window.open(`${portfolio.personal.resumePath}?download=1`, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      disabled={loading}
      onClick={handleDownload}
    >
      <Download size={16} />
      {loading ? "Preparing…" : "Download Résumé"}
    </Button>
  );
}
