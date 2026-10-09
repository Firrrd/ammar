import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/content/projects";
import { projectNumber } from "@/lib/content";

// The widest layout shows four cards in a row, so the first four images are
// the ones that can be on screen before any scrolling.
const FIRST_ROW = 4;

export function ProjectsTab() {
  return (
    <section>
      <SectionHeading hint={`${projects.length} projects`}>Projects</SectionHeading>
      {/* grid-cols-1 matters: without an explicit column, a card would grow as
          wide as its longest unwrapped line and push the page sideways. */}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {projects.map((project, index) => (
          <li key={project.id}>
            <ProjectCard
              project={project}
              number={projectNumber(index)}
              eager={index < FIRST_ROW}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
