import type { Stat } from "@/types/content";

export function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <dl className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-text-dim">
      {stats.map((stat) => (
        // Label first in the markup (a <dl> expects term, then value),
        // but shown number first: flex-row-reverse swaps them on screen.
        <div key={stat.label} className="flex flex-row-reverse gap-1">
          <dt>{stat.label}</dt>
          <dd className="font-semibold tabular-nums text-text-primary">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
