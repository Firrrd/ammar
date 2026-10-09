"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ContactButton } from "@/components/contact/ContactButton";
import { CvButton } from "@/components/profile/CvButton";
import { profile } from "@/content/profile";

const TOP_BAR_HEIGHT = 56;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** True once the page has been scrolled away from the very top. */
function useScrolled() {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 0,
    () => false, // on the server there is no scroll position yet
  );
}

/**
 * Whether the profile's own CV and Contact buttons are on screen (below the
 * top bar). The browser reports this through an IntersectionObserver, which
 * calls back only when the answer changes, not on every scroll.
 */
function useProfileActionsOnScreen(pathname: string) {
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const actions = document.getElementById("profile-actions");
    if (!actions) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      // Shrink the "screen" by the top bar's height: hidden behind the bar counts as gone.
      rootMargin: `-${TOP_BAR_HEIGHT}px 0px 0px 0px`,
    });
    observer.observe(actions);
    return () => observer.disconnect();
  }, [pathname]);

  return onScreen;
}

export function TopBar() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const profileActionsOnScreen = useProfileActionsOnScreen(pathname);

  // The profile block has its own CV and Contact buttons, so on the home
  // page the bar shows its pair only once those have scrolled away. Other
  // pages have no profile block, so the bar always shows them.
  const onHomePage = pathname === "/";
  const showActions = !onHomePage || !profileActionsOnScreen;
  const showIdentity = onHomePage && !profileActionsOnScreen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b bg-bg transition-colors duration-300 ${
        scrolled ? "border-border" : "border-transparent"
      }`}
    >
      <div className="flex h-14 items-center justify-between px-page">
        <div className="flex min-w-0 items-center gap-3">
          <a href="#" aria-label={`${profile.name}, back to top`} className="shrink-0">
            <Image
              src="/logo.png"
              alt=""
              width={394}
              height={96}
              loading="eager"
              className="h-6 w-auto"
            />
          </a>

          {/* A reminder of whose page this is, once the profile has scrolled away. */}
          <div
            aria-hidden="true"
            className={`hidden items-center gap-2 border-l border-border pl-3 transition duration-300 sm:flex ${
              showIdentity ? "opacity-100" : "-translate-y-1 opacity-0"
            }`}
          >
            <Image
              src={profile.avatar}
              alt=""
              width={48}
              height={48}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="truncate text-[13px] font-medium text-text-primary">
              {profile.name}
            </span>
          </div>
        </div>

        {/* inert: while hidden, the buttons cannot be clicked or reached with Tab. */}
        <nav
          aria-label="Quick actions"
          inert={!showActions}
          className={`flex shrink-0 items-center gap-2 transition duration-300 ${
            showActions ? "opacity-100" : "translate-y-1 opacity-0"
          }`}
        >
          <CvButton />
          <ContactButton />
        </nav>
      </div>
    </header>
  );
}
