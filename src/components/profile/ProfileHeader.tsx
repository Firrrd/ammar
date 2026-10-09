import Image from "next/image";
import type { CSSProperties } from "react";
import { ContactButton } from "@/components/contact/ContactButton";
import { Banner } from "@/components/profile/Banner";
import { CvButton } from "@/components/profile/CvButton";
import { StatsRow } from "@/components/profile/StatsRow";
import { Button } from "@/components/ui/Button";
import { factIcons, linkIcons } from "@/components/ui/icons";
import { achievements } from "@/content/achievements";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { getStats } from "@/lib/content";

/** Position in the entrance sequence: each step starts a little after the one before. */
const step = (index: number) => ({ "--i": index }) as CSSProperties;

export function ProfileHeader() {
  const stats = getStats(projects, achievements, profile.cgpa);

  return (
    <section id="profile" aria-labelledby="profile-name">
      <Banner />

      <div className="px-page">
        {/* Avatar on the left, pulled up over the banner; buttons on the right. */}
        <div id="profile-actions" className="flex items-end justify-between gap-4">
          <div className="rise-in -mt-12 shrink-0 sm:-mt-14" style={step(0)}>
            <Image
              src={profile.avatar}
              alt={profile.name}
              width={400}
              height={400}
              loading="eager"
              className="h-24 w-24 rounded-full bg-surface object-cover ring-4 ring-bg sm:h-28 sm:w-28"
            />
          </div>
          <div className="rise-in flex items-center gap-2 pt-3" style={step(1)}>
            <CvButton />
            <ContactButton />
          </div>
        </div>

        <div className="mt-3 max-w-[75ch] space-y-3">
          <div className="rise-in" style={step(2)}>
            <h1
              id="profile-name"
              className="text-[28px] font-bold leading-tight text-text-primary sm:text-4xl"
            >
              {profile.name}
            </h1>
            <p className="text-[13px] text-text-dim">
              {profile.handle}
              {profile.status && (
                <>
                  {" "}
                  <span className="text-border-light">|</span> {profile.status}
                </>
              )}
            </p>
          </div>

          <p className="rise-in text-[15px] leading-relaxed" style={step(3)}>
            {profile.bio}
          </p>

          <ul
            className="rise-in flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-text-dim"
            style={step(4)}
          >
            {profile.facts.map((fact) => {
              const Icon = factIcons[fact.kind];
              return (
                <li key={fact.kind} className="flex items-center gap-1.5">
                  <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                  {fact.label}
                </li>
              );
            })}
            {profile.availability && (
              <li className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
                </span>
                {profile.availability}
              </li>
            )}
          </ul>

          <nav
            aria-label="Profiles and contact"
            className="rise-in flex flex-wrap gap-2"
            style={step(5)}
          >
            {profile.links.map((link) => {
              const Icon = linkIcons[link.kind];
              return (
                <Button key={link.kind} href={link.href}>
                  <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                  {link.label}
                </Button>
              );
            })}
          </nav>

          <div className="rise-in" style={step(6)}>
            <StatsRow stats={stats} />
          </div>
        </div>
      </div>
    </section>
  );
}
