import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config();

const GEMINI_API_KEY = 'AIzaSyBJv2m1LtIVYHksfwEqyd4YG3GLGkE9XyY';
const PLANT_STAND_VARIANT_ID = '10190245757217';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Lifestyle image prompts for the 7-tier plant stand
// These prompts are designed to create Instagram-worthy lifestyle shots
const lifestylePrompts = [
  {
    name: 'living_room_corner',
    prompt: `Create a photorealistic interior design image: A stylish 7-tier black metal plant stand with dark wooden shelves stands in a bright, modern living room corner. The plant stand is approximately 6 feet tall with a slim vertical ladder-style design holding 7 shelves. Each shelf displays beautiful indoor plants: trailing pothos, small succulents in terracotta pots, a peace lily, and lush ferns. Natural sunlight streams through a large window nearby. The room features white walls, a cozy beige linen sofa partially visible, warm oak hardwood flooring, and minimalist Scandinavian decor. The image should look like a professional interior design magazine photo - warm, inviting, aspirational. Instagram-worthy home decor photography style.`,
  },
  {
    name: 'bedroom_window',
    prompt: `Create a photorealistic lifestyle image: A sleek 7-tier black metal vertical plant shelf positioned next to a sunny bedroom window. The tall plant stand has dark shelves and is filled with an array of lush green houseplants including trailing golden pothos, various succulents, a small snake plant, and leafy tropical plants. Soft morning light illuminates the plants, creating a peaceful atmosphere. The bedroom has neutral white and cream tones, crisp white linen bedding visible in the frame, and a serene minimalist aesthetic with cozy textures. Professional interior photography, peaceful morning vibes, hygge style.`,
  },
  {
    name: 'small_apartment',
    prompt: `Create a photorealistic interior photo: A tall 7-tier black metal plant stand in a cozy urban studio apartment, demonstrating smart vertical storage. The slim ladder-style plant shelf holds multiple potted plants at different heights including monstera, string of pearls, and various succulents. The small apartment features exposed brick wall, a comfortable velvet reading chair in forest green nearby, warm Edison bulb lighting, and vintage-modern decor. The plant stand fits perfectly in a narrow corner without taking floor space. Modern urban apartment living, space-saving home decor, editorial lifestyle photography, Apartment Therapy style.`,
  },
  {
    name: 'sunroom_plants',
    prompt: `Create a photorealistic plant lover's dream image: A stunning 7-tier black metal plant display stand in a bright sunroom absolutely filled with natural light. The vertical plant shelf showcases a curated collection of thriving indoor plants in beautiful terracotta, white ceramic, and woven basket planters. Large windows surround the space with views of greenery outside. The industrial black metal frame contrasts beautifully with the lush green plants and natural textures. This is plant parent goals - a botanical paradise, magazine-quality home and garden photography, greenhouse aesthetic.`,
  },
];

async function fetchProductImage(): Promise<string | null> {
  try {
    console.log('📦 Fetching product data to reference...');
    const response = await fetch('https://www.shopbambana.com/api/products');
    const products = await response.json();

    // Find the plant stand - try multiple matching strategies
    const plantStand = products.find((p: any) => {
      if (p.variants?.some((v: any) => v.id === PLANT_STAND_VARIANT_ID)) return true;
      if (p.variantId === PLANT_STAND_VARIANT_ID) return true;
      const title = p.title?.toLowerCase() || '';
      return (title.includes('plant stand') || title.includes('plant shelf') || title.includes('plant rack')) &&
             (title.includes('tall') || title.includes('tier') || title.includes('indoor'));
    });

    if (plantStand) {
      console.log(`✅ Found product: ${plantStand.title}`);
      console.log(`📷 Product image: ${plantStand.image}`);
      return plantStand.image;
    }

    // Try broader search
    const anyPlantStand = products.find((p: any) => {
      const title = p.title?.toLowerCase() || '';
      return title.includes('plant') && (title.includes('stand') || title.includes('shelf'));
    });

    if (anyPlantStand) {
      console.log(`✅ Found related product: ${anyPlantStand.title}`);
      console.log(`📷 Product image: ${anyPlantStand.image}`);
      return anyPlantStand.image;
    }

    console.log('⚠️ Plant stand not found in product catalog - generating generic lifestyle images');
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function generateLifestyleImage(prompt: string, name: string): Promise<string | null> {
  try {
    console.log(`\n🎨 Generating: ${name}...`);

    // Use the image generation model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp-image-generation',
    });

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        // @ts-ignore - responseModalities is supported but not in types
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const response = result.response;

    // Check for generated images in the response
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        // Check for inline data (base64 image)
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          const outputDir = path.join(process.cwd(), 'generated-images');
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          const extension = part.inlineData.mimeType.split('/')[1] || 'png';
          const filename = `plant_stand_${name}.${extension}`;
          const filepath = path.join(outputDir, filename);

          const imageBuffer = Buffer.from(part.inlineData.data!, 'base64');
          fs.writeFileSync(filepath, imageBuffer);

          console.log(`✅ Saved: ${filepath}`);
          return filepath;
        }
      }
    }

    // Log what we got back for debugging
    const text = response.text?.();
    if (text) {
      console.log(`📝 Response text: ${text.substring(0, 200)}...`);
    }

    console.log(`⚠️ No image data in response for ${name}`);
    return null;
  } catch (error: any) {
    console.error(`❌ Error generating ${name}:`, error.message || error);
    return null;
  }
}

async function main() {
  console.log('🌿 Plant Stand Lifestyle Image Generator\n');
  console.log('=========================================\n');

  // Get the product image for reference
  const productImage = await fetchProductImage();

  if (productImage) {
    console.log('\n📷 Reference product image URL for comparison:');
    console.log(productImage);
  }

  console.log('\n🎨 Starting lifestyle image generation with Gemini 2.0...\n');
  console.log('Using model: gemini-2.0-flash-exp-image-generation\n');

  const generatedImages: string[] = [];

  for (const { name, prompt } of lifestylePrompts) {
    const result = await generateLifestyleImage(prompt, name);

    if (result) {
      generatedImages.push(result);
    }

    // Rate limiting - wait between requests
    console.log('⏳ Waiting 3 seconds before next generation...');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log('\n=========================================');
  console.log('🎉 Generation Complete!\n');
  console.log(`Generated ${generatedImages.length} of ${lifestylePrompts.length} images`);

  if (generatedImages.length > 0) {
    console.log('\n📁 Generated images saved to: ./generated-images/');
    console.log('\nFiles created:');
    generatedImages.forEach(img => console.log(`  - ${path.basename(img)}`));
    console.log('\n📌 Next steps:');
    console.log('1. Review the generated images in ./generated-images/');
    console.log('2. Upload the best ones to your Shopify product gallery');
    console.log('3. Or upload to a CDN and add URLs to product images array');
  } else {
    console.log('\n⚠️ No images were generated. This could be due to:');
    console.log('   - API quota limits');
    console.log('   - Content filtering');
    console.log('   - Model availability in your region');
    console.log('\n💡 Alternative: Consider using dedicated image generation services like:');
    console.log('   - Midjourney');
    console.log('   - DALL-E 3');
    console.log('   - Adobe Firefly');
  }
}

main().catch(console.error);
