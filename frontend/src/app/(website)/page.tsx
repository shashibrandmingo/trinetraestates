"use client";

import React, { useState } from "react";
import HeroSection from "@/components/sections/home/HeroSection";
import AboutSection from "@/components/sections/home/AboutSection";
import PopularSectorsSection from "@/components/sections/home/PopularSectorsSection";
import SpaceCategoriesSection, { CategoryItem } from "@/components/sections/home/SpaceCategoriesSection";
import FeaturedPropertiesSection from "@/components/sections/home/FeaturedPropertiesSection";
import WhyChooseUsSection from "@/components/sections/home/WhyChooseUsSection";
import GetInTouchCtaSection from "@/components/sections/home/GetInTouchCtaSection";
import ContactCtaSection from "@/components/sections/home/ContactCtaSection";
import RequirementModal from "@/components/modals/RequirementModal";
import { RequirementFormData } from "@/components/forms/RequirementForm";
import { FeaturedPropertyItem } from "@/data/featuredPropertiesData";

// Rich Snippet FAQ Schema for Google Top-10 SERP Features
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

export default function HomePage() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    initialData: RequirementFormData;
  }>({
    isOpen: false,
    initialData: {},
  });

  const handleOpenModal = (data: RequirementFormData = {}) => {
    setModalState({
      isOpen: true,
      initialData: data,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      initialData: {},
    });
  };

  return (
    <main className="min-h-screen bg-[var(--bg-main)]">
      {/* Google FAQ Rich Snippet Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeFaqSchema),
        }}
      />

      {/* 1. Hero Section with Luxury Requirements Form */}
      <HeroSection />

      {/* 2. About Us Section */}
      <AboutSection />

      {/* 3. Popular Sectors in Noida (EXPLORE BY LOCATION) */}
      <PopularSectorsSection
        onSelectSector={(sector) =>
          handleOpenModal({
            area: sector.name,
            requirements: `Interested in office spaces in ${sector.name}`,
          })
        }
      />

      {/* 4. Find Your Ideal Space ("What are you looking for?") */}
      <SpaceCategoriesSection
        onOpenEnquiryModal={(data) => handleOpenModal(data)}
      />

      {/* 5. Premium Office Spaces in Noida (Featured Properties with Dynamic Filters) */}
      <FeaturedPropertiesSection
        onOpenForm={(property?: Partial<FeaturedPropertyItem> & { type?: string }) =>
          handleOpenModal(
            property
              ? {
                  area: property.sector || property.location,
                  spaceType: property.badge || "",
                  requirements: property.location || property.sector
                    ? `Inquiring about office space in ${property.location || property.sector} (${property.area || ""})`
                    : "",
                }
              : {}
          )
        }
      />

      {/* 6. Why Choose Us Section ("More Than Spaces, A Partner in Your Growth") */}
      <WhyChooseUsSection />

      {/* 7. Luxury Contact & Showcase Section (Form on Left + Image on Right) */}
      <ContactCtaSection />

      {/* 8. Get In Touch Banner ("The right workspace today, a bigger tomorrow") */}
      <GetInTouchCtaSection onOpenForm={() => handleOpenModal()} />

      {/* Luxury Popup Requirement Modal */}
      <RequirementModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        initialData={modalState.initialData}
      />
    </main>
  );
}
