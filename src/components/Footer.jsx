export default function Footer() {
  return (
    <footer className="relative left-1/2 w-screen -translate-x-1/2 pb-6 md:pb-8">
      {/* TOP DIVIDER */}
      <div className="border-t border-outlines mb-6 md:mb-8" />
      <div className="px-layout-s md:px-layout-m lg:px-layout-l">
        {/* FOOTER CONTENT */}
        <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] md:grid-rows-1 text-text gap-x-2 gap-y-6 md:gap-y-0 items-end">
          {/* SOURCES */}
          <div className="flex flex-col gap-4 items-start w-full">
            <h4>Sources</h4>
            <ul className="w-full grid grid-cols-1 md:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)] grid-rows-[auto_auto] md:grid-rows-3 md:grid-flow-col text-left text-xs gap-2">
              <li>
                <a
                  className="hover:text-link-hover transition"
                  href="https://brilliantmaps.com/authagraph-map/"
                  target="_blank"
                >
                  Brilliant Maps
                </a>
              </li>
              <li>
                <a
                  className="hover:text-link-hover transition"
                  href="https://doc.esri.com/en/arcgis-pro/latest/help/mapping/properties/list-of-supported-map-projections.html"
                  target="_blank"
                >
                  esri
                </a>
              </li>
              <li>
                <a
                  className="hover:text-link-hover transition"
                  href="https://flatearth.ws/"
                  target="_blank"
                >
                  FlatEarth.ws
                </a>
              </li>
              <li>
                <a
                  className="hover:text-link-hover transition"
                  href="https://mapshaper.org/"
                  target="_blank"
                >
                  mapshaper
                </a>
              </li>
              <li>
                <a
                  className="hover:text-link-hover transition"
                  href="https://narukawa-lab.jp/archives/authagraph-map/"
                  target="_blank"
                >
                  narukawa lab
                </a>
              </li>
              <li>
                <a
                  className="hover:text-link-hover transition"
                  href="https://www.naturalearthdata.com/"
                  target="_blank"
                >
                  Natural Earth
                </a>
              </li>

              <li>
                <a
                  className="hover:text-link-hover transition"
                  href="https://scienceinsights.org/what-is-a-mercator-map-projection-and-how-does-it-distort/"
                  target="_blank"
                >
                  Science Insights
                </a>
              </li>
              <li>
                <a
                  className="hover:text-link-hover transition"
                  href="https://thecartographicinstitute.com/"
                  target="_blank"
                >
                  The Cartographic Institute
                </a>
              </li>
              <li>
                <a
                  className="hover:text-link-hover transition"
                  href="https://en.wikipedia.org/"
                  target="_blank"
                >
                  Wikipedia
                </a>
              </li>
            </ul>
          </div>

          {/* COPYRIGHT */}
          <div className="text-xs md:text-right">
            © Merri Hookway {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}
