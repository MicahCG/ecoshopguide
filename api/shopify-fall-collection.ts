import { ShopifyAdminRequestError, shopifyAdminRequest } from "../server/shopify-admin.js";

type Product = {
  id: string;
  title: string;
  handle: string;
  vendor: string | null;
};

type Collection = {
  id: string;
  handle: string;
  products: { nodes: Array<{ id: string }> } | null;
};

const FALL_SHORTLIST = [
  {
    label: "Jack O Lantern Pumpkin – 20 Seeds",
    phrases: [["jack", "lantern", "pumpkin"], ["pumpkin", "seeds"]],
  },
  {
    label: "Premium Outdoor Waterproof Throw Pillow",
    phrases: [
      ["premium", "outdoor", "waterproof", "throw", "pillow"],
      ["fancy", "stacy", "pillow"],
    ],
  },
  {
    label: "Halloween Cushion Cover Horror Pumpkin",
    phrases: [
      ["halloween", "cushion"],
      ["horror", "pumpkin", "pillow"],
      ["halloween", "pillow", "cover"],
    ],
  },
  {
    label: "Tache Fall Orange Farmhouse Throw Blanket",
    phrases: [["tache", "fall", "orange"], ["farmhouse", "patchwork", "throw"]],
  },
  {
    label: "Folk Copper",
    phrases: [["folk", "copper"]],
  },
  {
    label: "Hello Pumpkin Coir Doormat",
    phrases: [
      ["hello", "pumpkin", "coir"],
      ["hello", "pumpkin", "doormat"],
    ],
  },
  {
    label: '32" Faux Bittersweet Stem',
    phrases: [["bittersweet", "stem"]],
  },
  {
    label: '28" Faux Pine Cone Branch Stem',
    phrases: [["pine", "cone", "branch"]],
  },
  {
    label: '27" Faux Japanese Maple Leaf Stem',
    phrases: [["japanese", "maple"]],
  },
  {
    label: '14" Faux Magnolia Leaf Stem',
    phrases: [["magnolia", "leaf", "stem"]],
  },
] as const;

/** Replaced assortment — remove these handles when syncing the Fall collection. */
const FALL_REMOVE_HANDLES = ["fall-gingham-blanket", "solid-color-lobster-rope-doormat"] as const;

function matchesProduct(product: Product, phrase: readonly string[]) {
  const searchable = `${product.title} ${product.handle} ${product.vendor ?? ""}`.toLowerCase();
  return phrase.every((word) => searchable.includes(word));
}

function findProduct(products: Product[], phraseGroups: readonly (readonly string[])[]) {
  for (const phrase of phraseGroups) {
    const product = products.find((candidate) => matchesProduct(candidate, phrase));
    if (product) return product;
  }
  return undefined;
}

export default async function handler(request: any, response: any) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const data = await shopifyAdminRequest<{
      collections: { nodes: Collection[] };
      products: { nodes: Product[] };
    }>(
      `query FallCollectionAndProducts {
        collections(first: 20, query: "handle:fall-halloween") {
          nodes { id handle products(first: 250) { nodes { id } } }
        }
        products(first: 250, query: "status:active") {
          nodes { id title handle vendor }
        }
      }`,
    );
    const collection = data.collections.nodes.find((candidate) => candidate.handle === "fall-halloween");
    if (!collection) {
      throw new ShopifyAdminRequestError("The Fall & Halloween collection was not found.");
    }

    const currentProductIds = new Set(collection.products?.nodes.map((product) => product.id) ?? []);
    const selected = FALL_SHORTLIST.map((item) => ({
      label: item.label,
      product: findProduct(data.products.nodes, item.phrases),
    }));
    const additions = selected
      .filter((item): item is { label: string; product: Product } =>
        Boolean(item.product && !currentProductIds.has(item.product.id)),
      )
      .map((item) => item.product);
    const removals = data.products.nodes.filter(
      (product) =>
        FALL_REMOVE_HANDLES.includes(product.handle as (typeof FALL_REMOVE_HANDLES)[number]) &&
        currentProductIds.has(product.id),
    );

    if (additions.length) {
      const result = await shopifyAdminRequest<{
        collectionAddProducts: { userErrors: Array<{ message: string }> };
      }>(
        `mutation AddFallCollectionProducts($id: ID!, $productIds: [ID!]!) {
          collectionAddProducts(id: $id, productIds: $productIds) {
            userErrors { message }
          }
        }`,
        { id: collection.id, productIds: additions.map((product) => product.id) },
      );
      if (result.collectionAddProducts.userErrors.length) {
        throw new ShopifyAdminRequestError("Shopify rejected one or more Fall collection additions.");
      }
    }

    if (removals.length) {
      const result = await shopifyAdminRequest<{
        collectionRemoveProducts: { userErrors: Array<{ message: string }> };
      }>(
        `mutation RemoveFallCollectionProducts($id: ID!, $productIds: [ID!]!) {
          collectionRemoveProducts(id: $id, productIds: $productIds) {
            userErrors { message }
          }
        }`,
        { id: collection.id, productIds: removals.map((product) => product.id) },
      );
      if (result.collectionRemoveProducts.userErrors.length) {
        throw new ShopifyAdminRequestError("Shopify rejected one or more Fall collection removals.");
      }
    }

    response.status(200).json({
      ok: true,
      collection: { id: collection.id, handle: collection.handle },
      added: additions.map((product) => ({ title: product.title, handle: product.handle })),
      removed: removals.map((product) => ({ title: product.title, handle: product.handle })),
      alreadyPresent: selected
        .filter((item) => item.product && currentProductIds.has(item.product.id))
        .map((item) => ({ label: item.label, title: item.product?.title, handle: item.product?.handle })),
      missing: selected.filter((item) => !item.product).map((item) => item.label),
    });
  } catch (error) {
    const message =
      error instanceof ShopifyAdminRequestError
        ? error.message
        : "Unable to update the Fall & Halloween collection.";
    response.status(503).json({ ok: false, error: message });
  }
}
