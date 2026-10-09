import type { ReactNode } from "react";

type SectionHeadingProps = {
  children: ReactNode;
  /** Small note on the right, such as a count. Keep it informative, not an instruction: labels like "click to expand" get mistaken for buttons. */
  hint?: ReactNode;
};

export function SectionHeading({ children, hint }: SectionHeadingProps) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-text-dim">
        {children}
      </h2>
      {hint && (
        <span className="text-xs text-text-dim">{hint}</span>
      )}
    </div>
  );
}
