import { Metadata } from "next";
import PropertyDetailClient from "@/components/properties/PropertyDetailClient";
import { propertyService, resolvePropertyImage } from "@/services/propertyService";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DYNAMIC SERVER-SIDE METADATA & SCHEMA FOR GOOGLE #1 RANKING
 * ─────────────────────────────────────────────────────────────────────────────
 * Googlebot crawlers read this directly on SSR to rank the property page for:
 * - "Office space in [Sector] Noida"
 * - "[Building Name] commercial office rent Noida"
 * - "Furnished office space [Sector] Noida"
 * ─────────────────────────────────────────────────────────────────────────────
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await propertyService.getPropertyBySlugOrId(slug);

  if (!doc) {
    return {
      title: "Commercial Office Space in Noida | Trinetra Estates",
      description:
        "Explore verified commercial office spaces for rent in Noida across Sector 62, 132, 142 & Expressway with Trinetra Estates.",
    };
  }

  const title = doc.title || "Premium Commercial Office Space";
  const sector =
    doc.location?.sector || doc.location?.locality || "Sector 62, Noida";
  const area = doc.areaSqFt ? `${doc.areaSqFt.toLocaleString()} Sq.Ft.` : "Commercial";
  const type = doc.propertyType || "Commercial Office Space";
  const building = doc.buildingName || "";

  const seoTitle = `${title} | ${area} ${type} in ${sector} | Trinetra Estates`;
  const seoDesc =
    doc.description ||
    `Verified ${area} ${type} for rent in ${building ? `${building}, ` : ""}${sector}, Noida. Features ${
      doc.workstations ? `${doc.workstations} workstations` : "workstations"
    }, modern amenities, high connectivity & 0% brokerage options.`;

  const canonicalUrl = `https://trinetraestates.com/properties/${slug}`;
  const rawImage =
    doc.imageUrl || doc.thumbnail || doc.images?.[0]?.url || "";
  const imageUrl =
    resolvePropertyImage(rawImage) ||
    "https://trinetraestates.com/images/bgbanners/herobanner.png";

  return {
    title: seoTitle,
    description: seoDesc.slice(0, 160),
    keywords: [
      title,
      `Office space in ${sector}`,
      `Commercial office for rent in ${sector}`,
      `Furnished office ${sector} Noida`,
      `${type} in Noida`,
      building ? `Office space in ${building}` : "",
      "Trinetra Estates Noida",
      "Commercial real estate Noida",
    ].filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: canonicalUrl,
      siteName: "Trinetra Estates",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - Commercial Office Space in ${sector}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDesc,
      images: [imageUrl],
      creator: "@trinetraestate",
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await propertyService.getPropertyBySlugOrId(slug);

  const rawImage = doc?.imageUrl || doc?.thumbnail || doc?.images?.[0]?.url || "";

  // Structured Data Schema (JSON-LD) for Real Estate Listing & Place
  const listingSchema = doc
    ? {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: doc.title,
        description: doc.description,
        url: `https://trinetraestates.com/properties/${slug}`,
        image:
          resolvePropertyImage(rawImage) ||
          "https://trinetraestates.com/images/bgbanners/herobanner.png",
        offers: {
          "@type": "Offer",
          price: doc.price || "On Request",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          businessFunction: "https://schema.org/LeaseOut",
        },
        about: {
          "@type": "Place",
          name: doc.title,
          address: {
            "@type": "PostalAddress",
            streetAddress: `${doc.location?.sector || doc.location?.locality || "Commercial Sector"}`,
            addressLocality: "Noida",
            addressRegion: "Uttar Pradesh",
            postalCode: "201301",
            addressCountry: "IN",
          },
        },
      }
    : null;

  return (
    <>
      {listingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(listingSchema),
          }}
        />
      )}
      <PropertyDetailClient slug={slug} initialDoc={doc} />
    </>
  );
}
