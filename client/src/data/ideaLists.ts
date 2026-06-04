import weddingHero from "@assets/dreamy-boho-garden-wedding-hero.png";
import forestHero from "@assets/enchanted-forest-retreat-hero.png";
import bohoLivingHero from "@assets/warm-boho-living-room-hero.png";
import cozyAptHero from "@assets/cozy-apartment-living-room-hero.png";
import jungleSpaHero from "@assets/jungle-spa-retreat-hero.png";
import jungleVibesHero from "@assets/jungle-spa-vibes-hero.png";
import dormHero from "@assets/cozy-dorm-room-hero.png";

export type ProductBadge =
  | "Best Match"
  | "Budget Pick"
  | "Splurge"
  | "Cozy Pick"
  | "Space Saver";

export interface IdeaProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  retailer: string;
  image: string;
  affiliateUrl: string;
  badge?: ProductBadge;
  categorySection: string;
}

export interface FeaturedLook {
  slug: string;
  title: string;
  image: string;
  href?: string;
}

export interface IdeaListCategory {
  slug: string;
  title: string;
  shortDescription: string;
  heroDescription: string;
  heroImage: string;
  creativeImages: string[];
  sections: string[];
  looks: FeaturedLook[];
  products: IdeaProduct[];
}

const PLACEHOLDER_IMG = "/placeholder-product.svg";

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
      out.push({
        id: `${prefix}-${String(n).padStart(3, "0")}`,
        title: `${section} Pick ${i + 1}`,
        description: "Placeholder descriptor - short, one-line product blurb.",
        price: prices[i % prices.length],
        retailer: retailers[i % retailers.length],
        image: PLACEHOLDER_IMG,
        affiliateUrl: "#",
        badge: badges[i % badges.length],
        categorySection: section,
      });
    }
  });
  return out;
};

const GREEN_WELLNESS_SECTIONS = [
  "Featured Picks",
  "Hanging Plants & Greenery",
  "Candles & Ambient Lighting",
  "Spa Bathroom Details",
  "Natural Textures & Storage",
];

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
    shortDescription:
      "Trailing plants, candlelight, and spa-quiet textures for a restorative home sanctuary.",
    heroDescription:
      "A curated shopping list for at-home spa rituals - hanging greenery, soft ambient light, and natural materials.",
    heroImage: jungleSpaHero,
    creativeImages: [jungleSpaHero, jungleVibesHero, forestHero],
    sections: GREEN_WELLNESS_SECTIONS,
    looks: [
      {
        slug: "jungle-spa-retreat",
        title: "Jungle Spa Retreat",
        image: jungleSpaHero,
        href: "/pages/jungle-spa-retreat",
      },
      {
        slug: "jungle-spa-vibes",
        title: "Jungle Spa Vibes",
        image: jungleVibesHero,
        href: "/pages/jungle-spa-vibes",
      },
      {
        slug: "hanging-plant-haven",
        title: "Hanging Plant Haven",
        image: forestHero,
      },
      {
        slug: "wellness-bathroom-refresh",
        title: "Wellness Bathroom Refresh",
        image: jungleSpaHero,
      },
      {
        slug: "cozy-plant-corner",
        title: "Cozy Plant Corner",
        image: jungleVibesHero,
      },
    ],
    products: buildProducts("green", GREEN_WELLNESS_SECTIONS),
  },
  {
    slug: "weddings",
    title: "Weddings",
    shortDescription:
      "Lanterns, florals, and table styling for an event that feels effortlessly romantic.",
    heroDescription:
      "Curated decor for ceremonies and receptions - florals, candlelight, and the small details guests remember.",
    heroImage: weddingHero,
    creativeImages: [weddingHero, forestHero, weddingHero],
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
    shortDescription:
      "Cozy lighting, smart storage, and budget-friendly styling for a dorm that feels like home.",
    heroDescription:
      "Everything you need to set up a comfortable, organized dorm - bedding, lighting, and clever storage.",
    heroImage: dormHero,
    creativeImages: [dormHero, dormHero, dormHero],
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
    shortDescription:
      "Multifunctional pieces and vertical storage that make compact rooms feel open and considered.",
    heroDescription:
      "Smart picks for studios and tiny apartments - pieces that earn their footprint without sacrificing style.",
    heroImage: cozyAptHero,
    creativeImages: [cozyAptHero, bohoLivingHero, cozyAptHero],
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
    shortDescription:
      "Layered textures, warm lighting, and natural decor for a living room that feels like a hug.",
    heroDescription:
      "Curated picks for a warm, lived-in living room - soft seating, layered rugs, and easy plant styling.",
    heroImage: bohoLivingHero,
    creativeImages: [bohoLivingHero, cozyAptHero, forestHero],
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
