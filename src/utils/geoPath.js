import * as d3 from "d3";

export function createProjectionPaths(
  world,
  outline,
  width = 800,
  height = 400,
  padding = 0,
) {
  const worldFeatures =
    world.type === "FeatureCollection" ? world.features : [world];

  let outlineFeature;

  if (outline.type === "FeatureCollection") {
    outlineFeature = outline.features[0];
  } else if (outline.type === "Feature") {
    outlineFeature = outline;
  } else {
    outlineFeature = {
      type: "Feature",
      properties: {},
      geometry: outline,
    };
  }

  const combined = {
    type: "FeatureCollection",
    features: [...worldFeatures, outlineFeature],
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

  const countryPaths = worldFeatures.map((feature) => ({
    id: feature.properties.ADM0_A3,
    d: path(feature),
  }));

  const outlinePath = path(outlineFeature);

  return {
    countryPaths,
    outlinePath,
  };
}
