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
  return (
    <Button
      href={portfolio.personal.resumePdfPath}
      download={RESUME_PDF_FILENAME}
      variant={variant}
      className={className}
    >
      <Download size={16} />
      Download Résumé
    </Button>
  );
}
