import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { site } from "@/data/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social sharing card, also used for Twitter via metadata fallback. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(900px 500px at 50% -120px, rgba(61,184,245,0.16), transparent 70%), #05070a",
          color: "#f5f7fa",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "#0b0f14",
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          {profile.initials}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.035em" }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 32, color: "#a1a8b3" }}>{site.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
