import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { RESUME_PDF_FILENAME } from "@/lib/contact";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "resume",
      RESUME_PDF_FILENAME,
    );
    const file = await readFile(filePath);

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${RESUME_PDF_FILENAME}"`,
        "Cache-Control": "public, max-age=3600, must-revalidate",
      },
    });
  } catch {
    return NextResponse.redirect(new URL("/resume?download=1", request.url));
  }
}
