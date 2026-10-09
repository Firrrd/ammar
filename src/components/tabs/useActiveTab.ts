"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_TAB, hashForTab, tabFromHash, type TabId } from "@/lib/tabs";

/**
 * history.pushState changes the URL without firing any event, so after
 * calling it we fire this one ourselves to tell the page to re-read the hash.
 */
const TAB_CHANGE = "tabchange";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange); // back and forward buttons
  window.addEventListener("hashchange", onChange); // hash edited by hand
  window.addEventListener(TAB_CHANGE, onChange); // our own pushState
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(TAB_CHANGE, onChange);
  };
}

/**
 * The active tab, stored in the URL hash (/#projects), so a tab can be linked
 * to directly and the back button moves between tabs.
 */
export function useActiveTab(): [TabId, (tab: TabId) => void] {
  const activeTab = useSyncExternalStore(
    subscribe,
    () => tabFromHash(window.location.hash),
    () => DEFAULT_TAB, // the server never sees the hash
  );

  const selectTab = useCallback((tab: TabId) => {
    if (tab === tabFromHash(window.location.hash)) return;
    const url = `${window.location.pathname}${window.location.search}${hashForTab(tab)}`;
    window.history.pushState(null, "", url);
    window.dispatchEvent(new Event(TAB_CHANGE));
  }, []);

  return [activeTab, selectTab];
}
