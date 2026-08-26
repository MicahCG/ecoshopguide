import assert from "node:assert/strict";
import test from "node:test";
import {
  RATING_MARKER,
  appendRatingCss,
  patchEsgCardMarkup,
  patchEsgCollectionTemplateJson,
  patchThemeSnippet,
} from "./shopify-ratings-sync";

test("patches card snippets once with the rating render marker", () => {
  const original = `<div class="card__information">
  <h3 class="card__heading">{{ card_product.title }}</h3>
  {% render 'price', product: card_product %}
</div>`;
  const line = `{% comment %} ${RATING_MARKER} {% endcomment %}\n{% render 'ecg-product-rating', product: product, card_product: card_product %}\n`;
  const patched = patchThemeSnippet(original, line);
  assert.match(patched, /EcoShopGuide product rating/);
  assert.match(patched, /render 'ecg-product-rating'/);
  const refreshed = patchThemeSnippet(patched, line);
  assert.equal(refreshed, patched);
});

test("patches esg collection cards before price", () => {
  const original = `<article class="esg-card"><div class="esg-card-body"><h4>Stem</h4><div class="esg-price">$6.95</div></div></article>`;
  const patched = patchEsgCardMarkup(original);
  assert.match(patched, /EcoShopGuide product rating/);
  assert.match(patched, /render 'ecg-product-rating'/);
  assert.match(patched, /<h4>Stem<\/h4>\s*\{% comment %\}/);
});

test("patches esg liquid embedded inside collection JSON templates", () => {
  const original = JSON.stringify(
    {
      sections: {
        custom_liquid_fall: {
          type: "custom-liquid",
          settings: {
            custom_liquid:
              '<div class="esg-card-body"><h4>{{ product.title }}</h4><div class="esg-price">{{ product.price | money }}</div>',
          },
        },
      },
    },
    null,
    2,
  );
  const patched = patchEsgCollectionTemplateJson(original);
  assert.notEqual(patched, original);
  assert.doesNotThrow(() => JSON.parse(patched));
  assert.match(patched, /render 'ecg-product-rating'/);
});

test("appends rating styles without duplicating them", () => {
  const once = appendRatingCss("body { color: green; }");
  assert.match(once, /\.ecg-product-rating/);
  assert.equal(appendRatingCss(once), once);
});
