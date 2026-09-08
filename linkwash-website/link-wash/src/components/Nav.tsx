
import { useEffect, useState } from "react";
import { EDGE_URL } from "../shared/shared";
import { BuyMeCoffeeButton } from "./BuyMeCoffee";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#demo", label: "Demo" },
  { href: "#privacy", label: "Privacy" },
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the menu on Escape, and whenever the layout grows into the desktop nav.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/60 transition-colors duration-300">
      <div className="flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 md:px-12 py-3.5 md:py-4">
        <a
          href="#hero"
          className="flex items-center gap-2 sm:gap-2.5 font-bold text-sm sm:text-base md:text-lg text-slate-900 dark:text-white no-underline shrink-0"
        >
          <div className="w-8 h-8 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <img src="/logo.png" alt="Link Wash Logo" className="w-full h-full object-contain" />
          </div>
          Link Wash
        </a>

        <ul className="hidden md:flex gap-8 list-none">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium no-underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <BuyMeCoffeeButton />

          {/* On phones this CTA lives inside the menu instead */}
          <a
            href={EDGE_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex bg-blue-600 text-white px-5 py-2.5 rounded-3xl text-sm font-semibold no-underline shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
          >
            Add to Browser
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="md:hidden relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 inline-flex items-center justify-center rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span
              aria-hidden="true"
              className={`absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                menuOpen ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                menuOpen ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-3 sm:px-6 pb-5 pt-2 border-t border-slate-200 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
          <ul className="flex flex-col list-none p-0 m-0">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white no-underline transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={EDGE_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            className="mt-3 flex items-center justify-center bg-blue-600 text-white px-5 py-3 rounded-2xl text-sm font-semibold no-underline shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
          >
            Add to Browser
          </a>
        </div>
      </div>
    </nav>
  );
}
