
import { useState } from "react";
import {
  FiXCircle,
  FiKey,
  FiBarChart2,
  FiShield,
  FiFileText,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { Reveal } from "../shared/shared";
import type { PrivacyItem } from "../types";

const PRIVACY_ITEMS: PrivacyItem[] = [
  {
    icon: <FiXCircle size={18} />,
    title: "Zero network requests",
    body: "Link Wash computes everything locally using your browser's built-in URL and URLSearchParams APIs. No server ever sees your links. You can verify this yourself in DevTools → Network the list stays empty.",
  },
  {
    icon: <FiKey size={18} />,
    title: "No accounts, ever",
    body: `No sign-up. No email. No OAuth. No "continue with Google." Link Wash installs and works immediately; nothing to create, nothing to verify, nothing to lose access to.`,
  },
  {
    icon: <FiBarChart2 size={18} />,
    title: "No analytics or telemetry",
    body: `The extension doesn't report home. No usage stats, no crash reports, no "anonymous" telemetry. What you clean stays between you and your device.`,
  },
  {
    icon: <FiShield size={18} />,
    title: "Minimal permissions",
    body: `Link Wash requests only the permissions it actually needs context menu access and clipboard write. No host permissions, no "read all your data on all websites."`,
  },
  {
    icon: <FiFileText size={18} />,
    title: "Free & open source (MIT)",
    body: "Every line of code is public. You don't have to trust our word on any of the above you can read the source, audit it, fork it, or build your own. MIT licensed, no strings attached.",
  },
];

export function PrivacySection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="privacy"
      className="bg-gray-200 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700/60 px-5 md:px-20 py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Left side */}
        <Reveal className="flex items-center justify-center">
          <img
            src="/privacy.svg"
            alt="Privacy illustration"
            className="w-full max-w-md h-auto object-contain mt-28"
          />
        </Reveal>

        {/* Right side */}
        <div>
          <Reveal
            as="h2"
            className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight"
          >
            Privacy is the
            <br />
            whole point.
          </Reveal>
          <Reveal
            as="p"
            className="mt-4 text-lg text-slate-700 dark:text-slate-400 leading-relaxed max-w-lg mb-9"
          >
            Not a feature. Not a checkbox. The reason Link Wash exists.
          </Reveal>

          <Reveal className="flex flex-col gap-3">
            {PRIVACY_ITEMS.map((item, i) => {
              const open = openIndex === i;
              return (
                <div
                  key={item.title}
                  className="border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden bg-white/70 dark:bg-slate-400/5"
                >
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    className={`w-full bg-transparent border-none cursor-pointer flex items-center justify-between font-semibold text-left transition-colors ${
                      open
                        ? "px-5 py-4.5 text-slate-900 dark:text-white"
                        : "px-4 py-3 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex items-center justify-center text-blue-500 dark:text-blue-400 shrink-0">
                        {item.icon}
                      </div>
                      {item.title}
                    </div>
                    <div className="shrink-0 text-slate-600 dark:text-slate-400 transition-transform">
                      {open ? <FiMinus size={20} /> : <FiPlus size={20} />}
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-400 ease-out text-slate-700 dark:text-slate-300 text-sm leading-relaxed ${
                      open ? "max-h-50 px-5 pb-5" : "max-h-0 px-5"
                    }`}
                  >
                    {item.body}
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}