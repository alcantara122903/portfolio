"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ResumePrintTrigger() {
  const searchParams = useSearchParams();
  const shouldDownload = searchParams.get("download") === "1";

  useEffect(() => {
    if (!shouldDownload) return;

    const timer = window.setTimeout(() => {
      window.print();
    }, 400);

    return () => window.clearTimeout(timer);
  }, [shouldDownload]);

  return null;
}
