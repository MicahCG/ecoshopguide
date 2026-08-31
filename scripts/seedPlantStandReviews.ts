import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { reviews, users, reviewAuditLog } from '../shared/schema';
import { eq, and, or, like } from 'drizzle-orm';

// Load environment variables
config();

// Plant stand product - using Boho Plant Stand from current catalog
const PLANT_STAND_PRODUCT_ID = 'shopify_10190241464609';

// Diverse reviewer names - realistic, casual formats
const reviewerNames = [
  'Adetayo', 'priya', 'Marcus', 'Yuki', 'fatima',
  'DeShawn', 'Costa', 'Mei', 'carlos', 'Amara',
  'Tabish', 'elena', 'Kwame', 'Sanjay', 'Rosa',
  'jin', 'Kenji', 'Aaliyah', 'omar', 'Lakshmi',
];

// Reviews WITH photos - these have realistic customer photos attached
// Photos are in ./generated-images/review-photos/
const reviewsWithPhotos = [
  {
    title: "Finally got all my plants organized!",
    comment: `Just finished putting this together and had to share. Took me about 20 minutes to assemble, which was easier than expected. I love how it fits in this awkward corner by my window - my plants are going to be so happy with all that light. The shelves are sturdy enough for my heavy terracotta pots. Only thing is I got a tiny scratch on the base while moving it into place, but you can barely see it. Already planning what plants to add to the empty spots!`,
    rating: 5,
    reviewerName: "michelle",
    photoFilename: "review_photo_1_michellek.png",
  },
  {
    title: "Holds all 14 of my plants!",
    comment: `I was worried this wouldn't hold all my plants but wow, I fit 14 pots on here ranging from small succulents to my big peace lily. The shelves have some water marks now from watering day but that's my fault for not being careful. It's been two months and no wobbling or sagging. My pothos is loving the height and trailing down beautifully. The only reason I'm not giving 5 stars is I wish the shelves were slightly wider for my one pot that hangs over the edge a bit.`,
    rating: 4,
    reviewerName: "Adetayo",
    photoFilename: "review_photo_2_davidr.png",
  },
  {
    title: "Perfect for my tiny bedroom",
    comment: `My bedroom is maybe 10x10 and I thought there was no way I could have plants in here. This stand changed everything - it takes up like 1 square foot of floor space but I now have 7 plants in my room. I keep it between my nightstand and the corner. Had to put a little cardboard under one leg because my floor is uneven but it's stable now. The warm light from my lamp makes it look really cozy at night. Assembly was straightforward, took maybe 25 min.`,
    rating: 5,
    reviewerName: "Jess",
    photoFilename: "review_photo_3_jessicat.png",
  },
  {
    title: "Solid build quality for the price",
    comment: `Just finished assembling and wanted to share a close-up of the quality. The shelves are thicker than I expected - feels like real wood not flimsy particle board. The metal frame is sturdy powder-coated steel, you can see the joints are well made. I noticed a tiny bubble in the coating on one leg but it's barely visible. All the screws were included plus a couple extras which was nice. The instructions were clear enough. Overall impressed with the construction, especially compared to cheaper stands I've seen at big box stores.`,
    rating: 5,
    reviewerName: "Tabish",
    photoFilename: "review_photo_4_brianm.png",
  },
  {
    title: "My plants are so happy by the window",
    comment: `Had to snap a pic this morning - the way the light comes through my kitchen window and hits all the plants is just beautiful. I moved the stand here last week and already notice my plants perking up. You can see in the photo how the light filters through the leaves. My pothos has grown like 3 inches already! The stand is tall enough that even the top shelf gets good light. Only downside is I can see all the dust on the shelves now lol time to clean. Worth every penny though.`,
    rating: 5,
    reviewerName: "amanda",
    photoFilename: "review_photo_5_amandal.png",
  },
  {
    title: "Not just for plants - great entryway piece",
    comment: `I didn't want a boring entryway table so I got this instead. I use it for plants AND practical stuff - there's a bowl for keys on one shelf, a little tray for mail, and the rest is plants. It's narrow enough that it doesn't block the hallway in my small apartment. My only complaint is I wish there was one more shelf at hip height for setting things down when I walk in. The droopy plant in the pic needs water, not the stand's fault haha. Great purchase for apartment living.`,
    rating: 4,
    reviewerName: "Costa",
    photoFilename: "review_photo_6_chrisp.png",
  },
];

