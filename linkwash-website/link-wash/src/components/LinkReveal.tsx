import { useEffect, useMemo, useRef } from "react";
import { LottieLight } from "lottie-react";
import type { LottieHandle } from "lottie-react";
import rawAnimation from "../assets/link-reveal.json";

/* Minimal shape of the bits of the Lottie document we touch. */
type LottieShape = { ty?: string; c?: { k?: number[] }; it?: LottieShape[] };
type LottieLayer = { nm?: string; shapes?: LottieShape[] };
type LottieDocument = { layers?: LottieLayer[]; assets?: { layers?: LottieLayer[] }[] };

/** The layer holding the rectangle that sits between the two link halves. */
const CENTER_LAYER = "center";
const BLACK = [0, 0, 0, 1];
/** Beat between loops so the reveal reads as a gesture, not a flicker. */
const REPLAY_DELAY_MS = 1100;

function paintShapesBlack(shapes: LottieShape[]) {
  shapes.forEach((shape) => {
    if ((shape.ty === "fl" || shape.ty === "st") && shape.c) {
      shape.c.k = [...BLACK];
    }
    if (shape.it) paintShapesBlack(shape.it);
  });
}

/** Recolours only the middle rectangle to black, leaving the brand blue elsewhere. */
function withBlackCenter(source: LottieDocument): LottieDocument {
  const doc = structuredClone(source);
  const layerGroups = [doc.layers ?? [], ...(doc.assets ?? []).map((asset) => asset.layers ?? [])];

  layerGroups.forEach((layers) =>
    layers.forEach((layer) => {
      if (layer.nm === CENTER_LAYER && layer.shapes) paintShapesBlack(layer.shapes);
    })
  );

  return doc;
}

interface LinkRevealProps {
  className?: string;
}

export function LinkReveal({ className = "" }: LinkRevealProps) {
  const lottieRef = useRef<LottieHandle>(null);
  const animationData = useMemo(
    () => withBlackCenter(rawAnimation as unknown as LottieDocument),
    []
  );

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const replayTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(replayTimer.current), []);

  const handleComplete = () => {
    if (reducedMotion) return;
    replayTimer.current = setTimeout(() => {
      lottieRef.current?.seek(0);
      lottieRef.current?.play();
    }, REPLAY_DELAY_MS);
  };

  return (
    <div
      className={`relative z-10 flex items-center justify-center h-64 sm:h-80 md:h-100 lg:h-125 ${className}`}
    >
      <div className="relative flex items-center justify-center w-64 sm:w-72 md:w-90 lg:w-110 h-64 sm:h-72 md:h-90 lg:h-110">
        {/* Soft blue halo, same visual weight as the blob it alternates with */}
        <div className="absolute w-48 sm:w-56 md:w-72 lg:w-90 h-48 sm:h-56 md:h-72 lg:h-90 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.20)_0%,rgba(37,99,235,0.08)_45%,transparent_70%)] blur-2xl" />

        <div className="relative w-48 sm:w-56 md:w-72 lg:w-90 h-48 sm:h-56 md:h-72 lg:h-90 animate-[floatSlow_6s_ease-in-out_infinite] motion-reduce:animate-none">
          {/* Light build: this file uses no expressions, so it needs no eval engine. */}
          <LottieLight
            lottieRef={lottieRef}
            src={animationData}
            loop={false}
            autoplay={!reducedMotion}
            subscriptions={{ complete: handleComplete }}
            rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
            className="w-full h-full"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
