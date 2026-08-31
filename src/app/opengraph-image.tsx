import { ImageResponse } from "next/og";

export const alt = "Ivan Alcantara — Mobile & Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(145deg, #09090b 0%, #0c1929 48%, #09090b 100%)",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#7dd3fc",
            fontSize: 28,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              background: "#38bdf8",
              transform: "rotate(45deg)",
              boxShadow: "0 0 24px rgba(56,189,248,0.8)",
            }}
          />
          Systems Lab
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            IVAN ALCANTARA
          </div>
          <div style={{ fontSize: 36, color: "#38bdf8", fontWeight: 600 }}>
            Mobile & Web Developer
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#a1a1aa",
              maxWidth: 820,
              lineHeight: 1.4,
            }}
          >
            Building systems that connect people, data, and experiences.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#71717a",
            fontSize: 22,
          }}
        >
          <span>Open to Internship · Mobile & Web · 2026</span>
          <span style={{ color: "#38bdf8" }}>ivan-alcantara.vercel.app</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
