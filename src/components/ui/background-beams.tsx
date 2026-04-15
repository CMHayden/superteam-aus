"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const beamPaths = [
  "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
  "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
  "M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811",
  "M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779",
  "M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747",
  "M-240 -349C-240 -349 -172 56 292 183C756 310 824 715 824 715",
  "M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683",
  "M-184 -413C-184 -413 -116 -8 348 119C812 246 880 651 880 651",
  "M-156 -445C-156 -445 -88 -40 376 87C840 214 908 619 908 619",
  "M-128 -477C-128 -477 -60 -72 404 55C868 182 936 587 936 587",
  "M-100 -509C-100 -509 -32 -104 432 23C896 150 964 555 964 555",
  "M-72 -541C-72 -541 -4 -136 460 -9C924 118 992 523 992 523",
  "M-44 -573C-44 -573 24 -168 488 -41C952 86 1020 491 1020 491",
];

const durations = [14, 16, 18, 20, 22, 24, 26, 19, 17, 21, 23, 25, 27];
const delays = [0, 1.2, 2.6, 0.8, 3.4, 1.6, 2.2, 0.4, 3.1, 1.1, 2.8, 0.6, 3.6];

export const BackgroundBeams = React.memo(
  ({
    className,
    colorScheme = "warm",
    contrast = "normal",
    reverse = false,
  }: {
    className?: string;
    colorScheme?: "warm" | "green";
    contrast?: "normal" | "high";
    reverse?: boolean;
  }) => {
    const instanceId = React.useId().replace(/:/g, "");
    const gradientStops =
      colorScheme === "green"
        ? {
            start: contrast === "high" ? "#163828" : "#1a2e22",
            mid1: contrast === "high" ? "#48c36f" : "#2d8f48",
            mid2: contrast === "high" ? "#f9d71c" : "#1b8a3d",
            end: contrast === "high" ? "#0c1712" : "#0f1411",
          }
        : {
            start: "#2a2418",
            mid1: "#e8c020",
            mid2: "#f9d71c",
            end: "#3d3510",
          };
    const trackStroke =
      contrast === "high"
        ? "rgb(224 231 227 / 0.22)"
        : colorScheme === "green"
          ? "rgb(152 170 160 / 0.14)"
          : "rgb(208 194 150 / 0.14)";

    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          reverse && "-scale-x-100",
          className,
        )}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          width="100%"
          height="100%"
          viewBox="0 0 696 316"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          {beamPaths.map((path, index) => (
            <path
              key={`beam-track-${index}`}
              d={path}
              stroke={trackStroke}
              strokeWidth={contrast === "high" ? "1.05" : "0.8"}
              fill="none"
            />
          ))}

          {beamPaths.map((path, index) => (
            <motion.path
              key={`beam-path-${index}`}
              d={path}
              stroke={`url(#beam-gradient-${instanceId}-${index})`}
              strokeOpacity={contrast === "high" ? "0.9" : "0.65"}
              strokeWidth={contrast === "high" ? "1.3" : "0.95"}
            />
          ))}

          <defs>
            {beamPaths.map((_, index) => (
              <motion.linearGradient
                id={`beam-gradient-${instanceId}-${index}`}
                key={`beam-gradient-key-${instanceId}-${index}`}
                initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
                animate={{
                  x1: ["0%", "100%"],
                  x2: ["4%", "92%"],
                  y1: ["0%", "100%"],
                  y2: ["0%", "96%"],
                }}
                transition={{
                  duration: durations[index] ?? 20,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: delays[index] ?? 0,
                }}
              >
                <stop stopColor={gradientStops.start} stopOpacity="0" />
                <stop offset="16%" stopColor={gradientStops.mid1} stopOpacity="0.9" />
                <stop offset="56%" stopColor={gradientStops.mid2} stopOpacity="0.95" />
                <stop offset="100%" stopColor={gradientStops.end} stopOpacity="0.12" />
              </motion.linearGradient>
            ))}
          </defs>
        </svg>
      </div>
    );
  },
);

BackgroundBeams.displayName = "BackgroundBeams";

