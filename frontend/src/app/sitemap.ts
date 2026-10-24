import { MetadataRoute } from 'next';
import { propertyService } from '@/services/propertyService';
import { getSiteUrl, getApiBaseUrl } from '@/config/apiConfig';
import { blogsData } from '@/data/blogsData';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  try {
    let properties = await propertyService.getActiveProperties(50);
    if (!properties || properties.length === 0) {
      const apiUrl = getApiBaseUrl();
      const res = await fetch(`${apiUrl}/offices?limit=50`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        properties = Array.isArray(json.data) ? json.data : [];
      }
    }

    const dynamicRoutes: MetadataRoute.Sitemap = properties
      .filter((prop) => Boolean(prop.slug || prop.propertyId || prop._id))
      .map((prop) => ({
        url: `${siteUrl}/properties/${prop.slug || prop.propertyId || prop._id}`,
        lastModified: prop.updatedAt ? new Date(prop.updatedAt) : new Date(),
        changeFrequency: 'daily',
        priority: 0.85,
      }));

    const blogRoutes: MetadataRoute.Sitemap = blogsData.map((b) => ({
      url: `${siteUrl}/blogs/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    return [...staticRoutes, ...dynamicRoutes, ...blogRoutes];
  } catch (err) {
    console.error('Sitemap generation error:', err);
    return staticRoutes;
  }
}
