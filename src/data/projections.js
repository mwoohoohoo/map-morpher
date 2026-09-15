export const PROJECTIONS = {
  mercator: {
    name: "Mercator",
    world: "/data/projections/world_mercator.geojson",
    outline: "/data/projections/outline_mercator.geojson",
    graticule: "/data/projections/graticule_mercator.geojson",
    year: "1569",

    creators: [
      {
        name: "Gerardus Mercator",
        profession: "cartographer",
        nationality: "Flemish",
      },
    ],

    type: "a cylindrical",
    typeDescription:
      "A cylindrical projection represents the Earth as if its surface were projected onto a cylinder.",

    features: [
      "allows accurate straight-line navigation",
      "preserves angles and shapes at local scale (conformal)",
      "widely used and recognised",
    ],

    cons: [
      "extreme area distortion far from the equator",
      "reinforces a Eurocentric perspective",
      "mathematically impossible to map the poles",
    ],
  },

  robinson: {
    name: "Robinson",
    world: "/data/projections/world_robinson.geojson",
    outline: "/data/projections/outline_robinson.geojson",
    graticule: "/data/projections/graticule_robinson.geojson",
    year: "1963",
    creators: [
      {
        name: "Arthur H. Robinson",
        profession: "cartographer and geographer",
        nationality: "American",
      },
    ],

    type: "a pseudo-cylindrical",
    typeDescription:
      "A pseudo-cylindrical projection uses straight, parallel lines of latitude while its meridians are not all straight and parallel.",

    features: [
      "offers a compromise between various distortions",
      "designed to be visually appealing",
    ],

    cons: [
      "moderately distorts areas, shapes, distances, directions and angles",
      "distortion increases away from the centre of the map",
    ],
  },

  dymaxion: {
    name: "Dymaxion / Fuller",
    world: "/data/projections/world_dymaxion.geojson",
    outline: "/data/projections/outline_dymaxion.geojson",
    graticule: "/data/projections/graticule_dymaxion.geojson",
    year: "1943",
    creators: [
      {
        name: "Buckminster Fuller",
        profession: "architect, author and designer",
        nationality: "American",
      },
    ],

    type: "an icosahedral",
    typeDescription:
      "An icosahedral projection projects the Earth onto the faces of an icosahedron, a three-dimensional shape with 20 triangular faces.",

    features: [
      "lack of an obvious north-south/east-west orientation can reduce cultural bias",
      "low distortion of areas, shapes, distances, directions and angles",
      "scale is accurate along facet edges",
    ],

    cons: [
      "distortion increases away from the facet edges",
      "flattened shape is unfamiliar",
    ],
  },

  gall_peters: {
    name: "Gall–Peters",
    world: "/data/projections/world_gall_peters.geojson",
    outline: "/data/projections/outline_gall_peters.geojson",
    graticule: "/data/projections/graticule_gall_peters.geojson",
    year: "1855 and 1973",

    creators: [
      {
        name: "James Gall",
        profession: "clergyman",
        nationality: "Scottish",
      },
      {
        name: "Arno Peters",
        profession: "filmmaker",
        nationality: "German",
      },
    ],

    type: "a cylindrical equal-area",
    typeDescription:
      "A cylindrical equal-area projection preserves the relative areas of regions while distorting their shapes.",

    features: [
      "reduces distortion of relative areas in comparison with the Mercator projection",
      "challenges Eurocentric perspectives and cultural biases",
    ],

    cons: [
      "high distortion of shapes, especially around the equator and poles",
    ],
  },

  goode_homolosine: {
    name: "Goode Homolosine",
    world: "/data/projections/world_goode_homolosine.geojson",
    outline: "/data/projections/outline_goode_homolosine.geojson",
    graticule: "/data/projections/graticule_goode_homolosine.geojson",
    year: "1923",
    creators: [
      {
        name: "John Paul Goode",
        profession: "cartographer and geographer",
        nationality: "American",
      },
    ],

    type: "an equal-area pseudo-cylindrical",
    typeDescription:
      "An equal-area pseudo-cylindrical projection preserves relative areas while using curved or interrupted meridians to reduce distortion.",

    features: [
      "combines strengths of sinusoidal and Mollweide projections, while mitigating their weaknesses",
      "maintains relative areas of land masses",
    ],

    cons: [
      "shapes, angles and distances are distorted",
      "its interrupted form sacrifices accuracy over oceans",
    ],
  },

  authagraph: {
    name: "AuthaGraph",
    world: "/data/projections/world_narukawa2022_authagraph.geojson",
    outline: "/data/projections/outline_narukawa2022_authagraph.geojson",
    graticule: "/data/projections/graticule_narukawa2022_authagraph.geojson",
    year: "1999",
    creators: [
      {
        name: "Hajime Narukawa",
        profession: "architect",
        nationality: "Japanese",
      },
    ],

    type: "an (almost) equal-area",
    typeDescription:
      "An equal-area projection preserves the relative areas of regions, although their shapes may be distorted. This projection conceptually fits into that category.",

    features: [
      "reduces distortion of areas and shapes",
      "can be tiled in any direction",
      "shows the world from a less Eurocentric perspective",
    ],

    cons: [
      "directions and distances are distorted",
      "orientation is unfamiliar",
    ],
  },

  winkel_tripel: {
    name: "Winkel Tripel",
    world: "/data/projections/world_winkel_tripel.geojson",
    outline: "/data/projections/outline_winkel_tripel.geojson",
    graticule: "/data/projections/graticule_winkel_tripel.geojson",
    year: "1921",
    creators: [
      {
        name: "Oswald Winkel",
        profession: "cartographer",
        nationality: "German",
      },
    ],

    type: "modified azimuthal",
    typeDescription:
      "A modified azimuthal projection combines characteristics of azimuthal projections with other methods to reduce overall distortion. In an azimuthal projection, a point (azimuth) on the globe becomes the centre of a circular projection, where distances and directions from the azimuth are preserved.",

    features: [
      "low average distortion of areas, direction and distance",
      "replaced the Robinson projection as National Geographic's projection of choice",
    ],

    cons: [
      "moderately distorts shapes, especially towards poles and map edges",
    ],
  },
};
