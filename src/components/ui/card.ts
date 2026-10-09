/*
  The look shared by every card on the site (projects, achievements).
  Kept as class strings, not a component, because the cards are different
  elements: a project card is a <button>, an achievement card is an <a> or
  an <article>.
*/

/** The panel itself: surface colour, border, rounded corners. */
export const cardSurface =
  "rounded-lg border border-border bg-surface transition-colors duration-300";

/** Added to cards that do something when clicked: the border lights up. */
export const cardInteractive = "hover:border-accent focus-visible:border-accent";
