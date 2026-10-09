/**
 * Rules for the contact form. Pure functions with no browser or server
 * code in them, so the form (in the browser) and the route (on the server)
 * both run exactly the same checks.
 */

export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 200 },
  message: { min: 10, max: 5000 },
} as const;

/**
 * Turns whatever arrived into a ContactInput: anything that is not text
 * becomes an empty string, and surrounding spaces are removed. The server
 * cannot trust that a request has the right shape, so it starts here.
 */
export function normaliseContact(raw: unknown): ContactInput {
  const source = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  return {
    name: text(source.name),
    email: text(source.email),
    message: text(source.message),
  };
}

/** Returns a message for each field that is wrong; an empty object means all good. */
export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const { name, email, message } = CONTACT_LIMITS;

  if (!input.name) errors.name = "Please enter your name.";
  else if (input.name.length < name.min) errors.name = "That name looks too short.";
  else if (input.name.length > name.max) errors.name = `Keep your name under ${name.max} characters.`;

  if (!input.email) errors.email = "Please enter your email address.";
  else if (input.email.length > email.max || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))
    errors.email = "That doesn't look like an email address.";

  if (!input.message) errors.message = "Please write a message.";
  else if (input.message.length < message.min)
    errors.message = `A little more detail, please: at least ${message.min} characters.`;
  else if (input.message.length > message.max)
    errors.message = `Keep your message under ${message.max} characters.`;

  return errors;
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** The email sent to the site owner. Plain text only, so nothing typed into the form can run as markup. */
export function buildContactEmail(input: ContactInput): { subject: string; text: string } {
  // A line break in a subject could be used to smuggle in extra email headers.
  const safeName = input.name.replace(/[\r\n]+/g, " ");
  return {
    subject: `Portfolio message from ${safeName}`,
    text: `From: ${safeName} <${input.email}>\n\n${input.message}\n\n--\nSent from the contact form on your portfolio.`,
  };
}
