import type { Profile } from "@/types/content";

export const profile: Profile = {
  name: "Ammar Firdaus",
  fullName: "Ammar Firdaus bin Nurul Hisyam",
  handle: "@ammfirdaus",
  greetings: ["Hi, I'm Ammar.", "Welcome to my portfolio.", "Let's connect & build together."],
  bio: "Software Developer | Applied AI/ML",
  about:
    "Final-year Software Engineering student with hands-on experience building responsive web applications using React, Next.js, TypeScript and PostgreSQL. Experienced in UI development, Agile/Scrum delivery and software testing, with a foundation in machine learning using Python (pandas, scikit-learn). AWS-certified in Cloud, Machine Learning and Generative AI foundations.",
  cgpa: "3.94",
  availability: "Open to internship",
  facts: [
    { kind: "education", label: "Software Engineering @ UPM" },
    { kind: "location", label: "Kajang, Selangor" },
  ],
  links: [
    { kind: "github", label: "GitHub", href: "https://github.com/Firrrd" },
    {
      kind: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ammarfirdausnh",
    },
    { kind: "email", label: "Email", href: "mailto:ammarfirdaus15@gmail.com" },
  ],
  avatar: "/avatar.jpg",
  cvUrl: "/cv.pdf",
};
