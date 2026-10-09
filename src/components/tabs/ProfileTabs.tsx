"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { TabBar } from "@/components/tabs/TabBar";
import { useActiveTab } from "@/components/tabs/useActiveTab";
import type { TabId } from "@/lib/tabs";

const TOP_BAR_HEIGHT = 56;

type ProfileTabsProps = {
  /** The content of each tab. Built on the server and passed in. */
  panels: Record<TabId, ReactNode>;
};

export function ProfileTabs({ panels }: ProfileTabsProps) {
  const [activeTab, selectTab] = useActiveTab();
  const sectionRef = useRef<HTMLDivElement>(null);

  // When the tab changes and the reader has scrolled down into a long tab,
  // bring the new tab's start into view instead of leaving them halfway down
  // it. This runs however the tab changed: the tab bar, a highlight row, a
  // "view all" link or the Back button.
  const previousTab = useRef(activeTab);
  useEffect(() => {
    if (previousTab.current === activeTab) return;
    previousTab.current = activeTab;
    const section = sectionRef.current;
    if (section && section.getBoundingClientRect().top < TOP_BAR_HEIGHT) {
      window.scrollTo({ top: section.offsetTop - TOP_BAR_HEIGHT, behavior: "smooth" });
    }
  }, [activeTab]);

  return (
    <div ref={sectionRef} className="mt-6">
      <TabBar activeTab={activeTab} onSelect={selectTab} />
      <div
        key={activeTab}
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="panel-in min-h-[50vh] py-8 px-page"
      >
        {panels[activeTab]}
      </div>
    </div>
  );
}
