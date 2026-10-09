import { describe, expect, it } from "vitest";
import {
  TYPEWRITER_START,
  TYPEWRITER_TIMING,
  typewriterStep,
  type TypewriterState,
} from "@/lib/typewriter";

const phrases = ["Hi", "Yo!"];

describe("typewriterStep", () => {
  it("types one more character at a time", () => {
    const { next, delay } = typewriterStep(TYPEWRITER_START, phrases);
    expect(next).toEqual({ phrase: 0, shown: 1, deleting: false });
    expect(delay).toBe(TYPEWRITER_TIMING.type);
  });

  it("holds a finished phrase, then starts deleting", () => {
    const { next, delay } = typewriterStep({ phrase: 0, shown: 2, deleting: false }, phrases);
    expect(next).toEqual({ phrase: 0, shown: 2, deleting: true });
    expect(delay).toBe(TYPEWRITER_TIMING.hold);
  });

  it("deletes one character at a time", () => {
    const { next, delay } = typewriterStep({ phrase: 0, shown: 2, deleting: true }, phrases);
    expect(next).toEqual({ phrase: 0, shown: 1, deleting: true });
    expect(delay).toBe(TYPEWRITER_TIMING.erase);
  });

  it("moves to the next phrase once the line is empty", () => {
    const { next, delay } = typewriterStep({ phrase: 0, shown: 0, deleting: true }, phrases);
    expect(next).toEqual({ phrase: 1, shown: 0, deleting: false });
    expect(delay).toBe(TYPEWRITER_TIMING.gap);
  });

  it("wraps from the last phrase back to the first", () => {
    const { next } = typewriterStep({ phrase: 1, shown: 0, deleting: true }, phrases);
    expect(next.phrase).toBe(0);
  });

  it("shows every phrase in full, in order, and loops", () => {
    let state: TypewriterState = TYPEWRITER_START;
    const completed: string[] = [];
    for (let i = 0; i < 40; i++) {
      const { next } = typewriterStep(state, phrases);
      // The step that flips to "deleting" is the moment a phrase is complete.
      if (next.deleting && !state.deleting) completed.push(phrases[state.phrase].slice(0, state.shown));
      state = next;
    }
    expect(completed.slice(0, 3)).toEqual(["Hi", "Yo!", "Hi"]);
  });

  it("never shows more characters than the phrase has, or fewer than none", () => {
    let state: TypewriterState = TYPEWRITER_START;
    for (let i = 0; i < 200; i++) {
      state = typewriterStep(state, phrases).next;
      expect(state.shown).toBeGreaterThanOrEqual(0);
      expect(state.shown).toBeLessThanOrEqual(phrases[state.phrase].length);
    }
  });
});
