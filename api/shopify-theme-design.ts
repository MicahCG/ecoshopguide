import {
  ShopifyAdminRequestError,
  shopifyAdminRequest,
} from "../server/shopify-admin.js";

type Theme = { id: string; name: string; role: string };

type ThemeLayoutResponse = {
  theme: {
    files: {
      nodes: Array<{ filename?: string; body?: { content?: string } | null }>;
    } | null;
  } | null;
};

const PREMIUM_STYLESHEET = "ecoshopguide-premium.css";
const PREMIUM_MARKER = "EcoShopGuide premium storefront";
const HOME_MARKER = "EcoShopGuide collection-first homepage";
const HOME_SECTION_FILENAME = "sections/ecg-home-hero.liquid";
const HOME_JSON_TEMPLATE_FILENAME = "templates/index.json";
const HOME_LIQUID_TEMPLATE_FILENAME = "templates/index.liquid";
const HOME_SECTION_TAG = "{% section 'ecg-home-hero' %}";
const COLLECTION_MARKER = "EcoShopGuide collection context hero";
const COLLECTION_SECTION_FILENAME = "sections/ecg-collection-hero.liquid";
const COLLECTION_JSON_TEMPLATE_FILENAME = "templates/collection.json";
const COLLECTION_LIQUID_TEMPLATE_FILENAME = "templates/collection.liquid";
const COLLECTION_SECTION_TAG = "{% section 'ecg-collection-hero' %}";
const HOME_SECTION = `{% comment %} ${HOME_MARKER} {% endcomment %}
<section class="ecg-home-hero" aria-labelledby="ecg-home-title">
    <div class="ecg-home-hero__copy">
      <p class="ecg-eyebrow">Thoughtfully collected</p>
      <h1 id="ecg-home-title">Make your space feel like you.</h1>
      <p class="ecg-home-hero__body">Curated finds for dorm move-in and the cozy, seasonal moments that make a room feel finished.</p>
      <div class="ecg-home-hero__actions">
        <a class="ecg-cta ecg-cta--primary" href="/collections/dorm-decor">Shop Dorm Decor</a>
        <a class="ecg-cta ecg-cta--secondary" href="/collections/fall-halloween">Shop Fall &amp; Halloween</a>
      </div>
      <ul class="ecg-trust-list" role="list">
        <li>Curated small brands</li>
        <li>Secure Shopify checkout</li>
        <li>Delivery shown before purchase</li>
      </ul>
    </div>
    <div class="ecg-home-hero__visual" aria-hidden="true">
      <div class="ecg-home-tile ecg-home-tile--dorm"><span>Dorm<br>move-in</span></div>
      <div class="ecg-home-tile ecg-home-tile--seasonal"><span>Fall<br>rituals</span></div>
      <div class="ecg-home-orbit"></div>
    </div>
  </section>
{% schema %}
{
  "name": "EcoShopGuide home hero",
  "tag": "section",
  "class": "ecg-home-hero-section",
  "settings": []
}
{% endschema %}`;

