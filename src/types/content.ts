export type ProjectCategory = "Course Project" | "Hackathon" | "Personal Project";

export type ProjectStatus = "completed" | "in-progress";

/** A titled list shown in the project detail panel, such as "Problem" or "Roadmap". */
export type ProjectSection = {
  title: string;
  items: string[];
};

export type Project = {
  /** Stable identifier, also used to link to the detail panel. */
  id: string;
  title: string;
  /** Ammar's role in the project. */
  role: string;
  /** The course or event the project was built for. */
  context: string;
  period: string;
  category: ProjectCategory;
  status: ProjectStatus;
  /** True when the project is a design prototype with no coded version. */
  prototypeOnly?: boolean;
  description: string;
  /** "What I did" bullets. */
  highlights: string[];
  technologies: string[];
  team?: string;
  /** Extra detail for the panel, beyond the highlights. */
  sections?: ProjectSection[];
  /** Path under public/, for example "/projects/refeed.png". */
  image?: string;
  /**
   * How the screenshot sits in its 16:9 frame. "cover" (the default) fills the
   * frame and crops the overflow; "contain" shows the whole image, for tall
   * ones such as phone mock-ups.
   */
  imageFit?: "cover" | "contain";
  liveUrl?: string;
  repositoryUrl?: string;
  prototypeUrl?: string;
  /** A recorded demo, for projects that cannot be tried online. */
  videoUrl?: string;
  /** Shown in the overview highlights. */
  featured?: boolean;
};

export type AchievementType = "Certification" | "Award";

export type Achievement = {
  id: string;
  title: string;
  type: AchievementType;
  issuer: string;
  /** "YYYY-MM", or "YYYY" when only the year is known. */
  date: string;
  skills: string[];
  /** Credential or proof link. */
  url?: string;
};

export type Education = {
  id: string;
  institution: string;
  /** Two letters for the monogram tile. */
  monogram: string;
  programme: string;
  period: string;
  location: string;
  notes: string[];
};

export type Activity = {
  id: string;
  organisation: string;
  /** Two letters for the monogram tile. */
  monogram: string;
  role: string;
  period: string;
  bullets: string[];
};

export type SkillGroup = {
  label: string;
  skills: string[];
};

export type ProfileFact = {
  kind: "education" | "location";
  label: string;
};

export type ProfileLink = {
  kind: "github" | "linkedin" | "email";
  label: string;
  href: string;
};

export type Profile = {
  name: string;
  fullName: string;
  handle: string;
  /** Short line shown beside the handle. Left out until supplied. */
  status?: string;
  /** Phrases the banner types out, one after another. The first is what reduced-motion visitors see. */
  greetings: string[];
  /** The one line under the handle. */
  bio: string;
  /** The longer paragraph in the overview tab's "about" section. */
  about: string;
  cgpa: string;
  facts: ProfileFact[];
  /** For example "Open to internships". Left out until supplied. */
  availability?: string;
  links: ProfileLink[];
  avatar: string;
  cvUrl: string;
};

export type Stat = {
  value: string;
  label: string;
};
