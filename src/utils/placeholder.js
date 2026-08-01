/**
 * Inline SVG placeholders as data URIs.
 *
 * Every restaurant in the staging city_id=118 response carries the *same*
 * `logo` URL, and that S3 object 404s — so in practice every image needs a
 * fallback. Keeping the fallback inline means it can't itself fail, and
 * tinting it per restaurant keeps a list of them from looking broken.
 */

const svg = (markup) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(markup.replace(/\s+/g, " ").trim())}`;

/**
 * Escape text before it goes into SVG markup. The restaurant name is
 * API-controlled, so an unescaped `&`, `<`, `>` or quote would corrupt the
 * SVG (or worse) — this closes that injection surface.
 */
const esc = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Warm tones that sit alongside the brand orange without clashing.
const TINTS = [
  ["#FFF3EC", "#FF9F63"],
  ["#FFF7E8", "#F0A93B"],
  ["#FDF0F2", "#E9738D"],
  ["#EFF6F1", "#5FA97D"],
  ["#F1F2FA", "#7B82C9"],
  ["#FBF0FA", "#B573AE"],
];

function hashCode(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Neutral plate-and-cutlery tile — the generic, name-less fallback. */
export const PLACEHOLDER_IMAGE = svg(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" fill="#FFF3EC"/>
    <circle cx="60" cy="60" r="26" fill="none" stroke="#FFC49E" stroke-width="3"/>
    <circle cx="60" cy="60" r="14" fill="#FFE4D3"/>
  </svg>
`);

/**
 * A tile carrying the restaurant's initial, tinted deterministically from its
 * name so the same restaurant always gets the same colour.
 *
 * `wide` returns a banner-shaped variant for the item-detail hero, where a
 * square tile's initial would otherwise blow up to fill the whole image.
 */
export function placeholderFor(name = "", { wide = false } = {}) {
  const label = esc((name.trim()[0] || "?").toUpperCase());
  const [bg, fg] = TINTS[hashCode(name) % TINTS.length];

  if (!wide) {
    return svg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <rect width="120" height="120" fill="${bg}"/>
        <circle cx="60" cy="60" r="34" fill="${fg}" opacity="0.14"/>
        <text x="60" y="60" fill="${fg}" font-family="Sora, Inter, sans-serif"
              font-size="48" font-weight="700" text-anchor="middle"
              dominant-baseline="central">${label}</text>
      </svg>
    `);
  }

  return svg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 224">
      <rect width="360" height="224" fill="${bg}"/>
      <circle cx="180" cy="104" r="46" fill="${fg}" opacity="0.16"/>
      <circle cx="180" cy="104" r="46" fill="none" stroke="${fg}"
              stroke-opacity="0.35" stroke-width="2"/>
      <text x="180" y="104" fill="${fg}" font-family="Sora, Inter, sans-serif"
            font-size="42" font-weight="700" text-anchor="middle"
            dominant-baseline="central">${label}</text>
      <text x="180" y="176" fill="${fg}" font-family="Inter, sans-serif"
            font-size="13" font-weight="600" text-anchor="middle"
            opacity="0.75">No photo available</text>
    </svg>
  `);
}

/** Decorative dish artwork for the Home promo banner. */
export const PROMO_IMAGE = svg(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 104">
    <rect width="120" height="104" fill="#FF5A1F"/>
    <circle cx="72" cy="52" r="46" fill="#FF7A38"/>
    <circle cx="72" cy="52" r="34" fill="#FFD8B0"/>
    <circle cx="72" cy="52" r="27" fill="#FFB067"/>
    <circle cx="62" cy="42" r="5" fill="#E23B1B"/>
    <circle cx="82" cy="48" r="5" fill="#E23B1B"/>
    <circle cx="66" cy="62" r="5" fill="#E23B1B"/>
    <circle cx="84" cy="66" r="4" fill="#E23B1B"/>
    <circle cx="72" cy="34" r="3.5" fill="#7FB069"/>
    <circle cx="56" cy="55" r="3" fill="#7FB069"/>
  </svg>
`);

/**
 * <img onError> handler. Swaps in the tinted placeholder built from the
 * image's own alt text, exactly once (so a broken fallback can't loop).
 */
export function onImageError(event) {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = "true";
  img.src = placeholderFor(img.alt || "");
}
