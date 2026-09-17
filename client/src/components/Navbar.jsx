import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-6 py-5 md:px-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Logo */}
        <a
          href="/"
          className="text-xl font-semibold tracking-[0.18em] text-white"
        >
          ESTATE<span className="text-white/50">CRM</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#properties"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Properties
          </a>

          <a
            href="#about"
            className="text-sm text-white/70 transition hover:text-white"
          >
            About
          </a>

          <a
            href="#contact"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Contact
          </a>

          <a
            href="/admin/login"
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm text-white transition duration-300 hover:bg-white hover:text-black"
          >
            Admin Login
          </a>
        </div>

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mx-4 mt-4 rounded-2xl border border-white/10 bg-black/80 p-6 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-5">
            <a
              href="#properties"
              onClick={() => setMenuOpen(false)}
              className="text-white/80"
            >
              Properties
            </a>

            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
              className="text-white/80"
            >
              About
            </a>

            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="text-white/80"
            >
              Contact
            </a>

            <a
              href="/admin/login"
              className="rounded-full border border-white/30 px-5 py-3 text-center text-white"
            >
              Admin Login
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;