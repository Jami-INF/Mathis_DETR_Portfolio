// scripts/generate-og.mjs
// Génère l'image de partage (Open Graph) 1200x630 aux couleurs du site.
// Usage : node scripts/generate-og.mjs
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/og-image.jpg");

const star = (tx, ty, scale, rot) => `
  <g transform="translate(${tx},${ty}) scale(${scale}) rotate(${rot})">
    <g fill="#edd1f1" stroke="#201920" stroke-width="5" stroke-linejoin="round">
      <rect x="-30" y="-5" width="60" height="10" rx="5"/>
      <rect x="-30" y="-5" width="60" height="10" rx="5" transform="rotate(60)"/>
      <rect x="-30" y="-5" width="60" height="10" rx="5" transform="rotate(120)"/>
    </g>
    <g fill="#edd1f1">
      <rect x="-30" y="-5" width="60" height="10" rx="5"/>
      <rect x="-30" y="-5" width="60" height="10" rx="5" transform="rotate(60)"/>
      <rect x="-30" y="-5" width="60" height="10" rx="5" transform="rotate(120)"/>
    </g>
  </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f8f6f2"/>
  <g stroke="#41382c" stroke-width="2" opacity="0.06">
    ${Array.from({ length: 27 }, (_, i) => `<line x1="${i * 46}" y1="0" x2="${i * 46}" y2="630"/>`).join("")}
    ${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${i * 46}" x2="1200" y2="${i * 46}"/>`).join("")}
  </g>

  ${star(980, 200, 1.7, 16)}
  ${star(1090, 470, 0.9, -12)}

  <g font-family="Helvetica, Arial, sans-serif" font-weight="800" fill="#edd1f1" stroke="#201920" stroke-width="3" paint-order="stroke" letter-spacing="-2">
    <text x="90" y="270" font-size="104">MATHIS</text>
    <text x="90" y="380" font-size="104">DETROUSSAT</text>
  </g>

  <text x="94" y="455" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="40" fill="#6f5647">Chargé de projet événementiel</text>
  <text x="96" y="520" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="28" fill="#b05ec0">mathis-detroussat.fr</text>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile(OUT);
console.log("og-image générée :", path.relative(ROOT, OUT));
