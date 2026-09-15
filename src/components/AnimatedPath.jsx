import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import polymorph from "polymorph-js";
import { interpolate as flubberInterpolate } from "flubber";

export default function AnimatedPath({ d, ...props }) {
  // The path currently visible on screen
  const currentD = useRef(d);

  // Animation progress: 0 → 1
  const progress = useMotionValue(0);

  // Create a new Polymorph interpolator whenever
  // the target path changes.
  const interp = useMemo(() => {
    try {
      const polymorphInterp = polymorph.interpolate([currentD.current, d]);

      // Test that it actually produces a valid path
      const test = polymorphInterp(0.5);

      if (test.includes("NaN")) {
        throw new Error("Invalid Polymorph interpolation");
      }

      return polymorphInterp;
    } catch {
      return flubberInterpolate(currentD.current, d);
    }
  }, [d]);

  // Convert animation progress into an SVG path
  const animatedD = useTransform(progress, (t) => {
    const path = interp(t);

    if (path.includes("NaN")) {
      return currentD.current;
    }

    // Remember the actual path currently being displayed.
    // This means a new transition can start from the
    // current position if the user changes projection
    // before the previous animation finishes.
    currentD.current = path;

    return path;
  });

  // Start animation whenever the target path changes
  useEffect(() => {
    progress.set(0);

    const controls = animate(progress, 1, {
      duration: 1,
      ease: "easeInOut",
    });

    return () => controls.stop();
  }, [d, progress]);

  return <motion.path d={animatedD} {...props} />;
}