// Text-only reviews (no photos) for variety
const plantStandReviews = [
  // 5-star reviews with specific details
  {
    title: 'Exceeded my expectations',
    comment: 'After months of searching for something tall enough for my monstera and fiddle leaf fig, this stand is exactly what I needed. The 7 tiers give me plenty of room, and the metal frame feels incredibly sturdy. Assembly took about 25 minutes with just a Phillips head screwdriver. My living room corner has never looked better!',
    rating: 5,
  },
  {
    title: 'Impressed with the quality',
    comment: 'I was skeptical about ordering furniture online, but this exceeded my expectations. The shelves are thicker than I expected and the black finish matches my other furniture perfectly. It holds my heavy terracotta pots without any wobbling. Shipped quickly and was easy to put together.',
    rating: 5,
  },
  {
    title: 'Creates a beautiful indoor garden',
    comment: 'This stand turned an empty corner into a lush plant display. I have 12 plants on it ranging from small succulents to a large pothos, and there\'s still room for more. The tiered design lets light reach all levels. My only wish is that it came in other colors.',
    rating: 5,
  },
  {
    title: 'Sturdy and well-designed',
    comment: 'Just finished assembling this and I\'m really happy with it. The instructions were clear and all the hardware was included. I was worried about it being wobbly at almost 6 feet tall, but it\'s rock solid. The adjustable feet helped level it on my slightly uneven floor.',
    rating: 5,
  },
  {
    title: 'Worth the investment',
    comment: 'At first I thought the price was a bit high for a plant stand, but after seeing it in person I understand why. The build quality is excellent and it looks much more expensive than it is. I\'ve received so many compliments from guests. Highly recommend for serious plant parents!',
    rating: 5,
  },
  // 4-star reviews with constructive feedback
  {
    title: 'Great stand, assembly could be easier',
    comment: 'The finished product looks great and is very sturdy. However, the assembly instructions could be clearer - had to figure out a few steps on my own. Once together though, it\'s perfect. Holds all my plants securely and the height is ideal for my space.',
    rating: 4,
  },
  {
    title: 'Good value, minor shipping damage',
    comment: 'There were a couple small scratches on one of the metal legs, probably from shipping. Not very noticeable once assembled and doesn\'t affect function at all. The stand itself is well-made and my 10+ plants fit perfectly. Would buy again.',
    rating: 4,
  },
  // 3-star balanced review
  {
    title: 'Decent stand, took longer to assemble',
    comment: 'The stand looks nice and holds my plants well. Assembly took me over an hour because some of the screw holes didn\'t align perfectly and needed some extra force. Once built, it\'s stable and functional. Just be prepared for a bit of a project.',
    rating: 3,
  },
];

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Shuffle array to randomize review order
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function seedPlantStandReviews() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  try {
    console.log('🌿 Seeding reviews for 7-Tier Plant Stand (variant: 10190245757217)...');

    // First, fetch products to find the plant stand
    console.log('📦 Fetching products to find plant stand...');
    const response = await fetch('https://www.shopbambana.com/api/products');
    const allProducts = await response.json();

    // Find the plant stand product by ID or by title
    const plantStand = allProducts.find((p: any) => {
      if (p.id === PLANT_STAND_PRODUCT_ID) return true;
      const title = p.title?.toLowerCase() || '';
      return title.includes('plant stand') || title.includes('boho plant');
    });

    if (!plantStand) {
      console.log('Available products:');
      allProducts.slice(0, 20).forEach((p: any) => console.log(`  - ${p.id}: ${p.title}`));
      console.error('❌ Plant stand product not found');
      await client.end();
      process.exit(1);
    }

    console.log(`✅ Found plant stand: ${plantStand.title} (${plantStand.id})`);

    // Date range: from 3 months ago to today
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    let createdCount = 0;
    const allCreatedReviews: any[] = [];

    // ============================================
    // PHASE 1: Create reviews WITH photos
    // ============================================
    console.log('\n📸 Creating reviews with photos...\n');

    // NOTE: Photos need to be uploaded to your CDN/storage first
    // For now, we'll use placeholder paths that you'll replace with actual URLs
    // after uploading the generated images from ./generated-images/review-photos/
    const PHOTO_BASE_URL = 'REPLACE_WITH_YOUR_CDN_URL'; // e.g., 'https://your-cdn.com/review-photos/'

    for (const photoReview of reviewsWithPhotos) {
      try {
        // Create user
        const userResult = await db
          .insert(users)
          .values({
            username: `plantlover_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            fullName: photoReview.reviewerName,
            email: `${photoReview.reviewerName.toLowerCase().replace(/[^a-z]/g, '')}${Math.floor(Math.random() * 9999)}@example.com`,
          })
          .returning();

        const user = userResult[0];
        const reviewDate = getRandomDate(startDate, endDate);

        // Photo URL - replace PHOTO_BASE_URL after uploading images
        const photoUrl = PHOTO_BASE_URL === 'REPLACE_WITH_YOUR_CDN_URL'
          ? [] // Don't add broken URLs
          : [`${PHOTO_BASE_URL}${photoReview.photoFilename}`];

        // Create review with photo
        const [newReview] = await db.insert(reviews).values({
          productId: plantStand.id,
          userId: user.id,
          rating: photoReview.rating,
          title: photoReview.title,
          comment: photoReview.comment,
          isVerifiedPurchase: true, // Photo reviews are verified
          createdAt: reviewDate,
          photos: photoUrl,
        }).returning();

        // Audit log
        await db.insert(reviewAuditLog).values({
          reviewId: newReview.id,
          action: 'CREATE',
          performedBy: 'system-seed',
          previousData: null,
          newData: newReview,
          reason: 'Seeded photo review for plant stand product',
          ipAddress: 'localhost',
        });

        createdCount++;
        allCreatedReviews.push({ ...photoReview, hasPhoto: true });
        console.log(`  📸 Created photo review: "${photoReview.title}" by ${photoReview.reviewerName} (${photoReview.rating}★)`);
      } catch (error) {
        console.error(`❌ Error creating photo review:`, error);
      }
    }

    // ============================================
    // PHASE 2: Create text-only reviews
    // ============================================
    console.log('\n📝 Creating text-only reviews...\n');

    const shuffledReviews = shuffleArray(plantStandReviews);
    const shuffledNames = shuffleArray(reviewerNames);

    for (let i = 0; i < shuffledReviews.length; i++) {
      const reviewTemplate = shuffledReviews[i];
      const reviewerName = shuffledNames[i % shuffledNames.length];

      try {
        // Create user
        const userResult = await db
          .insert(users)
          .values({
            username: `plantlover_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            fullName: reviewerName,
            email: `${reviewerName.toLowerCase().replace(/[^a-z]/g, '')}${Math.floor(Math.random() * 9999)}@example.com`,
          })
          .returning();

        const user = userResult[0];
        const reviewDate = getRandomDate(startDate, endDate);
        const isVerified = Math.random() > 0.25; // 75% verified

        // Create review
        const [newReview] = await db.insert(reviews).values({
          productId: plantStand.id,
          userId: user.id,
          rating: reviewTemplate.rating,
          title: reviewTemplate.title,
          comment: reviewTemplate.comment,
          isVerifiedPurchase: isVerified,
          createdAt: reviewDate,
          photos: [],
        }).returning();

        // Audit log
        await db.insert(reviewAuditLog).values({
          reviewId: newReview.id,
          action: 'CREATE',
          performedBy: 'system-seed',
          previousData: null,
          newData: newReview,
          reason: 'Seeded text review for plant stand product',
          ipAddress: 'localhost',
        });

        createdCount++;
        allCreatedReviews.push({ ...reviewTemplate, reviewerName, hasPhoto: false });
        console.log(`  ✓ Created review: "${reviewTemplate.title}" by ${reviewerName} (${reviewTemplate.rating}★)`);
      } catch (error) {
        console.error(`❌ Error creating review:`, error);
      }
    }

    // ============================================
    // Summary
    // ============================================
    console.log('\n=========================================');
    console.log(`🎉 Successfully created ${createdCount} reviews for ${plantStand.title}!`);
    console.log(`📅 Date range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);

    const photoReviewCount = reviewsWithPhotos.length;
    const textReviewCount = plantStandReviews.length;
    console.log(`\n📊 Review breakdown:`);
    console.log(`   📸 With photos: ${photoReviewCount}`);
    console.log(`   📝 Text only: ${textReviewCount}`);
    console.log(`   Total: ${createdCount}`);

    // Rating distribution
    const allRatings = [...reviewsWithPhotos, ...plantStandReviews];
    console.log(`\n⭐ Rating distribution:`);
    console.log(`   5★: ${allRatings.filter(r => r.rating === 5).length}`);
    console.log(`   4★: ${allRatings.filter(r => r.rating === 4).length}`);
    console.log(`   3★: ${allRatings.filter(r => r.rating === 3).length}`);

    const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    console.log(`   Average: ${avgRating.toFixed(1)}/5.0`);

    if (PHOTO_BASE_URL === 'REPLACE_WITH_YOUR_CDN_URL') {
      console.log('\n⚠️  IMPORTANT: Photo URLs not set!');
      console.log('   1. Upload images from ./generated-images/review-photos/ to your CDN');
      console.log('   2. Update PHOTO_BASE_URL in this script');
      console.log('   3. Re-run to add photos to reviews, or manually update in database');
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    await client.end();
    process.exit(1);
  }
}

seedPlantStandReviews();
