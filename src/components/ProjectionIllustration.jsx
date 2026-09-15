import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";
import { interpolate as flubberInterpolate } from "flubber";

const BASE_URL = import.meta.env.BASE_URL;

const VIEWBOX = "0 0 335 335";

const ASSETS = {
  cylinder: {
    grid: `${BASE_URL}assets/illustration/cylinder.svg`,
    complete: `${BASE_URL}assets/illustration/cylinder-circle.svg`,
  },
  cone: {
    grid: `${BASE_URL}assets/illustration/cone.svg`,
    complete: `${BASE_URL}assets/illustration/cone-circle.svg`,
  },
  disk: {
    grid: `${BASE_URL}assets/illustration/disk.svg`,
    complete: `${BASE_URL}assets/illustration/disk-circle.svg`,
  },
};

const ORDER = ["cylinder", "cone", "disk"];

const LINE_NAMES = Array.from({ length: 11 }, (_, index) => `line-${index}`);
const CIRCLE_NAMES = Array.from({ length: 5 }, (_, index) => `circle-${index}`);

// Slightly slower morph + a small pause between states.
const MORPH_DURATION = 0.9;
const HOLD_DURATION = 1.5;

const STROKE = "#857170";
const STROKE_WIDTH = 1;

const CIRCLE_FILL = "#857170";
const CIRCLE_OPACITY = 0.5;

// ------------------------------------------------------------
// SVG helpers
// ------------------------------------------------------------

function parseNumber(value) {
  return Number.parseFloat(value) || 0;
}

function circleToPath({ cx, cy, r }) {
  return [
    `M ${cx - r} ${cy}`,
    `a ${r} ${r} 0 1 0 ${r * 2} 0`,
    `a ${r} ${r} 0 1 0 ${-r * 2} 0`,
    "Z",
  ].join(" ");
}

function getClassElement(document, className) {
  return document.querySelector(`.${className}`);
}

function parseNamedPathElement(document, className) {
  const element = getClassElement(document, className);

  if (!element) {
    throw new Error(`Missing ${className} in projection illustration`);
  }

  const tagName = element.tagName.toLowerCase();

  if (tagName === "path") {
    const d = element.getAttribute("d");

    if (!d) {
      throw new Error(`Missing path data for ${className}`);
    }

    return d;
  }

  // Some exported Illustrator/Figma layers are wrapped in a <g> while
  // the actual geometry lives in a child <path>. This is the case for
  // cone's circle-4 layer. Use the child path as the geometry source.
  if (tagName === "g") {
    const path = element.querySelector("path");
    const d = path?.getAttribute("d");

    if (!d) {
      throw new Error(`Missing path data inside ${className}`);
    }

    return d;
  }

  // disk's circle-4 is exported as a <circle>; convert it to an
  // equivalent path so it can use the same flubber interpolation as
  // the other curved slots.
  if (tagName === "circle") {
    return circleToPath({
      cx: parseNumber(element.getAttribute("cx")),
      cy: parseNumber(element.getAttribute("cy")),
      r: parseNumber(element.getAttribute("r")),
    });
  }

  throw new Error(`Unsupported SVG element for ${className}`);
}

function parseGrid(svgText) {
  const parser = new DOMParser();
  const document = parser.parseFromString(svgText, "image/svg+xml");

  return {
    lines: LINE_NAMES.map((className) =>
      parseNamedPathElement(document, className),
    ),
    circles: CIRCLE_NAMES.map((className) =>
      parseNamedPathElement(document, className),
    ),
  };
}

function parseEllipse(svgText) {
  const parser = new DOMParser();
  const document = parser.parseFromString(svgText, "image/svg+xml");
  const ellipse = getClassElement(document, "ellipse");

  if (!ellipse) {
    throw new Error("Missing .ellipse in complete projection illustration");
  }

  return {
    cx: parseNumber(ellipse.getAttribute("cx")),
    cy: parseNumber(ellipse.getAttribute("cy")),
    r: parseNumber(ellipse.getAttribute("r")),
  };
}

// ------------------------------------------------------------
// Interpolation
// ------------------------------------------------------------

function createPathInterpolator(from, to) {
  try {
    return flubberInterpolate(from, to, {
      maxSegmentLength: 4,
    });
  } catch {
    return () => to;
  }
}

function interpolateNumber(from, to, t) {
  return from + (to - from) * t;
}

function interpolateEllipse(from, to, t) {
  return {
    cx: interpolateNumber(from.cx, to.cx, t),
    cy: interpolateNumber(from.cy, to.cy, t),
    r: interpolateNumber(from.r, to.r, t),
  };
}

