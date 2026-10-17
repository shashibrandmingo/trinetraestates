import React from "react";
import HomePageClient from "@/components/home/HomePageClient";
import { propertyService, BackendOfficeDoc } from "@/services/propertyService";
import { mapBackendOfficeToItem } from "@/components/sections/home/FeaturedPropertiesSection";
import { FeaturedPropertyItem } from "@/data/featuredPropertiesData";

// Incremental Static Regeneration: revalidate data every 1 hour (3600 seconds)
export const revalidate = 3600;

// Rich Snippet FAQ Schema for Google Top-10 SERP Features in Noida
const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the average rent for office space in Noida?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Commercial office space rent in Noida ranges from ₹35 to ₹50 per sq. ft. for bare-shell setups and ₹65 to ₹110+ per sq. ft. for fully furnished Grade-A corporate towers and plug-and-play centers across Sector 62, Sector 132, Sector 135, and Sector 142.",
      },
    },
    {
      "@type": "Question",
      name: "Which sectors in Noida are best for IT and corporate office space?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sector 62 (near Electronic City Metro), Sector 132, Sector 135, and Sector 142 along the Noida-Greater Noida Expressway are the top commercial sectors offering enterprise IT campuses with 24/7 power backup and excellent metro connectivity.",
      },
    },
    {
      "@type": "Question",
      name: "Are fully furnished and plug-and-play office spaces available for rent in Noida?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, verified fully furnished offices, managed corporate suites, and plug-and-play coworking setups are available for all team sizes from 10 to 100+ workstations with zero brokerage options.",
      },
    },
    {
      "@type": "Question",
      name: "What are the common commercial lease terms and lock-in periods in Noida?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Commercial leases in Noida typically feature a 3 to 9-year tenure with an initial 1 to 3-year lock-in period and standard 5% to 15% escalation every 1 to 3 years.",
      },
    },
    {
      "@type": "Question",
      name: "How can I schedule a guided site visit for office spaces in Noida?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can schedule a same-day guided property inspection by calling our commercial advisory desk at +91 99999 01196 or submitting your space requirements online.",
      },
    },
  ],
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
