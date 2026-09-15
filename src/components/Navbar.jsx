import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-screen z-50 backdrop-blur-md bg-bg">
      <div className="border-b border-outlines">
        <div className="px-layout-s md:px-layout-m lg:px-layout-l">
          <div className="max-w-[1400px] h-10 md:h-14 flex items-center justify-between mx-auto">
            {/* Logo */}
            <Link to="/">
              <img src={logo} alt="Map morpher" className="h-5 md:h-7 w-auto" />
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
