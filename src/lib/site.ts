// Vercel sets this on every build to the live site's domain, without "https://".
const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const site = {
  name: "Ammar Firdaus",
  title: "Ammar Firdaus · Software Engineering Student",
  description:
    "Portfolio of Ammar Firdaus, a final-year Software Engineering student at Universiti Putra Malaysia building web applications with React, Next.js and TypeScript.",
  // The site's public address. Link previews need full addresses for their
  // image, so "/opengraph-image" is joined to this. Locally there is no domain.
  url: productionDomain ? `https://${productionDomain}` : "http://localhost:3000",
} as const;
