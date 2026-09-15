import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import polymorph from "polymorph-js";
import { interpolate as flubberInterpolate } from "flubber";

export default function AnimatedGraticuleLine({ d, ...props }) {
  // The path currently represented by this SVG element.
  // null means the line is currently absent.
  const currentD = useRef(d ?? null);

  // Animation progress: 0 → 1
  const progress = useMotionValue(1);

  const targetD = d ?? null;

  // ----------------------------------------------------------
  // Create an interpolator between the current and target
  // geometries.
  //
  // Polymorph is tried first, matching AnimatedPath.
  // Flubber is used as a fallback if Polymorph fails.
  // ----------------------------------------------------------

  const interp = useMemo(() => {
    if (!currentD.current || !targetD) {
      return null;
    }

    try {
      const polymorphInterp = polymorph.interpolate([
        currentD.current,
        targetD,
      ]);

      // Test the interpolator before using it.
      const test = polymorphInterp(0.5);

      if (test.includes("NaN")) {
        throw new Error("Invalid Polymorph interpolation");
      }

      return polymorphInterp;
    } catch {
      return flubberInterpolate(currentD.current, targetD);
    }
  }, [targetD]);

  // ----------------------------------------------------------
  // Convert animation progress into SVG path data.
  // ----------------------------------------------------------

  const animatedD = useTransform(progress, (t) => {
    // Target line does not exist.
    //
    // Keep the current geometry in place while opacity
    // handles the disappearance.
    if (!targetD) {
      return currentD.current ?? "";
    }

    // No previous geometry.
    //
    // The line is appearing for the first time, so there is
    // nothing to morph from.
    if (!currentD.current) {
      currentD.current = targetD;
      return targetD;
    }

    // Interpolate between the current and target paths.
    if (interp) {
      const path = interp(t);

      // Protect against invalid output.
      if (path.includes("NaN")) {
        return currentD.current;
      }

      currentD.current = path;
      return path;
    }

    // Last-resort fallback.
    currentD.current = targetD;
    return targetD;
  });

  // ----------------------------------------------------------
  // Track whether the line existed before this transition.
  // ----------------------------------------------------------

  const isInitiallyPresent = useRef(Boolean(d));

  const animatedOpacity = useTransform(progress, (t) => {
    // Existing → existing
    if (isInitiallyPresent.current && targetD) {
      return 1;
    }

    // Missing → existing
    if (!isInitiallyPresent.current && targetD) {
      return t;
    }

    // Existing → missing
    if (isInitiallyPresent.current && !targetD) {
      return 1 - t;
    }

    return 0;
  });

  // ----------------------------------------------------------
  // Start animation whenever the target path changes.
  // ----------------------------------------------------------

  useEffect(() => {
    const wasPresent = Boolean(currentD.current);
    const willBePresent = Boolean(targetD);

    isInitiallyPresent.current = wasPresent;

    progress.set(0);

    const controls = animate(progress, 1, {
      duration: 1,
      ease: "easeInOut",

      onComplete: () => {
        // Once a line has completely disappeared, discard
        // its old geometry so that a future appearance does
        // not morph from a stale projection.
        if (!willBePresent) {
          currentD.current = null;
        }
      },
    });

    return () => controls.stop();
  }, [targetD, progress]);

  return <motion.path d={animatedD} opacity={animatedOpacity} {...props} />;
}
