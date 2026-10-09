import type { Achievement, Profile, Project, Stat } from "@/types/content";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** The plain email address from the profile's email link ("mailto:a@b.c" gives "a@b.c"). */
export function getEmailAddress(profile: Profile): string {
  const link = profile.links.find((candidate) => candidate.kind === "email");
  return link ? link.href.replace(/^mailto:/, "") : "";
}

/** The project marked as featured, or the first one if none is. */
export function getFeaturedProject(projects: Project[]): Project | undefined {
  return projects.find((project) => project.featured) ?? projects[0];
}

export type ProjectLink = {
  label: string;
  href: string;
};

/**
 * The buttons for a project's detail panel, most useful first.
 * Only links the project actually has are returned.
 */
export function getProjectLinks(project: Project): ProjectLink[] {
  const candidates: [label: string, href: string | undefined][] = [
    ["Visit site", project.liveUrl],
    ["Watch demo", project.videoUrl],
    ["View prototype", project.prototypeUrl],
    ["View source", project.repositoryUrl],
  ];
  return candidates.flatMap(([label, href]) => (href ? [{ label, href }] : []));
}

/** A card's display number from its position: 0 gives "01". */
export function projectNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

/** "2026-03" gives 2026; so does "2026". */
export function achievementYear(achievement: Achievement): number {
  return Number(achievement.date.slice(0, 4));
}

/** "2026-03" gives "Mar 2026"; "2023" stays "2023". */
export function formatAchievementDate(date: string): string {
  const [year, month] = date.split("-");
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

/** A copy sorted newest first. Dates are "YYYY-MM" or "YYYY", so text order is date order. */
export function sortNewestFirst(achievements: Achievement[]): Achievement[] {
  return [...achievements].sort((a, b) => b.date.localeCompare(a.date));
}

export type AchievementYearGroup = {
  year: number;
  items: Achievement[];
};

/** Groups achievements under their year, newest year and newest item first. */
export function groupAchievementsByYear(
  achievements: Achievement[],
): AchievementYearGroup[] {
  const groups: AchievementYearGroup[] = [];
  for (const achievement of sortNewestFirst(achievements)) {
    const year = achievementYear(achievement);
    const last = groups.at(-1);
    if (last?.year === year) {
      last.items.push(achievement);
    } else {
      groups.push({ year, items: [achievement] });
    }
  }
  return groups;
}

/** The most recent achievements, for the overview's "latest" list. */
export function getLatestAchievements(
  achievements: Achievement[],
  count = 3,
): Achievement[] {
  return sortNewestFirst(achievements).slice(0, count);
}

/** The numbers on the profile's stats line. Counted from the data, never typed in. */
export function getStats(
  projects: Project[],
  achievements: Achievement[],
  cgpa: string,
): Stat[] {
  const certifications = achievements.filter(
    (achievement) => achievement.type === "Certification",
  );
  return [
    { value: String(projects.length), label: "Projects" },
    { value: String(certifications.length), label: "Certifications" },
    { value: cgpa, label: "CGPA" },
  ];
}
