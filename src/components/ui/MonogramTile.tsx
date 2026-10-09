type MonogramTileProps = {
  /** Two letters. */
  children: string;
  /** Brighter text, used for the most recent entry in a list. */
  current?: boolean;
};

/** The small square with two letters that starts an education or activity row. */
export function MonogramTile({ children, current = false }: MonogramTileProps) {
  return (
    <span
      aria-hidden="true"
      className={`block h-8 w-8 rounded-md border border-border bg-surface text-center text-[11px] font-medium leading-8 ${
        current ? "text-text-primary" : "text-text-dim"
      }`}
    >
      {children}
    </span>
  );
}
