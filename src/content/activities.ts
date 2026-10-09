import type { Activity } from "@/types/content";

/** Newest first. */
export const activities: Activity[] = [
  {
    id: "jpmpp",
    organisation: "Student Representative Council Election Committee (JPMPP)",
    monogram: "JP",
    role: "Audit Committee",
    period: "2025 – 2026",
    bullets: [
      "Audited vote counts during and after the election process to ensure accuracy and integrity.",
      "Verified the functionality and reliability of the voting system prior to election day.",
      "Contributed to maintaining transparency and compliance throughout the electoral process.",
    ],
  },
  {
    id: "comcil",
    organisation:
      "Faculty of Computer Science and Information Technology Student Council (ComCil)",
    monogram: "CC",
    role: "Vice Honorary Treasurer",
    period: "2024 – 2025",
    bullets: [
      "Monitored and audited the organization's monthly financial transactions and cash flow records.",
      "Managed budget allocation and expenditure to ensure responsible and transparent use of organizational funds.",
      "Assisted in maintaining accurate financial documentation and reporting.",
    ],
  },
];
