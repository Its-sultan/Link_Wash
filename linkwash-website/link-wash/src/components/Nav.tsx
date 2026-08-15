
import { EDGE_URL } from "../shared/shared";


export function Nav() {


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/60 transition-colors duration-300">
      <div className="flex items-center gap-2.5 font-bold text-lg text-slate-900 dark:text-white">
        <div className="w-8 h-8 flex items-center justify-center shadow-lg shadow-blue-600/20">
          <img src="/logo.png" alt="Link Wash Logo" className="w-full h-full object-contain" />
        </div>
        Link Wash
      </div>

      <ul className="hidden md:flex gap-8 list-none">
        <li>
          <a
            href="#how"
            className="text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium no-underline"
          >
            How it works
          </a>
        </li>
        <li>
          <a
            href="#demo"
            className="text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium no-underline"
          >
            Demo
          </a>
        </li>
        <li>
          <a
            href="#privacy"
            className="text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium no-underline"
          >
            Privacy
          </a>
        </li>
      </ul>

      <div className="flex items-center gap-3">
    

        <a
          href={EDGE_URL}
          target="_blank"
          rel="noreferrer"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-3xl text-sm font-semibold no-underline shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
        >
          Add to Browser
        </a>
      </div>
    </nav>
  );
}
