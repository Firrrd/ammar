import { AchievementCard } from "@/components/achievements/AchievementCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { achievements } from "@/content/achievements";
import { groupAchievementsByYear } from "@/lib/content";

export function AchievementTab() {
  const groups = groupAchievementsByYear(achievements);

  return (
    <section>
      <SectionHeading hint={`${achievements.length} total`}>Achievement</SectionHeading>
      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.year} aria-labelledby={`year-${group.year}`}>
            <h3
              id={`year-${group.year}`}
              className="mb-3 flex items-center gap-3 font-mono text-xs text-text-secondary"
            >
              {group.year}
              {/* A line running from the year to the right edge. */}
              <span aria-hidden="true" className="h-px flex-1 bg-border" />
              <span className="text-[11px] text-text-dim">{group.items.length}</span>
            </h3>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {group.items.map((achievement) => (
                <li key={achievement.id}>
                  <AchievementCard achievement={achievement} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
