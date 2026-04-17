/**
 * JSX for `next/og` ImageResponse (Satori). Keep styles inline — limited CSS subset.
 * Brand colors match `globals.css` tokens.
 */
export function SuperteamShareImage() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 72,
        background: "linear-gradient(145deg, #071209 0%, #0d2d16 35%, #1b8a3d 55%, #0d2d16 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 900,
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#f9d71c",
          }}
        >
          Superteam
        </span>
        <span
          style={{
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#f4fbf6",
          }}
        >
          Australia
        </span>
        <span
          style={{
            fontSize: 30,
            fontWeight: 500,
            lineHeight: 1.35,
            color: "rgba(244, 251, 246, 0.88)",
          }}
        >
          Solana builders, founders, and creatives — shipping together.
        </span>
      </div>
    </div>
  );
}
