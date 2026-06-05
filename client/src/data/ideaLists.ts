import weddingHero from "@assets/dreamy-boho-garden-wedding-hero.png";
import forestHero from "@assets/enchanted-forest-retreat-hero.png";
import bohoLivingHero from "@assets/warm-boho-living-room-hero.png";
import cozyAptHero from "@assets/cozy-apartment-living-room-hero.png";
import jungleSpaHero from "@assets/jungle-spa-retreat-hero.png";
import jungleVibesHero from "@assets/jungle-spa-vibes-hero.png";
import dormHero from "@assets/cozy-dorm-room-hero.png";
import { PRODUCT_DATA } from "./productData";

/**
 * Short merchandising labels shown as a pill on each product card.
 * Kept as a free string so curators can add new badges without a code change.
 */
export type ProductBadge = string;

export interface IdeaProduct {
  id: string;
  title: string;
  /** Optional one-liner. Hidden on mobile cards to keep them compact. */
  description?: string;
  price: string;
  /** Strikethrough "was" price - reads as a deal. */
  listPrice?: string;
  retailer: string;
  image: string;
  affiliateUrl: string;
  badge?: ProductBadge;
  /** Amazon-style social proof. */
  rating?: number;
  reviewCount?: number;
  bought?: string;
  /** Name of the look-specific section this product belongs to. */
  categorySection: string;
}

export interface FeaturedLook {
  slug: string;
  title: string;
  image: string;
  /** One-line vibe description shown on the look card. */
  description?: string;
  /**
   * Name of the on-page product section this look filters to. When present the
   * look card scrolls to that section instead of navigating away.
   */
  section?: string;
  /** Optional external/standalone page (legacy behaviour). */
  href?: string;
}

export interface IdeaListCategory {
  slug: string;
  title: string;
  eyebrow: string;
  shortDescription: string;
  /** Compact hero subtitle - one calm sentence, no editorial padding. */
  heroDescription: string;
  heroImage: string;
  /** [0] is the strong hero image, [1..] are supporting images. */
  creativeImages: string[];
  /** Short "Curated for" trust chips shown above the products. */
  trustItems: string[];
  /** Core products that recreate the whole aesthetic. Shown first. */
  essentials: IdeaProduct[];
  sections: string[];
  looks: FeaturedLook[];
  products: IdeaProduct[];
}

const PLACEHOLDER_IMG = "/placeholder-product.svg";

// Deterministic, realistic-looking social proof so the cards read like a live
// storefront without hand-authoring every number.
const FILL_RATINGS = [4.6, 4.8, 4.5, 4.7, 4.4, 4.9, 4.5, 4.7, 4.6, 4.8];
const FILL_REVIEWS = [2281, 12540, 7207, 1034, 3150, 640, 892, 410, 5120, 1680];
const FILL_BOUGHT = [
  "3K+ bought in past month",
  "5K+ bought in past month",
  "1K+ bought in past month",
  "500+ bought in past month",
  "800+ bought in past month",
  "200+ bought in past month",
];

/** Derive a slightly higher "was" price so each item reads as a small deal. */
const dealPrice = (price: string): string | undefined => {
  const n = parseFloat(price.replace(/[^0-9.]/g, ""));
  if (!n) return undefined;
  const list = n / 0.8; // ~20% off
  return `$${list.toFixed(2)}`;
};

/**
 * Merge live data fetched from the retailer (scripts/fetchProducts.mjs) over the
 * curated seed - real image/price/rating/reviews/retailer win. We keep the
 * curated title (retailer SEO titles are noisy). For products without fetched
 * data we fabricate realistic social proof + a deal price so the placeholder
 * categories still read like a live storefront.
 */
const enrich = (p: IdeaProduct, i: number): IdeaProduct => {
  const f = PRODUCT_DATA[p.id];
  const real = !!f;
  const merged: IdeaProduct = {
    ...p,
    image: f?.image ?? p.image,
    price: f?.price ?? p.price,
    listPrice: f?.listPrice ?? p.listPrice,
    rating: f?.rating ?? p.rating,
    reviewCount: f?.reviewCount ?? p.reviewCount,
    retailer: f?.retailer ?? p.retailer,
  };
  return {
    ...merged,
    rating: merged.rating ?? (real ? undefined : FILL_RATINGS[i % FILL_RATINGS.length]),
    reviewCount:
      merged.reviewCount ?? (real ? undefined : FILL_REVIEWS[i % FILL_REVIEWS.length]),
    bought: merged.bought ?? (real ? undefined : FILL_BOUGHT[i % FILL_BOUGHT.length]),
    listPrice: merged.listPrice ?? (real ? undefined : dealPrice(merged.price)),
  };
};

