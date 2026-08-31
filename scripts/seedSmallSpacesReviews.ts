import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { reviews, users } from '../shared/schema';

// Load environment variables
config();

// Diverse reviewer names - realistic, casual formats
const reviewerNames = [
  'Adetayo', 'priya', 'Marcus', 'Yuki', 'fatima',
  'DeShawn', 'Costa', 'Mei', 'carlos', 'Amara',
  'Tabish', 'elena', 'Kwame', 'Sanjay', 'Rosa',
  'jin', 'Kenji', 'Aaliyah', 'omar', 'Lakshmi',
  'mia', 'Chioma', 'hassan', 'Ines', 'Tariq',
  'Yolanda', 'kai', 'Nadia', 'Kofi', 'ananya',
  'Diego', 'linh', 'Amira', 'Javier', 'Nia',
  'rahul', 'Sofia', 'Malik', 'yuna', 'Tomás',
];

// Small spaces specific review templates
const smallSpacesReviews = {
  // For woven baskets, planters
  baskets: [
    {
      title: 'Perfect for my tiny apartment!',
      comment: 'Finally found storage that actually looks good in my 400 sq ft studio. This basket is both functional and beautiful. Holds all my throw blankets without taking up precious floor space.',
      rating: 5,
    },
    {
      title: 'Great for small space organization',
      comment: 'Living in a small apartment means every piece needs to work hard. This basket stores my yoga gear and doubles as decor. Love the natural woven texture!',
      rating: 5,
    },
    {
      title: 'Stylish and compact',
      comment: 'I was worried it would overwhelm my small living room but it fits perfectly in the corner. The craftsmanship is excellent and it holds more than expected.',
      rating: 5,
    },
    {
      title: 'Exactly what my studio needed',
      comment: 'Small space living requires smart choices. This piece is versatile - I use it for plants, blankets, or magazines depending on my mood. Quality is outstanding.',
      rating: 5,
    },
    {
      title: 'Nice quality, perfect size',
      comment: 'Not too big, not too small - just right for my cozy apartment. The natural materials add warmth to my minimalist space. Very happy with this purchase.',
      rating: 4,
    },
  ],
  // For ceramic planters
  planters: [
    {
      title: 'Adds life to my small space',
      comment: 'This planter is the perfect size for my windowsill in my tiny kitchen. The ceramic quality is beautiful and my succulent looks so happy in it!',
      rating: 5,
    },
    {
      title: 'Compact and beautiful',
      comment: 'When you have limited space, every decor piece matters. This planter brings so much character without taking up room. The handcrafted details are lovely.',
      rating: 5,
    },
    {
      title: 'Perfect desk planter',
      comment: 'Working from home in a small apartment, my desk space is precious. This planter fits perfectly and brings a touch of nature to my workspace.',
      rating: 5,
    },
    {
      title: 'Great for apartment dwellers',
      comment: 'No outdoor space? No problem! This planter has helped me create a little indoor garden in my studio. The drainage works perfectly.',
      rating: 5,
    },
    {
      title: 'Cute and functional',
      comment: 'Small but mighty! This planter is perfect for my collection of small plants. The quality is much better than big box store options.',
      rating: 4,
    },
  ],
  // For lamps and lighting
  lighting: [
    {
      title: 'Cozy lighting for my studio',
      comment: 'This lamp creates the most beautiful ambient light in my small apartment. It doesn\'t take up much space but makes a huge impact on the atmosphere.',
      rating: 5,
    },
    {
      title: 'Perfect bedside lamp',
      comment: 'My bedroom is tiny so I needed a lamp that was both compact and stylish. This delivers on both! The warm glow is perfect for reading before bed.',
      rating: 5,
    },
    {
      title: 'Creates amazing ambiance',
      comment: 'Living in a small space means one light can change the whole mood. This lamp transforms my apartment from day to night mode beautifully.',
      rating: 5,
    },
    {
      title: 'Compact but impactful',
      comment: 'Don\'t let the size fool you - this lamp fills my small living room with the coziest light. Perfect for movie nights in my tiny apartment.',
      rating: 5,
    },
    {
      title: 'Love it for my reading nook',
      comment: 'Created a little reading corner in my studio and this lamp is the star. Warm light, beautiful design, and doesn\'t overwhelm the space.',
      rating: 4,
    },
  ],
  // For blankets and textiles
  textiles: [
    {
      title: 'Cozy essential for small living',
      comment: 'This blanket lives on my small sofa and makes my tiny living room feel like a sanctuary. So soft and the texture is beautiful!',
      rating: 5,
    },
    {
      title: 'Perfect for studio apartment life',
      comment: 'In a small space, your sofa is your bed and your bed is your sofa. This blanket makes both situations infinitely cozier.',
      rating: 5,
    },
    {
      title: 'Adds warmth without bulk',
      comment: 'Was worried a chunky blanket would overwhelm my small room but it\'s perfect. Adds texture and warmth without making the space feel cramped.',
      rating: 5,
    },
    {
      title: 'Best purchase for my apartment',
      comment: 'My 500 sq ft apartment feels so much more inviting with this blanket draped over my chair. Guests always comment on how cozy it looks.',
      rating: 5,
    },
    {
      title: 'Soft and stylish',
      comment: 'Great quality and the perfect size for my small reading chair. Makes my tiny corner feel like a luxury retreat.',
      rating: 4,
    },
  ],
  // For incense and wellness
  wellness: [
    {
      title: 'Transforms my small space',
      comment: 'In a tiny apartment, scent matters. This incense burner creates a spa-like atmosphere in my studio. The design is also stunning on my small shelf.',
      rating: 5,
    },
    {
      title: 'Compact wellness essential',
      comment: 'Don\'t have room for a meditation corner? This small but beautiful piece creates sacred space anywhere. Perfect for apartment living.',
      rating: 5,
    },
    {
      title: 'Daily ritual in my studio',
      comment: 'Every morning I use this in my tiny apartment and it sets the tone for the whole day. Beautiful craftsmanship and fits anywhere.',
      rating: 5,
    },
    {
      title: 'Small space, big vibes',
      comment: 'This little piece brings so much calm to my compact living situation. The design is gorgeous and it doesn\'t take up precious counter space.',
      rating: 5,
    },
    {
      title: 'Perfect for apartment living',
      comment: 'Finally found something beautiful that fits in my small space. Creates such a peaceful atmosphere for meditation and relaxation.',
      rating: 4,
    },
  ],
  // For wall decor and hanging items
  wallDecor: [
    {
      title: 'Maximizes my wall space',
      comment: 'In a small apartment, walls are prime real estate. This piece adds so much character without taking any floor space. Smart and beautiful!',
      rating: 5,
    },
    {
      title: 'Perfect for small spaces',
      comment: 'No room for floor plants? Go vertical! This hanging piece adds life to my tiny studio without sacrificing any of my limited floor space.',
      rating: 5,
    },
    {
      title: 'Makes my studio feel bigger',
      comment: 'Drawing the eye upward actually makes my small apartment feel more spacious. Plus it\'s absolutely beautiful. Great quality too.',
      rating: 5,
    },
    {
      title: 'Ideal apartment decor',
      comment: 'When every square foot counts, wall decor is the way to go. This piece transformed my blank wall into a focal point.',
      rating: 5,
    },
    {
      title: 'Love it in my entryway',
      comment: 'My apartment\'s tiny entryway needed something special. This adds personality without making the narrow space feel cluttered.',
      rating: 4,
    },
  ],
};

