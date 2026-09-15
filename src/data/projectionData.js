import { PROJECTIONS } from "./projections";
import { createProjectionPaths } from "../utils/geoPath";
import { createGraticulePaths } from "../utils/graticulePath";

// ------------------------------------------------------------
// In-memory caches.
//
// These survive route changes because this module remains loaded
// while the React application is running.
// ------------------------------------------------------------

const projectionCache = new Map();
const projectionPromises = new Map();

// ------------------------------------------------------------
// Load a single projection.
//
// The three network requests happen in parallel.
// The processed result is then cached.
// ------------------------------------------------------------

export async function loadProjection(key) {
  if (projectionCache.has(key)) {
    return projectionCache.get(key);
  }

  if (projectionPromises.has(key)) {
    return projectionPromises.get(key);
  }

  const projection = PROJECTIONS[key];

  if (!projection) {
    throw new Error(`Unknown projection: ${key}`);
  }

  const promise = (async () => {
    // Fetch all three files at the same time.
    const [worldResponse, outlineResponse, graticuleResponse] =
      await Promise.all([
        fetch(projection.world),
        fetch(projection.outline),
        fetch(projection.graticule),
      ]);

    if (!worldResponse.ok) {
      throw new Error(`Failed to load world data for ${key}`);
    }

    if (!outlineResponse.ok) {
      throw new Error(`Failed to load outline data for ${key}`);
    }

    if (!graticuleResponse.ok) {
      throw new Error(`Failed to load graticule data for ${key}`);
    }

    // Parse all three responses in parallel.
    const [world, outline, graticule] = await Promise.all([
      worldResponse.json(),
      outlineResponse.json(),
      graticuleResponse.json(),
    ]);

    // Process the projected geometry.
    const worldPaths = createProjectionPaths(world, outline, 800, 400);

    const graticulePaths = createGraticulePaths(graticule, outline, 240, 120);

    const graticuleLines = Object.fromEntries(
      graticulePaths.lines.map((line) => [line.id, line]),
    );

    const result = {
      ...worldPaths,
      graticuleLines,
      graticuleOutlinePath: graticulePaths.outlinePath,
    };

    projectionCache.set(key, result);
    projectionPromises.delete(key);

    return result;
  })();

  projectionPromises.set(key, promise);

  try {
    return await promise;
  } catch (error) {
    projectionPromises.delete(key);
    throw error;
  }
}

// ------------------------------------------------------------
// Return everything already in the cache.
// ------------------------------------------------------------

export function getCachedProjections() {
  return Object.fromEntries(projectionCache);
}

// ------------------------------------------------------------
// Return one cached projection, or undefined.
// ------------------------------------------------------------

export function getCachedProjection(key) {
  return projectionCache.get(key);
}

// ------------------------------------------------------------
// Preload projections one at a time during idle periods.
//
// This deliberately does NOT load all remaining projections
// simultaneously. The goal is to avoid making the browser
// parse/process six large datasets while the user is interacting
// with the page.
// ------------------------------------------------------------

export function preloadProjections(keys, onLoaded) {
  let cancelled = false;
  let index = 0;
  let idleHandle = null;

  const runNext = async () => {
    if (cancelled || index >= keys.length) {
      return;
    }

    const key = keys[index];
    index += 1;

    try {
      await loadProjection(key);

      if (!cancelled) {
        onLoaded?.(key);
      }
    } catch (error) {
      console.error(`Failed to preload projection: ${key}`, error);
    }

    if (!cancelled) {
      scheduleNext();
    }
  };

  const scheduleNext = () => {
    if (cancelled || index >= keys.length) {
      return;
    }

    if ("requestIdleCallback" in window) {
      idleHandle = window.requestIdleCallback(
        () => {
          runNext();
        },
        { timeout: 2000 },
      );
    } else {
      idleHandle = window.setTimeout(runNext, 100);
    }
  };

  scheduleNext();

  return () => {
    cancelled = true;

    if ("cancelIdleCallback" in window && idleHandle !== null) {
      window.cancelIdleCallback(idleHandle);
    } else if (idleHandle !== null) {
      window.clearTimeout(idleHandle);
    }
  };
}
