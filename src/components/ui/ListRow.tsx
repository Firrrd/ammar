import type { ReactNode } from "react";
import { LuChevronRight } from "react-icons/lu";

type ListRowProps = {
  /** The marker at the start of the row: a dot, a number or a monogram tile. */
  lead?: ReactNode;
  title: ReactNode;
  /** Lets a long title run to two lines instead of being cut off after one. */
  wrapTitle?: boolean;
  /** One line under the title, cut off with "…" if too long. */
  sub?: ReactNode;
  /** Small right-aligned note, hidden on phones. */
  meta?: ReactNode;
  /** Makes the row a button. */
  onClick?: () => void;
  /** Makes the row a link that opens in a new tab. */
  href?: string;
  /** For rows that open and close: whether it is open now. Turns the chevron. */
  expanded?: boolean;
  /** The id of the region this row opens and closes, for screen readers. */
  controls?: string;
};

const layout = "-mx-3 flex w-[calc(100%+1.5rem)] items-center gap-3 rounded-lg px-3 py-2.5 text-left";
const interactive = "group transition-colors hover:bg-elevated/70";

/*
  The site's main list building block. What it renders as depends on what
  it is given: a <button> with onClick, an <a> with href, or a plain <div>
  with neither. Only the first two get the hover effect and the chevron.
*/
export function ListRow({
  lead,
  title,
  wrapTitle = false,
  sub,
  meta,
  onClick,
  href,
  expanded,
  controls,
}: ListRowProps) {
  const isInteractive = Boolean(onClick || href);

  // Spans throughout, because a <button> may only contain inline elements.
  const content = (
    <>
      {lead && <span className="flex shrink-0 items-center">{lead}</span>}
      <span className="min-w-0 flex-1">
        <span
          className={`text-[15px] font-medium leading-snug text-text-primary ${
            wrapTitle ? "line-clamp-2" : "block truncate"
          }`}
        >
          {title}
        </span>
        {sub && <span className="block truncate text-[13px] text-text-dim">{sub}</span>}
      </span>
      {meta && (
        <span className="hidden shrink-0 font-mono text-[11px] text-text-dim sm:block">{meta}</span>
      )}
      {isInteractive && (
        <LuChevronRight
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 text-text-dim transition-transform duration-300 group-hover:text-text-primary ${
            expanded === undefined
              ? "group-hover:translate-x-0.5" // nudges right, hinting "go"
              : expanded
                ? "rotate-90" // points down while open
                : ""
          }`}
        />
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-expanded={expanded}
        aria-controls={controls}
        className={`${layout} ${interactive}`}
      >
        {content}
      </button>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${layout} ${interactive}`}>
        {content}
      </a>
    );
  }

  return <div className={layout}>{content}</div>;
}
