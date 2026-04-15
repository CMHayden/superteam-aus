"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type BeamOptions = {
  lane?: number;
  initialX?: number;
  translateX?: number;
  initialY?: number;
  translateY?: number;
  rotate?: number;
  className?: string;
  duration?: number;
  delay?: number;
  repeatDelay?: number;
};

const DEFAULT_COLLISION_SELECTOR = "[data-beam-collision-target]";

export function BackgroundBeamsWithCollision({
  children,
  className,
  collisionTargetRef,
  collisionTargetRefs,
  collisionTargetSelector = DEFAULT_COLLISION_SELECTOR,
  beamColorScheme = "green",
}: {
  children?: React.ReactNode;
  className?: string;
  /** @deprecated Prefer `collisionTargetRefs` or `data-beam-collision-target` on descendants. */
  collisionTargetRef?: React.RefObject<HTMLElement | null>;
  collisionTargetRefs?: ReadonlyArray<React.RefObject<HTMLElement | null>>;
  /** Query within the beam container when no refs are passed. Default `[data-beam-collision-target]`. */
  collisionTargetSelector?: string;
  beamColorScheme?: "green" | "orange";
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentSize, setParentSize] = useState({ width: 1440, height: 900 });

  const beams: BeamOptions[] = [
    { lane: 0.02, duration: 6, repeatDelay: 1.2, delay: 0.5, className: "h-20" },
    { lane: 0.12, duration: 5, repeatDelay: 1.1, delay: 0.2, className: "h-16" },
    { lane: 0.22, duration: 4.8, repeatDelay: 1.3, delay: 0.8, className: "h-14" },
    { lane: 0.34, duration: 5.6, repeatDelay: 1.0, delay: 0.1, className: "h-18" },
    { lane: 0.46, duration: 4.5, repeatDelay: 1.4, delay: 0.4, className: "h-16" },
    { lane: 0.58, duration: 5.2, repeatDelay: 1.1, delay: 0.7, className: "h-20" },
    { lane: 0.7, duration: 6, repeatDelay: 1.2, delay: 0.9, className: "h-16" },
    { lane: 0.8, duration: 5.1, repeatDelay: 1.0, delay: 0.3, className: "h-18" },
    { lane: 0.9, duration: 4.7, repeatDelay: 1.3, delay: 0.6, className: "h-14" },
    { lane: 0.98, duration: 5.4, repeatDelay: 1.1, delay: 1.0, className: "h-16" },
  ];

  useEffect(() => {
    const node = parentRef.current;
    if (!node) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr?.width) {
        setParentSize((prev) => ({
          width: cr.width,
          height: cr.height || prev.height,
        }));
      }
    });

    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={parentRef} className={cn("relative z-0 w-full overflow-x-clip", className)}>
      <div
        className="pointer-events-none absolute inset-0 z-0 min-h-full overflow-hidden bg-gradient-to-b from-brand-mist via-surface-base to-brand-green/12"
        aria-hidden
      >
        {beams.map((beam, index) => {
          const laneX = Math.round((beam.lane ?? 0.5) * parentSize.width);
          const travelY = Math.max(parentSize.height + 480, 2000);
          return (
            <CollisionMechanism
              key={`beam-${index}`}
              beamOptions={{ ...beam, initialX: laneX, translateX: laneX, translateY: travelY }}
              parentRef={parentRef}
              collisionTargetRef={collisionTargetRef}
              collisionTargetRefs={collisionTargetRefs}
              collisionTargetSelector={collisionTargetSelector}
              beamColorScheme={beamColorScheme}
            />
          );
        })}
      </div>

      {children ? <div className="relative z-10 w-full pt-24 md:pt-32">{children}</div> : null}
    </div>
  );
}

