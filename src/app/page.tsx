import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProjectPanelProvider } from "@/components/projects/ProjectPanel";
import { AchievementTab } from "@/components/tabs/AchievementTab";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { ProfileTabs } from "@/components/tabs/ProfileTabs";
import { ProjectsTab } from "@/components/tabs/ProjectsTab";

export default function Home() {
  return (
    <main className="flex-1">
      <ProfileHeader />
      <ProjectPanelProvider>
        <ProfileTabs
          panels={{
            overview: <OverviewTab />,
            projects: <ProjectsTab />,
            achievement: <AchievementTab />,
          }}
        />
      </ProjectPanelProvider>
    </main>
  );
}
