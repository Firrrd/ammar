"use client";

import { useEffect, useState } from "react";
import { TYPEWRITER_START, typewriterStep } from "@/lib/typewriter";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/** The banner's greeting, typed out and deleted one phrase after another. */
export function Greeting({ phrases }: { phrases: readonly string[] }) {
  const reducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState(TYPEWRITER_START);

  // Each change of state schedules the next one. typewriterStep decides
  // what comes next and how long to wait; this only runs the timer.
  useEffect(() => {
    if (reducedMotion) return;
    const { next, delay } = typewriterStep(state, phrases);
    const timer = setTimeout(() => setState(next), delay);
    return () => clearTimeout(timer);
  }, [state, phrases, reducedMotion]);

  // With reduced motion: the first phrase, complete and still.
  const text = reducedMotion ? phrases[0] : phrases[state.phrase].slice(0, state.shown);

  return (
    // On phones the text size follows the screen width (4.4vw, capped at 18px),
    // so a greeting of up to 32 characters stays on one line on any phone and
    // never wraps down onto the avatar. A test enforces the 32.
    <p className="mt-1 min-h-[1.4em] whitespace-nowrap font-mono text-[min(1.125rem,4.4vw)] leading-snug sm:text-3xl lg:text-4xl">
      {/* Screen readers get the greeting once, in full, instead of letter by letter. */}
      <span className="sr-only">{phrases.join(" ")}</span>
      <span aria-hidden="true">
        <span className="opacity-50">&gt; </span>
        {text}
        <span className="caret ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.12em] bg-current" />
      </span>
    </p>
  );
}
