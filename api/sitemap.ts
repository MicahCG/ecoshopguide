import type { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.setHeader('Content-Type', 'application/xml; charset=utf-8');
  response.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  if (request.method !== 'GET') {
    return response.status(405).end();
  }

  // Static pages with priorities
  const staticPages = [
    { loc: 'https://ecoshopguide.com/', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://ecoshopguide.com/blog', changefreq: 'daily', priority: '0.9' },
    { loc: 'https://ecoshopguide.com/shop-the-look', changefreq: 'weekly', priority: '0.9' },
    { loc: 'https://ecoshopguide.com/pages/about', changefreq: 'monthly', priority: '0.7' },
    { loc: 'https://ecoshopguide.com/pages/contact', changefreq: 'monthly', priority: '0.6' },
    { loc: 'https://ecoshopguide.com/pages/privacy-policy', changefreq: 'yearly', priority: '0.5' },
    { loc: 'https://ecoshopguide.com/pages/terms-of-service', changefreq: 'yearly', priority: '0.5' },
  ];

  // Shop the Look pages
  const shopTheLookPages = [
    'enchanted-forest-retreat',
    'dreamy-boho-garden-wedding',
    'warm-boho-living-room',
    'cozy-apartment-living-room',
    'jungle-spa-retreat',
    'jungle-spa-vibes',
    'cozy-dorm-room',
  ];

  let blogEntries: string[] = [];

  // Fetch all blog posts from database
  if (process.env.DATABASE_URL) {
    const sql = postgres(process.env.DATABASE_URL, {
      ssl: 'require',
      max: 1,
      connect_timeout: 10,
    });

    try {
      const blogs = await sql`
        SELECT slug, created_at
        FROM blogs
        ORDER BY created_at DESC
      `;

      blogEntries = blogs.map((blog: any) => {
        const lastmod = blog.created_at
          ? new Date(blog.created_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        return `  <url>
    <loc>https://ecoshopguide.com/blog/${blog.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });

      await sql.end();
    } catch (error) {
      console.error('Error fetching blogs for sitemap:', error);
      try { await sql.end(); } catch {}
    }
  }

  // Build the sitemap XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Core pages -->
${staticPages.map(p => `  <url>
    <loc>${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}

  <!-- Shop the Look pages -->
${shopTheLookPages.map(slug => `  <url>
    <loc>https://ecoshopguide.com/pages/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}

  <!-- Blog articles (auto-generated from database) -->
${blogEntries.join('\n')}

</urlset>`;

  return response.status(200).send(xml);
}
