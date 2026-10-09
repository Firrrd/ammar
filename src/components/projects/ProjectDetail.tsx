import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { StatusDot } from "@/components/ui/StatusDot";
import { getProjectLinks } from "@/lib/content";
import type { Project } from "@/types/content";

function SubHeading({ children }: { children: string }) {
  return (
    <h3 className="mb-2 mt-6 text-xs font-medium uppercase tracking-[0.12em] text-text-dim">
      {children}
    </h3>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-relaxed">
          <span aria-hidden="true" className="text-accent">
            ›
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Everything about one project, shown inside the detail panel. */
export function ProjectDetail({ project }: { project: Project }) {
  const links = getProjectLinks(project);

  return (
    <article>
      {project.image && (
        // The whole screenshot is shown here, where the card crops it.
        <div className="relative mb-5 aspect-video w-full overflow-hidden rounded-lg border border-border bg-elevated">
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="(min-width: 640px) 440px, 100vw"
            className="object-contain"
          />
        </div>
      )}

      <p className="flex flex-wrap items-center gap-2 text-xs text-text-dim">
        <StatusDot status={project.status} />
        {project.status === "completed" ? "Completed" : "In progress"} · {project.category}
        {project.prototypeOnly && " · Prototype only"}
      </p>

      <h2 className="mt-2 text-xl font-semibold tracking-tight text-text-primary">
        {project.title}
      </h2>

      <p className="mt-1 text-[13px] text-text-dim">
        {project.role} · {project.context}
      </p>
      <p className="text-[13px] text-text-dim">
        {project.period}
        {project.team && ` · ${project.team}`}
      </p>

      <p className="mt-4 text-sm leading-relaxed">{project.description}</p>

      {project.highlights.length > 0 && (
        <>
          <SubHeading>Highlights</SubHeading>
          <BulletList items={project.highlights} />
        </>
      )}

      {project.sections?.map((section) => (
        <section key={section.title}>
          <SubHeading>{section.title}</SubHeading>
          <BulletList items={section.items} />
        </section>
      ))}

      <SubHeading>Built with</SubHeading>
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.map((technology) => (
          <Chip key={technology}>{technology}</Chip>
        ))}
      </div>

      {links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {links.map((link, index) => (
            // The first link is the main action, so it gets the filled style.
            <Button key={link.label} href={link.href} variant={index === 0 ? "filled" : "outline"}>
              {link.label} ↗
            </Button>
          ))}
        </div>
      )}
    </article>
  );
}
