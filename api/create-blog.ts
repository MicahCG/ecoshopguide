import postgres from 'postgres';

// Simple API key auth for automated blog publishing
const API_KEY = process.env.BLOG_API_KEY;

export default async function handler(
  request: any,
  response: any,
) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Verify API key
  const authHeader = request.headers.authorization;
  if (!API_KEY || !authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.DATABASE_URL) {
    return response.status(500).json({ error: 'Database not configured' });
  }

  const sql = postgres(process.env.DATABASE_URL, {
    ssl: 'require',
    max: 1,
    connect_timeout: 10,
  });

  try {
    const { title, slug, intro, products, cta, featured, featureImage, category } = request.body;

    // Validate required fields
    if (!title || !slug || !intro || !products || !cta) {
      await sql.end();
      return response.status(400).json({ 
        error: 'Missing required fields', 
        required: ['title', 'slug', 'intro', 'products', 'cta'] 
      });
    }

    // Ensure products is an array (parse if it came in as a string)
    const productsArray = typeof products === 'string' ? JSON.parse(products) : products;

    // Upsert blog post (insert or update on slug conflict)
    // Use sql.json() to properly serialize the JSON array for PostgreSQL
    const result = await sql`
      INSERT INTO blogs (title, slug, intro, products, cta, featured, feature_image, category)
      VALUES (
        ${title},
        ${slug},
        ${intro},
        ${sql.json(productsArray)},
        ${cta},
        ${featured || false},
        ${featureImage || null},
        ${category || 'home'}
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        intro = EXCLUDED.intro,
        products = EXCLUDED.products,
        cta = EXCLUDED.cta,
        featured = EXCLUDED.featured,
        feature_image = EXCLUDED.feature_image,
        category = EXCLUDED.category
      RETURNING id, title, slug, created_at as "createdAt"
    `;

    console.log(`Blog post created/updated: ${title} (${slug})`);
    await sql.end();
    
    return response.status(201).json({
      success: true,
      blog: result[0]
    });

  } catch (error: any) {
    console.error('Error creating blog post:', error);
    try { await sql.end(); } catch {}
    return response.status(500).json({
      error: 'Failed to create blog post',
      message: error.message
    });
  }
}
