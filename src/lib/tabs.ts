export const TABS = [
  { id: "overview", label: "Overview" },
  { id: "projects", label: "Projects" },
  { id: "achievement", label: "Achievement" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export const DEFAULT_TAB: TabId = "overview";

function isTabId(value: string): value is TabId {
  return TABS.some((tab) => tab.id === value);
}

/**
 * Reads the tab from a URL hash such as "#projects".
 * Anything unrecognised, including no hash at all, means the default tab.
 */
export function tabFromHash(hash: string): TabId {
  const value = decodeURIComponent(hash.replace(/^#/, "")).toLowerCase();
  return isTabId(value) ? value : DEFAULT_TAB;
}

/** The hash for a tab. The default tab has none, so the home page URL stays clean. */
export function hashForTab(tab: TabId): string {
  return tab === DEFAULT_TAB ? "" : `#${tab}`;
}

/** The tab reached by pressing an arrow, Home or End key, wrapping at both ends. */
export function tabForKey(current: TabId, key: string): TabId | undefined {
  const index = TABS.findIndex((tab) => tab.id === current);
  const last = TABS.length - 1;
  switch (key) {
    case "ArrowRight":
      return TABS[index === last ? 0 : index + 1].id;
    case "ArrowLeft":
      return TABS[index === 0 ? last : index - 1].id;
    case "Home":
      return TABS[0].id;
    case "End":
      return TABS[last].id;
    default:
      return undefined;
  }
}
