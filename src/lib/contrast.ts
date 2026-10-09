/**
 * WCAG 2.1 contrast maths.
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */

/** Relative luminance of a "#rrggbb" colour: 0 is black, 1 is white. */
export function luminance(hex: string): number {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) throw new Error(`Expected a #rrggbb colour, got "${hex}"`);

  const [r, g, b] = [0, 2, 4].map((start) => {
    const channel = parseInt(match[1].slice(start, start + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two colours, from 1 (identical) to 21 (black on white). */
export function contrastRatio(a: string, b: string): number {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}