/** Placeholder generator for categories that don't yet have curated data. */
const buildProducts = (
  prefix: string,
  sections: string[],
  perSection = 4,
): IdeaProduct[] => {
  const badges: (ProductBadge | undefined)[] = [
    "Best Match",
    "Budget Pick",
    undefined,
    "Splurge",
  ];
  const retailers = ["Amazon", "Etsy", "Target", "Wayfair"];
  const prices = ["$19.99", "$34.00", "$58.00", "$129.00"];
  const out: IdeaProduct[] = [];
  sections.forEach((section, sIdx) => {
    for (let i = 0; i < perSection; i++) {
      const n = sIdx * perSection + i + 1;
      out.push(
        enrich(
          {
            id: `${prefix}-${String(n).padStart(3, "0")}`,
            title: `${section} Pick ${i + 1}`,
            price: prices[i % prices.length],
            retailer: retailers[i % retailers.length],
            image: PLACEHOLDER_IMG,
            affiliateUrl: "#",
            badge: badges[i % badges.length],
            categorySection: section,
          },
          n,
        ),
      );
    }
  });
  return out;
};

/** Compact helper for hand-curated products. affiliateUrl defaults to "#". */
type ProductSeed = Omit<IdeaProduct, "id" | "image" | "affiliateUrl"> & {
  affiliateUrl?: string;
};
const curate = (prefix: string, seeds: ProductSeed[]): IdeaProduct[] =>
  seeds.map((seed, i) =>
    enrich(
      {
        ...seed,
        id: `${prefix}-${String(i + 1).padStart(3, "0")}`,
        image: PLACEHOLDER_IMG,
        affiliateUrl: seed.affiliateUrl ?? "#",
      },
      i,
    ),
  );

/* ─────────────────────────  GREEN WELLNESS  ───────────────────────── */

const GW_RETREAT = "Jungle Spa Retreat";
const GW_VIBES = "Jungle Spa Vibes";
const GW_HAVEN = "Hanging Plant Haven";
const GW_BATHROOM = "Wellness Bathroom Refresh";
const GW_CORNER = "Cozy Plant Corner";

const GREEN_WELLNESS_SECTIONS = [
  GW_RETREAT,
  GW_VIBES,
  GW_HAVEN,
  GW_BATHROOM,
  GW_CORNER,
];

const GREEN_WELLNESS_ESSENTIALS = curate("green-ess", [
  {
    // price / rating / reviews / image come from scripts/fetchProducts.mjs
    title: "Retractable Moss Pole Plant Support",
    price: "$18.04",
    retailer: "DHgate",
    badge: "Best Match",
    affiliateUrl: "https://dhgate.sjv.io/qWZ9v5",
    categorySection: "Essentials",
  },
  {
    title: "Macrame Plant Hanger Set",
    price: "$24.00",
    retailer: "Etsy",
    badge: "Most Similar",
    categorySection: "Essentials",
  },
  {
    title: "Faux Monstera Plant",
    price: "$46.00",
    retailer: "Target",
    badge: "Plant Lover Pick",
    categorySection: "Essentials",
  },
  {
    title: "Warm Flameless Candle Set",
    price: "$29.99",
    retailer: "Amazon",
    badge: "Cozy Pick",
    categorySection: "Essentials",
  },
  {
    title: "Bamboo Shower Bench",
    price: "$69.00",
    retailer: "Wayfair",
    badge: "Spa Pick",
    categorySection: "Essentials",
  },
  {
    title: "Wall Mounted Plant Holder",
    price: "$16.99",
    retailer: "Amazon",
    badge: "Budget Pick",
    categorySection: "Essentials",
  },
  {
    title: "Natural Woven Storage Basket",
    price: "$34.00",
    retailer: "Target",
    badge: "Cozy Pick",
    categorySection: "Essentials",
  },
  {
    title: "Warm Rattan Lantern",
    price: "$39.00",
    retailer: "Amazon",
    badge: "Best Match",
    categorySection: "Essentials",
  },
]);

