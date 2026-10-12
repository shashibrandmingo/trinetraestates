import { Metadata } from "next";
import PropertyDetailClient from "@/components/properties/PropertyDetailClient";
import { propertyService, resolvePropertyImage } from "@/services/propertyService";
import { getSiteUrl } from "@/config/apiConfig";

interface PageProps {
  params: { slug: string };
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DYNAMIC SERVER-SIDE SEO METADATA & SCHEMA FOR NOIDA OFFICE SPACES
 * ─────────────────────────────────────────────────────────────────────────────
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  const doc = await propertyService.getPropertyBySlugOrId(slug);

  if (!doc) {
    return {
      title: "Commercial Office Space in Noida for Rent | Office Space Noida",
      description:
        "Find verified commercial office spaces for rent in Noida across Sector 62, 132, 142 & Expressways. 0% brokerage options. Call 99999 01196.",
    };
  }

  const title = doc.title || "Commercial Office Space";
  const sector =
    doc.location?.sector || doc.location?.locality || "Sector 62, Noida";
  const area = doc.areaSqFt ? `${doc.areaSqFt.toLocaleString("en-IN")} Sq.Ft.` : "Commercial";
  const type = doc.propertyType || "Commercial Office Space";
  const building = doc.buildingName || "";

  const seoTitle = `${title} | ${area} ${type} in ${sector} | Office Space Noida`;
  const seoDesc = doc.description
    ? `${doc.description.slice(0, 140)}... Call 99999 01196 for immediate site visit.`
    : `Verified ${area} ${type} for rent in ${building ? `${building}, ` : ""}${sector}, Noida. Modern amenities, 100% power backup, 24x7 security & 0% brokerage. Call 99999 01196.`;

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/properties/${slug}`;
  const rawImage = doc.imageUrl || doc.thumbnail || doc.images?.[0]?.url || "";
  const imageUrl =
    resolvePropertyImage(rawImage) ||
    "/images/sectors/sector-62.jpg";

  return {
    title: seoTitle,
    description: seoDesc.slice(0, 160),
    keywords: [
      `Office space in ${sector}`,
      `Commercial office for rent in ${sector}`,
      `Office space in Noida`,
      `Commercial office space in Noida`,
      `Furnished office for rent in ${sector} Noida`,
      `${type} in ${sector} Noida`,
      building ? `Office space in ${building}` : "",
      "Office Space Noida",
      "Commercial real estate Noida",
      "Office for lease Noida Expressway",
    ].filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: canonicalUrl,
      siteName: "Office Space Noida",
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
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = params;
  const doc = await propertyService.getPropertyBySlugOrId(slug);

  const siteUrl = getSiteUrl();
  const rawImage = doc?.imageUrl || doc?.thumbnail || doc?.images?.[0]?.url || "";

  // Structured Data Schema (JSON-LD) for Real Estate Listing, Breadcrumbs & FAQs
  const listingSchema = doc
    ? {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: doc.title,
        description: doc.description,
        url: `${siteUrl}/properties/${slug}`,
        image: resolvePropertyImage(rawImage) || `${siteUrl}/images/sectors/sector-62.jpg`,
        telephone: "+91-9999901196",
        offers: {
          "@type": "Offer",
          price: doc.price || "On Request",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          businessFunction: "https://schema.org/LeaseOut",
          validFrom: new Date().toISOString().split("T")[0],
        },
        about: {
          "@type": "Place",
          name: doc.buildingName || doc.title,
          address: {
            "@type": "PostalAddress",
            streetAddress: `${doc.location?.sector || doc.location?.locality || "Commercial Sector"}`,
            addressLocality: "Noida",
            addressRegion: "Uttar Pradesh",
            postalCode: "201301",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 28.5355,
            longitude: 77.3910,
          },
          amenityFeature: Array.isArray(doc.amenities)
            ? doc.amenities.map((item: string) => ({
                "@type": "LocationFeatureSpecification",
                name: item,
                value: true,
              }))
            : [],
        },
      }
    : null;

  const breadcrumbSchema = doc
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Office Spaces",
            item: `${siteUrl}/#office-spaces`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: doc.buildingName || doc.title,
            item: `${siteUrl}/properties/${slug}`,
          },
        ],
      }
    : null;

  const faqSchema = doc
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Where is this commercial office space located in Noida?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `This commercial space is situated at ${doc.buildingName || "Commercial Landmark"}, ${doc.location?.sector || "Sector 62"}, Noida, offering direct connectivity to the Noida Metro and expressways.`,
            },
          },
          {
            "@type": "Question",
            name: `What facilities are included with this office in ${doc.location?.sector || "Noida"}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `It features ${doc.furnishing || "modern furnishing"}, ${doc.workstations ? `${doc.workstations} workstations` : "customizable workstations"}, ${doc.cabins ? `${doc.cabins} private cabins` : "cabins"}, 100% power backup, high-speed elevators, and 24x7 security.`,
            },
          },
          {
            "@type": "Question",
            name: `How can I schedule a site visit for this office?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `You can schedule a physical or virtual site visit directly through Office Space Noida by submitting an enquiry or calling our leasing desk at +91 99999 01196.`,
            },
          },
        ],
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
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}
      <PropertyDetailClient slug={slug} initialDoc={doc} />
    </>
  );
}
