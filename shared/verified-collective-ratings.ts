import type { ShopifyReview } from "./shopify.js";

export type VerifiedCollectiveDetail = {
  review: ShopifyReview;
  supplierShipsInDays?: number;
};

/** Verified supplier aggregates — Collective does not sync these to storefront metafields. */
export const VERIFIED_COLLECTIVE_DETAILS: Record<string, VerifiedCollectiveDetail> = {
  "classic-white-box-light-pink-roses": { review: { rating: 4.2, count: 15 }, supplierShipsInDays: 2 },
  "7oz-posh™-candle-vessel-lid": { review: { rating: 5, count: 155 } },
  "10-faux-pale-pink-ranunculus-stem-bundle": { review: { rating: 5, count: 4 }, supplierShipsInDays: 2 },
  "13-faux-blush-ranunculus-stem": { review: { rating: 5, count: 2 }, supplierShipsInDays: 2 },
  "17-faux-anemone-white-stem": { review: { rating: 5, count: 3 }, supplierShipsInDays: 2 },
  "geranium-rose-signature-candle": { review: { rating: 4.9, count: 12 } },
  "forest-bathing-signature-candle-fir-pine-patchouli": { review: { rating: 5, count: 19 } },
  "folk-copper": { review: { rating: 5, count: 3 }, supplierShipsInDays: 3 },
  "hello-pumpkin-coir-doormat": { review: { rating: 5, count: 1 }, supplierShipsInDays: 7 },
  "tache-fall-orange-farmhouse-super-soft-micro-fleece-plaid-patchwork-plush-lightweight-bed-throw-blanket-4021": {
    review: { rating: 5, count: 6 },
  },
  "32-faux-bittersweet-stem": { review: { rating: 4.6, count: 7 } },
  "28-faux-pine-cone-branch-stem": { review: { rating: 4.7, count: 3 } },
  "27-faux-japanese-maple-leaf-stem": { review: { rating: 5, count: 7 } },
  "14-faux-magnolia-leaf-stem": { review: { rating: 4.6, count: 10 } },
  "autumn-in-the-holler-hand-poured-mountain-fall-candle": { review: { rating: 5, count: 2 } },
  "obsessed-with-fall-candle": { review: { rating: 4.9, count: 11 } },
  "tache-warm-colorful-thanksgiving-leaves-fall-foliage-tapestry-table-runners-11516": {
    review: { rating: 5, count: 3 },
  },
};
