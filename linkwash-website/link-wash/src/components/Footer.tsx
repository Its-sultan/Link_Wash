
import { FiExternalLink } from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import {
  EDGE_URL,
  GITHUB_URL,
  THABIT_URL,
} from "../shared/shared";
import { GiBoatPropeller } from "react-icons/gi";
import { BsBrowserEdge } from "react-icons/bs";
import { AirWaves } from "./AirWaves";
import { FooterBlobs } from "./FooterBlobs";


function UnderlineLink({ href, icon, children, iconColorClass = "" }: { href: string; icon?: React.ReactNode; children: React.ReactNode; iconColorClass?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative inline-flex items-center gap-2 no-underline text-sm font-medium text-slate-700 dark:text-slate-200 py-1"
    >
      {icon && <span className={iconColorClass}>{icon}</span>}
      <span className="relative">
        {children}
        <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 bg-current transition-all duration-300 ease-out group-hover:w-full" />
      </span>
    </a>
  );
}


function NavLink({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group relative inline-flex items-center gap-1 no-underline text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors w-fit"
    >
      <span className="relative">
        {children}
        <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 bg-current transition-all duration-300 ease-out group-hover:w-full" />
      </span>
      {external && (
        <FiExternalLink
          size={12}
          className="opacity-0 -translate-x-0.5 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300"
        />
      )}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-100 light:bg-white border-t border-slate-200 dark:border-slate-700/80 px-5 md:px-20 pt-16 pb-10 relative overflow-hidden">
      <FooterBlobs />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr_auto] gap-12 md:gap-16 items-start">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center">
              <img src="/logo.png" alt="Link Wash Logo" className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl">Link Wash</span>
          </div>
          <p className="text-slate-900 text-sm leading-relaxed max-w-xs mb-6">
            Strip tracking parameters from any URL. Free, open source, and
            100% local your links never leave your browser.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <UnderlineLink
              href={EDGE_URL}
              icon={<BsBrowserEdge size={16} />}
              iconColorClass="text-[#0078D4]"
            >
              Microsoft Edge Add-on
            </UnderlineLink>
            <UnderlineLink href={GITHUB_URL} icon={<SiGithub size={16} />}>
              GitHub
            </UnderlineLink>
          </div>
        </div>

        {/* Links */}
        <nav aria-label="Footer" className="flex flex-col gap-3 md:pt-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
            Product
          </span>
          <NavLink href="#demo">Demo</NavLink>
          <NavLink href="#how">How it works</NavLink>
          <NavLink href={GITHUB_URL} external>
            GitHub
          </NavLink>
          <NavLink href={EDGE_URL} external>
            Edge Add-on
          </NavLink>
        </nav>

        {/* Art */}
        <div className="relative flex items-center justify-end gap-4 self-start">
          <AirWaves />
          <GiBoatPropeller size={160} className="text-blue-400 spin" />
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-700 dark:border-slate-700 light:border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
        <span>{new Date().getFullYear()} &copy; Link Wash. MIT Licensed.</span>
        <span className="flex items-center gap-1.5 text-slate-400">
          Crafted by
          <NavLink href={THABIT_URL} external>
            <span className="text-blue-400 font-semibold hover:text-blue-300">
              Thabit S
            </span>
          </NavLink>
        </span>
      </div>
    </footer>
  );
}