function CollisionMechanism({
  parentRef,
  collisionTargetRef,
  collisionTargetRefs,
  collisionTargetSelector = DEFAULT_COLLISION_SELECTOR,
  beamOptions = {},
  beamColorScheme = "green",
}: {
  parentRef: React.RefObject<HTMLDivElement | null>;
  collisionTargetRef?: React.RefObject<HTMLElement | null>;
  collisionTargetRefs?: ReadonlyArray<React.RefObject<HTMLElement | null>>;
  collisionTargetSelector?: string;
  beamOptions?: BeamOptions;
  beamColorScheme?: "green" | "orange";
}) {
  const beamRef = useRef<HTMLDivElement>(null);
  const [beamKey, setBeamKey] = useState(0);
  const [explosions, setExplosions] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const hitTargetsRef = useRef(new Set<HTMLElement>());
  const hitFloorRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const beamPalette =
    beamColorScheme === "orange"
      ? {
          from: "from-brand-amber",
          via: "via-brand-ochre",
          particleFrom: "from-brand-amber",
          particleTo: "to-brand-ochre",
        }
      : {
          from: "from-brand-green",
          via: "via-brand-sage",
          particleFrom: "from-brand-sage",
          particleTo: "to-brand-green",
        };

  const spawnExplosion = (x: number, y: number) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setExplosions((prev) => [...prev, { id, x, y }]);
    window.setTimeout(() => {
      setExplosions((prev) => prev.filter((e) => e.id !== id));
    }, 900);
  };

  useEffect(() => {
    const resolveTargets = (): HTMLElement[] => {
      const parent = parentRef.current;
      if (!parent) {
        return [];
      }
      const fromRefs = collisionTargetRefs?.flatMap((r) => (r.current ? [r.current] : [])) ?? [];
      if (fromRefs.length > 0) {
        return fromRefs;
      }
      if (collisionTargetRef?.current) {
        return [collisionTargetRef.current];
      }
      return Array.from(parent.querySelectorAll(collisionTargetSelector));
    };

    const checkCollision = () => {
      if (!beamRef.current || !parentRef.current) {
        return;
      }

      const beamRect = beamRef.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();
      const beamCenterX = beamRect.left - parentRect.left + beamRect.width / 2;

      const targets = resolveTargets();
      for (const targetEl of targets) {
        if (hitTargetsRef.current.has(targetEl)) {
          continue;
        }
        const targetRect = targetEl.getBoundingClientRect();
        const intersectsTargetX =
          beamCenterX >= targetRect.left - parentRect.left &&
          beamCenterX <= targetRect.right - parentRect.left;
        const hitsTargetTop = beamRect.bottom >= targetRect.top;

        if (intersectsTargetX && hitsTargetTop) {
          hitTargetsRef.current.add(targetEl);
          spawnExplosion(beamCenterX, targetRect.top - parentRect.top);
        }
      }

      if (!hitFloorRef.current && beamRect.bottom >= parentRect.bottom - 2) {
        hitFloorRef.current = true;
        spawnExplosion(beamCenterX, parentRect.height - 2);
        timeoutRef.current = window.setTimeout(() => {
          hitTargetsRef.current.clear();
          hitFloorRef.current = false;
          setBeamKey((prev) => prev + 1);
        }, (beamOptions.repeatDelay ?? 0) * 1000 + 350);
      }
    };

    const animationInterval = window.setInterval(checkCollision, 50);
    return () => {
      window.clearInterval(animationInterval);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [
    beamOptions.repeatDelay,
    collisionTargetRef,
    collisionTargetRefs,
    collisionTargetSelector,
    parentRef,
  ]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          translateY: beamOptions.initialY ?? -220,
          translateX: beamOptions.initialX ?? 0,
          rotate: beamOptions.rotate ?? 0,
        }}
        variants={{
          animate: {
            translateY: beamOptions.translateY ?? 1800,
            translateX: beamOptions.translateX ?? 0,
            rotate: beamOptions.rotate ?? 0,
          },
        }}
        transition={{
          duration: beamOptions.duration ?? 8,
          repeat: 0,
          ease: "linear",
          delay: beamOptions.delay ?? 0,
        }}
        className={cn(
          "absolute left-0 top-0 m-auto h-16 w-[2px] rounded-full bg-gradient-to-t to-transparent",
          beamPalette.from,
          beamPalette.via,
          beamOptions.className,
        )}
      />

      <AnimatePresence>
        {explosions.map((explosion) => (
          <Explosion
            key={explosion.id}
            beamColorScheme={beamColorScheme}
            style={{
              left: `${explosion.x}px`,
              top: `${explosion.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}

function Explosion({
  beamColorScheme = "green",
  ...props
}: React.HTMLProps<HTMLDivElement> & { beamColorScheme?: "green" | "orange" }) {
  const spans = Array.from({ length: 16 }, (_, index) => ({
    id: index,
    directionX: Math.floor(Math.random() * 70 - 35),
    directionY: Math.floor(Math.random() * -45 - 8),
  }));

  return (
    <div {...props} className={cn("absolute z-30 h-2 w-2", props.className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className={cn(
          "absolute -inset-x-8 top-0 m-auto h-2 w-8 rounded-full bg-gradient-to-r from-transparent to-transparent blur-sm",
          beamColorScheme === "orange" ? "via-brand-amber" : "via-brand-green",
        )}
      />
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: span.directionX, y: span.directionY, opacity: 0 }}
          transition={{ duration: Math.random() * 1.0 + 0.4, ease: "easeOut" }}
          className={cn(
            "absolute h-1 w-1 rounded-full bg-gradient-to-b",
            beamColorScheme === "orange"
              ? "from-brand-amber to-brand-ochre"
              : "from-brand-sage to-brand-green",
          )}
        />
      ))}
    </div>
  );
}

