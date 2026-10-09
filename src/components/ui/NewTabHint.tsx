/**
 * Tells screen-reader users that a link opens in a new tab. Sighted users
 * see the ↗ or the browser's own cue; this text is never shown on screen.
 */
export function NewTabHint() {
  return <span className="sr-only"> (opens in a new tab)</span>;
}
