import type { ProjectStatus } from "@/types/content";

const styles: Record<ProjectStatus, { colour: string; label: string }> = {
  completed: { colour: "bg-green", label: "Completed" },
  "in-progress": { colour: "bg-amber", label: "In progress" },
};

/** The small coloured dot beside a project's title. */
export function StatusDot({ status }: { status: ProjectStatus }) {
  const { colour, label } = styles[status];
  return (
    <span title={label} className={`block h-1.5 w-1.5 shrink-0 rounded-full ${colour}`}>
      {/* Colour alone cannot be read by a screen reader, so say it in words too. */}
      <span className="sr-only">{label}</span>
    </span>
  );
}
