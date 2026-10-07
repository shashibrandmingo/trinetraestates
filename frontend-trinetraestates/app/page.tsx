import Navbar from "@/components/common/Navbar";
import Hero from "@/components/sections/hero/Hero";
import AboutUs from "@/components/sections/about/AboutUs";
import PopularLocalities from "@/components/sections/localities/PopularLocalities";
import WorkspaceCategories from "@/components/sections/categories/WorkspaceCategories";
import FeaturedProperties from "@/components/sections/featured-properties/FeaturedProperties";
import WhyChooseUs from "@/components/sections/why-choose-us/WhyChooseUs";
import GetInTouch from "@/components/sections/cta/GetInTouch";
import LetsTalk from "@/components/sections/cta/LetsTalk";
import Footer from "@/components/common/Footer";

// FAQ Structured Data Schema for Rich Snippets on Google Search
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best locations for commercial office space for rent in Noida?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The top commercial hubs in Noida include Sector 62 (IT hub with metro connectivity), Sector 132 & Sector 142 (Noida-Greater Noida Expressway corridor), Sector 16 (Film City & corporate hub), Sector 63, and Sector 125. Trinetra Estates offers verified office spaces across all these prime sectors.",
      },
    },
    {
      "@type": "Question",
      name: "What types of commercial office spaces does Trinetra Estates provide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trinetra Estates provides fully furnished office spaces, plug-and-play coworking desks, bare shell commercial spaces, and built-to-suit enterprise office floors ranging from 500 sq.ft to 50,000+ sq.ft with 100% verified inventory.",
      },
    },
    {
      "@type": "Question",
      name: "What is the average rent for office space in Noida?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Commercial office rent in Noida generally ranges from ₹35/sq.ft for bare shell setups to ₹60–₹110/sq.ft for premium fully furnished Grade-A IT parks and commercial towers, depending on the sector and amenities.",
      },
    },
    {
      "@type": "Question",
      name: "How can I book a site visit for office spaces in Noida?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can connect with Trinetra Estates commercial experts by calling +91 99999 01196 or submitting an enquiry on our website. Our team arranges same-day guided site visits with curated options.",
      },
    },
    {
      "@type": "Question",
      name: "Does Trinetra Estates assist with lease agreements and negotiations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Trinetra Estates provides end-to-end commercial advisory, including space shortlisting, transparent price negotiation with landlords, legal lease agreement drafting, and smooth handover.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      {/* FAQ Schema for Google Search Rich Cards */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <Navbar />

      {/* ── HERO SECTION ── */}
      <Hero />

      {/* ── ABOUT US SECTION ── */}
      <AboutUs />

      {/* ── POPULAR LOCALITIES / PRIME LOCATIONS SECTION ── */}
      <PopularLocalities />

      {/* ── FEATURED PROPERTIES SECTION ── */}
      <FeaturedProperties />

      {/* ── WHY CHOOSE US SECTION ── */}
      <WhyChooseUs />

      {/* ── GET IN TOUCH / ENQUIRY SECTION ── */}
      <GetInTouch />

      {/* ── WHAT ARE YOU LOOKING FOR / WORKSPACE CATEGORIES ── */}
      <WorkspaceCategories />

      {/* ── LET'S TALK / FIND A SPACE BANNER SECTION ── */}
      <LetsTalk />

      {/* ── Creative Luxury Footer ── */}
      <Footer />
    </>
  );
}
