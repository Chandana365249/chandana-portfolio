import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Monogram favicon in the brand gradient, matching the navbar badge. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(110deg, #38bdf8, #a78bfa 50%, #f472b6)",
          borderRadius: 7,
          color: "#04131c",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        {profile.initials}
      </div>
    ),
    size,
  );
}