const GREEN_WELLNESS_PRODUCTS = curate("green", [
  // Jungle Spa Retreat
  { title: "Bamboo Bath Stool", price: "$42.00", retailer: "Wayfair", badge: "Spa Pick", categorySection: GW_RETREAT },
  { title: "Hanging Artificial Vines", price: "$19.99", retailer: "Amazon", badge: "Best Match", categorySection: GW_RETREAT },
  { title: "Lantern Candle Holder", price: "$28.00", retailer: "Etsy", categorySection: GW_RETREAT },
  { title: "Natural Cotton Bath Mat", price: "$24.99", retailer: "Target", categorySection: GW_RETREAT },
  { title: "Macrame Planter", price: "$22.00", retailer: "Etsy", badge: "Most Similar", categorySection: GW_RETREAT },
  { title: "Eucalyptus Shower Bundle", price: "$14.99", retailer: "Amazon", badge: "Budget Pick", categorySection: GW_RETREAT },

  // Jungle Spa Vibes
  { title: "Faux Palm Tree", price: "$79.00", retailer: "Wayfair", badge: "Plant Lover Pick", categorySection: GW_VIBES },
  { title: "Warm Floor Lantern", price: "$48.00", retailer: "Amazon", categorySection: GW_VIBES },
  { title: "Soy Candle Trio", price: "$32.00", retailer: "Etsy", badge: "Cozy Pick", categorySection: GW_VIBES },
  { title: "Plant Wall Hooks (Set of 6)", price: "$12.99", retailer: "Amazon", badge: "Budget Pick", categorySection: GW_VIBES },
  { title: "Hanging Greenery Garland", price: "$18.99", retailer: "Amazon", categorySection: GW_VIBES },
  { title: "Woven Seagrass Basket", price: "$36.00", retailer: "Target", badge: "Best Match", categorySection: GW_VIBES },

  // Hanging Plant Haven
  { title: "Ceiling Plant Hooks (Set)", price: "$11.99", retailer: "Amazon", badge: "Budget Pick", categorySection: GW_HAVEN },
  { title: "Macrame Hanger Set of 3", price: "$26.00", retailer: "Etsy", badge: "Best Match", categorySection: GW_HAVEN },
  { title: "Faux Trailing Ivy", price: "$21.99", retailer: "Amazon", badge: "Most Similar", categorySection: GW_HAVEN },
  { title: "Ceramic Wall Planter", price: "$34.00", retailer: "Target", categorySection: GW_HAVEN },
  { title: "Botanical Wall Art Set", price: "$29.00", retailer: "Etsy", categorySection: GW_HAVEN },
  { title: "Floating Wood Shelves (Set of 2)", price: "$44.00", retailer: "Wayfair", badge: "Cozy Pick", categorySection: GW_HAVEN },

  // Wellness Bathroom Refresh
  { title: "Bamboo Shower Bench", price: "$69.00", retailer: "Wayfair", badge: "Spa Pick", categorySection: GW_BATHROOM },
  { title: "Amber Glass Soap Dispenser", price: "$18.99", retailer: "Amazon", badge: "Best Match", categorySection: GW_BATHROOM },
  { title: "Natural Cotton Bath Mat", price: "$24.99", retailer: "Target", categorySection: GW_BATHROOM },
  { title: "Eucalyptus Bundle", price: "$14.99", retailer: "Amazon", badge: "Budget Pick", categorySection: GW_BATHROOM },
  { title: "Warm Flameless Candle Set", price: "$29.99", retailer: "Amazon", badge: "Cozy Pick", categorySection: GW_BATHROOM },
  { title: "Ceramic Essential Oil Diffuser", price: "$39.00", retailer: "Target", badge: "Most Similar", categorySection: GW_BATHROOM },

  // Cozy Plant Corner
  { title: "Faux Monstera Plant", price: "$46.00", retailer: "Target", badge: "Plant Lover Pick", categorySection: GW_CORNER },
  { title: "Small Woven Basket", price: "$19.99", retailer: "Amazon", badge: "Budget Pick", categorySection: GW_CORNER },
  { title: "Soft Rattan Table Lamp", price: "$52.00", retailer: "Wayfair", badge: "Cozy Pick", categorySection: GW_CORNER },
  { title: "Wall Plant Shelf", price: "$28.00", retailer: "Etsy", categorySection: GW_CORNER },
  { title: "Chunky Knit Throw Pillow", price: "$26.00", retailer: "Target", badge: "Best Match", categorySection: GW_CORNER },
  { title: "Amber Soy Candle", price: "$16.99", retailer: "Amazon", categorySection: GW_CORNER },
]);

