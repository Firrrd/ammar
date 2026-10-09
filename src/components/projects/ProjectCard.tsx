"use client";

import Image from "next/image";
import { useProjectPanel } from "@/components/projects/ProjectPanel";
import { cardInteractive, cardSurface } from "@/components/ui/card";
import { Chip } from "@/components/ui/Chip";
import { StatusDot } from "@/components/ui/StatusDot";
import type { Project } from "@/types/content";

const CHIPS_SHOWN = 3;

type ProjectCardProps = {
  project: Project;
  /** Display number such as "01". */
  number: string;
  /** True for cards in the first row, so their images load straight away. */
  eager?: boolean;
};

/*
  The whole card is one button, so it is a single stop for keyboard users and
  opens the detail panel. A <button> may only contain inline
  elements, which is why everything inside is a <span> made block-level with
  classes instead of <div> and <p>.
*/
export function ProjectCard({ project, number, eager = false }: ProjectCardProps) {
  const { openProject } = useProjectPanel();
  const hiddenChips = project.technologies.length - CHIPS_SHOWN;

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => openProject(project.id)}
      className={`group flex h-full w-full flex-col overflow-hidden text-left ${cardSurface} ${cardInteractive}`}
    >
      {project.image && (
        <span className="relative block aspect-video w-full overflow-hidden border-b border-border bg-elevated">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 1440px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading={eager ? "eager" : "lazy"}
            className={`transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
              project.imageFit === "contain" ? "object-contain p-3" : "object-cover object-top"
            }`}
          />
        </span>
      )}

      <span className="flex flex-1 flex-col gap-2 p-4">
        <span className="flex items-center gap-2">
          <span className="text-xs tabular-nums text-text-dim">{number}</span>
          <span className="truncate text-[15px] font-medium text-text-primary">
            {project.title}
          </span>
          <StatusDot status={project.status} />
          {project.prototypeOnly && (
            <span className="rounded border border-border-light px-1.5 text-[11px] text-text-dim">
              Prototype
            </span>
          )}
        </span>

        <span className="block truncate text-[13px] text-text-dim">
          {project.role} · {project.context}
        </span>

        <span className="line-clamp-2 text-[13px] leading-relaxed">
          {project.description}
        </span>

        {/* mt-auto pushes the chips to the bottom, so they line up across a row of cards. */}
        <span className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          {project.technologies.slice(0, CHIPS_SHOWN).map((technology) => (
            <Chip key={technology}>{technology}</Chip>
          ))}
          {hiddenChips > 0 && (
            <span className="text-xs text-text-dim">+{hiddenChips}</span>
          )}
        </span>
      </span>
    </button>
  );
}
