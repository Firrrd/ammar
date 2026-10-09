import { describe, expect, it } from "vitest";
import {
  buildContactEmail,
  CONTACT_LIMITS,
  hasErrors,
  normaliseContact,
  validateContact,
} from "@/lib/contact";

const valid = { name: "Aina Rahman", email: "aina@example.com", message: "Hello, I would like to talk about an internship." };

describe("normaliseContact", () => {
  it("trims surrounding spaces", () => {
    expect(normaliseContact({ name: "  Aina ", email: " a@b.co ", message: " hi there  " })).toEqual({
      name: "Aina",
      email: "a@b.co",
      message: "hi there",
    });
  });

  it("turns missing or non-text values into empty strings", () => {
    expect(normaliseContact({ name: 42, message: ["x"] })).toEqual({ name: "", email: "", message: "" });
  });

  it("copes with input that is not an object at all", () => {
    for (const raw of [null, undefined, "text", 7]) {
      expect(normaliseContact(raw)).toEqual({ name: "", email: "", message: "" });
    }
  });
});

describe("validateContact", () => {
  it("accepts a sensible message", () => {
    expect(validateContact(valid)).toEqual({});
    expect(hasErrors(validateContact(valid))).toBe(false);
  });

  it("reports every empty field", () => {
    const errors = validateContact({ name: "", email: "", message: "" });
    expect(Object.keys(errors).sort()).toEqual(["email", "message", "name"]);
    expect(hasErrors(errors)).toBe(true);
  });

  it("rejects things that are not email addresses", () => {
    for (const email of ["aina", "aina@", "@example.com", "aina@example", "a b@example.com"]) {
      expect(validateContact({ ...valid, email }).email, email).toBeDefined();
    }
  });

  it("rejects a name or message that is too short", () => {
    expect(validateContact({ ...valid, name: "A" }).name).toBeDefined();
    expect(validateContact({ ...valid, message: "Hi" }).message).toBeDefined();
  });

  it("rejects anything over the length limits", () => {
    expect(validateContact({ ...valid, name: "a".repeat(CONTACT_LIMITS.name.max + 1) }).name).toBeDefined();
    expect(validateContact({ ...valid, message: "a".repeat(CONTACT_LIMITS.message.max + 1) }).message).toBeDefined();
    expect(validateContact({ ...valid, email: `${"a".repeat(200)}@example.com` }).email).toBeDefined();
  });

  it("accepts values exactly at the limits", () => {
    expect(validateContact({ ...valid, name: "a".repeat(CONTACT_LIMITS.name.max) }).name).toBeUndefined();
    expect(validateContact({ ...valid, message: "a".repeat(CONTACT_LIMITS.message.max) }).message).toBeUndefined();
  });
});

describe("buildContactEmail", () => {
  it("puts the sender and the message in the body", () => {
    const email = buildContactEmail(valid);
    expect(email.subject).toBe("Portfolio message from Aina Rahman");
    expect(email.text).toContain("From: Aina Rahman <aina@example.com>");
    expect(email.text).toContain(valid.message);
  });

  it("removes line breaks from the name, so it cannot add email headers", () => {
    const email = buildContactEmail({ ...valid, name: "Aina\r\nBcc: someone@evil.example" });
    expect(email.subject).not.toMatch(/[\r\n]/);
  });
});
