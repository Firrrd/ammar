"use client";

import { useContact } from "@/components/contact/ContactPopup";
import { Button } from "@/components/ui/Button";

/** The "Contact" button, used in the top bar and the profile header. */
export function ContactButton() {
  const { openContact } = useContact();
  return (
    <Button variant="filled" aria-haspopup="dialog" onClick={openContact}>
      Contact
    </Button>
  );
}
