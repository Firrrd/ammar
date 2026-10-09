/**
 * Prepares the site's images from the originals in assets/.
 *
 * Run with: npm run images
 *
 * 1. Logos: the source files are light artwork on solid black. The artwork
 *    is a single colour, so each pixel's brightness says how much "logo" is
 *    there. Brightness becomes opacity: black turns fully transparent, the
 *    artwork stays solid, and the soft edges in between stay soft.
 *
 * 2. Avatar: the source is a tall selfie. It is cropped to a square around
 *    the face, so the round avatar shows the face instead of the background.
 *
 * 3. Icons: Ammar's favicon files (cream artwork on a transparent
 *    background, kept transparent at his request) are copied, unchanged, to
 *    the names Next.js looks for in src/app/. It finds them by file name
 *    and adds the <link> tags itself.
 */
import { existsSync } from "node:fs";
import { copyFile } from "node:fs/promises";
import sharp from "sharp";

// The site's accent colour (--color-accent in globals.css).
const INK = [247, 247, 247];

// Brightness below this is treated as pure black, to drop compression noise.
const NOISE_FLOOR = 12;

const logos = [
  { input: "assets/logo.png", output: "public/logo.png", height: 96 },
  { input: "assets/logo-simplify.png", output: "public/logo-mark.png", height: 256 },
];

for (const { input, output, height } of logos) {
  const { data, info } = await sharp(input)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let pixel = 0; pixel < info.width * info.height; pixel++) {
    const from = pixel * info.channels;
    const brightness = Math.max(data[from], data[from + 1], data[from + 2]);
    const to = pixel * 4;
    rgba[to] = INK[0];
    rgba[to + 1] = INK[1];
    rgba[to + 2] = INK[2];
    rgba[to + 3] = brightness < NOISE_FLOOR ? 0 : brightness;
  }

  const result = await sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim() // crop away the empty margin around the artwork
    .resize({ height })
    .png()
    .toFile(output);

  console.log(`${input} -> ${output} (${result.width}x${result.height})`);
}

// Square around the face in the 608x1080 original, in pixels.
const AVATAR_CROP = { left: 70, top: 365, width: 470, height: 470 };

// The uncropped original is private and not in git, so a fresh copy of the
// project will not have it. The cropped public/avatar.jpg is in git already.
if (existsSync("assets/avatar.jpg")) {
  const avatar = await sharp("assets/avatar.jpg")
    .extract(AVATAR_CROP)
    .resize(400, 400)
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile("public/avatar.jpg");

  console.log(`assets/avatar.jpg -> public/avatar.jpg (${avatar.width}x${avatar.height})`);
} else {
  console.log("assets/avatar.jpg not found; keeping the existing public/avatar.jpg");
}

const icons = [
  { input: "assets/favicon-512x512.png", output: "src/app/icon.png" }, // browser tabs
  { input: "assets/favicon-180x180.png", output: "src/app/apple-icon.png" }, // iPhone home screen
];

for (const { input, output } of icons) {
  await copyFile(input, output);
  console.log(`${input} -> ${output}`);
}
