"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import {
  CONTACT_LIMITS,
  hasErrors,
  normaliseContact,
  validateContact,
  type ContactErrors,
} from "@/lib/contact";

// What the form is doing right now. One value, so it can never be
// "sending" and "sent" at the same time.
type Status = "idle" | "sending" | "sent" | "failed" | "not-configured";

const field =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-dim transition-colors aria-[invalid=true]:border-red";
const label = "mb-1.5 block text-xs font-medium text-text-dim";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs text-red">
      {message}
    </p>
  );
}

export function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser's own page-reloading submit
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // Check in the browser first, so mistakes are reported instantly.
    const found = validateContact(normaliseContact(data));
    setErrors(found);
    if (hasErrors(found)) {
      // Move to the first field that needs fixing.
      const first = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        form.reset();
        setStatus("sent");
        return;
      }
      const result = await response.json().catch(() => ({}));
      if (result.error === "invalid-fields" && result.fields) {
        // The server disagreed with the browser's checks; show what it found.
        setErrors(result.fields);
        setStatus("idle");
      } else {
        setStatus(result.error === "not-configured" ? "not-configured" : "failed");
      }
    } catch {
      setStatus("failed"); // no connection
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-lg border border-border p-6 text-center">
        <p className="text-sm font-medium text-green">Message sent</p>
        <p className="mt-1 text-sm">Thanks, I&apos;ll get back to you soon.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-xs text-text-dim transition-colors hover:text-text-primary"
        >
          Send another
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    // noValidate: our own messages are shown instead of the browser's pop-up bubbles.
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/*
        A trap for automated form-fillers: off-screen and skipped by keyboards
        and screen readers, so people never fill it in. The server discards
        any message that has it filled.
      */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={label}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name.max}
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={field}
          />
          <FieldError id="contact-name-error" message={errors.name} />
        </div>
        <div>
          <label htmlFor="contact-email" className={label}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={CONTACT_LIMITS.email.max}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={field}
          />
          <FieldError id="contact-email-error" message={errors.email} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={label}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          maxLength={CONTACT_LIMITS.message.max}
          placeholder="What would you like to talk about?"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`${field} resize-y`}
        />
        <FieldError id="contact-message-error" message={errors.message} />
      </div>

      {/* role="alert" makes screen readers announce the problem as it appears. */}
      {(status === "failed" || status === "not-configured") && (
        <p role="alert" className="rounded-lg border border-red/40 bg-red/10 px-3.5 py-2.5 text-[13px]">
          {status === "failed"
            ? "Sorry, that didn't send. Please try again, or email me directly at "
            : "The form isn't switched on yet. Please email me directly at "}
          <a href={`mailto:${fallbackEmail}`} className="text-text-primary underline underline-offset-2">
            {fallbackEmail}
          </a>
          .
        </p>
      )}

      <div className="flex items-center justify-end">
        <Button type="submit" variant="filled" disabled={sending}>
          {sending ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
