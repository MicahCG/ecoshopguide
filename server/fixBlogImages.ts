import { requireDb } from "./db";
import { blogs } from "@shared/schema";
import { eq } from "drizzle-orm";

// Mapping of bad images to good replacements
// The portrait image (photo-1507003211169) is a man's headshot - completely wrong for home decor
const IMAGE_FIXES: Record<string, Record<string, string>> = {
  // "12 Cozy Apartment Decorating Ideas" - fix multiple sections
  "12-cozy-apartment-decorating-ideas": {
    "Fireplace Ambiance": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    "Dimmer Switch Magic": "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80",
  },
  
  "12-essentials-small-space": {
    "Wireless Lighting": "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80",
  },
  
  "guide-cozy-living-space": {
    "Lighting Strategy": "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80",
  },
  
  "small-space-living-ideas-big-impact": {
    "Statement Wall Treatment": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    "Dramatic Lighting Fixture": "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80",
    "Curated Collection Display": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80",
    "Indoor-Outdoor Connection": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  
  "15-ways-elevate-wedding-venue": {
    "Candlelight Everywhere": "https://images.unsplash.com/photo-1602874801006-bf8c1b70e0b0?w=800&q=80",
  },
  
  "2026-luxury-wedding-inspires": {
    "Organic Tablescape Design": "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80",
  },
  
  "15-warm-apartment-aesthetic-ideas": {
    "Vintage Brass Accents": "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80",
  },
  
  "12-studio-apartment-ideas-2026": {
    "Lighting Layers": "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80",
  },
  
  "small-apartment-decor-tips-cozy-home": {
    "Warm Lighting Throughout": "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80",
  },
  
  "easy-ways-elevate-apartment-style": {
    "Invest in Lighting": "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80",
  },
  
  "12-ways-style-eco-wedding-venue": {
    "Candlelight Ambiance": "https://images.unsplash.com/photo-1602874801006-bf8c1b70e0b0?w=800&q=80",
  },
  
  "12-natural-wedding-decoration-ideas": {
    "Driftwood Accents": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
};

// Additional image replacements for common broken/misused images
const GLOBAL_IMAGE_REPLACEMENTS: Record<string, string> = {
  // Portrait image (man's headshot) - completely wrong for home decor
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d": "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f",
  // Broken Unsplash URL (malformed ID)
  "https://images.unsplash.com/photo-1478146059778-achart-preview-09w": "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
};

async function fixBlogImages() {
  console.log("Starting blog image audit and fix...\n");
  const db = requireDb();
  
  const allBlogs = await db.select().from(blogs);
  let fixedCount = 0;
  
  for (const blog of allBlogs) {
    let products = blog.products as any[];
    let hasChanges = false;
    
    if (!Array.isArray(products)) {
      console.log(`Skipping ${blog.slug} - products is not an array`);
      continue;
    }
    
    // Check for specific fixes for this blog
    const blogFixes = IMAGE_FIXES[blog.slug];
    
    products = products.map((product, index) => {
      let imageUrl = product.image || product.imageUrl;
      if (!imageUrl) return product;
      
      // Check for specific title-based fixes
      if (blogFixes && blogFixes[product.title]) {
        const newImage = blogFixes[product.title];
        console.log(`  [${blog.slug}] Fixing "${product.title}"`);
        console.log(`    Old: ${imageUrl.substring(0, 60)}...`);
        console.log(`    New: ${newImage.substring(0, 60)}...`);
        hasChanges = true;
        return {
          ...product,
          image: newImage,
        };
      }
      
      // Check for global replacements (broken/misused images)
      for (const [badUrl, goodUrl] of Object.entries(GLOBAL_IMAGE_REPLACEMENTS)) {
        if (imageUrl.includes(badUrl.split("?")[0].split("/").pop() || "")) {
          console.log(`  [${blog.slug}] Replacing broken/misused image in "${product.title}"`);
          hasChanges = true;
          return {
            ...product,
            image: goodUrl + "?w=800&q=80",
          };
        }
      }
      
      return product;
    });
    
    if (hasChanges) {
      await db.update(blogs)
        .set({ products })
        .where(eq(blogs.id, blog.id));
      fixedCount++;
      console.log(`  Updated: ${blog.slug}\n`);
    }
  }
  
  console.log(`\nFixed ${fixedCount} blog posts with image issues.`);
}

// Run
fixBlogImages()
  .then(() => {
    console.log("\nImage fix complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error fixing images:", err);
    process.exit(1);
  });
