import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://trinetraestates.com";
  const currentDate = new Date();

  // Core static pages (Note: Do NOT include '#' hash fragment URLs as Google sitemap guidelines forbid them)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Dynamically fetch active commercial properties from MongoDB backend
  try {
    const apiUrl =
      (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(
        /\/+$/,
        ""
      );
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${apiUrl}/offices?status=Active&limit=100`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const offices = Array.isArray(data)
        ? data
        : data?.data && Array.isArray(data.data)
        ? data.data
        : [];

      const propertyRoutes: MetadataRoute.Sitemap = offices
        .filter((o: any) => o.slug || o._id)
        .map((o: any) => ({
          url: `${baseUrl}/properties/${o.slug || o._id}`,
          lastModified: o.updatedAt ? new Date(o.updatedAt) : currentDate,
          changeFrequency: "weekly" as const,
          priority: 0.9,
        }));

      return [...staticRoutes, ...propertyRoutes];
    }
  } catch {
    // Graceful fallback to static routes if backend is temporarily unreachable during build
  }

  return staticRoutes;
}
