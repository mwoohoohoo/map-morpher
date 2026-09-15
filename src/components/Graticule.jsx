import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useMotionValueEvent } from "motion/react";
import polymorph from "polymorph-js";
import { interpolate as flubberInterpolate } from "flubber";

const DEFAULT_STROKE = "#857170";

const STROKE_WIDTH = 1;

// Internal safety margin so strokes that touch the logical
// projection boundary are never clipped by the Canvas edge.
const PADDING_X = 2;
const PADDING_Y = 1;

function createInterpolator(from, to) {
  if (!from || !to) return null;

  // Try Polymorph first.
  try {
    const interpolator = polymorph.interpolate([from, to]);

    // Validate the interpolator once before using it.
    const test = interpolator(0.5);

    if (test.includes("NaN")) {
      throw new Error("Invalid Polymorph interpolation");
    }

    return interpolator;
  } catch {
    // Fall back to Flubber.
    try {
      return flubberInterpolate(from, to);
    } catch {
      return null;
    }
  }
}

function ease(t) {
  // Smoothstep.
  return t * t * (3 - 2 * t);
}

export default function Graticule({
  graticuleLines,
  graticuleLineIds,
  outlinePath,
  width = 240,
  height = 120,
  stroke = DEFAULT_STROKE,
  progress,
}) {
  const canvasRef = useRef(null);

  // ------------------------------------------------------------
  // Current geometry
  // ------------------------------------------------------------

  const currentLines = useRef(new Map());
  const currentOutline = useRef(null);

  // Interpolators for the current projection transition.
  const interpolators = useRef(new Map());
  const outlineInterpolator = useRef(null);

  // Whether initial geometry has been established.
  const initialised = useRef(false);

  // Keep the latest draw function available to effects/listeners.
  const drawRef = useRef(null);

  // ------------------------------------------------------------
  // Draw
  // ------------------------------------------------------------

  const draw = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;

    if (!cssWidth || !cssHeight) return;

    const dpr = window.devicePixelRatio || 1;

    // ----------------------------------------------------------
    // Clear using physical canvas coordinates.
    //
    // This is important: clearRect must not inherit the drawing
    // transform or stale pixels can remain after resizing.
    // ----------------------------------------------------------

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ----------------------------------------------------------
    // Calculate the responsive drawing area.
    // ----------------------------------------------------------

    const drawWidth = Math.max(1, cssWidth - PADDING_X * 2);

    const drawHeight = Math.max(1, cssHeight - PADDING_Y * 2);

    const scaleX = drawWidth / width;
    const scaleY = drawHeight / height;

    // ----------------------------------------------------------
    // Retina + responsive transform.
    //
    // DPR handles physical pixel density.
    // scaleX/Y maps our logical projection coordinates into the
    // actual responsive Canvas size.
    // ----------------------------------------------------------

    ctx.setTransform(
      dpr * scaleX,
      0,
      0,
      dpr * scaleY,
      dpr * PADDING_X,
      dpr * PADDING_Y,
    );

    // ----------------------------------------------------------
    // Keep strokes visually close to 1 CSS pixel.
    //
    // Your Canvas maintains the same aspect ratio as the logical
    // geometry, so scaleX and scaleY are effectively equal.
    // ----------------------------------------------------------

    ctx.strokeStyle = stroke;

    ctx.lineWidth = STROKE_WIDTH / ((scaleX + scaleY) / 2);

    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // ----------------------------------------------------------
    // Draw graticule lines.
    // ----------------------------------------------------------

    for (const line of currentLines.current.values()) {
      if (!line.d || line.opacity <= 0) {
        continue;
      }

      try {
        const path = new Path2D(line.d);

        ctx.globalAlpha = line.opacity;
        ctx.stroke(path);
      } catch {
        // Ignore invalid intermediate path data.
      }
    }

    // ----------------------------------------------------------
    // Draw projection outline.
    // ----------------------------------------------------------

    if (currentOutline.current) {
      try {
        const path = new Path2D(currentOutline.current);

        ctx.globalAlpha = 1;
        ctx.stroke(path);
      } catch {
        // Ignore invalid intermediate path data.
      }
    }

    // ----------------------------------------------------------
    // Restore a predictable Canvas state.
    // ----------------------------------------------------------

    ctx.globalAlpha = 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [width, height, stroke]);

  drawRef.current = draw;

  // ------------------------------------------------------------
  // Canvas resizing
  // ------------------------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const resize = () => {
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;

      if (!cssWidth || !cssHeight) return;

      const dpr = window.devicePixelRatio || 1;

      const pixelWidth = Math.max(1, Math.round(cssWidth * dpr));

      const pixelHeight = Math.max(1, Math.round(cssHeight * dpr));

      // Only resize the backing bitmap when its dimensions
      // actually change.
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      // Redraw immediately after the resize.
      drawRef.current?.();
    };

    resize();

    const observer = new ResizeObserver(resize);

    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  }, []);

  // ------------------------------------------------------------
  // Prepare geometry/interpolators whenever the projection
  // changes.
  // ------------------------------------------------------------

  useLayoutEffect(() => {
    // ----------------------------------------------------------
    // Initial render
    // ----------------------------------------------------------

    if (!initialised.current) {
      currentLines.current.clear();

      for (const id of graticuleLineIds) {
        const d = graticuleLines[id]?.d ?? null;

        currentLines.current.set(id, {
          d,
          opacity: d ? 1 : 0,
        });
      }

      currentOutline.current = outlinePath;

      interpolators.current.clear();
      outlineInterpolator.current = null;

      initialised.current = true;

      drawRef.current?.();

      return;
    }

    // ----------------------------------------------------------
    // Create line interpolators from the geometry that is
    // currently visible to the new target geometry.
    // ----------------------------------------------------------

    const nextInterpolators = new Map();

    for (const id of graticuleLineIds) {
      const current = currentLines.current.get(id);

      const target = graticuleLines[id]?.d ?? null;

      if (current?.d && target && current.d !== target) {
        const interpolator = createInterpolator(current.d, target);

        if (interpolator) {
          nextInterpolators.set(id, interpolator);
        }
      }
    }

    interpolators.current = nextInterpolators;

    // ----------------------------------------------------------
    // Outline interpolator
    // ----------------------------------------------------------

    outlineInterpolator.current = createInterpolator(
      currentOutline.current,
      outlinePath,
    );
  }, [graticuleLines, graticuleLineIds, outlinePath]);

  // ------------------------------------------------------------
  // ONE animation listener.
  //
  // This is important for performance: geometry is updated and
  // the Canvas is drawn in a single pass for each Motion frame.
  // ------------------------------------------------------------

  useMotionValueEvent(progress, "change", (value) => {
    const t = ease(value);

    // --------------------------------------------------------
    // Graticule lines
    // --------------------------------------------------------

    for (const id of graticuleLineIds) {
      const current = currentLines.current.get(id);

      if (!current) continue;

      const target = graticuleLines[id]?.d ?? null;

      // Existing → existing
      if (current.d && target) {
        const interpolator = interpolators.current.get(id);

        if (interpolator) {
          try {
            current.d = interpolator(t);
          } catch {
            current.d = target;
          }
        } else {
          current.d = target;
        }

        current.opacity = 1;

        continue;
      }

      // Missing → existing
      if (!current.d && target) {
        current.d = target;
        current.opacity = t;

        continue;
      }

      // Existing → missing
      if (current.d && !target) {
        current.opacity = 1 - t;

        continue;
      }

      // Missing → missing
      current.opacity = 0;
    }

    // --------------------------------------------------------
    // Projection outline
    // --------------------------------------------------------

    if (outlineInterpolator.current) {
      try {
        currentOutline.current = outlineInterpolator.current(t);
      } catch {
        currentOutline.current = outlinePath;
      }
    } else {
      currentOutline.current = outlinePath;
    }

    // --------------------------------------------------------
    // ONE Canvas draw
    // --------------------------------------------------------

    drawRef.current?.();

    // --------------------------------------------------------
    // At the end of the transition, commit the exact target
    // geometry. This prevents accumulated interpolation error.
    // --------------------------------------------------------

    if (value >= 1) {
      for (const id of graticuleLineIds) {
        const target = graticuleLines[id]?.d ?? null;

        currentLines.current.set(id, {
          d: target,
          opacity: target ? 1 : 0,
        });
      }

      currentOutline.current = outlinePath;
    }
  });

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-auto"
      style={{
        aspectRatio: `${width} / ${height}`,
      }}
      aria-hidden="true"
    />
  );
}