/* ─────────────────────────  OTHER CATEGORIES  ─────────────────────── */

const WEDDINGS_SECTIONS = [
  "Featured Picks",
  "Florals & Centerpieces",
  "Lanterns & Candlelight",
  "Table Decor",
  "Ceremony Details",
];

const DORM_SECTIONS = [
  "Featured Picks",
  "Storage & Organization",
  "Desk Setup",
  "Bedding & Cozy Details",
  "Lighting & Wall Decor",
];

const SMALL_SPACE_SECTIONS = [
  "Featured Picks",
  "Multifunctional Furniture",
  "Vertical Storage",
  "Compact Decor",
  "Small Space Lighting",
];

const LIVING_SECTIONS = [
  "Featured Picks",
  "Cozy Seating",
  "Rugs & Pillows",
  "Plants & Natural Decor",
  "Lighting & Accent Pieces",
];

export const IDEA_LIST_CATEGORIES: IdeaListCategory[] = [
  {
    slug: "green-wellness",
    title: "Green Wellness",
    eyebrow: "EcoShopGuide Idea List",
    shortDescription:
      "Trailing plants, candlelight, and spa-quiet textures for a restorative home sanctuary.",
    heroDescription:
      "Recreate a calming spa-inspired space with hanging greenery, warm light, candles, and natural textures.",
    heroImage: jungleSpaHero,
    creativeImages: [jungleSpaHero, jungleVibesHero, forestHero],
    trustItems: [
      "Spa-inspired spaces",
      "Cozy greenery",
      "Small home upgrades",
      "Budget finds",
    ],
    essentials: GREEN_WELLNESS_ESSENTIALS,
    sections: GREEN_WELLNESS_SECTIONS,
    looks: [
      {
        slug: "jungle-spa-retreat",
        title: GW_RETREAT,
        image: jungleSpaHero,
        description:
          "Warm candles, hanging greenery, and bamboo textures for a calming escape.",
        section: GW_RETREAT,
      },
      {
        slug: "jungle-spa-vibes",
        title: GW_VIBES,
        image: jungleVibesHero,
        description:
          "A lush lounge with soft lanterns, a daybed, and tropical greenery.",
        section: GW_VIBES,
      },
      {
        slug: "hanging-plant-haven",
        title: GW_HAVEN,
        image: forestHero,
        description:
          "Trailing ivy, ceiling hooks, and macrame for a living canopy.",
        section: GW_HAVEN,
      },
      {
        slug: "wellness-bathroom-refresh",
        title: GW_BATHROOM,
        image: bohoLivingHero,
        description:
          "Bamboo, amber glass, and eucalyptus for a warm, spa-like bath.",
        section: GW_BATHROOM,
      },
      {
        slug: "cozy-plant-corner",
        title: GW_CORNER,
        image: cozyAptHero,
        description:
          "A soft-lit nook with faux plants, baskets, and cozy textures.",
        section: GW_CORNER,
      },
    ],
    products: GREEN_WELLNESS_PRODUCTS,
  },
  {
    slug: "weddings",
    title: "Weddings",
    eyebrow: "EcoShopGuide Idea List",
    shortDescription:
      "Lanterns, florals, and table styling for an event that feels effortlessly romantic.",
    heroDescription:
      "Curated decor for ceremonies and receptions - florals, candlelight, and the small details guests remember.",
    heroImage: weddingHero,
    creativeImages: [weddingHero, forestHero, weddingHero],
    trustItems: ["Garden ceremonies", "Reception tables", "Candlelight", "Budget finds"],
    essentials: [],
    sections: WEDDINGS_SECTIONS,
    looks: [
      {
        slug: "dreamy-boho-garden-wedding",
        title: "Dreamy Boho Garden Wedding",
        image: weddingHero,
        href: "/pages/dreamy-boho-garden-wedding",
      },
      {
        slug: "enchanted-forest-retreat",
        title: "Enchanted Forest Retreat",
        image: forestHero,
        href: "/pages/enchanted-forest-retreat",
      },
      {
        slug: "lantern-lit-reception",
        title: "Lantern-Lit Reception",
        image: weddingHero,
      },
      {
        slug: "floral-aisle-ceremony",
        title: "Floral Aisle Ceremony",
        image: forestHero,
      },
    ],
    products: buildProducts("wedding", WEDDINGS_SECTIONS),
  },
  {
    slug: "dorm-rooms",
    title: "Dorm Rooms",
    eyebrow: "EcoShopGuide Idea List",
    shortDescription:
      "Cozy lighting, smart storage, and budget-friendly styling for a dorm that feels like home.",
    heroDescription:
      "Everything you need to set up a comfortable, organized dorm - bedding, lighting, and clever storage.",
    heroImage: dormHero,
    creativeImages: [dormHero, dormHero, dormHero],
    trustItems: ["Small rooms", "Smart storage", "Cozy lighting", "Budget finds"],
    essentials: [],
    sections: DORM_SECTIONS,
    looks: [
      {
        slug: "cozy-dorm-room",
        title: "Cozy Eco-Friendly Dorm",
        image: dormHero,
        href: "/pages/cozy-dorm-room",
      },
      {
        slug: "fairy-lit-corner",
        title: "Fairy-Lit Reading Corner",
        image: dormHero,
      },
      {
        slug: "minimal-study-setup",
        title: "Minimal Study Setup",
        image: dormHero,
      },
    ],
    products: buildProducts("dorm", DORM_SECTIONS),
  },
  {
    slug: "small-spaces",
    title: "Small Spaces",
    eyebrow: "EcoShopGuide Idea List",
    shortDescription:
      "Multifunctional pieces and vertical storage that make compact rooms feel open and considered.",
    heroDescription:
      "Smart picks for studios and tiny apartments - pieces that earn their footprint without sacrificing style.",
    heroImage: cozyAptHero,
    creativeImages: [cozyAptHero, bohoLivingHero, cozyAptHero],
    trustItems: ["Studios", "Vertical storage", "Multi-use pieces", "Budget finds"],
    essentials: [],
    sections: SMALL_SPACE_SECTIONS,
    looks: [
      {
        slug: "cozy-apartment-living-room",
        title: "Cozy Apartment Living Room",
        image: cozyAptHero,
        href: "/pages/cozy-apartment-living-room",
      },
      {
        slug: "warm-boho-living-room",
        title: "Warm Boho Living Room",
        image: bohoLivingHero,
        href: "/pages/warm-boho-living-room",
      },
      {
        slug: "studio-nook",
        title: "Studio Nook",
        image: cozyAptHero,
      },
      {
        slug: "vertical-storage-wall",
        title: "Vertical Storage Wall",
        image: bohoLivingHero,
      },
    ],
    products: buildProducts("small", SMALL_SPACE_SECTIONS),
  },
  {
    slug: "living-rooms",
    title: "Living Rooms",
    eyebrow: "EcoShopGuide Idea List",
    shortDescription:
      "Layered textures, warm lighting, and natural decor for a living room that feels like a hug.",
    heroDescription:
      "Curated picks for a warm, lived-in living room - soft seating, layered rugs, and easy plant styling.",
    heroImage: bohoLivingHero,
    creativeImages: [bohoLivingHero, cozyAptHero, forestHero],
    trustItems: ["Warm textures", "Soft seating", "Plant styling", "Budget finds"],
    essentials: [],
    sections: LIVING_SECTIONS,
    looks: [
      {
        slug: "warm-boho-living-room",
        title: "Warm Boho Living Room",
        image: bohoLivingHero,
        href: "/pages/warm-boho-living-room",
      },
      {
        slug: "cozy-apartment-living-room",
        title: "Cozy Apartment Living Room",
        image: cozyAptHero,
        href: "/pages/cozy-apartment-living-room",
      },
      {
        slug: "earthy-neutral-lounge",
        title: "Earthy Neutral Lounge",
        image: bohoLivingHero,
      },
      {
        slug: "plant-filled-reading-nook",
        title: "Plant-Filled Reading Nook",
        image: forestHero,
      },
    ],
    products: buildProducts("living", LIVING_SECTIONS),
  },
];

export const getCategoryBySlug = (slug: string) =>
  IDEA_LIST_CATEGORIES.find((c) => c.slug === slug);

/** Other categories, for the "Related Idea Lists" rail. */
export const getRelatedCategories = (slug: string) =>
  IDEA_LIST_CATEGORIES.filter((c) => c.slug !== slug);

/** Stable id used for in-page section anchors. */
export const sectionId = (section: string) =>
  `section-${section.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
