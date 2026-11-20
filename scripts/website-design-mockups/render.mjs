/**
 * Renders the website design mockups used by the "Types of website design"
 * article to optimised images in public/images/insights.
 *
 *   node scripts/website-design-mockups/render.mjs            every mockup, then the cover
 *   node scripts/website-design-mockups/render.mjs minimalist  just the ones named
 *
 * Each mockup is a plain HTML page sized 1600 x 1000. A headless Chromium
 * browser (Microsoft Edge or Google Chrome, or the one named in $BROWSER)
 * screenshots it at 2x, and sharp - already installed alongside Next.js -
 * converts the capture to WebP. The cover is a collage of the finished
 * mockups, so it is always rendered last, as a JPEG for social cards, with
 * the 4:3 and 1:1 crops that article structured data asks for.
 */
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import sharp from "sharp"

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, "../..")
const examplesDir = path.join(root, "public/images/insights/types-of-website-design")
const coverBase = path.join(root, "public/images/insights/types-of-website-design")

const BROWSERS = [
  process.env.BROWSER,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
]

const browser = BROWSERS.find((candidate) => candidate && existsSync(candidate))
if (!browser) {
  console.error("No Chromium browser found. Set $BROWSER to the path of Chrome or Edge.")
  process.exit(1)
}

const scratch = mkdtempSync(path.join(tmpdir(), "website-design-mockups-"))

/** A 2x screenshot of one page, as a PNG buffer. */
async function capture(file, width, height) {
  const shot = path.join(scratch, `${path.basename(file, ".html")}.png`)
  const result = spawnSync(
    browser,
    [
      "--headless=new",
      "--hide-scrollbars",
      "--force-device-scale-factor=2",
      `--window-size=${width},${height}`,
      // Web fonts load over the network; virtual time waits for them without a fixed sleep
      "--virtual-time-budget=8000",
      `--user-data-dir=${path.join(scratch, "profile")}`,
      `--screenshot=${shot}`,
      pathToFileURL(file).href,
    ],
    { stdio: "pipe" },
  )
  if (!existsSync(shot)) {
    throw new Error(`Screenshot failed for ${file}: ${result.stderr?.toString()}`)
  }
  return sharp(shot).toBuffer()
}

async function renderExample(name) {
  const png = await capture(path.join(here, `${name}.html`), 1600, 1000)
  const target = path.join(examplesDir, `${name}.webp`)
  await sharp(png).resize(2400, 1500).webp({ quality: 82, effort: 6 }).toFile(target)
  console.log(`  ${path.relative(root, target)}`)
}

async function renderCover() {
  const png = await capture(path.join(here, "cover.html"), 1600, 900)
  const jpeg = { quality: 84, mozjpeg: true }
  const full = sharp(png).resize(2400, 1350)

  await full.clone().jpeg(jpeg).toFile(`${coverBase}.jpg`)
  // The crops keep the middle of the collage, where the tiles are densest
  await full.clone().resize(1800, 1350, { fit: "cover", position: "centre" }).jpeg(jpeg).toFile(`${coverBase}-4x3.jpg`)
  await full.clone().resize(1350, 1350, { fit: "cover", position: "centre" }).jpeg(jpeg).toFile(`${coverBase}-1x1.jpg`)
  console.log(`  ${path.relative(root, coverBase)}{,-4x3,-1x1}.jpg`)
}

mkdirSync(examplesDir, { recursive: true })

const requested = process.argv.slice(2)
const examples = readdirSync(here)
  .filter((file) => file.endsWith(".html") && file !== "cover.html")
  .map((file) => file.replace(/\.html$/, ""))
  .filter((name) => requested.length === 0 || requested.includes(name))

try {
  console.log(`Rendering with ${browser}`)
  for (const name of examples) await renderExample(name)
  if (requested.length === 0 || requested.includes("cover")) await renderCover()
} finally {
  rmSync(scratch, { recursive: true, force: true })
}
