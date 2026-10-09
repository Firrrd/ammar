"use client";

import { useLayoutEffect, useRef, type KeyboardEvent } from "react";
import { TABS, tabForKey, type TabId } from "@/lib/tabs";

type TabBarProps = {
  activeTab: TabId;
  onSelect: (tab: TabId) => void;
};

export function TabBar({ activeTab, onSelect }: TabBarProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const positioned = useRef(false);

  // Moves the underline under the active tab. It writes to the element's style
  // directly instead of through React state, so the bar is not re-rendered
  // just to move a line.
  useLayoutEffect(() => {
    const list = listRef.current;
    const underline = underlineRef.current;
    if (!list || !underline) return;

    const place = () => {
      const tab = list.querySelector<HTMLElement>(`[data-tab="${activeTab}"]`);
      if (!tab) return;
      // The first placement jumps straight there; later ones slide.
      underline.style.transitionDuration = positioned.current ? "" : "0s";
      // Sit under the label text only, not the tab's padding, so the first
      // tab's underline lines up with the logo and page edge.
      const { paddingLeft, paddingRight } = getComputedStyle(tab);
      const left = tab.offsetLeft + parseFloat(paddingLeft);
      const width = tab.offsetWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
      underline.style.transform = `translateX(${left}px)`;
      underline.style.width = `${width}px`;
      positioned.current = true;
    };

    place();
    // Tabs change size when the web font finishes loading or the window
    // resizes; re-measure whenever any tab's size changes.
    const observer = new ResizeObserver(place);
    list.querySelectorAll("[data-tab]").forEach((tab) => observer.observe(tab));
    return () => observer.disconnect();
  }, [activeTab]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = tabForKey(activeTab, event.key);
    if (!next) return;
    event.preventDefault();
    onSelect(next);
    listRef.current?.querySelector<HTMLElement>(`[data-tab="${next}"]`)?.focus();
  }

  return (
    <div className="sticky top-14 z-30 border-b border-border bg-bg/85 backdrop-blur-md">
      <div
        ref={listRef}
        role="tablist"
        aria-label="Profile sections"
        onKeyDown={handleKeyDown}
        className="no-scrollbar relative flex overflow-x-auto px-page"
      >
        {TABS.map((tab) => {
          const selected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              data-tab={tab.id}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              // Only the active tab is a Tab-key stop; arrows move between tabs.
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(tab.id)}
              className={`shrink-0 whitespace-nowrap px-3.5 py-3 text-sm transition-colors first:-ml-3.5 ${
                selected
                  ? "font-medium text-text-primary"
                  : "text-text-dim hover:text-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
        <span
          ref={underlineRef}
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-0.5 rounded-full bg-accent transition-[transform,width] duration-300 ease-out"
        />
      </div>
    </div>
  );
}
