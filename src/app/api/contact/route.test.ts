import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";

const valid = {
  name: "Aina Rahman",
  email: "aina@example.com",
  message: "Hello, I would like to talk about an internship.",
};

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

/** Replaces the real fetch, so no test ever contacts Resend. */
function mockResend(status = 200) {
  // The parameter types say what the route passes to fetch, so the tests
  // below can inspect the call. The values themselves are not used here.
  const fetchMock = vi.fn(
    async (...args: [url: string | URL | Request, init?: RequestInit]) =>
      new Response(JSON.stringify({ received: args.length }), { status }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/contact", () => {
  it("rejects a body that is not JSON", async () => {
    const response = await post("not json");
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "invalid-request" });
  });

  it("rejects invalid fields and says which ones", async () => {
    const fetchMock = mockResend();
    vi.stubEnv("RESEND_API_KEY", "test-key");
    const response = await post({ name: "", email: "nope", message: "short" });
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(Object.keys(json.fields).sort()).toEqual(["email", "message", "name"]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("pretends to succeed, and sends nothing, when the hidden field is filled", async () => {
    const fetchMock = mockResend();
    vi.stubEnv("RESEND_API_KEY", "test-key");
    const response = await post({ ...valid, website: "http://spam.example" });
    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("says it is not set up when there is no API key", async () => {
    const fetchMock = mockResend();
    vi.stubEnv("RESEND_API_KEY", "");
    const response = await post(valid);
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "not-configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the message to the profile's email, with reply-to set to the sender", async () => {
    const fetchMock = mockResend();
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("CONTACT_TO_EMAIL", "");
    const response = await post(valid);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer test-key");
    const sent = JSON.parse(init?.body as string);
    expect(sent.to).toEqual(["ammarfirdaus15@gmail.com"]);
    expect(sent.reply_to).toBe("aina@example.com");
    expect(sent.subject).toBe("Portfolio message from Aina Rahman");
    expect(sent.text).toContain(valid.message);
    expect(sent.html).toBeUndefined();
  });

  it("uses CONTACT_TO_EMAIL when it is set", async () => {
    const fetchMock = mockResend();
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("CONTACT_TO_EMAIL", "other@example.com");
    await post(valid);
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string).to).toEqual(["other@example.com"]);
  });

  it("reports a failure when Resend refuses, without leaking the message to the log", async () => {
    mockResend(401);
    vi.stubEnv("RESEND_API_KEY", "bad-key");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await post(valid);
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "send-failed" });
    expect(log.mock.calls.flat().join(" ")).not.toContain(valid.message);
    expect(log.mock.calls.flat().join(" ")).not.toContain(valid.email);
  });

  it("reports a failure when Resend cannot be reached", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network down"); }));
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await post(valid);
    expect(response.status).toBe(502);
  });
});
