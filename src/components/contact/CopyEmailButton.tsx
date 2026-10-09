"use client";

import { useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";
import { Button } from "@/components/ui/Button";

/** Copies the email address to the clipboard and confirms it for two seconds. */
export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Copying can be refused (an old browser, or permission denied).
      // Opening the mail app is the next best thing.
      window.location.href = `mailto:${email}`;
    }
  }

  const Icon = copied ? LuCheck : LuCopy;
  return (
    <Button onClick={copy}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {/* aria-live: screen readers announce the change to "copied". */}
      <span aria-live="polite">{copied ? "copied" : email}</span>
    </Button>
  );
}
