import React from "react";
import HomePageClient from "@/components/home/HomePageClient";
import { propertyService, BackendOfficeDoc, mapBackendOfficeToItem } from "@/services/propertyService";
import { FeaturedPropertyItem } from "@/data/featuredPropertiesData";
import { faqsData } from "@/data/faqsData";

// Incremental Static Regeneration: revalidate data every 1 hour (3600 seconds)
export const revalidate = 3600;

// Rich Snippet FAQ Schema for Google Top-10 SERP Features in Noida (100% matched to on-page content)
const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqsData.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default async function HomePage() {
  let initialProperties: FeaturedPropertyItem[] = [];

  try {
    const rawDocs: BackendOfficeDoc[] = await propertyService.getActiveProperties(24);
    if (Array.isArray(rawDocs) && rawDocs.length > 0) {
      initialProperties = rawDocs.map((doc, idx) => mapBackendOfficeToItem(doc, idx));
    }
  } catch (err) {
    console.error("Error fetching homepage properties for SSR:", err);
  }

  return (
    <main className="min-h-screen bg-[var(--bg-main)]">
      {/* Google FAQ Rich Snippet Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeFaqSchema),
        }}
      />

      {/* Interactive Website Components with SSR-hydrated Properties */}
      <HomePageClient initialProperties={initialProperties} />
    </main>
  );
}
