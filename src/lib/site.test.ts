import { describe, expect, it } from "vitest";
import { site } from "@/lib/site";

describe("site metadata", () => {
  it("has a title that starts with the site name", () => {
    expect(site.title.startsWith(site.name)).toBe(true);
  });

  // Search engines cut descriptions off at roughly 160 characters.
  it("has a description short enough to show in full in search results", () => {
    expect(site.description.length).toBeGreaterThan(50);
    expect(site.description.length).toBeLessThanOrEqual(160);
  });
});
