import { useEffect, useState } from "react";
import { Blob } from "./Blob";
import { LinkReveal } from "./LinkReveal";

/**
 * The hero artwork alternates on a fixed rhythm: two days of <LinkReveal />,
 * then two days of <Blob />, repeating forever from the anchor date below.
 */
const CYCLE_START = new Date(2026, 8, 8); // 8 Sep 2026 — first LinkReveal day
const PHASE_DAYS = 2;
const CYCLE_DAYS = PHASE_DAYS * 2;
const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** True on the first two days of each four-day cycle. */
function showsLinkReveal(now: Date = new Date()) {
  // Rounding keeps the count whole across daylight-saving shifts.
  const days = Math.round((startOfDay(now).getTime() - CYCLE_START.getTime()) / DAY_MS);
  const phase = ((days % CYCLE_DAYS) + CYCLE_DAYS) % CYCLE_DAYS;
  return phase < PHASE_DAYS;
}

export function HeroVisual() {
  const [linkReveal, setLinkReveal] = useState(() => showsLinkReveal());

  // Re-check just after midnight so a long-open tab flips on schedule.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const scheduleNextCheck = () => {
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
      timer = setTimeout(() => {
        setLinkReveal(showsLinkReveal());
        scheduleNextCheck();
      }, nextMidnight.getTime() - now.getTime());
    };

    scheduleNextCheck();
    return () => clearTimeout(timer);
  }, []);

  return linkReveal ? <LinkReveal /> : <Blob />;
}
