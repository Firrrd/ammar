import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { achievements } from "@/content/achievements";
import { activities } from "@/content/activities";
import { education } from "@/content/education";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import {
  formatAchievementDate,
  getFeaturedProject,
  getStats,
  groupAchievementsByYear,
  projectNumber,
} from "@/lib/content";

// Temporary page for reviewing the design foundation. Removed in Feature 12.
export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false },
};

// Tailwind only generates classes it can find written out in full,
// so each swatch names its class instead of building it from the token name.
const colours = [
  { token: "bg", hex: "#0A1628", swatch: "bg-bg", use: "Page, top bar" },
  { token: "surface", hex: "#0F1E36", swatch: "bg-surface", use: "Cards, buttons, chips" },
  { token: "elevated", hex: "#172A46", swatch: "bg-elevated", use: "Row and button hover" },
  { token: "border", hex: "#1E3050", swatch: "bg-border", use: "Lines and outlines" },
  { token: "border-light", hex: "#2B4268", swatch: "bg-border-light", use: "Hover outlines" },
  { token: "border-strong", hex: "#5A7096", swatch: "bg-border-strong", use: "Form field outlines" },
  { token: "text-primary", hex: "#F1F5F9", swatch: "bg-text-primary", use: "Name, titles, active tab" },
  { token: "text-secondary", hex: "#A9B8CE", swatch: "bg-text-secondary", use: "Paragraphs, button labels" },
  { token: "text-dim", hex: "#7F93B3", swatch: "bg-text-dim", use: "Labels, inactive tabs, hints" },
  { token: "accent", hex: "#F7F7F7", swatch: "bg-accent", use: "Underline, bullets, fills, focus" },
  { token: "accent-dim", hex: "10% accent", swatch: "bg-accent-dim", use: "Tinted fills" },
  { token: "green", hex: "#4ADE80", swatch: "bg-green", use: "\"Completed\" dot" },
  { token: "amber", hex: "#FCBB00", swatch: "bg-amber", use: "\"In progress\" dot" },
];

