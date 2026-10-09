"use client";

import type { PointerEvent } from "react";
import { Greeting } from "@/components/profile/Greeting";
import { profile } from "@/content/profile";

/**
 * The strip across the top of the profile: a typed greeting over a slowly
 * drifting dot grid, with a soft shade that follows the cursor. It is the one
 * light area on the site: the site's own two colours swapped, off-white
 * (accent) behind and navy (bg) for the text. The moving
 * background is CSS (globals.css); only the cursor light needs this script.
 */
export function Banner() {
  // Tell the CSS where the cursor is, as two custom properties. Written
  // straight to the element, so moving the mouse does not re-render React.
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      className="banner relative aspect-[3/1] max-h-[280px] w-full overflow-hidden border-b border-border bg-accent text-bg"
    >
      <div aria-hidden="true" className="banner-dots absolute inset-0" />
      <div aria-hidden="true" className="banner-glow absolute" />
      <div aria-hidden="true" className="banner-spot absolute inset-0" />

      {/* Top-aligned on phones, where the avatar covers the bottom-left corner. */}
      <div className="relative flex h-full flex-col justify-start pt-4 px-page sm:justify-center sm:pb-8 sm:pt-0">
        <p className="font-mono text-[11px] lowercase text-bg/70 sm:text-xs">
          <span aria-hidden="true" className="text-bg">
            {"// "}
          </span>
          welcome
        </p>
        <Greeting phrases={profile.greetings} />
      </div>
    </div>
  );
}
