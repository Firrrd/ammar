import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

/*
  The picture shown when a link to the site is shared (WhatsApp, LinkedIn and
  so on). Next.js finds this file by its name, runs it once at build time,
  and adds the <meta> tags that point to the result.

  It is drawn from JSX, but by an image library, not a browser: only inline
  styles and flexbox work, so there are no Tailwind classes here and the
  colours are written out (they match globals.css).
*/

export const alt = `${profile.name} · ${profile.bio}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#0a1628";
const BORDER = "#1e3050";
const TEXT_PRIMARY = "#f1f5f9";
const TEXT_SECONDARY = "#a9b8ce";
const TEXT_DIM = "#7f93b3";

/** Reads a file from public/ as a data URL, the form an <img> here needs. */
async function publicImage(file: string, type: string) {
  const data = await readFile(join(process.cwd(), "public", file));
  return `data:${type};base64,${data.toString("base64")}`;
}

export default async function OpenGraphImage() {
  const [logo, avatar] = await Promise.all([
    publicImage("logo.png", "image/png"),
    publicImage(profile.avatar.replace(/^\//, ""), "image/jpeg"),
  ]);
  const facts = profile.facts.map((fact) => fact.label).join("  ·  ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 80,
          background: NAVY,
          color: TEXT_SECONDARY,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- not a web page; next/image does not work here */}
          <img src={logo} alt="" width={246} height={60} />
          <div style={{ marginTop: 56, fontSize: 84, color: TEXT_PRIMARY, letterSpacing: -2 }}>
            {profile.name}
          </div>
          <div style={{ marginTop: 12, fontSize: 36 }}>{profile.bio}</div>
          <div style={{ marginTop: 28, fontSize: 24, color: TEXT_DIM }}>{facts}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt=""
          width={280}
          height={280}
          style={{ borderRadius: 9999, border: `6px solid ${BORDER}` }}
        />
      </div>
    ),
    size,
  );
}
