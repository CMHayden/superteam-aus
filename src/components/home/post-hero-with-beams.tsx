"use client";

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

/**
 * Single colliding-beams layer for all sections below the hero. Targets register
 * via `data-beam-collision-target` on card surfaces; floor collisions use the
 * bottom of this wrapper (full page stack).
 */
export function PostHeroWithBeams({ children }: { children: React.ReactNode }) {
  return (
    <section id="post-hero">
      <BackgroundBeamsWithCollision beamColorScheme="green">
        {children}
      </BackgroundBeamsWithCollision>
    </section>
  );
}
