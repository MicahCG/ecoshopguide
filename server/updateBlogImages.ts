import { requireDb } from "./db";
import { blogs } from "@shared/schema";
import { eq } from "drizzle-orm";

// Feature images for Wedding blogs
const weddingFeatureImages: Record<string, string> = {
  "2026-luxury-wedding-inspires": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  "15-ways-elevate-wedding-venue": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  "eco-friendly-wedding-guide": "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&q=80",
  "boho-wedding-must-haves": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
  "beautiful-wedding-ideas": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
  "curate-sustainable-wedding": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  "old-money-aesthetic-wedding": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  "outdoor-wedding-venue-ideas": "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80",
  "romantic-wedding-arch-ideas": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
  "destination-wedding-planning": "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
  "intimate-elopement-inspiration": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  "bridal-getting-ready-room": "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800&q=80",
  "wedding-photography-tips-couples": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
  "wedding-day-timeline-tips": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  "wedding-vow-writing-guide": "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&q=80",
  "eco-friendly-wedding-favors": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  "sustainable-bridal-beauty": "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80",
  "minimalist-wedding-design": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
  "wedding-ceremony-decor-ideas": "https://images.unsplash.com/photo-1470525273955-23d7acdf0917?w=800&q=80",
  "organic-wedding-cake-inspiration": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  "wedding-guest-experience-ideas": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  "sustainable-wedding-registry": "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800&q=80",
};

// Feature images for Home/Apartment blogs
const homeFeatureImages: Record<string, string> = {
  "12-studio-apartment-ideas-2026": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "small-apartment-decor-tips-cozy-home": "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800&q=80",
  "apartment-aesthetic-ideas": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
  "cozy-apartment-bedroom-ideas": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
  "small-space-living-hacks": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
  "minimal-apartment-styling": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  "warm-apartment-lighting-ideas": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  "apartment-plant-styling-guide": "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800&q=80",
  "studio-apartment-layout-tips": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "small-kitchen-organization-ideas": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  "apartment-entryway-ideas": "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
  "compact-home-office-setup": "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&q=80",
  "10-eco-essentials": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  "15-elegant-ways-elevate-kitchen-style": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  "8-tiny-apartment-decor-ideas-spacious": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
};

// Keywords for categorizing
const WEDDING_KEYWORDS = [
  "wedding", "bridal", "bride", "ceremony", "reception", "venue",
  "boho-wedding", "eco-friendly-wedding", "sustainable-wedding",
  "old-money-wedding", "destination-wedding", "romantic", "elopement",
  "vow", "favor", "registry", "arch"
];

const HOME_KEYWORDS = [
  "apartment", "studio", "cozy", "small-space", "living-space", "decor",
  "aesthetic", "kitchen", "tiny", "essentials", "elevate", "warm",
  "layout", "eco-essentials", "bedroom", "entryway", "office", "plant",
  "lighting", "minimal", "organization"
];

function getCategory(slug: string, title: string): string {
  const combined = `${slug.toLowerCase()} ${title.toLowerCase()}`;
  
  const isWedding = WEDDING_KEYWORDS.some(keyword => combined.includes(keyword));
  
  if (isWedding) return "wedding";
  return "home";
}

function getFeatureImage(slug: string, products: any): string {
  // First check our predefined maps
  if (weddingFeatureImages[slug]) return weddingFeatureImages[slug];
  if (homeFeatureImages[slug]) return homeFeatureImages[slug];
  
  // Fallback: try to get from first product
  if (products && Array.isArray(products) && products.length > 0) {
    const firstProduct = products[0];
    if (firstProduct.image) return firstProduct.image;
    if (firstProduct.imageUrl) return firstProduct.imageUrl;
  }
  
  // Default fallback images based on category
  return "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80";
}

export async function updateBlogImagesAndCategories() {
  console.log("Starting blog image and category update...");
  const db = requireDb();
  
  const allBlogs = await db.select().from(blogs);
  console.log(`Found ${allBlogs.length} blogs to update`);
  
  for (const blog of allBlogs) {
    const category = getCategory(blog.slug, blog.title);
    const featureImage = getFeatureImage(blog.slug, blog.products);
    
    await db.update(blogs)
      .set({
        category,
        featureImage
      })
      .where(eq(blogs.id, blog.id));
    
    console.log(`Updated: ${blog.slug} -> category: ${category}`);
  }
  
  console.log("Blog update complete!");
}

// Run if executed directly
updateBlogImagesAndCategories()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error updating blogs:", err);
    process.exit(1);
  });
