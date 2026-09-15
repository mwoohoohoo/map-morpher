import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-screen z-50 backdrop-blur-md bg-bg">
      <div className="border-b border-outlines">
        <div className="px-layout-s md:px-layout-m lg:px-layout-l">
          <div className="max-w-[1400px] h-10 md:h-14 flex items-center justify-between mx-auto">
            {/* Logo */}
            <Link to="/">
              <h2>Map morpher</h2>
            </Link>

            {/* Nav links */}
            <nav>
              <Link
                to="/about"
                className="text-sm md:text-base nav-link hover:text-link-hover transition"
              >
                About
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
