import postgres from 'postgres';

export default async function handler(
  request: any,
  response: any,
) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    return response.status(500).json({
      error: 'Database not configured',
      message: 'DATABASE_URL environment variable is missing'
    });
  }

  // Initialize database connection inside handler to catch errors
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: 'require',
    max: 1,
    connect_timeout: 10,
  });

  try {
    const { slug } = request.query;

    if (slug && typeof slug === 'string') {
      // Get single blog by slug
      const blogs = await sql`
        SELECT id, title, slug, intro, products, cta, featured, feature_image as "featureImage", category, created_at as "createdAt"
        FROM blogs
        WHERE slug = ${slug}
        LIMIT 1
      `;

      if (blogs.length === 0) {
        await sql.end();
        return response.status(404).json({ error: 'Blog not found' });
      }

      await sql.end();
      return response.status(200).json(blogs[0]);
    }

    // Get all blogs ordered by created_at desc
    const blogs = await sql`
      SELECT id, title, slug, intro, products, cta, featured, feature_image as "featureImage", category, created_at as "createdAt"
      FROM blogs
      ORDER BY created_at DESC
    `;

    console.log(`Fetched ${blogs.length} blogs from database`);
    await sql.end();
    return response.status(200).json(blogs);

  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    try { await sql.end(); } catch {}
    return response.status(500).json({
      error: 'Failed to fetch blogs',
      message: error.message,
      hint: 'Check that DATABASE_URL is set correctly in Vercel environment variables'
    });
  }
}
