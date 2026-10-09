import type { IconType } from "react-icons";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import {
  LuFileText,
  LuGraduationCap,
  LuMail,
  LuMapPin,
} from "react-icons/lu";
import type { ProfileFact, ProfileLink } from "@/types/content";

/** One icon per kind of fact. Adding a new kind to the type forces an entry here. */
export const factIcons: Record<ProfileFact["kind"], IconType> = {
  education: LuGraduationCap,
  location: LuMapPin,
};

/** One icon per kind of link. */
export const linkIcons: Record<ProfileLink["kind"], IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  email: LuMail,
};

export const CvIcon = LuFileText;
