const BASE_URL = import.meta.env.BASE_URL;
const DATA_PATH = `${BASE_URL}data/projections/`;

export const PROJECTIONS = {
  mercator: {
    name: "Mercator",
    world: `${DATA_PATH}world_mercator.geojson`,
    outline: `${DATA_PATH}outline_mercator.geojson`,
    graticule: `${DATA_PATH}graticule_mercator.geojson`,
    year: "1569",

    creators: [
      {
        name: "Gerardus Mercator",
        profession: "cartographer",
        nationality: "Flemish",
      },
    ],

    type: {
      article: "a",
      text: "cylindrical",
      annotations: [
        {
          term: "cylindrical",
          description:
            "A cylindrical projection represents the Earth as if its surface were projected onto a cylinder.",
        },
      ],
    },

    features: [
      {
        text: "allows accurate straight-line navigation",
      },
      {
        text: "preserves angles and shapes at a local scale (conformal)",
        annotations: [
          {
            term: "conformal",
            description:
              "Conformal maps preserve angles, but may distort lengths or distances.",
          },
        ],
      },
      {
        text: "widely used and recognised (especially for mapping applications)",
      },
    ],

    cons: [
      {
        text: "extreme area distortion far from the equator",
      },
      {
        text: "reinforces a Eurocentric perspective",
      },
      {
        text: "mathematically impossible to map the poles",
        annotations: [
          {
            term: "mathematically impossible",
            description:
              "The linear scaling along the meridians (resulting from the cylindrical projection) becomes infinitely large at the poles.",
          },
        ],
      },
    ],
  },

  robinson: {
    name: "Robinson",
    world: `${DATA_PATH}world_robinson.geojson`,
    outline: `${DATA_PATH}outline_robinson.geojson`,
    graticule: `${DATA_PATH}graticule_robinson.geojson`,
    year: "1963",
    creators: [
      {
        name: "Arthur H. Robinson",
        profession: "cartographer and geographer",
        nationality: "American",
      },
    ],

    type: {
      article: "a",
      text: "pseudo-cylindrical",
      annotations: [
        {
          term: "pseudo-cylindrical",
          description:
            "A pseudo-cylindrical projection uses straight, parallel lines of latitude while its meridians are not all straight and parallel.",
        },
      ],
    },

    features: [
      {
        text: "offers a compromise between various distortions",
      },
      {
        text: "designed to be visually appealing",
      },
    ],

    cons: [
      {
        text: "moderately distorts areas, shapes, distances, directions and angles",
      },
      {
        text: "distortion increases away from the centre of the map",
      },
    ],
  },

  dymaxion: {
    name: "Dymaxion / Fuller",
    world: `${DATA_PATH}world_dymaxion.geojson`,
    outline: `${DATA_PATH}outline_dymaxion.geojson`,
    graticule: `${DATA_PATH}graticule_dymaxion.geojson`,
    year: "1943",
    creators: [
      {
        name: "Buckminster Fuller",
        profession: "architect, author and designer",
        nationality: "American",
      },
    ],

    type: {
      article: "an",
      text: "icosahedral",
      annotations: [
        {
          term: "icosahedral",
          description:
            "An icosahedral projection projects the Earth onto the faces of an icosahedron, a three-dimensional shape with 20 triangular faces.",
        },
      ],
    },

    features: [
      {
        text: "lack of an obvious orientation can reduce cultural bias",
      },
      {
        text: "low distortion of areas, shapes, distances, directions and angles",
      },
      {
        text: "scale is accurate along facet edges",
      },
    ],

    cons: [
      {
        text: "distortion increases away from the facet edges",
      },
      {
        text: "flattened shape is unfamiliar",
      },
    ],
  },

  gall_peters: {
    name: "Gall–Peters",
    world: `${DATA_PATH}world_gall_peters.geojson`,
    outline: `${DATA_PATH}outline_gall_peters.geojson`,
    graticule: `${DATA_PATH}graticule_gall_peters.geojson`,
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

    type: {
      article: "a",
      text: "cylindrical equal-area",
      annotations: [
        {
          term: "cylindrical",
          description:
            "A cylindrical projection represents the Earth as if its surface were projected onto a cylinder.",
        },
        {
          term: "equal-area",
          description:
            "An equal-area projection preserves the relative areas of regions while distorting their shapes.",
        },
      ],
    },

    features: [
      {
        text: "reduces distortion of relative areas in comparison with the Mercator projection",
      },
      {
        text: "challenges Eurocentric perspectives and cultural biases",
      },
    ],

    cons: [
      {
        text: "high distortion of shapes, especially around the equator and poles",
      },
    ],
  },

  goode_homolosine: {
    name: "Goode Homolosine",
    world: `${DATA_PATH}world_goode_homolosine.geojson`,
    outline: `${DATA_PATH}outline_goode_homolosine.geojson`,
    graticule: `${DATA_PATH}graticule_goode_homolosine.geojson`,
    year: "1923",
    creators: [
      {
        name: "John Paul Goode",
        profession: "cartographer and geographer",
        nationality: "American",
      },
    ],

    type: {
      article: "an",
      text: "equal-area pseudo-cylindrical",
      annotations: [
        {
          term: "equal-area",
          description:
            "An equal-area projection preserves the relative areas of regions while distorting their shapes.",
        },
        {
          term: "pseudo-cylindrical",
          description:
            "A pseudo-cylindrical projection uses straight, parallel lines of latitude and a straight central meridian. However, unlike in a cylindrical projection, all other meridians are longer and bow outwards from the central meridian.",
        },
      ],
    },

    features: [
      {
        text: "combines strengths of sinusoidal and Mollweide projections, while mitigating their weaknesses",
        annotations: [
          {
            term: "sinusoidal",
            description:
              "The sinusoidal projection was the first pseudo-cylindrical projection. It is equal-area, with the poles represented as points. The equator and central meridian are undistorted.",
          },
          {
            term: "Mollweide",
            description:
              "The Mollweide projection is an equal-area pseudo-cylindrical projection in the shape of an ellipse. Shapes at the ellipse's perimeter are less distorted than they are in the sinusoidal projection.",
          },
        ],
      },
      {
        text: "maintains relative areas of land masses",
      },
    ],

    cons: [
      {
        text: "shapes, angles and distances are distorted",
      },
      {
        text: "its interrupted form sacrifices accuracy over the oceans",
      },
    ],
  },

  authagraph: {
    name: "AuthaGraph",
    world: `${DATA_PATH}world_narukawa2022_authagraph.geojson`,
    outline: `${DATA_PATH}outline_narukawa2022_authagraph.geojson`,
    graticule: `${DATA_PATH}graticule_narukawa2022_authagraph.geojson`,
    year: "1999",
    creators: [
      {
        name: "Hajime Narukawa",
        profession: "architect",
        nationality: "Japanese",
      },
    ],

    type: {
      article: "an",
      text: "(almost) equal-area",
      annotations: [
        {
          term: "(almost) equal-area",
          description:
            "An equal-area projection preserves the relative areas of regions, although their shapes may be distorted. This projection conceptually fits into that category, although it is not strictly an equal-area projection.",
        },
      ],
    },

    features: [
      {
        text: "reduces distortion of areas and shapes",
      },
      {
        text: "can be tiled in any direction",
      },
      {
        text: "shows the world from a less Eurocentric perspective",
      },
    ],

    cons: [
      {
        text: "directions and distances are distorted",
      },
      {
        text: "orientation is unfamiliar",
      },
    ],
  },

  winkel_tripel: {
    name: "Winkel Tripel",
    world: `${DATA_PATH}world_winkel_tripel.geojson`,
    outline: `${DATA_PATH}outline_winkel_tripel.geojson`,
    graticule: `${DATA_PATH}graticule_winkel_tripel.geojson`,
    year: "1921",
    creators: [
      {
        name: "Oswald Winkel",
        profession: "cartographer",
        nationality: "German",
      },
    ],

    type: {
      article: "a",
      text: "modified azimuthal",
      annotations: [
        {
          term: "modified azimuthal",
          description:
            "A modified azimuthal projection combines characteristics of azimuthal projections with other methods to reduce overall distortion. In an azimuthal projection, a point (azimuth) on the globe becomes the centre of a circular projection, where distances and directions from the azimuth are preserved.",
        },
      ],
    },

    features: [
      {
        text: "low average distortion of areas, directions and distances",
      },
      {
        text: "replaced the Robinson projection as National Geographic's projection of choice",
      },
    ],

    cons: [
      {
        text: "moderately distorts shapes, especially towards the poles and map edges",
      },
    ],
  },

  equal_earth: {
    name: "Equal Earth",
    world: `${DATA_PATH}world_equal_earth.geojson`,
    outline: `${DATA_PATH}outline_equal_earth.geojson`,
    graticule: `${DATA_PATH}graticule_equal_earth.geojson`,
    year: "2018",
    creators: [
      {
        name: "Bernhard Jenny, Bojan Šavrič and Tom Patterson",
        profession: "cartographers",
      },
    ],

    type: {
      article: "an",
      text: "equal-area pseudo-cylindrical",
      annotations: [
        {
          term: "equal-area",
          description:
            "An equal-area projection preserves the relative areas of regions while distorting their shapes.",
        },
        {
          term: "pseudo-cylindrical",
          description:
            "A pseudo-cylindrical projection uses straight, parallel lines of latitude and a straight central meridian. However, unlike in a cylindrical projection, all other meridians are longer and bow outwards from the central meridian.",
        },
      ],
    },

    features: [
      {
        text: "visually similar to the Robinson projection, except that it accurately represents areas of land masses",
      },
      {
        text: "popularised by the 'Correct the Map' campaign and was consequently voted in by the UN in 2026 as a recommended alternative to the Mercator projection",
      },
    ],

    cons: [
      {
        text: "distorts shapes, directions, angles and distances",
      },
    ],
  },
};
