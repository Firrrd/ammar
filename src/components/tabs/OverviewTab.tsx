import { ExpandableRow } from "@/components/overview/ExpandableRow";
import { Highlights } from "@/components/overview/Highlights";
import { TabLink } from "@/components/overview/TabLink";
import { Chip } from "@/components/ui/Chip";
import { ListRow } from "@/components/ui/ListRow";
import { MonogramTile } from "@/components/ui/MonogramTile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { achievements } from "@/content/achievements";
import { activities } from "@/content/activities";
import { education } from "@/content/education";
import { profile } from "@/content/profile";
import { skillGroups } from "@/content/skills";
import { formatAchievementDate, getLatestAchievements } from "@/lib/content";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-relaxed">
          <span aria-hidden="true" className="font-mono text-accent">
            ›
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function OverviewTab() {
  const skillCount = skillGroups.reduce((total, group) => total + group.skills.length, 0);
  const latest = getLatestAchievements(achievements);

  return (
    // One column until 1024px, then main (2/3) and side (1/3).
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
      <div className="min-w-0 space-y-10 lg:col-span-2">
        <section>
          <SectionHeading>About</SectionHeading>
          <p className="max-w-[75ch] leading-relaxed">{profile.about}</p>
        </section>

        <section>
          <SectionHeading>Highlights</SectionHeading>
          <Highlights />
        </section>

        <section>
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-1">
            {education.map((entry, index) => (
              <ExpandableRow
                key={entry.id}
                lead={<MonogramTile current={index === 0}>{entry.monogram}</MonogramTile>}
                title={entry.institution}
                wrapTitle
                sub={entry.programme}
                meta={entry.period}
              >
                <p className="mb-3 text-[13px] text-text-dim">
                  {/* The period is hidden in the row on phones, so repeat it here. */}
                  <span className="sm:hidden">{entry.period} · </span>
                  {entry.location}
                </p>
                <Bullets items={entry.notes} />
              </ExpandableRow>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading>Activities</SectionHeading>
          <div className="space-y-1">
            {activities.map((entry, index) => (
              <ExpandableRow
                key={entry.id}
                lead={<MonogramTile current={index === 0}>{entry.monogram}</MonogramTile>}
                title={entry.organisation}
                wrapTitle
                sub={entry.role}
                meta={entry.period}
              >
                <p className="mb-3 text-[13px] text-text-dim sm:hidden">{entry.period}</p>
                <Bullets items={entry.bullets} />
              </ExpandableRow>
            ))}
          </div>
        </section>
      </div>

      <aside className="min-w-0 space-y-10">
        <section>
          <SectionHeading hint={`${skillCount} skills`}>Stack</SectionHeading>
          <dl className="space-y-4">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <dt className="mb-1.5 font-mono text-[11px] text-text-dim">{group.label}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <Chip key={skill}>{skill}</Chip>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <SectionHeading hint={<TabLink tab="achievement">view all →</TabLink>}>
            Latest
          </SectionHeading>
          <div>
            {latest.map((achievement) => (
              <ListRow
                key={achievement.id}
                title={achievement.title}
                wrapTitle
                sub={achievement.issuer}
                meta={formatAchievementDate(achievement.date)}
                href={achievement.url}
              />
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