const COLLECTION_SECTION = `{% comment %} ${COLLECTION_MARKER} {% endcomment %}
{% liquid
  assign ecg_handle = collection.handle
  assign ecg_eyebrow = 'The EcoShopGuide edit'
  assign ecg_title = collection.title
  assign ecg_copy = collection.description | strip_html
  assign ecg_note = 'Thoughtfully collected for the way you live.'
  if ecg_handle == 'dorm-decor'
    assign ecg_eyebrow = 'Move-in, made easy'
    assign ecg_title = 'Dorm Decor'
    assign ecg_copy = 'Small-space essentials for a room that feels like home from day one.'
    assign ecg_note = 'Study, store, soften, repeat.'
  elsif ecg_handle == 'fall-halloween'
    assign ecg_eyebrow = 'Seasonal edit'
    assign ecg_title = 'Fall & Halloween'
    assign ecg_copy = 'Cozy layers, warm texture, and just enough friendly fright.'
    assign ecg_note = 'Pumpkin season, thoughtfully styled.'
  endif
%}
<section class="ecg-collection-hero ecg-collection-hero--{{ ecg_handle }}" aria-labelledby="ecg-collection-title">
  <div class="ecg-collection-hero__copy">
    <p class="ecg-eyebrow">{{ ecg_eyebrow }}</p>
    <h1 id="ecg-collection-title">{{ ecg_title }}</h1>
    <p>{{ ecg_copy }}</p>
    <div class="ecg-collection-hero__actions">
      <a class="ecg-cta ecg-cta--primary" href="#product-grid">Shop the edit</a>
      <a class="ecg-cta ecg-cta--secondary" href="/">Explore all edits</a>
    </div>
  </div>
  <div class="ecg-collection-hero__visual" aria-hidden="true">
    <span class="ecg-collection-hero__label">{{ ecg_note }}</span>
    <span class="ecg-collection-hero__shape ecg-collection-hero__shape--one"></span>
    <span class="ecg-collection-hero__shape ecg-collection-hero__shape--two"></span>
    <span class="ecg-collection-hero__shape ecg-collection-hero__shape--three"></span>
  </div>
</section>
{% schema %}
{
  "name": "Collection hero",
  "tag": "section",
  "class": "ecg-collection-hero-section",
  "settings": []
}
{% endschema %}`;
const PREMIUM_CSS = `/* EcoShopGuide premium storefront polish */
:root {
  --ecg-ink: #17382f;
  --ecg-forest: #245442;
  --ecg-cream: #fbf8f2;
  --ecg-sand: #eee5d7;
  --ecg-clay: #b86d4d;
  --ecg-line: rgba(23, 56, 47, 0.14);
}

html { scroll-behavior: smooth; }

body {
  background: var(--ecg-cream);
  color: var(--ecg-ink);
  -webkit-font-smoothing: antialiased;
}

body :is(.header, .site-header) {
  background: color-mix(in srgb, var(--ecg-cream) 94%, transparent);
  border-bottom: 1px solid var(--ecg-line);
  backdrop-filter: blur(14px);
}

body :is(.button, .btn, button[type="submit"], input[type="submit"]) {
  min-height: 46px;
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.01em;
  transition: transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
}

body :is(.button--secondary, .btn--secondary) {
  background: transparent;
  border-color: var(--ecg-forest);
  color: var(--ecg-forest);
}

body :is(.card, .product-card) {
  border: 1px solid var(--ecg-line);
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(23, 56, 47, 0.05);
  overflow: hidden;
}

body :is(.card img, .product-card img) {
  transition: transform 240ms ease;
}

body :is(.price, .price-item) {
  color: var(--ecg-forest);
  font-weight: 750;
}

body :is(.announcement-bar, .utility-bar) {
  background: var(--ecg-forest);
  color: #fff;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ecg-home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  align-items: center;
  gap: clamp(2rem, 6vw, 6rem);
  max-width: 1240px;
  margin: clamp(1.25rem, 4vw, 4rem) auto clamp(2.5rem, 5vw, 5rem);
  padding: clamp(2rem, 6vw, 5.5rem);
  background: radial-gradient(circle at 92% 10%, #f2ddca 0, transparent 27%), linear-gradient(135deg, #edf0e5, #fbf8f2 58%, #f4e8dd);
  border: 1px solid var(--ecg-line);
  border-radius: 28px;
  overflow: hidden;
}

.ecg-eyebrow {
  margin: 0 0 0.8rem;
  color: var(--ecg-forest);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.ecg-home-hero h1 {
  max-width: 10ch;
  margin: 0;
  color: var(--ecg-ink);
  font-size: clamp(2.5rem, 5vw, 5.5rem);
  line-height: 0.94;
  letter-spacing: -0.065em;
}

.ecg-home-hero__body {
  max-width: 42rem;
  margin: 1.4rem 0 0;
  font-size: clamp(1rem, 1.45vw, 1.2rem);
  line-height: 1.55;
}

.ecg-home-hero__actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.75rem; }
.ecg-cta {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.2rem;
  border: 1px solid var(--ecg-forest);
  border-radius: 999px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
}
.ecg-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(23, 56, 47, 0.14); }
.ecg-cta--primary { background: var(--ecg-forest); color: #fff; }
.ecg-cta--secondary { background: rgba(255,255,255,0.55); color: var(--ecg-forest); }
.ecg-trust-list { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; margin: 1.5rem 0 0; padding: 0; font-size: 0.78rem; font-weight: 700; list-style: none; }
.ecg-trust-list li { display: inline-flex; align-items: center; gap: 0.35rem; }
.ecg-trust-list li::before { width: 0.4rem; height: 0.4rem; border-radius: 99px; background: var(--ecg-clay); content: ""; }

.ecg-home-hero__visual { position: relative; min-height: 360px; }
.ecg-home-tile { position: absolute; display: flex; align-items: end; width: min(52vw, 270px); aspect-ratio: 0.78; padding: 1.25rem; border: 10px solid rgba(255,255,255,.6); border-radius: 35% 35% 9% 9%; box-shadow: 0 18px 44px rgba(23,56,47,.17); color: #fff; font-size: clamp(1.25rem, 2vw, 1.9rem); font-weight: 800; line-height: .95; letter-spacing: -.045em; overflow: hidden; }
.ecg-home-tile::before { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 42%, rgba(12,35,28,.67)); content: ""; }
.ecg-home-tile span { position: relative; }
.ecg-home-tile--dorm { top: 0; left: 5%; z-index: 2; background: linear-gradient(155deg, #d8b47c 0%, #e4ddca 40%, #476553 100%); transform: rotate(-7deg); }
.ecg-home-tile--seasonal { right: 4%; bottom: 0; z-index: 3; background: linear-gradient(155deg, #be7652 0%, #c99561 35%, #3f4e35 100%); transform: rotate(8deg); }
.ecg-home-orbit { position: absolute; inset: 17% 12%; border: 1px solid rgba(36,84,66,.22); border-radius: 50%; transform: rotate(-18deg); }

@media (hover: hover) {
  body :is(.card, .product-card):hover {
    box-shadow: 0 14px 32px rgba(23, 56, 47, 0.12);
    transform: translateY(-2px);
  }

  body :is(.card, .product-card):hover img { transform: scale(1.025); }
  body :is(.button, .btn, button[type="submit"], input[type="submit"]):hover { transform: translateY(-1px); }
}

/* Collection-specific context + a denser, mobile-first product grid. */
.ecg-collection-hero-section { margin: 0 auto; }
.ecg-collection-hero {
  position: relative; display: grid; grid-template-columns: minmax(0, 1.04fr) minmax(15rem, .96fr);
  gap: clamp(1.5rem, 5vw, 5rem); max-width: 1240px; margin: clamp(.75rem, 3vw, 2rem) auto clamp(1.5rem, 4vw, 3rem);
  padding: clamp(1.8rem, 5vw, 4.5rem); overflow: hidden; border: 1px solid var(--ecg-line); border-radius: 28px;
}
.ecg-collection-hero h1 { max-width: 10ch; margin: 0; color: var(--ecg-ink); font-size: clamp(2.35rem, 4.8vw, 5rem); line-height: .94; letter-spacing: -.06em; }
.ecg-collection-hero__copy > p:not(.ecg-eyebrow) { max-width: 40rem; margin: 1rem 0 0; line-height: 1.55; font-size: clamp(1rem, 1.4vw, 1.15rem); }
.ecg-collection-hero__actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 1.5rem; }
.ecg-collection-hero__visual { position: relative; min-height: 260px; isolation: isolate; }
.ecg-collection-hero__label { position: absolute; right: 4%; bottom: 5%; z-index: 3; max-width: 12ch; padding: .9rem 1rem; background: rgba(255,255,255,.84); border: 1px solid rgba(255,255,255,.75); border-radius: 14px; color: var(--ecg-ink); font-size: .83rem; font-weight: 800; line-height: 1.1; box-shadow: 0 10px 25px rgba(23,56,47,.12); }
.ecg-collection-hero__shape { position: absolute; display: block; border-radius: 999px; box-shadow: 0 18px 35px rgba(23,56,47,.15); }
.ecg-collection-hero__shape--one { inset: 9% 19% auto auto; width: 55%; aspect-ratio: 1; background: linear-gradient(145deg,#f0d4b4,#b66b45); }
.ecg-collection-hero__shape--two { left: 6%; bottom: 9%; width: 46%; aspect-ratio: 1; background: linear-gradient(145deg,#476f5c,#b9c889); transform: rotate(-18deg); border-radius: 31% 69% 57% 43%/42% 47% 53% 58%; }
.ecg-collection-hero__shape--three { top: 13%; left: 18%; width: 25%; aspect-ratio: 1; background: rgba(251,248,242,.9); border: 1px solid rgba(23,56,47,.15); }
.ecg-collection-hero--dorm { background: radial-gradient(circle at 84% 15%,#f0e2c7 0,transparent 30%),linear-gradient(135deg,#e6eee4,#fbf8f2 55%,#e9dbc7); }
.ecg-collection-hero--dorm .ecg-collection-hero__shape--one { background: linear-gradient(145deg,#c99865,#f0e1c8); }
.ecg-collection-hero--dorm .ecg-collection-hero__shape--two { background: linear-gradient(145deg,#406553,#9ac09d); }
.ecg-collection-hero--fall-halloween { background: radial-gradient(circle at 88% 14%,#e6a76e 0,transparent 28%),linear-gradient(135deg,#452c2a,#71533a 52%,#cf8050); color: #fff; }
.ecg-collection-hero--fall-halloween :is(h1,.ecg-eyebrow,.ecg-collection-hero__copy > p) { color: #fff; }
.ecg-collection-hero--fall-halloween .ecg-cta--primary { background: #f4ddbc; border-color: #f4ddbc; color: #4a2c28; }
.ecg-collection-hero--fall-halloween .ecg-cta--secondary { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.75); color: #fff; }
.ecg-collection-hero--fall-halloween .ecg-collection-hero__shape--one { background: linear-gradient(145deg,#e37b39,#f0b15f); }
.ecg-collection-hero--fall-halloween .ecg-collection-hero__shape--two { background: linear-gradient(145deg,#172e27,#4e7b5a); }
.ecg-collection-hero--fall-halloween .ecg-collection-hero__shape--three { background: rgba(248,215,174,.86); border-color: rgba(248,215,174,.7); }
body.template-collection :is(.product-grid,.collection-product-grid,#product-grid) { display: grid !important; grid-template-columns: repeat(4,minmax(0,1fr)) !important; gap: 1rem !important; }
body.template-collection :is(.card,.product-card) { border-radius: 16px; }
body.template-collection :is(.card__content,.product-card__content) { padding: .75rem !important; }
body.template-collection :is(.card__heading,.card-title,.product-card__title) { font-size: .96rem !important; line-height: 1.25 !important; }
body.template-collection :is(.card__information,.card-information,.product-card__meta) { gap: .25rem !important; }
@media(max-width:989px) {
  body.template-collection :is(.product-grid,.collection-product-grid,#product-grid) { grid-template-columns: repeat(3,minmax(0,1fr)) !important; }
  .ecg-collection-hero { grid-template-columns: 1fr minmax(13rem,.8fr); }
}
@media(max-width:749px) {
  .ecg-collection-hero { grid-template-columns: 1fr; gap: 1rem; margin: .5rem 0 1.25rem; padding: 1.75rem 1.25rem 1.15rem; border-right: 0; border-left: 0; border-radius: 0; }
  .ecg-collection-hero h1 { font-size: clamp(2.5rem,13vw,3.9rem); }
  .ecg-collection-hero__actions { display: grid; grid-template-columns: 1fr; }
  .ecg-collection-hero__visual { min-height: 145px; margin-top: .2rem; }
  .ecg-collection-hero__label { right: 3%; bottom: 0; }
  .ecg-collection-hero__shape--one { top: 0; right: 15%; width: 45%; }
  .ecg-collection-hero__shape--two { left: 14%; bottom: 0; width: 39%; }
  .ecg-collection-hero__shape--three { top: 15%; left: 31%; width: 20%; }
  body.template-collection :is(.product-grid,.collection-product-grid,#product-grid) { grid-template-columns: repeat(2,minmax(0,1fr)) !important; gap: .65rem !important; }
  body.template-collection :is(.card__content,.product-card__content) { padding: .6rem !important; }
  body.template-collection :is(.card__heading,.card-title,.product-card__title) { font-size: .87rem !important; line-height: 1.22 !important; }
}
@media (max-width: 749px) {
  body { font-size: 16px; }

  body :is(.header, .site-header) { padding-block: 9px; }
  body :is(.grid, .product-grid) { gap: 12px; }
  body :is(.card, .product-card) { border-radius: 14px; }
  body :is(.card__heading, .card-title, .product-card__title) {
    font-size: 1rem;
    line-height: 1.28;
  }
  body :is(.price, .price-item) { font-size: 0.94rem; }
  body :is(.button, .btn, button[type="submit"], input[type="submit"]) { min-height: 48px; }

  .ecg-home-hero { grid-template-columns: 1fr; gap: 1.5rem; margin: 0.75rem 0 2.25rem; padding: 1.75rem 1.25rem 1.25rem; border-right: 0; border-left: 0; border-radius: 0; }
  .ecg-home-hero h1 { max-width: 11ch; font-size: clamp(2.65rem, 13vw, 4rem); }
  .ecg-home-hero__body { margin-top: 1rem; font-size: 1rem; }
  .ecg-home-hero__actions { display: grid; grid-template-columns: 1fr; margin-top: 1.25rem; }
  .ecg-cta { width: 100%; min-height: 52px; }
  .ecg-trust-list { gap: 0.45rem 0.8rem; margin-top: 1.25rem; font-size: 0.7rem; }
  .ecg-home-hero__visual { min-height: 260px; margin-inline: -0.2rem; }
  .ecg-home-tile { width: min(48vw, 190px); padding: 0.9rem; border-width: 7px; border-radius: 30% 30% 9% 9%; }
  .ecg-home-tile--dorm { left: 7%; }
  .ecg-home-tile--seasonal { right: 7%; }
}
`;

