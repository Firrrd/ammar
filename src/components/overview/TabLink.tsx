"use client";

import type { ReactNode } from "react";
import { useActiveTab } from "@/components/tabs/useActiveTab";
import type { TabId } from "@/lib/tabs";

/** A small text button that switches to another tab, such as "view all →". */
export function TabLink({ tab, children }: { tab: TabId; children: ReactNode }) {
  const [, selectTab] = useActiveTab();
  return (
    <button
      type="button"
      onClick={() => selectTab(tab)}
      // py-1 makes the tappable area 24px tall; -my-1 stops that moving the heading.
      className="-my-1 py-1 text-xs text-text-dim transition-colors hover:text-text-primary"
    >
      {children}
    </button>
  );
}
