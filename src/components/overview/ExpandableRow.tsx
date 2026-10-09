"use client";

import { useId, useState, type ReactNode } from "react";
import { ListRow } from "@/components/ui/ListRow";

type ExpandableRowProps = {
  lead?: ReactNode;
  title: ReactNode;
  wrapTitle?: boolean;
  sub?: ReactNode;
  meta?: ReactNode;
  /** What unfolds beneath the row. */
  children: ReactNode;
};

/** A list row that opens and closes to show more detail beneath it. */
export function ExpandableRow({ children, ...row }: ExpandableRowProps) {
  const [open, setOpen] = useState(false);
  const regionId = useId();

  return (
    <div>
      <ListRow {...row} expanded={open} controls={regionId} onClick={() => setOpen(!open)} />
      {/*
        Height cannot be animated to "auto", so the content sits in a grid row
        that animates between 0fr (no height) and 1fr (its natural height).
        The inner element hides what overflows while the row is shrinking.
        "inert" keeps closed content away from keyboards and screen readers.
      */}
      <div
        id={regionId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {/* pl-11 lines the detail up with the row's title, past the 32px tile. */}
          <div className="pb-4 pl-11 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
