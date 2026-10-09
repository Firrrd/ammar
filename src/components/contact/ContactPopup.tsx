"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyEmailButton } from "@/components/contact/CopyEmailButton";
import { Button } from "@/components/ui/Button";
import { linkIcons } from "@/components/ui/icons";
import { Modal } from "@/components/ui/Modal";
import { profile } from "@/content/profile";
import { getEmailAddress } from "@/lib/content";

type ContactContext = {
  openContact: () => void;
};

const Context = createContext<ContactContext | null>(null);

/** Lets any component inside <ContactProvider> open the contact pop-up. */
export function useContact(): ContactContext {
  const context = useContext(Context);
  if (!context) throw new Error("useContact must be used inside <ContactProvider>");
  return context;
}

/**
 * Owns the one contact pop-up. It wraps the whole site (see layout.tsx),
 * because the Contact buttons live in two far-apart places: the top bar
 * and the profile header.
 */
export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openContact = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ openContact }), [openContact]);

  const email = getEmailAddress(profile);
  const otherLinks = profile.links.filter((link) => link.kind !== "email");

  return (
    <Context.Provider value={value}>
      {children}
      <Modal open={open} onClose={close} label="Contact" variant="center">
        <h2 className="pr-10 text-lg font-semibold tracking-tight text-text-primary">
          Let&apos;s talk
        </h2>
        <p className="mb-5 mt-1 text-sm">
          An internship, a project or a question. Send me a note.
        </p>

        <ContactForm fallbackEmail={email} />

        <div className="mt-6 border-t border-border pt-4">
          <p className="mb-2 text-xs text-text-dim">Or reach me directly</p>
          <div className="flex flex-wrap gap-2">
            <CopyEmailButton email={email} />
            {otherLinks.map((link) => {
              const Icon = linkIcons[link.kind];
              return (
                <Button key={link.kind} href={link.href}>
                  <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                  {link.label}
                </Button>
              );
            })}
          </div>
        </div>
      </Modal>
    </Context.Provider>
  );
}
