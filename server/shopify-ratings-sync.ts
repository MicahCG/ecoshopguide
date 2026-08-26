import { VERIFIED_COLLECTIVE_DETAILS } from "../shared/verified-collective-ratings.js";
import { ShopifyAdminRequestError, shopifyAdminRequest } from "./shopify-admin.js";

export const RATING_SNIPPET_FILENAME = "snippets/ecg-product-rating.liquid";
export const RATING_MARKER = "EcoShopGuide product rating";

export const RATING_SNIPPET = `{% comment %} ${RATING_MARKER} {% endcomment %}
{% liquid
  assign ecg_product = product
  if card_product != blank
    assign ecg_product = card_product
  endif
  if ecg_product == blank and closest.product != blank
    assign ecg_product = closest.product
  endif
  assign ecg_count = ecg_product.metafields.reviews.rating_count.value | default: ecg_product.metafields.reviews.rating_count | plus: 0
  assign ecg_rating_obj = ecg_product.metafields.reviews.rating.value
  if ecg_rating_obj.value != blank
    assign ecg_rating = ecg_rating_obj.value
  elsif ecg_rating_obj.rating != blank
    assign ecg_rating = ecg_rating_obj.rating
  else
    assign ecg_rating = ecg_rating_obj
  endif
%}
{% if ecg_product != blank and ecg_count > 0 and ecg_rating != blank %}
  <p class="ecg-product-rating" aria-label="Rated {{ ecg_rating | round: 1 }} out of 5 from {{ ecg_count }} reviews">
    <span aria-hidden="true">★</span> {{ ecg_rating | round: 1 }} ({{ ecg_count }})
  </p>
{% endif %}
`;

export const RATING_CSS = `
.ecg-product-rating {
  margin: 0.15rem 0 0.35rem;
  font-size: 0.86rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--ecg-forest, #245442);
}
body.template-collection .ecg-product-rating {
  font-size: 0.82rem;
}
body.template-product .ecg-product-rating {
  margin-top: 0.35rem;
  font-size: 0.92rem;
}
`;

const CARD_SNIPPET_CANDIDATES = [
  "snippets/card-product.liquid",
  "snippets/product-card.liquid",
] as const;

const PRODUCT_SECTION_CANDIDATES = [
  "sections/main-product.liquid",
  "sections/product-template.liquid",
] as const;

const SNIPPET_NAME = "ecg-product-rating";

const CARD_RENDER_LINE =
  `        {% comment %} ${RATING_MARKER} {% endcomment %}\n` +
  `        {% render '${SNIPPET_NAME}', product: card_product %}\n`;

const PRODUCT_RENDER_LINE =
  `        {% comment %} ${RATING_MARKER} {% endcomment %}\n` +
  `        {% render '${SNIPPET_NAME}', product: product %}\n`;

function ratingMetafieldValue(rating: number) {
  return JSON.stringify({
    scale_min: "1.0",
    scale_max: "5.0",
    value: rating.toFixed(1),
  });
}

export function patchThemeSnippet(content: string, renderLine: string): string {
  if (content.includes(RATING_MARKER)) {
    // Refresh an older rating render to the latest line.
    return content.replace(
      /\{%\s*comment\s*%\}\s*EcoShopGuide product rating\s*\{%\s*endcomment\s*%\}\s*\{%\s*render\s+'ecg-product-rating'[^%]*%\}\s*/g,
      renderLine,
    );
  }

  const patterns = [
    /\{%[-\s]*render\s+['"]price['"]/,
    /\{%[-\s]*render\s+['"]price-list['"]/,
    /<div class="card-information"/,
    /class="[^"]*product-card__price/,
    /class="[^"]*price-list/,
    /<div class="product__title"/,
    /<h1[^>]*class="[^"]*product[^"]*title/,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match?.index !== undefined) {
      return `${content.slice(0, match.index)}${renderLine}${content.slice(match.index)}`;
    }
  }

  return `${content.trimEnd()}\n${renderLine}`;
}

function isEsgCardHtml(content: string) {
  return (
    content.includes('class="esg-card"') ||
    content.includes('class=\\"esg-card\\"') ||
    content.includes("<article class=\"esg-card\">") ||
    content.includes("<div class=\"esg-card-body\">") ||
    content.includes('<div class=\\"esg-card-body\\">')
  );
}

export function stripMisplacedEsgRatingPatch(content: string) {
  if (isEsgCardHtml(content) || !content.includes(RATING_MARKER)) {
    return content;
  }
  return content.replace(
    /\{%\s*comment\s*%\}\s*EcoShopGuide product rating\s*\{%\s*endcomment\s*%\}\s*\{%\s*render\s+'ecg-product-rating'[^%]*%\}\s*/g,
    "",
  );
}

export function patchEsgCardMarkup(content: string): string {
  content = stripMisplacedEsgRatingPatch(content);
  if (!isEsgCardHtml(content) || !content.includes("esg-price")) {
    return content;
  }

  const renderLine =
    `{% comment %} ${RATING_MARKER} {% endcomment %}\n` +
    `{% render 'ecg-product-rating', product: product, card_product: card_product %}\n`;

  if (content.includes(RATING_MARKER)) {
    return content.replace(
      /\{%\s*comment\s*%\}\s*EcoShopGuide product rating\s*\{%\s*endcomment\s*%\}\s*\{%\s*render\s+'ecg-product-rating'[^%]*%\}\s*/g,
      renderLine,
    );
  }

  const patterns = [
    /(<div class="esg-card-body">\s*<h4>[\s\S]*?<\/h4>)(\s*<div class="esg-price">)/g,
    /(<div class=\\"esg-card-body\\">\s*<h4>[\s\S]*?<\/h4>)(\s*<div class=\\"esg-price\\">)/g,
  ];

  for (const pattern of patterns) {
    if (pattern.test(content)) {
      return content.replace(pattern, `$1\n${renderLine}$2`);
    }
  }

  return content.replace(/<div class="esg-price">/g, `${renderLine}<div class="esg-price">`);
}

export function patchEsgCollectionTemplateJson(content: string): string {
  const templateJson = content
    .replace(/^\uFEFF/, "")
    .replace(/^\s*\/\*[\s\S]*?\*\/\s*/, "");
  let template: unknown;
  try {
    template = JSON.parse(templateJson);
  } catch {
    return patchEsgCardMarkup(content);
  }

  let changed = false;
  const patchValue = (value: unknown): unknown => {
    if (typeof value === "string" && value.includes("esg-price")) {
      const cleaned = stripMisplacedEsgRatingPatch(value);
      const patched = isEsgCardHtml(cleaned) ? patchEsgCardMarkup(cleaned) : cleaned;
      if (patched !== value) changed = true;
      return patched;
    }
    if (Array.isArray(value)) return value.map(patchValue);
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
          key,
          patchValue(entry),
        ]),
      );
    }
    return value;
  };

  const patched = patchValue(template);
  if (!changed) return content;
  return `${JSON.stringify(patched, null, 2)}\n`;
}