function ease(t) {
  return t * t * (3 - 2 * t);
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export default function ProjectionIllustration({
  width = 335,
  height = 335,
  className = "",
}) {
  const [assets, setAssets] = useState(null);

  const progress = useMotionValue(0);
  const currentStageRef = useRef("cylinder");
  const renderProgress = useRef(0);
  const [, forceRender] = useState(0);

  // ----------------------------------------------------------
  // Load all SVG assets once.
  // ----------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function loadAssets() {
      try {
        const loaded = {};

        await Promise.all(
          ORDER.map(async (name) => {
            const { grid, complete } = ASSETS[name];

            const [gridResponse, completeResponse] = await Promise.all([
              fetch(grid),
              fetch(complete),
            ]);

            if (!gridResponse.ok || !completeResponse.ok) {
              throw new Error(`Failed to load ${name} illustration assets`);
            }

            const [gridText, completeText] = await Promise.all([
              gridResponse.text(),
              completeResponse.text(),
            ]);

            loaded[name] = {
              grid: parseGrid(gridText),
              ellipse: parseEllipse(completeText),
            };
          }),
        );

        if (!cancelled) {
          setAssets(loaded);
        }
      } catch (error) {
        console.error("Failed to load projection illustration:", error);
      }
    }

    loadAssets();

    return () => {
      cancelled = true;
    };
  }, []);

  // ----------------------------------------------------------
  // Precompute all transitions.
  // The class names are now the explicit mapping between states:
  //   line-0    -> line-0
  //   ...
  //   circle-0  -> circle-0
  //   ...
  //   circle-4  -> circle-4
  // ----------------------------------------------------------

  const transitions = useMemo(() => {
    if (!assets) {
      return null;
    }

    const result = {};

    for (let index = 0; index < ORDER.length; index += 1) {
      const fromName = ORDER[index];
      const toName = ORDER[(index + 1) % ORDER.length];

      const from = assets[fromName];
      const to = assets[toName];

      result[fromName] = {
        toName,
        lineInterpolators: from.grid.lines.map((d, lineIndex) =>
          createPathInterpolator(d, to.grid.lines[lineIndex]),
        ),
        circleInterpolators: from.grid.circles.map((d, circleIndex) =>
          createPathInterpolator(d, to.grid.circles[circleIndex]),
        ),
        ellipse: {
          from: from.ellipse,
          to: to.ellipse,
        },
      };
    }

    return result;
  }, [assets]);

  // ----------------------------------------------------------
  // Re-render while MotionValue progress changes.
  // ----------------------------------------------------------

  useMotionValueEvent(progress, "change", (value) => {
    renderProgress.current = value;
    forceRender((count) => count + 1);
  });

  // ----------------------------------------------------------
  // Continuous loop:
  // cylinder -> cone -> disk -> cylinder -> ...
  // ----------------------------------------------------------

  useEffect(() => {
    if (!transitions) {
      return undefined;
    }

    let cancelled = false;
    let controls = null;

    const sleep = (duration) =>
      new Promise((resolve) => {
        setTimeout(resolve, duration * 1000);
      });

    async function loop() {
      while (!cancelled) {
        const fromName = currentStageRef.current;
        const transition = transitions[fromName];

        if (!transition) {
          return;
        }

        // Pause briefly on each finished state before the next morph.
        await sleep(HOLD_DURATION);

        if (cancelled) {
          return;
        }

        progress.set(0);

        controls = animate(progress, 1, {
          duration: MORPH_DURATION,
          ease: [0.4, 0, 0.2, 1],
        });

        await controls.finished;

        if (cancelled) {
          return;
        }

        currentStageRef.current = transition.toName;
        progress.set(0);
      }
    }

    loop();

    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [transitions, progress]);

  if (!assets || !transitions) {
    return null;
  }

  const fromName = currentStageRef.current;
  const transition = transitions[fromName];

  if (!transition) {
    return null;
  }

  const t = ease(renderProgress.current);

  const lines = transition.lineInterpolators.map((interpolator) =>
    interpolator(t),
  );

  const circles = transition.circleInterpolators.map((interpolator) =>
    interpolator(t),
  );

  // Unlike the projection grid, the large translucent circle is allowed
  // to move to the new position for each projection state.
  const ellipse = interpolateEllipse(
    transition.ellipse.from,
    transition.ellipse.to,
    t,
  );

  return (
    <svg
      viewBox={VIEWBOX}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-labelledby="projection-illustration-title"
    >
      <title id="projection-illustration-title">
        Illustration showing a projection surface transforming from a cylinder
        to a cone to a disk
      </title>
      {/* Translucent projection surface */}
      <circle
        className="ellipse"
        cx={ellipse.cx}
        cy={ellipse.cy}
        r={ellipse.r}
        fill={CIRCLE_FILL}
        fillOpacity={CIRCLE_OPACITY}
        stroke={STROKE}
        strokeWidth={0}
      />

      {/* Morphing projection grid */}
      <g fill="none" stroke={STROKE} strokeWidth={STROKE_WIDTH}>
        {lines.map((d, index) => (
          <path key={`line-${index}`} d={d} vectorEffect="non-scaling-stroke" />
        ))}

        {circles.map((d, index) => (
          <path
            key={`circle-${index}`}
            d={d}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  );
}
