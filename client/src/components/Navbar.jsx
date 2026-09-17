import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-6 py-5 md:px-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        {/* LOGO */}

        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl font-semibold tracking-[0.18em] text-white"
        >
          Kundanagari
          <span className="text-white/50">Property</span>
        </Link>

        {/* DESKTOP NAV */}

        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/properties"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Properties
          </Link>

          {isHome ? (
            <a
              href="#about"
              className="text-sm text-white/70 transition hover:text-white"
            >
              About
            </a>
          ) : (
            <Link
              to="/#about"
              className="text-sm text-white/70 transition hover:text-white"
            >
              About
            </Link>
          )}

          {isHome ? (
            <a
              href="#contact"
              className="text-sm text-white/70 transition hover:text-white"
            >
              Contact
            </a>
          ) : (
            <Link
              to="/#contact"
              className="text-sm text-white/70 transition hover:text-white"
            >
              Contact
            </Link>
          )}

          <Link
            to="/admin/login"
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm text-white transition duration-300 hover:bg-white hover:text-black"
          >
            Admin Login
          </Link>
        </div>

        {/* MOBILE BUTTON */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white md:hidden"
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className="block h-px w-5 bg-white" />
            <span className="block h-px w-5 bg-white" />
          </div>
        </button>
      </nav>

      {/* MOBILE MENU */}

      {menuOpen && (
        <div className="mx-4 mt-4 rounded-2xl border border-white/10 bg-black/90 p-6 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-5">
            <Link
              to="/properties"
              onClick={closeMenu}
              className="text-white/80"
            >
              Properties
            </Link>

            {isHome ? (
              <a
                href="#about"
                onClick={closeMenu}
                className="text-white/80"
              >
                About
              </a>
            ) : (
              <Link
                to="/#about"
                onClick={closeMenu}
                className="text-white/80"
              >
                About
              </Link>
            )}

            {isHome ? (
              <a
                href="#contact"
                onClick={closeMenu}
                className="text-white/80"
              >
                Contact
              </a>
            ) : (
              <Link
                to="/#contact"
                onClick={closeMenu}
                className="text-white/80"
              >
                Contact
              </Link>
            )}

            <Link
              to="/admin/login"
              onClick={closeMenu}
              className="rounded-full border border-white/30 px-5 py-3 text-center text-white"
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;