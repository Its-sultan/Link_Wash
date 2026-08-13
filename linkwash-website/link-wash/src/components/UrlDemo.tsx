import { useState, useRef } from "react";
import {
  FiSettings,
  FiClipboard,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { TRACKING, SAFE, Reveal } from "../shared/shared";
import type { CleanUrlOutput, DemoFeature, TrackingParam } from "../types";
import { SiAnswer } from "react-icons/si";
import { VscDeveloperTools } from "react-icons/vsc";
import { RiResetRightLine } from "react-icons/ri";


const EXAMPLE_URL =
  "https://example.com/article?id=42&utm_source=newsletter&utm_medium=email&utm_campaign=launch&fbclid=IwAR3x_abc123def456&gclid=CjwKCAiA7Y2k&lang=en";

function cleanTheUrl(raw: string): CleanUrlOutput {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { status: 'invalid' };
  }
  
  const removed: TrackingParam[] = [];
  
  Array.from(url.searchParams.keys()).forEach((key) => {
    const match = TRACKING.find((p) => p.key === key);
    if (match && !SAFE.has(key)) {
      url.searchParams.delete(key);
      removed.push(match);
    }
  });
  
  return { 
    status: 'ok',
    cleaned: url.toString(), 
    removed,
    raw
  };
}

function BeforeUrl({
  raw,
  removedKeys,
}: {
  raw: string;
  removedKeys: Set<string>;
}) {
  const parts = raw.split("?");
  if (parts.length < 2) return <>{raw}</>;
  const paramParts = parts[1].split("&");
  return (
    <>
      {parts[0]}?
      {paramParts.map((part, i) => {
        const key = part.split("=")[0];
        const isTracking = removedKeys.has(key);
        return (
          <span key={i}>
            {i > 0 && <span className="text-slate-400">&amp;</span>}
            <span
              className={isTracking ? "line-through text-red-300" : undefined}
            >
              {part}
            </span>
          </span>
        );
      })}
    </>
  );
}

