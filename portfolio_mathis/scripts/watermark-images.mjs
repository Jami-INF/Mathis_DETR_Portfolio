// scripts/watermark-images.mjs
// Redimensionne les photos sources à 2500px max ET grave un filigrane de crédit
// en bas à droite. Idempotent (manifeste) + sauvegarde des originaux.
//
// Usage : node scripts/watermark-images.mjs
import sharp from "sharp";
import { readdir, mkdir, copyFile, readFile, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(ROOT, "src/assets");

// Dossiers de PHOTOS à traiter (on exclut volontairement `element/` = décorations).
const PHOTO_DIRS = ["galerie", "projets", "photos"].map((d) => path.join(ASSETS, d));

const MAX_DIM = 2500;
const CREDIT = "© Mathis DETROUSSAT — mathis-detroussat.fr";
const EXT_OK = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const BACKUP_DIR = path.join(ROOT, ".image-originals-backup");
const MANIFEST = path.join(ROOT, "scripts/.watermark-manifest.json");

async function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (EXT_OK.has(path.extname(e.name).toLowerCase())) out.push(p);
  }
  return out;
}

function watermarkSvg(imgW, text) {
  const fs = Math.max(13, Math.min(20, Math.round(imgW * 0.009)));
  const pad = Math.round(fs * 0.9);
  const tw = Math.ceil(text.length * fs * 0.52);
  const w = tw + pad * 2;
  const h = Math.round(fs + pad * 1.4);
  const x = w - pad;
  const y = h - pad;
  const common = `font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="${fs}" text-anchor="end"`;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      `<text x="${x + 1}" y="${y + 1}" ${common} fill="rgba(0,0,0,0.55)">${text}</text>` +
      `<text x="${x}" y="${y}" ${common} fill="rgba(255,255,255,0.9)">${text}</text>` +
      `</svg>`
  );
}

function encode(pipeline, ext) {
  if (ext === ".png") return pipeline.png({ compressionLevel: 9 });
  if (ext === ".webp") return pipeline.webp({ quality: 82 });
  return pipeline.jpeg({ quality: 82, mozjpeg: true });
}

async function run() {
  const manifest = existsSync(MANIFEST)
    ? JSON.parse(await readFile(MANIFEST, "utf8"))
    : {};

  let files = [];
  for (const d of PHOTO_DIRS) files.push(...(await walk(d)));

  let done = 0,
    skipped = 0,
    before = 0,
    after = 0;

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    if (manifest[rel]) {
      skipped++;
      continue;
    }
    const ext = path.extname(file).toLowerCase();
    const sizeBefore = (await stat(file)).size;

    // Sauvegarde de l'original (une seule fois).
    const backup = path.join(BACKUP_DIR, rel);
    if (!existsSync(backup)) {
      await mkdir(path.dirname(backup), { recursive: true });
      await copyFile(file, backup);
    }

    const resized = await sharp(file, { failOn: "none" })
      .rotate()
      .resize(MAX_DIM, MAX_DIM, { fit: "inside", withoutEnlargement: true })
      .toBuffer();

    const meta = await sharp(resized).metadata();
    const svg = watermarkSvg(meta.width, CREDIT);

    const out = await encode(
      sharp(resized).composite([{ input: svg, gravity: "southeast" }]),
      ext
    ).toBuffer();

    await writeFile(file, out);

    manifest[rel] = { at: new Date().toISOString() };
    before += sizeBefore;
    after += out.length;
    done++;
    console.log(
      `✓ ${rel}  ${(sizeBefore / 1e6).toFixed(1)}Mo → ${(out.length / 1e6).toFixed(2)}Mo`
    );
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(
    `\nTerminé : ${done} traitée(s), ${skipped} ignorée(s).` +
      (done
        ? `  ${(before / 1e6).toFixed(0)}Mo → ${(after / 1e6).toFixed(0)}Mo`
        : "")
  );
  console.log(`Originaux sauvegardés dans : ${path.relative(ROOT, BACKUP_DIR)}/`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
