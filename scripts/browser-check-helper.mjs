/**
 * A small helper for checking the built site in a real browser.
 *
 * It starts Microsoft Edge with no window ("headless") and controls one page
 * through Edge's DevTools protocol, with no extra libraries. Used during
 * development to verify things a unit test cannot see: clicks, key presses,
 * focus, scrolling, layout at different screen sizes, and screenshots.
 *
 * Use it from a throwaway script, with the built site already running
 * (npm run build, then npx next start -p 3111):
 *
 *   import { launch, sleep } from "./browser-check-helper.mjs";
 *   const page = await launch("C:/some/folder/for/output");
 *   await page.size(390, 800, true);                 // a phone
 *   await page.go("http://localhost:3111/#projects");
 *   const cards = await page.ev(`document.querySelectorAll("li button").length`);
 *   await page.shot("projects.png");
 *   page.close();
 *
 * CAUTION: .env.local holds a real Resend key. A script that submits the
 * contact form for real will send a real email. Replace window.fetch in the
 * page with a fake before submitting, as the Feature 10 checks did.
 */
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @param {string} out   Folder for screenshots and the browser's temporary profile.
 * @param {number} port  DevTools port. Use a different one per script run at the same time.
 */
export async function launch(out, port = 9340) {
  const browser = spawn(EDGE, [
    "--headless=new",
    "--disable-gpu",
    `--remote-debugging-port=${port}`,
    "--window-size=1280,800",
    `--user-data-dir=${out}/edge-profile-${port}`,
    "about:blank",
  ]);

  // Wait for the browser to start and report its page.
  let target;
  for (let attempt = 0; attempt < 40 && !target; attempt++) {
    await sleep(250);
    try {
      const pages = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      target = pages.find((page) => page.type === "page");
    } catch {
      // not up yet
    }
  }

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => socket.addEventListener("open", resolve));

  // Each command gets a number; the reply with the same number resolves it.
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  });

  /** Sends one DevTools protocol command, e.g. send("Page.navigate", { url }). */
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = ++nextId;
      pending.set(id, resolve);
      socket.send(JSON.stringify({ id, method, params }));
    });

  /** Runs JavaScript in the page and returns its result. Promises are awaited. */
  const ev = async (expression) => {
    const reply = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    const problem = reply.result.exceptionDetails;
    if (problem) throw new Error(JSON.stringify(problem.exception?.description ?? problem));
    return reply.result.result.value;
  };

  /** Sets the screen size. mobile=true also makes it behave like a phone. */
  const size = (width, height, mobile = false) =>
    send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });

  /** Opens a URL and waits for the page to settle. */
  const go = async (url, wait = 2500) => {
    await send("Page.navigate", { url });
    await sleep(wait);
  };

  /** Saves a screenshot of what is on screen into the output folder. */
  const shot = async (file) => {
    const reply = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(`${out}/${file}`, Buffer.from(reply.result.data, "base64"));
  };

  const close = () => {
    socket.close();
    browser.kill();
  };

  return { send, ev, size, go, shot, close };
}
