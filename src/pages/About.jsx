import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CopyEmailButton from "../ui/CopyEmailButton";
import ProjectionIllustration from "../components/ProjectionIllustration";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col min-h-0 pt-10 md:pt-14">
        <div className="relative left-1/2 -translate-x-1/2 flex flex-col flex-1 min-h-0 w-screen px-layout-s md:px-layout-m lg:px-layout-l">
          <div className="w-full max-w-[1400px] flex-1 border border-l-outlines border-r-outlines border-y-0 mx-auto grid grid-cols-1 lg:grid-cols-[minmax(560px,1fr)_minmax(0,1fr)] min-h-0 gap-px bg-outlines">
            {/* Top-left */}
            <div className="flex flex-col items-start px-4 lg:px-6 py-4 lg:py-6 gap-3 lg:gap-6 bg-bg order-2 lg:order-1">
              <h1>About this tool</h1>
              <p className="body-large">
                I am a bit of a map nerd. I'm fascinated by how geo-spatial data
                bridges the gap between the physical and digital worlds and I'm
                excited by how much I still have to learn about this field.
              </p>
              <p className="pt-1">
                Prior to my map nerd days, I was only really aware of one map
                projection: the Mercator, a version of which is often used for
                mapping applications. But there are so many others out there,
                with all sorts of quirky shapes and interesting histories.
              </p>
              <p>
                This tool showcases a selection of more- and less-well-known
                projections, to help make sense of how they relate to (and
                differ from) each other. It's still in development, so let me
                know if there's a projection or other feature you'd like added.
              </p>
              <p>
                I hope by sharing this that I can ignite a little of my map
                passion in you, too.
              </p>
              <p>Merri, September 2026</p>
              <div className="flex flex-col w-full md:flex-row gap-3 md:gap-6 items-center">
                <CopyEmailButton />
                <a
                  className="font-medium text-base hover:text-link-hover transition text-center w-full md:w-fit md:text-left mt-3 lg:mt-2"
                  href="https://studioglu.nl"
                  target="_blank"
                >
                  See more of my work
                </a>
              </div>
            </div>

            {/* Top-right */}
            <div className="bg-bg flex items-center justify-center px-4 py-4 md:px-10 md:py-10 order-1 lg:order-2">
              <ProjectionIllustration />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
