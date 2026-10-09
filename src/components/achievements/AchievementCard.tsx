import type { IconType } from "react-icons";
import { LuAward, LuBadgeCheck } from "react-icons/lu";
import { cardInteractive, cardSurface } from "@/components/ui/card";
import { Chip } from "@/components/ui/Chip";
import { formatAchievementDate } from "@/lib/content";
import type { Achievement } from "@/types/content";

const typeIcons: Record<Achievement["type"], IconType> = {
  Certification: LuBadgeCheck,
  Award: LuAward,
};

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  const Icon = typeIcons[achievement.type];

  const content = (
    <>
      <span className="flex items-center justify-between gap-3 font-mono text-[11px] text-text-dim">
        <span className="flex items-center gap-1.5 lowercase">
          <Icon aria-hidden="true" className="h-3.5 w-3.5" />
          {achievement.type}
        </span>
        <time dateTime={achievement.date}>{formatAchievementDate(achievement.date)}</time>
      </span>

      <span className="block text-[15px] font-medium leading-snug text-text-primary">
        {achievement.title}
      </span>
      <span className="block text-[13px] text-text-dim">{achievement.issuer}</span>

      {achievement.skills.length > 0 && (
        <span className="flex flex-wrap gap-1.5 pt-1">
          {achievement.skills.map((skill) => (
            <Chip key={skill}>{skill}</Chip>
          ))}
        </span>
      )}

      {achievement.url && (
        // mt-auto keeps this line at the bottom, level across a row of cards.
        <span className="mt-auto pt-2 font-mono text-[11px] text-text-secondary transition-colors group-hover:text-text-primary">
          View credential ↗
        </span>
      )}
    </>
  );

  const layout = "flex h-full flex-col gap-2 p-4";

  // With a credential, the whole card is the link. Without one (the award),
  // it is a plain card with no hover effect, so it does not look clickable.
  if (achievement.url) {
    return (
      <a
        href={achievement.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group ${cardSurface} ${cardInteractive} ${layout}`}
      >
        {content}
      </a>
    );
  }

  return <article className={`${cardSurface} ${layout}`}>{content}</article>;
}
