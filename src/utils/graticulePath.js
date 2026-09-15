import * as d3 from "d3";

export function createGraticulePaths(
  graticule,
  outline,
  width = 300,
  height = 175,
  padding = 0,
) {
  if (!graticule) {
    throw new Error("createGraticulePaths: graticule is null or undefined");
  }

  if (!outline) {
    throw new Error("createGraticulePaths: outline is null or undefined");
  }

  // ----------------------------------------------------------
  // Get graticule features
  // ----------------------------------------------------------

  const features =
    graticule.type === "FeatureCollection" ? graticule.features : [graticule];

  // ----------------------------------------------------------
  // Keep only valid meridian / parallel features.
  // ----------------------------------------------------------

  const lineFeatures = features.filter(
    (feature) =>
      feature?.properties &&
      (feature.properties.type === "meridian" ||
        feature.properties.type === "parallel") &&
      feature.geometry &&
      (feature.geometry.type === "LineString" ||
        feature.geometry.type === "MultiLineString"),
  );

  // ----------------------------------------------------------
  // Group all geometry belonging to the same logical
  // meridian / parallel.
  // ----------------------------------------------------------

  const groupedLines = new Map();

  for (const feature of lineFeatures) {
    const type = feature.properties.type;
    const value = feature.properties.value;
    const id = `${type}_${value}`;

    if (!groupedLines.has(id)) {
      groupedLines.set(id, {
        type,
        value,
        coordinates: [],
      });
    }

    const group = groupedLines.get(id);

    if (feature.geometry.type === "LineString") {
      group.coordinates.push(feature.geometry.coordinates);
    } else if (feature.geometry.type === "MultiLineString") {
      group.coordinates.push(...feature.geometry.coordinates);
    }
  }

  // ----------------------------------------------------------
  // Convert grouped lines back into GeoJSON Features.
  // ----------------------------------------------------------

  const groupedFeatures = Array.from(groupedLines.entries()).map(
    ([id, group]) => ({
      type: "Feature",
      id,
      properties: {
        type: group.type,
        value: group.value,
      },
      geometry: {
        type: "MultiLineString",
        coordinates: group.coordinates,
      },
    }),
  );

  // ----------------------------------------------------------
  // Normalise the projection outline.
  //
  // Your outline files are GeometryCollections, so convert
  // raw geometries to Features where necessary.
  // ----------------------------------------------------------

  let outlineFeature;

  if (outline.type === "FeatureCollection") {
    outlineFeature = outline.features?.[0] ?? null;
  } else if (outline.type === "Feature") {
    outlineFeature = outline;
  } else {
    outlineFeature = {
      type: "Feature",
      properties: {},
      geometry: outline,
    };
  }

  if (!outlineFeature) {
    throw new Error("createGraticulePaths: could not create outline feature");
  }

  // ----------------------------------------------------------
  // Fit graticule + outline into the SVG.
  // ----------------------------------------------------------

  const combined = {
    type: "FeatureCollection",
    features: [...groupedFeatures, outlineFeature],
  };

  const identity = d3
    .geoIdentity()
    .reflectY(true)
    .fitExtent(
      [
        [padding, padding],
        [width - padding, height - padding],
      ],
      combined,
    );

  const path = d3.geoPath(identity);

  // ----------------------------------------------------------
  // Generate one path per logical meridian / parallel.
  // ----------------------------------------------------------

  const lines = groupedFeatures
    .map((feature) => ({
      id: feature.id,
      type: feature.properties.type,
      value: feature.properties.value,
      d: path(feature),
    }))
    .filter((line) => line.d);

  // ----------------------------------------------------------
  // Generate the projection outline path.
  // ----------------------------------------------------------

  const outlinePath = path(outlineFeature);

  return {
    lines,
    outlinePath,
  };
}
