import { ImageResponse } from "next/og";
import { SuperteamShareImage } from "@/lib/og/superteam-share-image";

export const alt =
  "Superteam Australia — Solana builders, founders, and creatives shipping together.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<SuperteamShareImage />, {
    ...size,
  });
}
