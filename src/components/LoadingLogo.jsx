import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { interpolate } from "flubber";

const LOGO_FILES = [
  "/assets/loading/load-1.svg",
  "/assets/loading/load-2.svg",
  "/assets/loading/load-3.svg",
];

const MORPH_DURATION = 0.15;

export default function LoadingLogo({ size = 85, className = "" }) {
  const [shapes, setShapes] = useState(null);

  const progress = useMotionValue(0);
  const currentIndex = useRef(0);

  // ------------------------------------------------------------
  // Load the SVGs and extract their two paths:
  //
  // path 0 = outer frame
  // path 1 = inner cut-out
  // ------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    async function loadShapes() {
      try {
        const loaded = await Promise.all(
          LOGO_FILES.map(async (file) => {
            const response = await fetch(file);

            if (!response.ok) {
              throw new Error(`Failed to load ${file}`);
            }

            const svgText = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(svgText, "image/svg+xml");

            const path = doc.querySelector("path");

            if (!path) {
              throw new Error(`No path found in ${file}`);
            }

            const d = path.getAttribute("d");

            if (!d) {
              throw new Error(`No path data found in ${file}`);
            }

            /*
             * Each supplied SVG contains two subpaths.
             * We split them by the second "M".
             */
            const subpaths = d.split(/(?=M)/);

            if (subpaths.length < 2) {
              throw new Error(
                `${file} does not contain the expected two subpaths`,
              );
            }

            return {
              outer: subpaths[0],
              inner: subpaths[1],
            };
          }),
        );

        if (!cancelled) {
          setShapes(loaded);
        }
      } catch (error) {
        console.error("Failed to load loading logo:", error);
      }
    }

    loadShapes();

    return () => {
      cancelled = true;
    };
  }, []);

  // ------------------------------------------------------------
  // Create Flubber interpolators for the INNER shapes only.
  // ------------------------------------------------------------
  const interpolators = useMemo(() => {
    if (!shapes) return null;

    return [
      interpolate(shapes[0].inner, shapes[1].inner, {
        maxSegmentLength: 4,
      }),

      interpolate(shapes[1].inner, shapes[2].inner, {
        maxSegmentLength: 4,
      }),

      interpolate(shapes[2].inner, shapes[0].inner, {
        maxSegmentLength: 4,
      }),
    ];
  }, [shapes]);

  // ------------------------------------------------------------
  // Turn animation progress into the current inner shape.
  // ------------------------------------------------------------
  const animatedInner = useTransform(progress, (t) => {
    if (!interpolators) return "";

    return interpolators[currentIndex.current](t);
  });

  // ------------------------------------------------------------
  // Continuously morph:
  //
  // 1 → 2
  // 2 → 3
  // 3 → 1
  // ------------------------------------------------------------
  useEffect(() => {
    if (!interpolators) return;

    let cancelled = false;
    let controls;

    function morph() {
      if (cancelled) return;

      controls = animate(progress, 1, {
        duration: MORPH_DURATION,
        ease: "easeInOut",

        onComplete: () => {
          if (cancelled) return;

          currentIndex.current =
            (currentIndex.current + 1) % interpolators.length;

          progress.set(0);
          morph();
        },
      });
    }

    currentIndex.current = 0;
    progress.set(0);

    morph();

    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [interpolators, progress]);

  if (!shapes) {
    return null;
  }

  return (
    <motion.svg
      viewBox="0 0 85 85"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Static outer frame */}
      <path d={shapes[0].outer} fill="#664e4c" />

      {/* Animated inner cut-out */}
      <motion.path d={animatedInner} fill="#E8D9BD" />
    </motion.svg>
  );
}
