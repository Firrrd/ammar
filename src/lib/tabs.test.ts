import { describe, expect, it } from "vitest";
import { DEFAULT_TAB, hashForTab, TABS, tabForKey, tabFromHash } from "@/lib/tabs";

describe("TABS", () => {
  it("are overview, projects and achievement, in that order", () => {
    expect(TABS.map((tab) => tab.id)).toEqual(["overview", "projects", "achievement"]);
  });

  it("default to overview", () => {
    expect(DEFAULT_TAB).toBe("overview");
  });
});

describe("tabFromHash", () => {
  it("reads a known tab, with or without the #", () => {
    expect(tabFromHash("#projects")).toBe("projects");
    expect(tabFromHash("achievement")).toBe("achievement");
  });

  it("ignores letter case", () => {
    expect(tabFromHash("#Projects")).toBe("projects");
  });

  it("falls back to overview for no hash or an unknown one", () => {
    expect(tabFromHash("")).toBe("overview");
    expect(tabFromHash("#")).toBe("overview");
    expect(tabFromHash("#blog")).toBe("overview");
  });
});

describe("hashForTab", () => {
  it("gives overview no hash, and other tabs their name", () => {
    expect(hashForTab("overview")).toBe("");
    expect(hashForTab("projects")).toBe("#projects");
    expect(hashForTab("achievement")).toBe("#achievement");
  });

  it("round-trips with tabFromHash", () => {
    for (const { id } of TABS) {
      expect(tabFromHash(hashForTab(id))).toBe(id);
    }
  });
});

describe("tabForKey", () => {
  it("moves right and left", () => {
    expect(tabForKey("overview", "ArrowRight")).toBe("projects");
    expect(tabForKey("projects", "ArrowLeft")).toBe("overview");
  });

  it("wraps around at both ends", () => {
    expect(tabForKey("achievement", "ArrowRight")).toBe("overview");
    expect(tabForKey("overview", "ArrowLeft")).toBe("achievement");
  });

  it("jumps to the first and last tab with Home and End", () => {
    expect(tabForKey("projects", "Home")).toBe("overview");
    expect(tabForKey("projects", "End")).toBe("achievement");
  });

  it("ignores other keys", () => {
    expect(tabForKey("projects", "Enter")).toBeUndefined();
    expect(tabForKey("projects", "a")).toBeUndefined();
  });
});
