import { useState, useEffect, useRef, useCallback } from "react";
import {
  FiCheckCircle,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { Reveal } from "../shared/shared";
import type { Step } from "../types";
import { LuMousePointerClick } from "react-icons/lu";

const STEP_DURATION = 5000;
const STEPS: Step[] = [
  {
    title: "Right-click any link",
    body: `Hover any link on any page, right-click, and choose "Copy clean link." Tracking params are stripped before it even hits your clipboard.`,
  },
  {
    title: "Open the popup & paste",
    body: "Click the Link Wash icon in your toolbar. Paste any URL to see a live preview of exactly what gets removed with a plain-English explanation per parameter.",
  },
  {
    title: "Review removed params",
    body: "Each stripped parameter is listed with a one-line explanation. Toggle any back on if you need it, the clean URL updates instantly.",
  },
  {
    title: "Copy & share",
    body: `Hit "Copy clean link" and share a URL that reveals nothing about where you found it or who you are. Done.`,
  },
];


function StepPreview({ step }: { step: number }) {
 
  if (step === 0) {
    return (
      <div className="bg-slate-800 dark:bg-slate-800 light:bg-slate-100 rounded-xl p-5 border border-slate-700 dark:border-slate-700 light:border-slate-200">
        <div className="text-xs text-slate-200 mb-4 font-semibold flex items-center gap-2">
          <LuMousePointerClick size={16}  className="text-gray-200" /> Context Menu
        </div>
        <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-200 rounded-lg overflow-hidden">
          {["Open link in new tab", "Save link as…", "Copy link address"].map(
            (t) => (
              <div
                key={t}
                className="px-4 py-2.5 text-sm text-slate-400 border-b border-slate-700 dark:border-slate-700 light:border-slate-200"
              >
                {t}
              </div>
            )
          )}
          <div className="px-4 py-2.5 text-sm bg-blue-600/20 text-blue-400 font-bold flex items-center gap-2">
            <img src="/logo.png" alt="Link Wash Logo" className="w-4 h-4" />
            Copy clean link
          </div>
        </div>
        <div className="mt-3.5 text-xs text-slate-400">
          3 tracking params stripped instantly
        </div>
      </div>
    );
  }
  if (step === 1) {
    return (
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex items-center justify-center">
            <img src="/logo.png" alt="Link Wash Logo" className="w-4 h-4" />
          </div>
          <span className="font-bold">Link Wash</span>
        </div>
        <div className="text-xs text-slate-400 mb-1.5">
          Paste a link to clean it
        </div>
        <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-blue-600/40 rounded-lg px-3 py-2.5 font-mono text-xs text-slate-400 break-all shadow-[0_0_0_3px_rgba(37,99,235,0.1)]">
          https://example.com/page?
          <span className="text-red-300">utm_source=newsletter</span>&
          <span className="text-red-300">fbclid=IwAR3x</span>
        </div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div>
        <div className="text-xs font-bold text-slate-400 mb-3.5 uppercase tracking-wider">
          Removed Parameters
        </div>
        <div className="flex flex-col gap-2">
          {[
            { k: "utm_source", d: "Identifies which site sent the click" },
            { k: "fbclid", d: "Facebook click identifier" },
          ].map((r) => (
            <div
              key={r.k}
              className="bg-red-600/8 border border-red-600/20 rounded-lg p-3 flex items-center justify-between"
            >
              <div>
                <div className="font-mono text-sm text-red-300 font-semibold">
                  {r.k}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{r.d}</div>
              </div>
              <div className="w-10 h-5 bg-slate-600/10 dark:bg-slate-400/10 rounded-full relative">
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-slate-400 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="text-center py-5">
      <div className="w-16 h-16 bg-green-600/15 border-2 border-green-600/40 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiCheckCircle size={28} className="text-green-500" />
      </div>
      <div className="font-bold text-base mb-2">Link copied!</div>
      <div className="text-sm text-slate-400 mb-4">
        3 tracking parameters removed
      </div>
      <div className=" border border-green-600/20 rounded-lg p-3 font-mono text-base text-green-300 break-all">
        https://example.com/page
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToStep = useCallback(
    (index: number) => {
      if (index === currentStep) return;
      setCurrentStep(index);
    },
    [currentStep]
  );

  const next = useCallback(() => {
    goToStep((currentStep + 1) % STEPS.length);
  }, [currentStep, goToStep]);

  const prev = useCallback(() => {
    goToStep((currentStep - 1 + STEPS.length) % STEPS.length);
  }, [currentStep, goToStep]);

  // Auto-advance timer
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(next, STEP_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStep, next]);

  return (
    <section
      id="how"
      className="bg-gray-200 dark:bg-slate-800 border-t border-b border-slate-200 dark:border-slate-700/60 px-5 md:px-20 py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left side: Carousel */}
        <Reveal>
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-blue-500 dark:text-blue-400 text-sm font-semibold uppercase tracking-wider mb-4">
              <FiShare2 size={14} /> How it works
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
              Clean links in
              <br />
              two simple ways.
            </h2>
            <p className="mt-4 text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-lg">
              No setup, no accounts. Just install and instantly start sharing
              cleaner links.
            </p>
          </div>

          {/* Carousel container */}
          <div className="relative overflow-hidden rounded-2xl border-none">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentStep * 100}%)` }}
            >
              {STEPS.map((step, i) => (
                <div key={i} className="w-full shrink-0 px-6 py-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full px-4 flex items-center justify-center font-extrabold text-base bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700">
              <div
                key={currentStep}
                className="h-full bg-transparent rounded-r-full transition-all duration-300"
                style={{
                  width: "100%",
                  animation: `shrinkWidth ${STEP_DURATION}ms linear forwards`,
                }}
              />
            </div>
          </div>

          {/* Dots and navigation */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToStep(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === currentStep
                      ? "bg-blue-600 w-8"
                      : "bg-slate-400 dark:bg-slate-500 hover:bg-slate-500 dark:hover:bg-slate-400"
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="p-2 rounded-full border bg-black border-slate-300 dark:border-slate-600 text-slate-50 hover:text-[#2563eb] transition-colors"
                aria-label="Previous step"
              >
                <FiChevronLeft size={22} />
              </button>
              <button
                onClick={next}
                className="p-2 rounded-full border bg-black border-slate-300 dark:border-slate-600 text-slate-50 hover:text-[#2563eb] transition-colors"
                aria-label="Next step"
              >
                <FiChevronRight size={22} />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Right side: Preview */}
        <div className="sticky top-28">
          <Reveal>
            <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-slate-100 dark:bg-slate-700/40 px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                  Link Wash Extension
                </span>
              </div>
              <div className="p-6 min-h-80">
                <StepPreview step={currentStep} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    
    </section>
  );
}