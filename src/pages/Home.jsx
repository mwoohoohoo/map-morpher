import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";

import WorldMap from "../components/WorldMap";
import ProjectionSelect from "../ui/ProjectionSelect";
import { PROJECTIONS } from "../data/projections";
import {
  getCachedProjection,
  getCachedProjections,
  loadProjection,
  preloadProjections,
} from "../data/projectionData";

import Navbar from "../components/Navbar";
import MapDescription from "../components/MapDescription";
import Footer from "../components/Footer";
import Graticule from "../components/Graticule";
import Loading from "./Loading";

const WIDTH = 800;
const HEIGHT = 400;

const GRATICULE_WIDTH = 240;
const GRATICULE_HEIGHT = 120;

const INITIAL_PROJECTION = "authagraph";

export default function Home() {
  // ------------------------------------------------------------
  // Projection selection
  // ------------------------------------------------------------

  const [selectedProjection, setProjection] = useState(INITIAL_PROJECTION);

  // ------------------------------------------------------------
  // Use whatever has already been loaded synchronously
  // from the module cache.
  //
  // This is what prevents the Loading screen appearing again
  // when navigating away from Home and returning to it.
  // ------------------------------------------------------------

  const [projectionPaths, setProjectionPaths] = useState(() => {
    const cached = getCachedProjections();

    return Object.keys(cached).length ? cached : null;
  });

  // ------------------------------------------------------------
  // Mobile Map / Graticule slider
  // ------------------------------------------------------------

  const [selectedView, setSelectedView] = useState(0);

  // ------------------------------------------------------------
  // ONE shared animation clock.
  //
  // Both WorldMap and Graticule receive this same MotionValue.
  // ------------------------------------------------------------

  const projectionProgress = useMotionValue(1);

  // Remember which projection was previously displayed.
  const previousProjection = useRef(INITIAL_PROJECTION);

  // ------------------------------------------------------------
  // Load initial projection and begin background preloading.
  // ------------------------------------------------------------

  useEffect(() => {
    let cancelled = false;
    let cancelPreload = () => {};

    async function initialise() {
      try {
        // ------------------------------------------------------
        // Load the currently selected projection first.
        //
        // If it is already cached, this resolves immediately.
        // ------------------------------------------------------

        if (!getCachedProjection(INITIAL_PROJECTION)) {
          await loadProjection(INITIAL_PROJECTION);
        }

        if (cancelled) return;

        // Give Home everything currently available.
        setProjectionPaths(getCachedProjections());

        // ------------------------------------------------------
        // Preload all remaining projections in the background.
        // ------------------------------------------------------

        const remaining = Object.keys(PROJECTIONS).filter(
          (key) => !getCachedProjection(key),
        );

        cancelPreload = preloadProjections(remaining, () => {
          if (cancelled) return;

          setProjectionPaths(getCachedProjections());
        });
      } catch (error) {
        console.error("Failed to initialise projections:", error);
      }
    }

    initialise();

    return () => {
      cancelled = true;
      cancelPreload();
    };
  }, []);

  // ------------------------------------------------------------
  // Build the union of every graticule ID currently cached.
  // ------------------------------------------------------------

  const graticuleLineIds = useMemo(() => {
    if (!projectionPaths) {
      return [];
    }

    return [
      ...new Set(
        Object.values(projectionPaths).flatMap((projection) =>
          Object.keys(projection.graticuleLines),
        ),
      ),
    ];
  }, [projectionPaths]);

  // ------------------------------------------------------------
  // Animate the shared projection progress.
  //
  // This runs after the child Canvas components have prepared
  // their interpolators.
  // ------------------------------------------------------------

  useEffect(() => {
    if (selectedProjection === previousProjection.current) {
      return;
    }

    previousProjection.current = selectedProjection;

    projectionProgress.set(0);

    const controls = animate(projectionProgress, 1, {
      duration: 0.7,
      ease: "easeInOut",
    });

    return () => {
      controls.stop();
    };
  }, [selectedProjection, projectionProgress]);

  // ------------------------------------------------------------
  // Projection change handler.
  //
  // Cached projection → switches immediately.
  //
  // Not cached yet → load it, then switch.
  // ------------------------------------------------------------

  const handleProjectionChange = async (key) => {
    if (key === selectedProjection) {
      return;
    }

    try {
      if (!getCachedProjection(key)) {
        await loadProjection(key);
      }

      setProjectionPaths(getCachedProjections());

      setProjection(key);
    } catch (error) {
      console.error(`Failed to load projection: ${key}`, error);
    }
  };

  // ------------------------------------------------------------
  // Loading
  // ------------------------------------------------------------

  if (!projectionPaths) {
    return <Loading />;
  }

  const currentProjection = projectionPaths[selectedProjection];

  const projectionContent = PROJECTIONS[selectedProjection];

  // ------------------------------------------------------------
  // Mobile swipe handling
  // ------------------------------------------------------------

  const handleSwipe = (_, info) => {
    const threshold = 50;

    if (info.offset.x < -threshold) {
      setSelectedView(1);
    } else if (info.offset.x > threshold) {
      setSelectedView(0);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 flex flex-col min-h-0 pt-10 md:pt-14">
        <div className="relative left-1/2 -translate-x-1/2 flex flex-col flex-1 min-h-0 w-screen px-layout-s md:px-layout-m lg:px-layout-l">
          <div className="w-full max-w-[1400px] flex-1 border border-l-outlines border-r-outlines border-y-0 mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] lg:grid-rows-[minmax(min-content,clamp(140px,12vw,220px))_minmax(0,1fr)] gap-px bg-outlines">
            {/* ------------------------------------------------
                Top-left
            ------------------------------------------------ */}

            <div className="flex flex-col items-start justify-center px-4 lg:px-6 py-4 lg:py-6 gap-3 lg:gap-6 bg-bg">
              <h1>Imperfect projections</h1>

              <p className="body-large">
                Map projections are 2D representations of the 3D reality we live
                in. The change in dimensions means that no map will ever be
                perfect. Use this tool to get a taste for the variety of maps
                out there and the different ways they try to solve the
                impossible mapping problem.
              </p>
            </div>

            {/* ------------------------------------------------
                Top-right — desktop graticule
            ------------------------------------------------ */}

            <div className="hidden min-w-0 lg:flex bg-bg px-4 lg:px-6 py-4 lg:py-6 items-center">
              <Graticule
                graticuleLines={currentProjection.graticuleLines}
                graticuleLineIds={graticuleLineIds}
                outlinePath={currentProjection.graticuleOutlinePath}
                width={GRATICULE_WIDTH}
                height={GRATICULE_HEIGHT}
                progress={projectionProgress}
                projectionName={projectionContent.name}
              />
            </div>

            {/* ------------------------------------------------
                Bottom-left — map / graticule
            ------------------------------------------------ */}

            <div className="min-w-0 bg-bg">
              <div className="flex flex-col px-4 lg:px-6 py-4 lg:py-6 gap-4 lg:gap-3">
                <ProjectionSelect
                  selectedProjection={selectedProjection}
                  setProjection={handleProjectionChange}
                />

                {/* ------------------------------------------------
                    Desktop map
                ------------------------------------------------ */}

                <div className="hidden lg:block">
                  <WorldMap
                    countryPaths={currentProjection.countryPaths}
                    outlinePath={currentProjection.outlinePath}
                    width={WIDTH}
                    height={HEIGHT}
                    progress={projectionProgress}
                    projectionName={projectionContent.name}
                  />
                </div>

                {/* ------------------------------------------------
                    Mobile / tablet slider
                ------------------------------------------------ */}

                <div className="lg:hidden">
                  {/* Slider viewport */}

                  <div className="overflow-hidden w-full">
                    <motion.div
                      className="flex w-[200%]"
                      animate={{
                        x: selectedView === 0 ? "0%" : "-50%",
                      }}
                      transition={{
                        duration: 0.35,
                        ease: "easeInOut",
                      }}
                      drag="x"
                      dragMomentum={false}
                      onDragEnd={handleSwipe}
                      style={{
                        touchAction: "pan-y",
                      }}
                    >
                      {/* Map */}

                      <div className="w-1/2 min-w-0 shrink-0 flex justify-center overflow-hidden">
                        <WorldMap
                          countryPaths={currentProjection.countryPaths}
                          outlinePath={currentProjection.outlinePath}
                          width={WIDTH}
                          height={HEIGHT}
                          progress={projectionProgress}
                          projectionName={projectionContent.name}
                        />
                      </div>

                      {/* Graticule */}

                      <div className="w-1/2 min-w-0 shrink-0 flex justify-center overflow-hidden">
                        <Graticule
                          graticuleLines={currentProjection.graticuleLines}
                          graticuleLineIds={graticuleLineIds}
                          outlinePath={currentProjection.graticuleOutlinePath}
                          width={GRATICULE_WIDTH}
                          height={GRATICULE_HEIGHT}
                          progress={projectionProgress}
                          projectionName={projectionContent.name}
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* View toggle */}

                  <div className="flex justify-center mt-4 w-full">
                    <div className="inline-flex w-full border border-text rounded-sm overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setSelectedView(0)}
                        aria-pressed={selectedView === 0}
                        className={`px-4 py-1 text-sm flex-1 transition-colors ${
                          selectedView === 0
                            ? "bg-text text-surface font-medium"
                            : "bg-transparent text-text"
                        }`}
                      >
                        Map
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedView(1)}
                        aria-pressed={selectedView === 1}
                        className={`px-4 py-1 text-sm flex-1 transition-colors ${
                          selectedView === 1
                            ? "bg-text text-surface font-medium"
                            : "bg-transparent text-text"
                        }`}
                      >
                        Graticule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------
                Bottom-right
            ------------------------------------------------ */}

            <MapDescription projectionContent={projectionContent} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
