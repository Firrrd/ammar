/**
 * The logic of a typewriter that types a phrase, pauses, deletes it and
 * moves on to the next. Pure: given where it is, it says where it goes
 * next and how long to wait first. The component only supplies the timer.
 */

export type TypewriterState = {
  /** Which phrase is being shown. */
  phrase: number;
  /** How many of its characters are visible. */
  shown: number;
  deleting: boolean;
};

export const TYPEWRITER_START: TypewriterState = { phrase: 0, shown: 0, deleting: false };

export const TYPEWRITER_TIMING = {
  type: 55, // between typed characters
  hold: 1800, // a finished phrase stays on screen
  erase: 28, // between deleted characters
  gap: 350, // empty line before the next phrase
} as const;

/** The next state, and the wait in milliseconds before moving to it. */
export function typewriterStep(
  state: TypewriterState,
  phrases: readonly string[],
): { next: TypewriterState; delay: number } {
  const length = phrases[state.phrase].length;

  if (!state.deleting) {
    if (state.shown < length) {
      return { next: { ...state, shown: state.shown + 1 }, delay: TYPEWRITER_TIMING.type };
    }
    return { next: { ...state, deleting: true }, delay: TYPEWRITER_TIMING.hold };
  }

  if (state.shown > 0) {
    return { next: { ...state, shown: state.shown - 1 }, delay: TYPEWRITER_TIMING.erase };
  }
  return {
    next: { phrase: (state.phrase + 1) % phrases.length, shown: 0, deleting: false },
    delay: TYPEWRITER_TIMING.gap,
  };
}
