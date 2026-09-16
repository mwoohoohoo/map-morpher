import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useMotionValueEvent } from "motion/react";
import polymorph from "polymorph-js";
import { interpolate as flubberInterpolate } from "flubber";

const STROKE = "#857170";
const FILL = "#857170";

const STROKE_WIDTH = 1;

// Small internal safe area so projection boundaries that touch
// the logical edge cannot be clipped by the Canvas stroke.
const PADDING_X = 2;
const PADDING_Y = 1;

function createInterpolator(from, to) {
  if (!from || !to) return null;

  // Try Polymorph first.
  try {
    const interpolator = polymorph.interpolate([from, to]);

    // Validate the interpolator before using it.
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

export default function WorldMap({
  countryPaths,
  outlinePath,
  width = 800,
  height = 400,
  progress,
  projectionName,
}) {
  const canvasRef = useRef(null);

  // ------------------------------------------------------------
  // Current geometry
  // ------------------------------------------------------------

  const currentCountries = useRef(new Map());

  const currentOutline = useRef(null);

  // ------------------------------------------------------------
  // Interpolators for the current transition
  // ------------------------------------------------------------

  const interpolators = useRef(new Map());

  const outlineInterpolator = useRef(null);

  // ------------------------------------------------------------
  // Lifecycle / drawing refs
  // ------------------------------------------------------------

  const initialised = useRef(false);

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

    if (!cssWidth || !cssHeight) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;

    // ----------------------------------------------------------
    // Clear the physical bitmap.
    //
    // Resetting the transform first is important. Otherwise
    // clearRect() is affected by the drawing transform and can
    // leave stale pixels at the edges after resizing.
    // ----------------------------------------------------------

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ----------------------------------------------------------
    // Responsive logical drawing area.
    // ----------------------------------------------------------

    const drawWidth = Math.max(1, cssWidth - PADDING_X * 2);

    const drawHeight = Math.max(1, cssHeight - PADDING_Y * 2);

    const scaleX = drawWidth / width;

    const scaleY = drawHeight / height;

    // ----------------------------------------------------------
    // Retina + logical-coordinate transform.
    //
    // DPR controls the physical backing resolution.
    // scaleX/Y maps the projection's logical coordinate system
    // into the responsive CSS-sized Canvas.
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
    // Countries
    // ----------------------------------------------------------

    ctx.fillStyle = FILL;
    ctx.globalAlpha = 1;

    for (const d of currentCountries.current.values()) {
      if (!d) continue;

      try {
        const path = new Path2D(d);

        ctx.fill(path);
      } catch {
        // Ignore malformed intermediate path data.
      }
    }

    // ----------------------------------------------------------
    // Projection outline
    // ----------------------------------------------------------

    if (currentOutline.current) {
      try {
        const path = new Path2D(currentOutline.current);

        ctx.strokeStyle = STROKE;

        // Keep the visible stroke approximately 1 CSS pixel
        // regardless of responsive scaling.
        ctx.lineWidth = STROKE_WIDTH / ((scaleX + scaleY) / 2);

        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        ctx.stroke(path);
      } catch {
        // Ignore malformed intermediate path data.
      }
    }

    // ----------------------------------------------------------
    // Restore a predictable Canvas state.
    // ----------------------------------------------------------

    ctx.globalAlpha = 1;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [width, height]);

  drawRef.current = draw;

  // ------------------------------------------------------------
  // ONE MotionValue listener.
  //
  // Geometry interpolation and drawing happen together in one
  // pass for each animation frame.
  // ------------------------------------------------------------

  useMotionValueEvent(progress, "change", (value) => {
    const t = ease(value);

    // --------------------------------------------------------
    // Countries
    // --------------------------------------------------------

    for (const country of countryPaths) {
      const id = country.id;
      const targetD = country.d;

      const interpolator = interpolators.current.get(id);

      if (interpolator) {
        try {
          currentCountries.current.set(id, interpolator(t));
        } catch {
          currentCountries.current.set(id, targetD);
        }
      } else {
        currentCountries.current.set(id, targetD);
      }
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
    // One complete Canvas draw
    // --------------------------------------------------------

    drawRef.current?.();

    // --------------------------------------------------------
    // Commit exact target geometry at the end.
    //
    // This prevents tiny interpolation differences from
    // accumulating between successive transitions.
    // --------------------------------------------------------

    if (value >= 1) {
      for (const country of countryPaths) {
        currentCountries.current.set(country.id, country.d);
      }

      currentOutline.current = outlinePath;
    }
  });

  // ------------------------------------------------------------
  // Canvas resizing
  // ------------------------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const resize = () => {
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;

      if (!cssWidth || !cssHeight) {
        return;
      }

      const dpr = window.devicePixelRatio || 1;

      const pixelWidth = Math.max(1, Math.round(cssWidth * dpr));

      const pixelHeight = Math.max(1, Math.round(cssHeight * dpr));

      // Resize the physical bitmap only when required.
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      // Redraw immediately after resizing.
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
  // Prepare interpolation whenever the projection target changes
  // ------------------------------------------------------------

  useLayoutEffect(() => {
    const targetMap = new Map(
      countryPaths.map((country) => [country.id, country.d]),
    );

    // ----------------------------------------------------------
    // Initial render
    // ----------------------------------------------------------

    if (!initialised.current) {
      for (const [id, d] of targetMap) {
        currentCountries.current.set(id, d);
      }

      currentOutline.current = outlinePath;

      interpolators.current.clear();

      outlineInterpolator.current = null;

      initialised.current = true;

      drawRef.current?.();

      return;
    }

    // ----------------------------------------------------------
    // Country interpolators
    // ----------------------------------------------------------

    const nextInterpolators = new Map();

    for (const [id, targetD] of targetMap) {
      const currentD = currentCountries.current.get(id);

      if (currentD && targetD && currentD !== targetD) {
        const interpolator = createInterpolator(currentD, targetD);

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
  }, [countryPaths, outlinePath]);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-auto"
      style={{
        aspectRatio: `${width} / ${height}`,
      }}
      role="img"
      aria-label={`World map using the ${projectionName} projection`}
    />
  );
}
