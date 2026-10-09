import { profile } from "@/content/profile";
import { getEmailAddress } from "@/lib/content";
import { buildContactEmail, hasErrors, normaliseContact, validateContact } from "@/lib/contact";

/*
  POST /api/contact

  Runs on the server. The contact form sends its fields here; this checks
  them again (a request can be made without the form, so the browser's
  checks cannot be trusted) and asks Resend to email them to the site owner.

  Settings come from environment variables (see .env.example):
    RESEND_API_KEY      required; the form reports "not set up" without it
    CONTACT_TO_EMAIL    optional; defaults to the email in the profile
    CONTACT_FROM_EMAIL  optional; defaults to Resend's shared test sender
*/

const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid-request" }, { status: 400 });
  }

  // "website" is a field hidden from people. Only automated form-fillers
  // complete it, so answer as if it worked and send nothing.
  if (typeof body === "object" && body !== null && "website" in body && body.website) {
    return Response.json({ ok: true });
  }

  const input = normaliseContact(body);
  const errors = validateContact(input);
  if (hasErrors(errors)) {
    return Response.json({ error: "invalid-fields", fields: errors }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "not-configured" }, { status: 503 });
  }

  const { subject, text } = buildContactEmail(input);
  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
        to: [process.env.CONTACT_TO_EMAIL || getEmailAddress(profile)],
        // Pressing "reply" in the inbox answers the person who wrote.
        reply_to: input.email,
        subject,
        text,
      }),
    });
    if (!response.ok) {
      // Log the status only: never the message or the sender's details.
      console.error(`Contact form: Resend answered ${response.status}`);
      return Response.json({ error: "send-failed" }, { status: 502 });
    }
  } catch {
    console.error("Contact form: could not reach Resend");
    return Response.json({ error: "send-failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