function textBody(content: string) {
  return { type: "TEXT", value: content };
}

function occurrenceCount(input: string, needle: string) {
  if (!needle) return 0;

  let count = 0;
  let cursor = 0;
  while (true) {
    const next = input.indexOf(needle, cursor);
    if (next === -1) return count;
    count += 1;
    cursor = next + needle.length;
  }
}

function getLayoutDiagnostics(layout: string) {
  return {
    premiumMarkerPresent: layout.includes(PREMIUM_MARKER),
    correctStylesheetPresent: layout.includes(
      `'${PREMIUM_STYLESHEET}' | asset_url | stylesheet_tag`,
    ),
    malformedStylesheetPresent: layout.includes(
      `'assets/${PREMIUM_STYLESHEET}' | asset_url`,
    ),
    contentForLayoutOccurrences: occurrenceCount(layout, "{{ content_for_layout }}"),
  };
}

async function readThemeFile(themeId: string, filename: string) {
  return shopifyAdminRequest<ThemeLayoutResponse>(
    `query StoreManagerThemeFile($themeId: ID!, $filenames: [String!]!) {
      theme(id: $themeId) {
        files(filenames: $filenames) {
          nodes {
            filename
            body {
              ... on OnlineStoreThemeFileBodyText {
                content
              }
            }
          }
        }
      }
    }`,
    { themeId, filenames: [filename] },
  );
}

