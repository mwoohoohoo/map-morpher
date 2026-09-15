import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUTPUT_DIR = "./public/data/projections";
const TEMP_DIR = "./scripts/.tmp-graticules";

const INTERVAL = 15;
const STEP = 1;

const MERCATOR_LAT_LIMIT = 85.05112878;

const PROJECTIONS = {
  mercator: {
    proj: "+proj=merc",
    output: "graticule_mercator.geojson",
    minLat: -MERCATOR_LAT_LIMIT,
    maxLat: MERCATOR_LAT_LIMIT,
  },

  robinson: {
    proj: "+proj=robin",
    output: "graticule_robinson.geojson",
    minLat: -90,
    maxLat: 90,
  },

  dymaxion: {
    proj: "+proj=dymaxion",
    output: "graticule_dymaxion.geojson",
    minLat: -90,
    maxLat: 90,
    densify: true,
  },

  gall_peters: {
    proj: "+proj=cea +lat_ts=45",
    output: "graticule_gall_peters.geojson",
    minLat: -90,
    maxLat: 90,
  },

  goode_homolosine: {
    proj: "+proj=igh",
    output: "graticule_goode_homolosine.geojson",
    minLat: -90,
    maxLat: 90,
  },

  authagraph: {
    proj: "+proj=narukawa2022",
    output: "graticule_narukawa2022_authagraph.geojson",
    minLat: -90,
    maxLat: 90,
  },

  winkel_tripel: {
    proj: "+proj=wintri",
    output: "graticule_winkel_tripel.geojson",
    minLat: -90,
    maxLat: 90,
  },
};

mkdirSync(OUTPUT_DIR, { recursive: true });
mkdirSync(TEMP_DIR, { recursive: true });

function createMeridian(longitude, minLat, maxLat) {
  const coordinates = [];

  for (let latitude = minLat; latitude <= maxLat; latitude += STEP) {
    coordinates.push([longitude, Number(latitude.toFixed(6))]);
  }

  return {
    type: "Feature",
    properties: {
      type: "meridian",
      value: longitude,
    },
    geometry: {
      type: "LineString",
      coordinates,
    },
  };
}

function createParallel(latitude) {
  const coordinates = [];

  for (let longitude = -180; longitude <= 180; longitude += STEP) {
    coordinates.push([longitude, latitude]);
  }

  return {
    type: "Feature",
    properties: {
      type: "parallel",
      value: latitude,
    },
    geometry: {
      type: "LineString",
      coordinates,
    },
  };
}

function createGraticule(minLat, maxLat) {
  const features = [];

  // ----------------------------------------------------------
  // Meridians
  //
  // Generate every 15° longitude.
  // Unlike Mapshaper's built-in graticule, each meridian
  // continues all the way to the requested latitude limits.
  // ----------------------------------------------------------

  for (let longitude = -180; longitude <= 180; longitude += INTERVAL) {
    features.push(createMeridian(longitude, minLat, maxLat));
  }

  // ----------------------------------------------------------
  // Parallels
  //
  // Generate every 15° latitude within the projection's
  // geographic limits.
  // ----------------------------------------------------------

  for (
    let latitude = Math.ceil(minLat / INTERVAL) * INTERVAL;
    latitude <= maxLat;
    latitude += INTERVAL
  ) {
    features.push(createParallel(latitude));
  }

  return {
    type: "FeatureCollection",
    features,
  };
}

for (const [id, projection] of Object.entries(PROJECTIONS)) {
  console.log(`\nGenerating ${id} graticule...`);

  // ----------------------------------------------------------
  // 1. Create geographic graticule
  // ----------------------------------------------------------

  const geographicGraticule = createGraticule(
    projection.minLat,
    projection.maxLat,
  );

  const tempInput = path.join(TEMP_DIR, `${id}.geojson`);

  writeFileSync(tempInput, JSON.stringify(geographicGraticule));

  // ----------------------------------------------------------
  // 2. Project the graticule with Mapshaper
  // ----------------------------------------------------------

  const outputPath = path.join(OUTPUT_DIR, projection.output);

  const args = [tempInput, "-proj", projection.proj];

  if (projection.densify) {
    args.push("densify");
  }

  args.push("-o", outputPath);

  console.log(`npx mapshaper ${args.join(" ")}`);

  execFileSync("npx", ["mapshaper", ...args], {
    stdio: "inherit",
  });

  console.log(`✓ ${outputPath}`);
}

console.log("\nAll graticules generated successfully.");
