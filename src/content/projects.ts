import type { Project } from "@/types/content";

/** Newest first. A card's number (01, 02, ...) is its position in this list. */
export const projects: Project[] = [
  {
    id: "stella-studybuddy",
    featured: true,
    image: "/projects/stella-studybuddy2.png",
    title: "Stella_studybuddy",
    role: "Developer",
    context: "Personal project",
    period: "Aug 2026 – Oct 2026",
    category: "Personal Project",
    status: "completed",
    description:
      "A private AI study partner called Stella. Give her your own notes, slides and textbook pages; she answers questions from them and turns them into quizzes, flashcards and exam questions with mark schemes. She runs on a Qwen model served locally through Ollama, so files, chats and results never leave the computer.",
    highlights: [
      "Reads almost any study material: typed or scanned PDFs, photos and screenshots, Word, PowerPoint, Excel, e-books, web pages and text, dropped on the window or pasted in",
      "Pictures of text are read twice, by the Qwen vision model and by an OCR engine; pages where the two disagree are flagged, and a review screen shows each page beside its text for correction",
      "Answers from the student's own material and cites the pages used; when the material does not cover a question, Stella says so before answering from general knowledge",
      "Quizzes (multiple choice, true/false and short written answers), flashcards scheduled in boxes, and 6 to 10 mark exam questions with a mark scheme; written answers are marked point by point and totalled by code",
      "Every question and card quotes the sentence it is based on and is thrown away if that sentence is not in the material",
      "Missed questions come back first next time; sets print with or without answers or export as an Anki deck",
      "Questions typed or spoken, with speech transcribed locally by faster-whisper",
      "Runs on Windows 10/11 and Linux; automated tests run without the models, and reading accuracy was measured with the real ones",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "Ollama (Qwen 3.5)",
      "bge-m3 embeddings",
      "RapidOCR",
      "faster-whisper",
      "SQLite",
      "HTML/CSS/JavaScript",
      "pytest",
    ],
    repositoryUrl: "https://github.com/Firrrd/Stella_studybuddy",
  },
  {
    id: "spotential",
    image: "/projects/spotential.png",
    title: "Spotential",
    role: "Chief Financial Officer",
    context: "CIC Asia 2026 (Convergence Innovation Competition)",
    period: "Aug 2026 – Sep 2026",
    category: "Hackathon",
    status: "completed",
    description:
      "Location intelligence for Malaysian MSMEs. Drop a pin and pick a business type to get a scored analysis of the site before signing a lease: who you would compete with, how many people live within walking distance and what the rent means for break-even.",
    highlights: [
      "Worked on the business model and pricing: a free tier, a Pro subscription and a flat listing fee for event organisers, earning from subscriptions and credit-based usage",
      "Researched the Malaysian MSME market from DOSM figures on business share, contribution to GDP and five-year survival",
      "Location analysis across 15 business categories in F&B, retail and services, with a Success Score over five dimensions and every figure traced to its source",
      "Walk-in catchment measured from a 400 m population grid, competitor analysis from Google Places and per-district rent benchmarks",
      "Side-by-side comparison of two or three sites, and a what-if simulator for revenue, profit, break-even and the cash needed before opening",
      "The AI never does arithmetic: Gemini turns questions into parameter changes, a deterministic engine computes every number, and answers citing figures not on the page are refused",
    ],
    technologies: [
      "React 18",
      "TypeScript",
      "Vite",
      "Fastify",
      "Google Cloud Run",
      "Firestore",
      "Google Maps Platform",
      "Gemini",
    ],
    team: "Team of four",
    sections: [
      {
        title: "Problem",
        items: [
          "Opening a shop in Malaysia usually comes down to instinct and a walk around the neighbourhood.",
          "The data that would answer \"is this a good spot?\" (census figures, competitor density, rents) is scattered across government portals, mapping services and PDF reports.",
        ],
      },
      {
        title: "Market",
        items: [
          "96% of all businesses in Malaysia are MSMEs, providing 48.7% of jobs (DOSM, MSME Performance 2025)",
          "MSMEs contribute 39.5% of GDP, RM652.4 billion in 2024 (DOSM, MSME Performance 2024)",
          "28,294 enterprises closed in 2024, and only 69.9% survive five years (DOSM, Business Demography 2024)",
          "30 to 35% of new F&B ventures close within 12 to 18 months (MFBEA, Retail Group Malaysia)",
        ],
      },
      {
        title: "Business model",
        items: [
          "Free: 3 analyses, 3 PDF downloads and 3 AI answers, for trying one location",
          "Pro, $17.99 a month: unlimited analyses and PDFs, plus comparisons, the simulator and the heatmap",
          "Event listing, $6.99 per event: organisers' bazaars and expos shown to nearby businesses",
          "Revenue from tiered subscriptions and credit-based usage",
        ],
      },
      {
        title: "Validation",
        items: [
          "Tested with a student entrepreneur, a restaurant owner and small business owners",
        ],
      },
      {
        title: "Stated limits",
        items: [
          "The Success Score is a comparison aid and has not been validated against real business outcomes",
          "Projections from stated inputs, not financial advice",
        ],
      },
    ],
    repositoryUrl: "https://github.com/HAIZ4D/spotential",
    liveUrl: "https://spotential-app.web.app",
    videoUrl: "https://www.youtube.com/watch?v=ojN8QHzWbfw",
  },
  {
    id: "squadview",
    image: "/projects/squadview.png",
    title: "SquadView",
    role: "Developer",
    context: "Personal project",
    period: "Jul 2026 – Aug 2026",
    category: "Personal Project",
    status: "completed",
    description:
      "A local web app for Football Manager 26 that tracks squad development across seasons: upload the squad once a season and see whether each player improved and whether the squad is stronger than before.",
    highlights: [
      "Two headline numbers: squad strength (mean rating, transfers included) and development (mean change for players present in both seasons), which together show whether a squad was \"bought, not built\"",
      "CSV import from the FM26 player export, parsed and rated in the browser and re-validated on the server",
      "Ratings as a weighted average of position-preset attributes, scaled 0–100 and recomputed when a player's position changes",
      "Player identity kept separate from per-season snapshots, so history persists across seasons",
      "Rating and comparison logic covered by automated tests",
    ],
    technologies: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "PostgreSQL",
      "Prisma 7",
      "PapaParse",
      "Vitest",
    ],
    repositoryUrl: "https://github.com/Firrrd/SquadView_FM26",
  },
  {
    id: "scrap2go",
    image: "/projects/scrap2go.png",
    imageFit: "contain",
    title: "Scrap2Go",
    role: "UI Developer",
    context: "Entrepreneurship in Computing course project",
    period: "Oct 2025 – Jan 2026",
    category: "Course Project",
    status: "completed",
    description:
      "A digital platform that streamlines end-of-life vehicle disposal for owners.",
    highlights: [
      "Designed and developed the responsive user interface",
      "AI-powered vehicle valuation",
      "Automated towing dispatch",
      "Integrated JPJ e-deregistration",
    ],
    technologies: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4"],
    repositoryUrl: "https://github.com/naimmazni/scrap2go",
    liveUrl: "https://scrap2go.vercel.app",
  },
  {
    id: "refeed",
    image: "/projects/refeed.png",
    title: "ReFeed",
    role: "Scrum Master · Technical & Development Lead",
    context: "Software Development Methodology course project",
    period: "Oct 2025 – Jan 2026",
    category: "Course Project",
    status: "completed",
    description:
      "A web marketplace connecting food waste generators (restaurants) with farmers and feed processors.",
    highlights: [
      "Led Agile (Scrum) development and coordinated team delivery",
      "Hyper-local matching of generators and farmers within a 5–10km radius",
      "Photo-based waste verification",
      "ESG impact dashboard tracking waste reduction and carbon footprint",
    ],
    technologies: [
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "Firebase",
      "Google Maps API",
    ],
    team: "Team of seven",
    sections: [
      {
        title: "Problem",
        items: [
          "Food businesses pay high fees to have organic waste collected and sent to landfill, while small farmers face rising feed and fertiliser costs.",
          "Businesses are paying to throw away what farmers would pay for.",
        ],
      },
      {
        title: "For food generators",
        items: [
          "Create and manage waste listings",
          "Upload verification photos",
          "Set pickup schedules",
          "Manage orders",
        ],
      },
      {
        title: "For farmers",
        items: [
          "Browse and filter listings by type and location",
          "Reserve on a first-come-first-served basis",
          "View pickup schedules",
          "Rate generators after collection",
        ],
      },
      {
        title: "Market validation",
        items: [
          "Surveys of 40 food vendors and 30 agricultural producers",
          "60% of businesses generate surplus food daily",
          "82.5% cite lack of redistribution channels as the biggest barrier",
          "77.5% would list surplus on a digital platform",
          "Over 93% of farmers describe feed costs as high or very high",
          "73.3% are interested in surplus food for feed or compost",
        ],
      },
      {
        title: "Delivery",
        items: [
          "Agile Scrum over a 12-week plan in three phases",
          "Weeks 1–4: role-based accounts and photo-based waste verification with a waste taxonomy",
          "Weeks 5–8: 5–10km radius matching and pickup scheduling",
          "Weeks 9–12: ESG dashboard, ratings and a pilot",
        ],
      },
      {
        title: "Engineering work",
        items: [
          "Use case, class and package diagrams",
          "Functional and non-functional requirements",
          "Architecture: client-server, serverless, component-based",
          "User acceptance testing for both roles",
        ],
      },
      {
        title: "Business model",
        items: [
          "5–10% commission on each completed transaction",
          "Optional premium subscription",
        ],
      },
      {
        title: "Roadmap",
        items: [
          "Route planning, new-listing alerts and a Bahasa Melayu interface",
          "AI contamination detection, business licence verification and offline support",
          "Recommendations, national ESG reporting and a Flutter mobile app",
        ],
      },
    ],
    repositoryUrl: "https://github.com/ahmad-zhafir/ReFeed",
    liveUrl: "https://re-feed-nine.vercel.app",
  },
  {
    id: "myaccesscare",
    image: "/projects/myaccesscare.png",
    title: "MyAccessCare",
    role: "UI Developer",
    context: "NEXG Godamlah 2.0 Smart ID Hackathon",
    period: "Dec 2025",
    category: "Hackathon",
    status: "completed",
    prototypeOnly: true,
    description:
      "A hackathon concept and interactive Figma prototype for a web healthcare platform that uses MyKad as a secure Master Patient Index to unify patient identity across fragmented medical systems without a central database.",
    highlights: [
      "Designed the prototype's user interface in Figma",
      "Proposed interoperable data access using HL7 FHIR standards",
      "Proposed secure emergency \"break-glass\" access to critical patient information",
      "Proposed zero-retention architecture to preserve data privacy",
    ],
    technologies: ["Figma", "MyKad", "HL7 FHIR"],
    team: "InfiniTea Crew, team of three",
    sections: [
      {
        title: "Problem",
        items: [
          "Patient records are siloed across hospitals and clinics, causing repeated tests and treatment delays.",
          "First responders have no immediate access to identity, allergies, medication history or blood type.",
        ],
      },
      {
        title: "Solution",
        items: [
          "No new card or app for citizens; the physical MyKad is the only key.",
          "An interoperability layer fetches records on demand from existing systems.",
        ],
      },
      {
        title: "Users",
        items: [
          "Healthcare providers: doctors, nurses, clinic administrators",
          "First responders: paramedics, emergency room staff",
        ],
      },
      {
        title: "Key features",
        items: [
          "\"Break-Glass\" scanner: a paramedic scans the MyKad and instantly sees the \"Vital 5\"; an offline mode reads from an encrypted local cache when there is no connectivity",
          "Universal record viewer: a doctor inserts the MyKad into a reader and sees a unified timeline of the patient's history pulled from linked hospitals",
        ],
      },
      {
        title: "Security model",
        items: [
          "Consent-first, with break-glass access for emergencies",
          "Data stays in each hospital's own system, so there is no central database to breach",
        ],
      },
      {
        title: "Pitch summary: the \"3 S\"",
        items: [
          "Speed: turning the \"golden hour\" into the \"golden minute\"",
          "Savings: fewer duplicate X-rays and lab tests",
          "Security: decentralised storage",
        ],
      },
    ],
    prototypeUrl:
      "https://www.figma.com/proto/1mpoV5BcKDaVHDLm5j3n6L/Main?node-id=6-4&starting-point-node-id=6%3A4&t=ZMQrmb8zbsLXG90V-1",
  },
];
