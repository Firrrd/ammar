import { describe, expect, it } from "vitest";
import {
  achievementYear,
  formatAchievementDate,
  getEmailAddress,
  getFeaturedProject,
  getLatestAchievements,
  getProjectLinks,
  getStats,
  groupAchievementsByYear,
  projectNumber,
  sortNewestFirst,
} from "@/lib/content";
import type { Achievement, Project } from "@/types/content";

// Small made-up records, so these tests do not change when the real content does.
function achievement(id: string, date: string, type: Achievement["type"] = "Certification"): Achievement {
  return { id, title: id, type, issuer: "Issuer", date, skills: [] };
}

function project(id: string, extra: Partial<Project> = {}): Project {
  return {
    id,
    title: id,
    role: "Developer",
    context: "Test",
    period: "2026",
    category: "Personal Project",
    status: "completed",
    description: "",
    highlights: [],
    technologies: [],
    ...extra,
  };
}

describe("getEmailAddress", () => {
  const base = { name: "", fullName: "", handle: "", greetings: [], bio: "", about: "", cgpa: "", facts: [], avatar: "", cvUrl: "" };

  it("strips mailto: from the email link", () => {
    expect(
      getEmailAddress({ ...base, links: [{ kind: "email", label: "Email", href: "mailto:a@example.com" }] }),
    ).toBe("a@example.com");
  });

  it("returns an empty string when there is no email link", () => {
    expect(getEmailAddress({ ...base, links: [] })).toBe("");
  });
});

describe("getFeaturedProject", () => {
  it("returns the project marked as featured", () => {
    const list = [project("a"), project("b", { featured: true })];
    expect(getFeaturedProject(list)?.id).toBe("b");
  });

  it("falls back to the first project when none is featured", () => {
    expect(getFeaturedProject([project("a"), project("b")])?.id).toBe("a");
  });

  it("returns undefined for an empty list", () => {
    expect(getFeaturedProject([])).toBeUndefined();
  });
});

describe("getProjectLinks", () => {
  it("returns nothing for a project with no links", () => {
    expect(getProjectLinks(project("a"))).toEqual([]);
  });

  it("returns only the links that exist", () => {
    const links = getProjectLinks(project("a", { prototypeUrl: "https://example.com/p" }));
    expect(links).toEqual([{ label: "View prototype", href: "https://example.com/p" }]);
  });

  it("orders them: site, demo, prototype, source", () => {
    const links = getProjectLinks(
      project("a", {
        repositoryUrl: "https://example.com/repo",
        prototypeUrl: "https://example.com/proto",
        videoUrl: "https://example.com/video",
        liveUrl: "https://example.com",
      }),
    );
    expect(links.map((link) => link.label)).toEqual([
      "Visit site",
      "Watch demo",
      "View prototype",
      "View source",
    ]);
  });
});

describe("projectNumber", () => {
  it("counts from 01 and pads to two digits", () => {
    expect(projectNumber(0)).toBe("01");
    expect(projectNumber(4)).toBe("05");
    expect(projectNumber(11)).toBe("12");
  });
});

describe("achievement dates", () => {
  it("reads the year from either date format", () => {
    expect(achievementYear(achievement("a", "2026-03"))).toBe(2026);
    expect(achievementYear(achievement("b", "2023"))).toBe(2023);
  });

  it("formats a month and year, or a year alone", () => {
    expect(formatAchievementDate("2026-03")).toBe("Mar 2026");
    expect(formatAchievementDate("2025-12")).toBe("Dec 2025");
    expect(formatAchievementDate("2023")).toBe("2023");
  });
});

describe("sortNewestFirst", () => {
  it("orders by date, newest first", () => {
    const list = [achievement("old", "2023"), achievement("new", "2026-03"), achievement("mid", "2025-03")];
    expect(sortNewestFirst(list).map((a) => a.id)).toEqual(["new", "mid", "old"]);
  });

  it("leaves the original list untouched", () => {
    const list = [achievement("old", "2023"), achievement("new", "2026-03")];
    sortNewestFirst(list);
    expect(list.map((a) => a.id)).toEqual(["old", "new"]);
  });
});

describe("groupAchievementsByYear", () => {
  it("puts each achievement under its year, newest year first", () => {
    const groups = groupAchievementsByYear([
      achievement("a", "2025-03"),
      achievement("b", "2026-01"),
      achievement("c", "2023"),
      achievement("d", "2026-03"),
    ]);
    expect(groups.map((g) => g.year)).toEqual([2026, 2025, 2023]);
    expect(groups[0].items.map((a) => a.id)).toEqual(["d", "b"]);
  });

  it("returns no groups for an empty list", () => {
    expect(groupAchievementsByYear([])).toEqual([]);
  });
});

describe("getLatestAchievements", () => {
  const list = [
    achievement("a", "2025-03"),
    achievement("b", "2026-03"),
    achievement("c", "2026-01"),
    achievement("d", "2026-02"),
  ];

  it("returns the three most recent by default", () => {
    expect(getLatestAchievements(list).map((a) => a.id)).toEqual(["b", "d", "c"]);
  });

  it("returns everything when fewer exist than asked for", () => {
    expect(getLatestAchievements(list.slice(0, 2), 5)).toHaveLength(2);
  });
});

describe("getStats", () => {
  it("counts projects and certifications, leaving awards out of the certification count", () => {
    const stats = getStats(
      [project("a"), project("b")],
      [achievement("x", "2026-01"), achievement("y", "2023", "Award")],
      "3.93",
    );
    expect(stats).toEqual([
      { value: "2", label: "Projects" },
      { value: "1", label: "Certifications" },
      { value: "3.93", label: "CGPA" },
    ]);
  });
});
