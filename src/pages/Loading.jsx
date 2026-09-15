import Navbar from "../components/Navbar";
import LoadingLogo from "../components/LoadingLogo";
import Footer from "../components/Footer";

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col min-h-0 pt-10 md:pt-14">
        <div className="relative left-1/2 -translate-x-1/2 w-screen flex flex-col flex-1 min-h-0 px-layout-s md:px-layout-m lg:px-layout-l">
          <div className="mx-auto w-full max-w-[1400px] flex-1 border-x border-x-outlines flex flex-col gap-4 items-center justify-center px-4 lg:px-6 py-4 lg:py-6">
            <LoadingLogo size={64} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