export function appendRatingCss(existingCss: string) {
  if (existingCss.includes(".ecg-product-rating")) return existingCss;
  return `${existingCss.trimEnd()}\n${RATING_CSS.trim()}\n`;
}

type AdminProduct = { id: string; handle: string; title: string };

export async function syncVerifiedCollectiveRatings(options: {
  themeId?: string | null;
  premiumStylesheet?: string;
  readThemeFile?: (themeId: string, filename: string) => Promise<string | null>;
  upsertThemeFiles?: (
    themeId: string,
    files: Array<{ filename: string; content: string }>,
  ) => Promise<string[]>;
} = {}) {
  const handles = Object.keys(VERIFIED_COLLECTIVE_DETAILS);
  const productsData = await shopifyAdminRequest<{
    products: { nodes: AdminProduct[] };
  }>(
    `query VerifiedRatingProducts {
      products(first: 250, query: "status:active") {
        nodes { id handle title }
      }
    }`,
  );

  const products = productsData.products.nodes.filter((product) =>
    handles.includes(product.handle),
  );
  const missingHandles = handles.filter(
    (handle) => !products.some((product) => product.handle === handle),
  );

  const metafields = products.flatMap((product) => {
    const detail = VERIFIED_COLLECTIVE_DETAILS[product.handle];
    if (!detail) return [];
    return [
      {
        ownerId: product.id,
        namespace: "reviews",
        key: "rating",
        type: "rating",
        value: ratingMetafieldValue(detail.review.rating),
      },
      {
        ownerId: product.id,
        namespace: "reviews",
        key: "rating_count",
        type: "number_integer",
        value: String(detail.review.count),
      },
    ];
  });

  if (metafields.length) {
    const chunkSize = 20;
    for (let index = 0; index < metafields.length; index += chunkSize) {
      const chunk = metafields.slice(index, index + chunkSize);
      const result = await shopifyAdminRequest<{
        metafieldsSet: {
          metafields: Array<{ id: string }>;
          userErrors: Array<{ message: string; field?: string[] }>;
        };
      }>(
        `mutation SetVerifiedRatings($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields { id }
            userErrors { field message }
          }
        }`,
        { metafields: chunk },
      );

      if (result.metafieldsSet.userErrors.length) {
        throw new ShopifyAdminRequestError(
          result.metafieldsSet.userErrors.map((error) => error.message).join(" "),
        );
      }
    }
  }

  let themeUpdates: string[] = [];
  if (options.themeId && options.readThemeFile && options.upsertThemeFiles) {
    const files: Array<{ filename: string; content: string }> = [
      { filename: RATING_SNIPPET_FILENAME, content: RATING_SNIPPET },
    ];

    for (const filename of CARD_SNIPPET_CANDIDATES) {
      const existing = await options.readThemeFile(options.themeId, filename);
      if (!existing) continue;
      files.push({
        filename,
        content: patchThemeSnippet(existing, CARD_RENDER_LINE),
      });
      break;
    }

    for (const filename of PRODUCT_SECTION_CANDIDATES) {
      const existing = await options.readThemeFile(options.themeId, filename);
      if (!existing) continue;
      files.push({
        filename,
        content: patchThemeSnippet(existing, PRODUCT_RENDER_LINE),
      });
      break;
    }

    if (options.premiumStylesheet) {
      files.push({
        filename: "assets/ecoshopguide-premium.css",
        content: appendRatingCss(options.premiumStylesheet),
      });
    }

    themeUpdates = await options.upsertThemeFiles(options.themeId, files);
  }

  const syncedHandles = products.map((product) => product.handle);

  return {
    synced: syncedHandles.map((handle) => ({ handle, ok: true })),
    missingHandles,
    themeUpdates,
  };
}
