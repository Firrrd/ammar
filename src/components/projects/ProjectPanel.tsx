"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { Modal } from "@/components/ui/Modal";
import { projects } from "@/content/projects";
import type { Project } from "@/types/content";

type ProjectPanelContext = {
  /** Opens the detail panel for the project with this id. */
  openProject: (id: string) => void;
};

const Context = createContext<ProjectPanelContext | null>(null);

/**
 * Lets any component inside <ProjectPanelProvider> open the detail panel:
 *   const { openProject } = useProjectPanel();
 */
export function useProjectPanel(): ProjectPanelContext {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useProjectPanel must be used inside <ProjectPanelProvider>");
  }
  return context;
}

/**
 * Owns the one detail panel on the page and the "which project is open"
 * state. It wraps the tabs, so a card in the projects tab and a highlight
 * row in the overview tab (Feature 9) can both open the same panel.
 */
export function ProjectPanelProvider({ children }: { children: ReactNode }) {
  // Two pieces of state, not one: when the panel closes, the project stays
  // in place so its content is still there while the panel slides away.
  const [project, setProject] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  const openProject = useCallback((id: string) => {
    const found = projects.find((candidate) => candidate.id === id);
    if (!found) return;
    setProject(found);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ openProject }), [openProject]);

  return (
    <Context.Provider value={value}>
      {children}
      <Modal open={open} onClose={close} label="Project details" title="Project">
        {project && <ProjectDetail project={project} />}
      </Modal>
    </Context.Provider>
  );
}