// Product filters for small spaces collection (matching CollectionSmallSpaces.tsx)
function isSmallSpacesProduct(product: any): { match: boolean; category: string } {
  const title = product.title.toLowerCase();

  // Studio Boho Accents
  if ((title.includes('woven') && title.includes('basket')) ||
      title.includes('eucalyptus') ||
      (title.includes('african') && title.includes('wood'))) {
    return { match: true, category: 'baskets' };
  }

  // Cozy Corner Decor - planters
  if ((title.includes('retro') && title.includes('wall') && title.includes('hydroponic')) ||
      (title.includes('abstract') && title.includes('ceramic') && title.includes('planter')) ||
      (title.includes('boho') && title.includes('hanging') && title.includes('planter')) ||
      (title.includes('ceramic') && title.includes('fleshy') && title.includes('planter'))) {
    return { match: true, category: 'planters' };
  }

  // Curated section products
  if (title.includes('nepali') && title.includes('incense')) {
    return { match: true, category: 'wellness' };
  }
  if (title.includes('orb') && title.includes('light')) {
    return { match: true, category: 'lighting' };
  }
  if (title.includes('chunky') && title.includes('knit') && title.includes('blanket')) {
    return { match: true, category: 'textiles' };
  }
  if (title.includes('lamp') || title.includes('bedside')) {
    return { match: true, category: 'lighting' };
  }
  if (title.includes('candle')) {
    return { match: true, category: 'wellness' };
  }

  // Additional small space friendly products
  if (title.includes('planter') || title.includes('pot')) {
    return { match: true, category: 'planters' };
  }
  if (title.includes('blanket') || title.includes('throw')) {
    return { match: true, category: 'textiles' };
  }
  if (title.includes('hanging') || title.includes('wall')) {
    return { match: true, category: 'wallDecor' };
  }

  return { match: false, category: '' };
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedSmallSpacesReviews() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  try {
    console.log('Starting to seed 40 reviews for Cozy Small Spaces collection...');

    // Fetch products from production API
    console.log('Fetching products from production API...');
    const response = await fetch('https://www.shopbambana.com/api/products');
    const allProducts = await response.json();

    if (!allProducts || allProducts.length === 0) {
      console.error('No products found');
      process.exit(1);
    }

    // Filter to small spaces products
    const smallSpacesProducts = allProducts.filter((p: any) => isSmallSpacesProduct(p).match);

    console.log(`Found ${smallSpacesProducts.length} products matching small spaces collection`);

    if (smallSpacesProducts.length === 0) {
      console.log('Product titles available:');
      allProducts.slice(0, 10).forEach((p: any) => console.log(`  - ${p.title}`));
      console.error('No matching small spaces products found');
      process.exit(1);
    }

    // Log matched products
    console.log('Matched products:');
    smallSpacesProducts.forEach((p: any) => {
      const { category } = isSmallSpacesProduct(p);
      console.log(`  - ${p.title} (${category})`);
    });

    // Date range: from 6 months ago to today
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    const reviewsToCreate = 40;
    let createdCount = 0;

    for (let i = 0; i < reviewsToCreate; i++) {
      try {
        // Select random product from small spaces collection
        const product = getRandomItem(smallSpacesProducts);
        const { category } = isSmallSpacesProduct(product);

        // Get appropriate review template
        const categoryReviews = smallSpacesReviews[category as keyof typeof smallSpacesReviews] || smallSpacesReviews.baskets;
        const reviewTemplate = getRandomItem(categoryReviews);

        // Select random reviewer name
        const reviewerName = getRandomItem(reviewerNames);

        // Create user
        const userResult = await db
          .insert(users)
          .values({
            username: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            fullName: reviewerName,
            email: `${reviewerName.toLowerCase().replace(/[^a-z]/g, '')}${Math.floor(Math.random() * 9999)}@example.com`,
          })
          .returning();

        const user = userResult[0];

        // Random date within range
        const reviewDate = getRandomDate(startDate, endDate);

        // 85% chance of verified purchase
        const isVerified = Math.random() > 0.15;

        // Create review
        await db.insert(reviews).values({
          productId: product.id,
          userId: user.id,
          rating: reviewTemplate.rating,
          title: reviewTemplate.title,
          comment: reviewTemplate.comment,
          isVerifiedPurchase: isVerified,
          createdAt: reviewDate,
          photos: [],
        });

        createdCount++;

        if (createdCount % 10 === 0) {
          console.log(`Created ${createdCount}/${reviewsToCreate} reviews...`);
        }
      } catch (error) {
        console.error(`Error creating review ${i + 1}:`, error);
      }
    }

    console.log(`\nSuccessfully created ${createdCount} new reviews for Cozy Small Spaces collection!`);
    console.log(`Date range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);

    await client.end();
  } catch (error) {
    console.error('Error seeding reviews:', error);
    await client.end();
    process.exit(1);
  }
}

seedSmallSpacesReviews();