export default function StyleGuide() {
  const stats = getStats(projects, achievements, profile.cgpa);
  const featured = getFeaturedProject(projects);
  const skillCount = skillGroups.reduce((sum, group) => sum + group.skills.length, 0);

  return (
    <main className="space-y-12 py-10 px-page">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Style guide</h1>
        <p className="mt-2 max-w-[75ch]">
          Temporary page showing the design foundation from Feature 1. It is
          removed before the site goes live.
        </p>
      </header>

      <section>
        <SectionHeading hint={`${colours.length} tokens`}>Colours</SectionHeading>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {colours.map((colour) => (
            <li
              key={colour.token}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
            >
              <span
                className={`h-10 w-10 shrink-0 rounded-md border border-border-light ${colour.swatch}`}
              />
              <span className="min-w-0">
                <span className="block text-xs text-text-primary">
                  {colour.token}
                </span>
                <span className="block text-[11px] text-text-dim">
                  {colour.hex}
                </span>
                <span className="block truncate text-[13px]">{colour.use}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeading hint="1 family">Type</SectionHeading>
        <div className="space-y-4">
          <p className="text-4xl font-bold text-text-primary">Ammar Firdaus</p>
          <p className="text-xs text-text-dim">
            name · Geist bold, 36px on desktop (28px on mobile)
          </p>
          <p className="max-w-[75ch] text-[15px] leading-relaxed">
            Body text in Geist at 15px. Final-year Software Engineering student
            with hands-on experience building responsive web applications using
            React, Next.js, TypeScript and PostgreSQL.
          </p>
          <p className="text-[15px] font-medium text-text-primary">
            Row title, 15px medium
          </p>
          <p className="text-[13px] text-text-dim">Row subtitle, 13px dim</p>
          <p className="text-sm text-text-primary">Overview · Projects · Achievement</p>
          <p className="text-xs text-text-dim">tabs and labels · Geist, 12–14px</p>
          <p className="text-2xl font-bold tabular-nums text-text-primary">
            3.93 · 5 · 6
          </p>
        </div>
      </section>

      <section>
        <SectionHeading hint="hover and tab to them">Buttons</SectionHeading>
        <div className="flex flex-wrap items-center gap-3">
          <Button>outline</Button>
          <Button variant="filled">filled</Button>
          <Button href="/cv.pdf">link, same site</Button>
          <Button href="https://github.com/Firrrd" variant="filled">
            link, new tab
          </Button>
          <Button disabled>disabled</Button>
          <Button variant="filled" disabled>
            disabled
          </Button>
        </div>
      </section>

      <section>
        <SectionHeading>Chips</SectionHeading>
        <div className="flex flex-wrap gap-1.5">
          {["TypeScript", "React", "Next.js", "Tailwind CSS", "PostgreSQL", "Python"].map(
            (label) => (
              <Chip key={label}>{label}</Chip>
            ),
          )}
        </div>
      </section>

      <section>
        <SectionHeading>Section heading</SectionHeading>
        <div className="max-w-md space-y-4 rounded-lg border border-border bg-surface p-4">
          <SectionHeading>Without a hint</SectionHeading>
          <SectionHeading hint="click to read">With a hint</SectionHeading>
        </div>
      </section>

      <section>
        <SectionHeading>Surfaces and status dots</SectionHeading>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-bg p-4">
            <p className="text-text-primary">bg</p>
            <p>Secondary text</p>
            <p className="text-text-dim">Dim text</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-text-primary">surface</p>
            <p>Secondary text</p>
            <p className="text-text-dim">Dim text</p>
          </div>
          <div className="rounded-lg border border-border-light bg-elevated p-4">
            <p className="text-text-primary">elevated</p>
            <p>Secondary text</p>
            <p className="text-text-dim">Dim text</p>
          </div>
        </div>
        <p className="mt-4 flex items-center gap-2 text-[13px]">
          <span className="h-1.5 w-1.5 rounded-full bg-green" /> Completed
          <span className="ml-4 h-1.5 w-1.5 rounded-full bg-amber" /> In progress
        </p>
      </section>

      <section>
        <SectionHeading hint="read from src/content">Content (Feature 2)</SectionHeading>
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-text-dim">profile</p>
            <p className="mt-2 font-medium text-text-primary">
              {profile.name} <span className="text-xs text-text-dim">{profile.handle}</span>
            </p>
            <p className="mt-2 text-[13px]">
              {stats.map((stat) => `${stat.value} ${stat.label}`).join(" · ")}
            </p>
            <p className="mt-2 text-[13px] text-text-dim">
              {education.length} education · {activities.length} activities ·{" "}
              {skillGroups.length} skill groups ({skillCount} skills)
            </p>
            <p className="mt-2 text-[13px] text-text-dim">
              Featured project: {featured?.title}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-text-dim">
              projects · {projects.length}
            </p>
            <ul className="mt-2 space-y-1.5">
              {projects.map((project, index) => (
                <li key={project.id} className="flex items-center gap-2 text-[13px]">
                  <span className="text-[11px] text-text-dim">
                    {projectNumber(index)}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      project.status === "completed" ? "bg-green" : "bg-amber"
                    }`}
                  />
                  <span className="truncate text-text-primary">{project.title}</span>
                  <span className="truncate text-text-dim">{project.role}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-text-dim">
              achievements · {achievements.length}
            </p>
            {groupAchievementsByYear(achievements).map((group) => (
              <div key={group.year} className="mt-2">
                <p className="text-[11px] text-text-dim">{group.year}</p>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3 text-[13px]">
                      <span className="truncate text-text-primary">{item.title}</span>
                      <span className="shrink-0 text-[11px] text-text-dim">
                        {formatAchievementDate(item.date)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
