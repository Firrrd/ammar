"use client";

import { useProjectPanel } from "@/components/projects/ProjectPanel";
import { useActiveTab } from "@/components/tabs/useActiveTab";
import { ListRow } from "@/components/ui/ListRow";
import { StatusDot } from "@/components/ui/StatusDot";
import { achievements } from "@/content/achievements";
import { education } from "@/content/education";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { getFeaturedProject } from "@/lib/content";

function Dot() {
  return <span className="block h-1.5 w-1.5 rounded-full bg-accent" />;
}

/** The three rows that sum up the profile, each leading somewhere. */
export function Highlights() {
  const { openProject } = useProjectPanel();
  const [, selectTab] = useActiveTab();

  const featured = getFeaturedProject(projects);
  const current = education[0];
  const awsCount = achievements.filter(
    (achievement) => achievement.issuer === "Amazon Web Services",
  ).length;

  return (
    <div>
      {featured && (
        <ListRow
          lead={<StatusDot status={featured.status} />}
          title={featured.title}
          sub={featured.description}
          meta="featured"
          onClick={() => openProject(featured.id)}
        />
      )}
      <ListRow
        lead={<Dot />}
        title={`CGPA ${profile.cgpa}`}
        sub={`${current.programme} · ${current.institution}`}
        meta="education"
      />
      <ListRow
        lead={<Dot />}
        title={`${awsCount} AWS certifications`}
        sub="Cloud, Machine Learning and Generative AI foundations"
        meta="achievement"
        onClick={() => selectTab("achievement")}
      />
    </div>
  );
}