async function readThemeLayout(themeId: string) {
  return readThemeFile(themeId, "layout/theme.liquid");
}

async function inspectHomepageTemplateCandidates(themeId: string) {
  return Promise.all(
    [HOME_JSON_TEMPLATE_FILENAME, HOME_LIQUID_TEMPLATE_FILENAME].map(async (filename) => {
      try {
        const data = await readThemeFile(themeId, filename);
        const nodes = data.theme?.files?.nodes ?? [];
        const content = nodes[0]?.body?.content ?? "";
        return {
          filename,
          nodeCount: nodes.length,
          returnedFilename: nodes[0]?.filename ?? null,
          contentLength: content.length,
          preview: content.slice(0, 180),
        };
      } catch (error) {
        return {
          filename,
          error: error instanceof Error ? error.message : "Unable to inspect template",
        };
      }
    }),
  );
}

function injectStylesheet(layout: string) {
  // Replace every prior version of this stylesheet link. A previous version
  // accidentally used an `assets/` prefix before `asset_url`, which produced
  // an `assets/assets/...` URL on the storefront.
  const existingPremiumAsset = /(?:\{% comment %\}\s*EcoShopGuide premium storefront\s*\{% endcomment %\}\s*)?(?:\{\{\s*'[^']*ecoshopguide-premium\.css'\s*\|\s*asset_url\s*\|\s*stylesheet_tag\s*\}\}|<link[^>]*ecoshopguide-premium\.css[^>]*>)/g;
  const tag = `{% comment %} ${PREMIUM_MARKER} {% endcomment %}\n{{ '${PREMIUM_STYLESHEET}' | asset_url | stylesheet_tag }}`;
  if (!layout.includes("</head>")) {
    throw new ShopifyAdminRequestError("The active Shopify theme has no head element to update.");
  }
  const withoutPriorAsset = layout.replace(existingPremiumAsset, "");
  return withoutPriorAsset.replace("</head>", `${tag}\n</head>`);
}

function removeLegacyHomeHero(layout: string) {
  const marker = `{% comment %} ${HOME_MARKER} {% endcomment %}`;
  const markerIndex = layout.indexOf(marker);
  if (markerIndex === -1) return layout;

  const contentIndex = layout.indexOf("{{ content_for_layout }}", markerIndex);
  if (contentIndex === -1) {
    throw new ShopifyAdminRequestError("Could not locate the active theme content area after the legacy homepage hero.");
  }
  return `${layout.slice(0, markerIndex)}${layout.slice(contentIndex)}`;
}

function buildHomeTemplate(existingTemplate: string) {
  let template: { sections?: Record<string, unknown>; order?: string[] };
  try {
    // Shopify's generated JSON templates include a JSONC block-comment preamble.
    // Remove it before parsing the actual JSON payload.
    const templateJson = existingTemplate
      .replace(/^\uFEFF/, "")
      .replace(/^\s*\/\*[\s\S]*?\*\/\s*/, "");
    template = JSON.parse(templateJson);
  } catch {
    throw new ShopifyAdminRequestError("The active homepage template is not valid JSON.");
  }

  const sections = template.sections ?? {};
  sections.ecg_home_hero = { type: "ecg-home-hero", settings: {} };
  const existingOrder = Array.isArray(template.order) ? template.order : Object.keys(sections);
  template.sections = sections;
  template.order = ["ecg_home_hero", ...existingOrder.filter((id) => id !== "ecg_home_hero")];
  return `${JSON.stringify(template, null, 2)}\n`;
}

function buildLegacyHomeTemplate(existingTemplate: string) {
  if (existingTemplate.includes(HOME_SECTION_TAG)) {
    return existingTemplate;
  }

  // This is the active homepage template in older Shopify themes. Keeping the
  // template intentionally small lets the native theme header/footer remain in
  // control while the collection-first EcoShopGuide experience owns the page.
  return `${HOME_SECTION_TAG}\n`;
}

function buildCollectionTemplate(existingTemplate: string) {
  let template: { sections?: Record<string, unknown>; order?: string[] };
  try {
    const templateJson = existingTemplate
      .replace(/^\uFEFF/, "")
      .replace(/^\s*\/\*[\s\S]*?\*\/\s*/, "");
    template = JSON.parse(templateJson);
  } catch {
    throw new ShopifyAdminRequestError("The active collection template is not valid JSON.");
  }

  const sections = template.sections ?? {};
  sections.ecg_collection_hero = { type: "ecg-collection-hero", settings: {} };
  const existingOrder = Array.isArray(template.order) ? template.order : Object.keys(sections);
  template.sections = sections;
  template.order = [
    "ecg_collection_hero",
    ...existingOrder.filter((id) => id !== "ecg_collection_hero"),
  ];
  return `${JSON.stringify(template, null, 2)}\n`;
}

function buildLegacyCollectionTemplate(existingTemplate: string) {
  if (existingTemplate.includes(COLLECTION_SECTION_TAG)) {
    return existingTemplate;
  }
  return `${COLLECTION_SECTION_TAG}\n${existingTemplate}`;
}

/**
 * Applies a deliberately small, reversible visual layer to the live Shopify
 * theme. The endpoint is POST-only and never accepts arbitrary file content.
 */
export default async function handler(request: any, response: any) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const requestedThemeId =
      typeof request.query?.themeId === "string" ? request.query.themeId : null;

    const themes = await shopifyAdminRequest<{ themes: { nodes: Theme[] } }>(
      "query StoreManagerThemes { themes(first: 20) { nodes { id name role } } }",
    );
    if (request.query?.diagnostic === "1") {
      const themeDiagnostics = await Promise.all(
        themes.themes.nodes.map(async (candidate) => {
          try {
            const layoutData = await readThemeLayout(candidate.id);
            const layout = layoutData.theme?.files?.nodes[0]?.body?.content ?? "";
            return {
              id: candidate.id,
              name: candidate.name,
              role: candidate.role,
              readable: Boolean(layout),
              ...getLayoutDiagnostics(layout),
              homepageTemplateCandidates:
                candidate.role === "MAIN"
                  ? await inspectHomepageTemplateCandidates(candidate.id)
                  : undefined,
            };
          } catch {
            return {
              id: candidate.id,
              name: candidate.name,
              role: candidate.role,
              readable: false,
            };
          }
        }),
      );

      response.status(200).json({ ok: true, themes: themeDiagnostics });
      return;
    }

    const theme = requestedThemeId
      ? themes.themes.nodes.find(
          (candidate) =>
            candidate.id === requestedThemeId ||
            candidate.id.endsWith(`/${requestedThemeId}`),
        )
      : themes.themes.nodes.find((candidate) => candidate.role === "MAIN");
    if (!theme) {
      throw new ShopifyAdminRequestError(
        requestedThemeId
          ? "The requested Shopify theme was not found."
          : "No published Shopify theme was found.",
      );
    }

    const files = await readThemeLayout(theme.id);
    const layout = files.theme?.files?.nodes[0]?.body?.content;
    if (!layout) throw new ShopifyAdminRequestError("The active theme layout could not be read.");
    const updatedLayout = injectStylesheet(removeLegacyHomeHero(layout));
    const jsonTemplateData = await readThemeFile(theme.id, HOME_JSON_TEMPLATE_FILENAME);
    const jsonTemplate = jsonTemplateData.theme?.files?.nodes[0]?.body?.content;
    let templateFilename = HOME_JSON_TEMPLATE_FILENAME;
    let templateFormat: "json" | "liquid" = "json";
    let updatedTemplate: string;

    try {
      if (!jsonTemplate) throw new Error("No JSON homepage template found.");
      updatedTemplate = buildHomeTemplate(jsonTemplate);
    } catch {
      const liquidTemplateData = await readThemeFile(theme.id, HOME_LIQUID_TEMPLATE_FILENAME);
      const liquidTemplate = liquidTemplateData.theme?.files?.nodes[0]?.body?.content;
      if (!liquidTemplate) {
        throw new ShopifyAdminRequestError("The active homepage template could not be read.");
      }
      templateFilename = HOME_LIQUID_TEMPLATE_FILENAME;
      templateFormat = "liquid";
      updatedTemplate = buildLegacyHomeTemplate(liquidTemplate);
    }

    const collectionJsonTemplateData = await readThemeFile(
      theme.id,
      COLLECTION_JSON_TEMPLATE_FILENAME,
    );
    const collectionJsonTemplate =
      collectionJsonTemplateData.theme?.files?.nodes[0]?.body?.content;
    let collectionTemplateFilename = COLLECTION_JSON_TEMPLATE_FILENAME;
    let collectionTemplateFormat: "json" | "liquid" = "json";
    let updatedCollectionTemplate: string;

    try {
      if (!collectionJsonTemplate) throw new Error("No JSON collection template found.");
      updatedCollectionTemplate = buildCollectionTemplate(collectionJsonTemplate);
    } catch {
      const collectionLiquidTemplateData = await readThemeFile(
        theme.id,
        COLLECTION_LIQUID_TEMPLATE_FILENAME,
      );
      const collectionLiquidTemplate =
        collectionLiquidTemplateData.theme?.files?.nodes[0]?.body?.content;
      if (!collectionLiquidTemplate) {
        throw new ShopifyAdminRequestError("The active collection template could not be read.");
      }
      collectionTemplateFilename = COLLECTION_LIQUID_TEMPLATE_FILENAME;
      collectionTemplateFormat = "liquid";
      updatedCollectionTemplate = buildLegacyCollectionTemplate(collectionLiquidTemplate);
    }

    type ThemeFilesUpsertResponse = {
      themeFilesUpsert: {
        upsertedThemeFiles: Array<{ filename: string }>;
        job?: { id: string } | null;
        userErrors: Array<{ message: string }>;
      };
    };

    const upsertThemeFiles = async (
      files: Array<{ filename: string; body: ReturnType<typeof textBody> }>,
      label: string,
    ) => {
      const result = await shopifyAdminRequest<ThemeFilesUpsertResponse>(
        `mutation StoreManagerPremiumStyles($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
        themeFilesUpsert(themeId: $themeId, files: $files) {
          upsertedThemeFiles { filename }
          job { id }
          userErrors { message }
        }
      }`,
        { themeId: theme.id, files },
      );

      const errorMessages = result.themeFilesUpsert.userErrors
        .map(({ message }) => message.trim())
        .filter(Boolean);
      if (errorMessages.length) {
        throw new ShopifyAdminRequestError(
          `Shopify rejected the theme ${label} update: ${errorMessages.join(" ")}`,
        );
      }

      return result.themeFilesUpsert;
    };

    // Shopify validates JSON templates against the sections already present in the
    // theme. Upload the section definitions before the templates that reference them.
    const foundationUpdate = await upsertThemeFiles(
      [
        { filename: `assets/${PREMIUM_STYLESHEET}`, body: textBody(PREMIUM_CSS) },
        { filename: "layout/theme.liquid", body: textBody(updatedLayout) },
        { filename: HOME_SECTION_FILENAME, body: textBody(HOME_SECTION) },
        { filename: COLLECTION_SECTION_FILENAME, body: textBody(COLLECTION_SECTION) },
      ],
      "foundation",
    );
    const templateUpdate = await upsertThemeFiles(
      [
        { filename: templateFilename, body: textBody(updatedTemplate) },
        {
          filename: collectionTemplateFilename,
          body: textBody(updatedCollectionTemplate),
        },
      ],
      "template",
    );

    // Read the layout back from Shopify. `themeFilesUpsert` can acknowledge an
    // update before the storefront CDN has refreshed, so this confirms that the
    // active theme source itself contains the intended, deploy-safe markup.
    const verifiedFiles = await readThemeLayout(theme.id);
    const verifiedLayout = verifiedFiles.theme?.files?.nodes[0]?.body?.content ?? "";
    const verifiedTemplateData = await readThemeFile(theme.id, templateFilename);
    const verifiedTemplate = verifiedTemplateData.theme?.files?.nodes[0]?.body?.content ?? "";
    const verifiedSectionData = await readThemeFile(theme.id, HOME_SECTION_FILENAME);
    const verifiedSection = verifiedSectionData.theme?.files?.nodes[0]?.body?.content ?? "";
    const verifiedCollectionTemplateData = await readThemeFile(
      theme.id,
      collectionTemplateFilename,
    );
    const verifiedCollectionTemplate =
      verifiedCollectionTemplateData.theme?.files?.nodes[0]?.body?.content ?? "";
    const verifiedCollectionSectionData = await readThemeFile(
      theme.id,
      COLLECTION_SECTION_FILENAME,
    );
    const verifiedCollectionSection =
      verifiedCollectionSectionData.theme?.files?.nodes[0]?.body?.content ?? "";
    let homeTemplateHasSection = false;
    let homeSectionFirst = false;
    if (templateFormat === "json") {
      try {
        const parsedTemplate = JSON.parse(
          verifiedTemplate
            .replace(/^\uFEFF/, "")
            .replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ""),
        ) as {
          sections?: Record<string, { type?: string }>;
          order?: string[];
        };
        homeTemplateHasSection = parsedTemplate.sections?.ecg_home_hero?.type === "ecg-home-hero";
        homeSectionFirst = parsedTemplate.order?.[0] === "ecg_home_hero";
      } catch {
        // The validation below exposes a useful persistence error to the caller.
      }
    } else {
      const sectionPosition = verifiedTemplate.indexOf(HOME_SECTION_TAG);
      homeTemplateHasSection = sectionPosition >= 0;
      homeSectionFirst = verifiedTemplate.trimStart().startsWith(HOME_SECTION_TAG);
    }
    let collectionTemplateHasSection = false;
    let collectionSectionFirst = false;
    if (collectionTemplateFormat === "json") {
      try {
        const parsedTemplate = JSON.parse(
          verifiedCollectionTemplate
            .replace(/^\uFEFF/, "")
            .replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ""),
        ) as {
          sections?: Record<string, { type?: string }>;
          order?: string[];
        };
        collectionTemplateHasSection =
          parsedTemplate.sections?.ecg_collection_hero?.type === "ecg-collection-hero";
        collectionSectionFirst = parsedTemplate.order?.[0] === "ecg_collection_hero";
      } catch {
        // The validation below exposes a useful persistence error to the caller.
      }
    } else {
      const sectionPosition = verifiedCollectionTemplate.indexOf(COLLECTION_SECTION_TAG);
      collectionTemplateHasSection = sectionPosition >= 0;
      collectionSectionFirst = verifiedCollectionTemplate
        .trimStart()
        .startsWith(COLLECTION_SECTION_TAG);
    }
    const layoutDiagnostics = getLayoutDiagnostics(verifiedLayout);
    const verification = {
      ...layoutDiagnostics,
      legacyHomeHeroAbsent: !verifiedLayout.includes(HOME_MARKER),
      homeSectionPresent: verifiedSection.includes(HOME_MARKER),
      homeTemplateHasSection,
      homeSectionFirst,
      collectionSectionPresent: verifiedCollectionSection.includes(COLLECTION_MARKER),
      collectionTemplateHasSection,
      collectionSectionFirst,
      malformedStylesheetAbsent: !layoutDiagnostics.malformedStylesheetPresent,
    };
    if (
      !verification.premiumMarkerPresent ||
      !verification.legacyHomeHeroAbsent ||
      !verification.homeSectionPresent ||
      !verification.homeTemplateHasSection ||
      !verification.homeSectionFirst ||
      !verification.collectionSectionPresent ||
      !verification.collectionTemplateHasSection ||
      !verification.collectionSectionFirst ||
      !verification.correctStylesheetPresent ||
      !verification.malformedStylesheetAbsent
    ) {
      throw new ShopifyAdminRequestError("Shopify did not persist the active theme update.");
    }

    response.status(200).json({
      ok: true,
      theme: { id: theme.id, name: theme.name, role: theme.role },
      availableThemes: themes.themes.nodes.map((candidate) => ({
        id: candidate.id,
        name: candidate.name,
        role: candidate.role,
      })),
      updatedFiles: [
        ...foundationUpdate.upsertedThemeFiles,
        ...templateUpdate.upsertedThemeFiles,
      ].map((file) => file.filename),
      homepageTemplate: { filename: templateFilename, format: templateFormat },
      collectionTemplate: {
        filename: collectionTemplateFilename,
        format: collectionTemplateFormat,
      },
      jobId: templateUpdate.job?.id ?? foundationUpdate.job?.id ?? null,
      verification,
      layoutDiagnostics,
    });
  } catch (error) {
    const message = error instanceof ShopifyAdminRequestError
      ? error.message
      : "Unable to apply the Shopify storefront design update.";
    response.status(503).json({ ok: false, error: message });
  }
}
