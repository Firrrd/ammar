import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { achievements } from "@/content/achievements";
import { activities } from "@/content/activities";
import { education } from "@/content/education";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { getProjectLinks, getStats, sortNewestFirst } from "@/lib/content";

/**
 * Checks on the real content. These guard decisions recorded in SPEC.md,
 * so a later edit cannot quietly undo one.
 */

function expectUnique(values: string[]) {
  expect(new Set(values).size).toBe(values.length);
}

describe("projects", () => {
  it("lists exactly the six agreed projects, newest first", () => {
    expect(projects.map((p) => p.title)).toEqual([
      "Stella_studybuddy",
      "Spotential",
      "SquadView",
      "Scrap2Go",
      "ReFeed",
      "MyAccessCare",
    ]);
  });

  it("has unique ids", () => {
    expectUnique(projects.map((p) => p.id));
  });

  it("marks only Stella_studybuddy as in progress", () => {
    const inProgress = projects.filter((p) => p.status === "in-progress");
    expect(inProgress.map((p) => p.id)).toEqual(["stella-studybuddy"]);
  });

  it("features exactly one project, Stella_studybuddy", () => {
    expect(projects.filter((p) => p.featured).map((p) => p.id)).toEqual(["stella-studybuddy"]);
  });

  it("keeps any CGPA mentioned in the about text in step with the stats line", () => {
    // The about text need not mention the CGPA; if it does, it must not be stale.
    const mentioned = /CGPA (d.d+)/.exec(profile.about)?.[1];
    if (mentioned) expect(mentioned).toBe(profile.cgpa);
  });

  it("gives every project a description, highlights and technologies", () => {
    for (const p of projects) {
      expect(p.description.length, p.id).toBeGreaterThan(20);
      expect(p.highlights.length, p.id).toBeGreaterThan(0);
      expect(p.technologies.length, p.id).toBeGreaterThan(0);
    }
  });

  it("uses https for every external link", () => {
    for (const p of projects) {
      for (const url of [p.liveUrl, p.repositoryUrl, p.prototypeUrl, p.videoUrl]) {
        if (url) expect(url, p.id).toMatch(/^https:\/\//);
      }
    }
  });

  it("gives every project a screenshot", () => {
    for (const p of projects) expect(p.image, p.id).toBeDefined();
  });

  it("points any screenshot at a file that exists in public/", () => {
    for (const p of projects) {
      if (p.image) expect(existsSync(`public${p.image}`), p.image).toBe(true);
    }
  });

  it("presents MyAccessCare as a prototype, with no claim of working software", () => {
    const p = projects.find((p) => p.id === "myaccesscare")!;
    expect(p.prototypeOnly).toBe(true);
    expect(p.prototypeUrl).toBeDefined();
    expect(p.repositoryUrl).toBeUndefined();
    expect(p.liveUrl).toBeUndefined();
    const text = [p.description, ...p.highlights].join(" ");
    expect(text).not.toMatch(/\b(built|implemented|developed)\b/i);
  });

  it("gives every project at least one button in its detail panel", () => {
    for (const p of projects) {
      expect(getProjectLinks(p).length, p.id).toBeGreaterThan(0);
    }
  });

  it("shows only 'View prototype' for MyAccessCare", () => {
    const p = projects.find((p) => p.id === "myaccesscare")!;
    expect(getProjectLinks(p).map((link) => link.label)).toEqual(["View prototype"]);
  });

  it("does not claim Ammar wrote Spotential's code (he was CFO)", () => {
    const p = projects.find((p) => p.id === "spotential")!;
    const text = [p.description, ...p.highlights].join(" ");
    expect(text).not.toMatch(/\b(built|implemented|developed|coded)\b/i);
  });

  it("never describes ReFeed's built features as AI-driven", () => {
    const p = projects.find((p) => p.id === "refeed")!;
    const text = [p.description, ...p.highlights].join(" ");
    expect(text).not.toMatch(/\bAI\b/);
  });
});

describe("achievements", () => {
  it("has six certifications and one award", () => {
    expect(achievements.filter((a) => a.type === "Certification")).toHaveLength(6);
    expect(achievements.filter((a) => a.type === "Award")).toHaveLength(1);
  });

  it("has unique ids", () => {
    expectUnique(achievements.map((a) => a.id));
  });

  it("writes every date as YYYY-MM or YYYY", () => {
    for (const a of achievements) {
      expect(a.date, a.id).toMatch(/^\d{4}(-(0[1-9]|1[0-2]))?$/);
    }
  });

  it("is already stored newest first", () => {
    expect(achievements).toEqual(sortNewestFirst(achievements));
  });

  it("gives every certification an https credential link", () => {
    for (const a of achievements.filter((a) => a.type === "Certification")) {
      expect(a.url, a.id).toMatch(/^https:\/\//);
    }
  });
});

describe("profile", () => {
  it("links to GitHub, LinkedIn and email, in that order", () => {
    expect(profile.links.map((l) => l.kind)).toEqual(["github", "linkedin", "email"]);
  });

  it("points the avatar and CV at files that exist in public/", () => {
    expect(existsSync(`public${profile.avatar}`)).toBe(true);
    expect(existsSync(`public${profile.cvUrl}`)).toBe(true);
  });

  // 32 is what fits on one line at the phone text size set in Greeting.tsx.
  it("has short banner greetings that fit on one line of a phone", () => {
    expect(profile.greetings.length).toBeGreaterThan(0);
    for (const greeting of profile.greetings) {
      expect(greeting.length, greeting).toBeGreaterThan(0);
      expect(greeting.length, greeting).toBeLessThanOrEqual(32);
    }
  });

  it("produces the agreed stats line", () => {
    expect(getStats(projects, achievements, profile.cgpa)).toEqual([
      { value: "6", label: "Projects" },
      { value: "6", label: "Certifications" },
      { value: "3.94", label: "CGPA" },
    ]);
  });
});

describe("education, activities and skills", () => {
  it("has two education entries and two activities, each with a two-letter monogram", () => {
    expect(education).toHaveLength(2);
    expect(activities).toHaveLength(2);
    for (const entry of [...education, ...activities]) {
      expect(entry.monogram, entry.id).toMatch(/^[A-Z]{2}$/);
    }
  });

  it("has the six skill groups from the CV, none empty", () => {
    expect(skillGroups.map((g) => g.label)).toEqual([
      "Languages",
      "Web & Mobile",
      "Databases",
      "Cloud & AI",
      "Tools & Platform",
      "Engineering Practices",
    ]);
    for (const group of skillGroups) {
      expect(group.skills.length, group.label).toBeGreaterThan(0);
    }
  });
});
