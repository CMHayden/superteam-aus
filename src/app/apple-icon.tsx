import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #071209 0%, #1b8a3d 55%, #0d2d16 100%)",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: "#f9d71c",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            ST
          </span>
          <span
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: "#f4fbf6",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            AU
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
