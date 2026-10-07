import type { Metadata } from "next";
import { propertyService, resolvePropertyImage } from "@/services/propertyService";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await propertyService.getPropertyBySlugOrId(slug);

  if (!property) {
    return {
      title: "Commercial Office Space in Noida | Trinetra Estates",
      description:
        "Verified premium commercial office space for rent and lease in Noida. Modern workspaces with 100% power backup and metro connectivity.",
    };
  }

  const rawSector =
    property.location?.sector ||
    property.location?.locality ||
    property.location?.address ||
    "Noida";
  const sector = rawSector.trim();
  const building = property.buildingName?.trim() || "";
  const title = property.title || (building ? `${building}, ${sector}` : `Office Space in ${sector}, Noida`);

  const descSnippet =
    property.description?.trim() ||
    property.overviewDescription?.trim() ||
    `Verified commercial office space in ${building ? `${building}, ` : ""}${sector}, Noida. Grade-A commercial facilities, modern infrastructure, and seamless metro connectivity.`;

  const coverImg =
    property.images && property.images.length > 0
      ? typeof property.images[0] === "string"
        ? property.images[0]
        : property.images[0]?.url
      : property.imageUrl || "";

  const resolvedImage = coverImg ? resolvePropertyImage(coverImg) : "";

  return {
    title: `${title} | Trinetra Estates`,
    description: descSnippet.slice(0, 160),
    openGraph: {
      title: `${title} | Trinetra Estates`,
      description: descSnippet.slice(0, 160),
      url: `https://trinetraestates.com/properties/${slug}`,
      siteName: "Trinetra Estates - Commercial Real Estate Noida",
      images: resolvedImage
        ? [
            {
              url: resolvedImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Trinetra Estates`,
      description: descSnippet.slice(0, 160),
      images: resolvedImage ? [resolvedImage] : [],
    },
  };
}

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
