import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Error() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col min-h-0 pt-10 md:pt-14">
        <div className="relative left-1/2 -translate-x-1/2 w-screen flex flex-col items-center justify-center gap-4 flex-1 min-h-0 px-layout-s md:px-layout-m lg:px-layout-l">
          <h1 className="text-center">Uncharted territory</h1>
          <p className="body-large text-center">
            This page has disappeared off of the face of the Earth. Sorry about
            that.
          </p>

          <Link
            to="/"
            className="cursor-pointer text-base bg-text text-surface text-center font-medium w-full md:w-fit px-4 py-3 mt-2 rounded-sm hover:bg-link-hover transition"
          >
            Return to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