export function UrlDemo() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CleanUrlOutput>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

 const runDemo = (raw?: string) => {
  const value = (raw ?? input).trim();
  if (!value) {
    setResult({ status: "empty" });
    return;
  }
  
  const out = cleanTheUrl(value);
  
  if (out && out.status === "invalid") {
    setResult({ status: "invalid" });
    return;
  }
  
  if (out && out.status === "ok") {
    setResult(out);
    setCopied(false);
  }
};

  const loadExample = () => {
    setInput(EXAMPLE_URL);
    runDemo(EXAMPLE_URL);
  };

    const resetDemo = () => {
    setInput("");
    setResult(null);
    setCopied(false);
    if (copyTimer.current) {
      clearTimeout(copyTimer.current);
      copyTimer.current = null;
    }
  };

  const copyClean = () => {
    if (!result || result.status !== "ok") return;
    navigator.clipboard?.writeText(result.cleaned).then(() => {
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    });
  };

 const removedKeys: Set<string> = new Set<string>(
  result?.status === "ok" ? result.removed.map((r) => r.key) : []
);

  const features: DemoFeature[] = [
    {
      icon: <VscDeveloperTools size={24} />,
      title: "100% local processing",
      body: "Every character of your URL stays on your device. Watch DevTools Network, you'll see zero requests made.",
    },
    {
      icon: <SiAnswer size={22} />,
      title: "Instant results",
      body: "No round trips, no waiting. The cleaned URL appears the millisecond you click because it's just string manipulation, not a network call.",
    },
    {
      icon: <FiSettings size={22} />,
      title: "Toggle any param",
      body: "Each removed parameter can be restored individually. Changed your mind about keeping utm_content? One click brings it back.",
    },
  ];

  return (
    <section id="demo" className="px-5 md:px-20 py-24 relative">
      <Reveal
        as="h2"
        className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-14"
      >
        See Link Wash in action.
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <Reveal className="relative z-10">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4 mb-6">
              <div className=" shrink-0 flex items-center justify-center mt-2 text-blue-400">
                {f.icon}
              </div>
              <div>
                <h4 className="text-base font-bold mb-1.5">{f.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal className="bg-slate-800  border-none rounded-3xl p-8 relative max-h-85 overflow-y-auto">

         <button
            onClick={resetDemo}
            className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700/50"
            aria-label="Reset"
          >
            <RiResetRightLine size={20} />
          </button>

          <div className="flex items-center gap-3 mb-7">
            <div className="shrink-0 flex items-center justify-center">
              <img src="/logo.png" alt="Link Wash" className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-base text-white">Link Wash</div>
              <div className="text-xs text-slate-400">
                Paste a link to clean it
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-400 mb-2 font-medium">
            URL with tracking parameters
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com/article?utm_source=newsletter&utm_medium=email&fbclid=IwAR3x_abc123&id=42"
            className="w-full bg-slate-900 dark:bg-slate-900 light:bg-slate-50 border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-lg px-4 py-3 text-white dark:text-white light:text-slate-900 font-mono text-sm resize-none outline-none focus:border-blue-600 min-h-18"
          />

          <div className="flex gap-2.5 mt-3">
            <button
              onClick={() => runDemo()}
              className="bg-blue-600 text-white border-none cursor-pointer px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors"
            >
              Clean URL
            </button>
            <button
              onClick={loadExample}
              className="bg-slate-600/10 dark:bg-slate-400/10 text-slate-400 border-none cursor-pointer px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-600/20 dark:hover:bg-slate-400/20 transition-colors"
            >
              Load example
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-400 min-h-4.5">
            {result?.status === "empty" && "Paste a URL above first."}
            {result?.status === "invalid" &&
              "That doesn't look like a valid URL — make sure it starts with https://"}
            {result?.status === "ok" &&
              (result.removed.length > 0
                ? `Removed ${result.removed.length} tracking parameter${result.removed.length > 1 ? "s" : ""}.`
                : "This URL is already clean.")}
          </p>

          {result !== null && result.status === "ok" && (
  <div>
    <div className="mb-4">
      <div className="text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
        Original
      </div>
      <div className="bg-red-600/8 border border-red-600/20 rounded-lg px-3.5 py-3 font-mono text-xs leading-relaxed break-all text-slate-200">
        <BeforeUrl raw={(result as any).raw} removedKeys={removedKeys} />
      </div>
    </div>
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
                  Cleaned
                </div>
                <div className="bg-green-600/8 border border-green-600/20 rounded-lg px-3.5 py-3 font-mono text-xs leading-relaxed break-all text-green-300">
                  {result.cleaned}
                </div>
              </div>
              <div className="mt-4">
                {result.removed.length > 0 ? (
                  <>
                    <div className="text-sm font-semibold text-slate-400 mb-2.5">
                      {result.removed.length} tracking parameter
                      {result.removed.length > 1 ? "s" : ""} removed
                    </div>
                    {result.removed.map((r) => (
                      <span
                        key={r.key}
                        className="inline-flex items-center gap-1.5 bg-red-600/10 border border-red-600/20 text-red-300 px-2.5 py-1 rounded-full text-xs font-mono m-1"
                      >
                        <FiAlertCircle size={12} /> {r.key} — {r.explanation}
                      </span>
                    ))}
                  </>
                ) : (
                  <div className="text-sm text-slate-400 mt-2">
                    <FiCheckCircle className="inline mr-2" size={16} />
                    No tracking parameters found — this URL is already clean!
                  </div>
                )}
              </div>
              <button
                onClick={copyClean}
                className={`w-full mt-4 text-white border-none cursor-pointer px-3 py-3 rounded-lg text-sm font-semibold transition-all ${
                  copied
                    ? "bg-green-600 shadow-[0_0_24px_rgba(22,163,74,0.3)]"
                    : "bg-blue-600 shadow-[0_0_24px_rgba(37,99,235,0.3)] hover:bg-blue-700"
                }`}
              >
                {copied ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiCheckCircle size={16} /> Copied!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FiClipboard size={16} /> Copy clean link
                  </span>
                )}
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
