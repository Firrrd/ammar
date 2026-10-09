import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio, luminance } from "@/lib/contrast";

describe("contrast maths", () => {
  it("gives black and white the extreme luminances", () => {
    expect(luminance("#000000")).toBe(0);
    expect(luminance("#ffffff")).toBeCloseTo(1);
  });

  it("gives black on white the maximum ratio of 21", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21);
  });

  it("does not depend on argument order", () => {
    expect(contrastRatio("#0a1628", "#f7f7f7")).toBe(
      contrastRatio("#f7f7f7", "#0a1628"),
    );
  });

  it("rejects anything that is not #rrggbb", () => {
    expect(() => luminance("navy")).toThrow();
  });
});

/**
 * Reads the real tokens out of globals.css, so changing a colour there
 * and breaking readability fails this test.
 */
function readTokens(): Record<string, string> {
  const css = readFileSync("src/app/globals.css", "utf8");
  const tokens: Record<string, string> = {};
  for (const [, name, value] of css.matchAll(
    /--color-([a-z-]+):\s*(#[0-9a-f]{6})\s*;/gi,
  )) {
    tokens[name] = value;
  }
  return tokens;
}

describe("the light banner", () => {
  it("keeps its dimmed label readable: navy at 70% over off-white", () => {
    const tokens = readTokens();
    // Blend 70% navy with 30% off-white to get the colour actually seen.
    const mix = (index: number) =>
      Math.round(
        0.7 * parseInt(tokens.bg.slice(index, index + 2), 16) +
          0.3 * parseInt(tokens.accent.slice(index, index + 2), 16),
      )
        .toString(16)
        .padStart(2, "0");
    const seen = `#${mix(1)}${mix(3)}${mix(5)}`;
    expect(contrastRatio(seen, tokens.accent)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("theme colours meet WCAG AA (4.5:1) for text", () => {
  const tokens = readTokens();
  const AA = 4.5;

  const pairs: [text: string, background: string][] = [
    ["text-primary", "bg"],
    ["text-primary", "surface"],
    ["text-primary", "elevated"],
    ["text-secondary", "bg"],
    ["text-secondary", "surface"],
    ["text-secondary", "elevated"],
    ["text-dim", "bg"],
    ["text-dim", "surface"],
    ["text-dim", "elevated"],
    ["accent", "bg"],
    // Error messages in the contact form, which sits on the surface colour.
    ["red", "surface"],
    ["red", "bg"],
    // Dark text on the accent fill: filled buttons and hovered outline buttons.
    ["bg", "accent"],
  ];

  it.each(pairs)("%s on %s", (text, background) => {
    expect(tokens[text], `token --color-${text} not found`).toBeDefined();
    expect(tokens[background], `token --color-${background} not found`).toBeDefined();
    expect(contrastRatio(tokens[text], tokens[background])).toBeGreaterThanOrEqual(AA);
  });
});
