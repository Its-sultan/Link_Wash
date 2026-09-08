
"use client";

import { useState, useEffect } from "react";
import { HeroVisual } from "./HeroVisual";

const HEADLINE_WORDS = [
  "clean links.",
  "private links.",
  "clean URLs.",
  "safer links.",
  "zero clutter.",
];

const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "fbclid",
  "gclid",
  "igshid",
  "mc_eid",
  "msclkid",
];

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [swapping, setSwapping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSwapping(true);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % HEADLINE_WORDS.length);
        setSwapping(false);
      }, 350);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-16 px-5 md:px-20 pt-28 pb-20 relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_60%_at_70%_50%,rgba(37,99,235,0.12)_0%,transparent_70%),radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(59,130,246,0.07)_0%,transparent_60%)]" />
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      

      {/* Left side */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight min-h-[2.4em] md:min-h-[2.2em]">
          Share{" "}
          <span className="relative inline-block align-top overflow-hidden">
            <span
              className={`inline-block text-blue-400 transition-all duration-350 ease-out ${
                swapping
                  ? "opacity-0 -translate-y-3 blur-[2px]"
                  : "opacity-100 translate-y-0 blur-0"
              }`}
            >
              {HEADLINE_WORDS[wordIndex]}
            </span>
          </span>
          <br />
          Not tracking tags.
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-slate-400 -400 max-w-xl">
          Tracking parameters clutter the links you share. Link Wash strips them
          all{" "}
          <strong className="text-gray-500 light:text-slate-900">
            instantly, locally, privately
          </strong>{" "}
          without breaking the link.
        </p>

        {/* Tracking params  */}
        <div className="mt-8 relative max-w-xl overflow-hidden">
          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm flex-wrap whitespace-nowrap">
            <span className="text-zinc-600">&gt;</span>
            <span className="text-zinc-400">stripped:</span>
            <div className="flex items-center gap-3 text-zinc-600 flex-wrap">
              {TRACKED_PARAMS.map((p) => (
                <span key={p} className="line-through decoration-red-500/50">
                  {p}
                </span>
              ))}
            </div>
            <span className="w-0.5 h-4 bg-red-400 animate-[blink_1s_step-end_infinite]" />
          </div>
        </div>
      </div>

      {/* Right side – alternates LinkReveal / Blob every two days */}
      <HeroVisual />
    </section>
  );
}