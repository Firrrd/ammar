import { NewTabHint } from "@/components/ui/NewTabHint";
import { profile } from "@/content/profile";

export function Footer() {
  const links = [
    ...profile.links.map((link) => ({ label: link.label, href: link.href })),
    { label: "CV", href: profile.cvUrl },
  ];

  return (
    <footer className="border-t border-border">
      <div className="flex flex-col gap-3 py-6 px-page sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-text-dim">
          © {new Date().getFullYear()} {profile.name} · A Man on A Mission
        </p>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
          {links.map((link) => {
            const opensNewTab = !link.href.startsWith("mailto:");
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={opensNewTab ? "_blank" : undefined}
                  rel={opensNewTab ? "noopener noreferrer" : undefined}
                  // py-1 makes the tappable area at least 24px tall.
                  className="inline-block py-1 text-text-dim transition-colors hover:text-text-primary"
                >
                  {link.label}
                  {opensNewTab && <NewTabHint />}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
