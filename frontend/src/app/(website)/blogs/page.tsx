import React from "react";
import type { Metadata } from "next";
import BlogIndexClient from "@/components/sections/blog/BlogIndexClient";

export const metadata: Metadata = {
  title: "Commercial Real Estate Blogs & Guides | Office Space in Noida",
  description:
    "Explore expert commercial real estate insights, Noida office space rental trends, sector comparisons & leasing checklists to make informed workspace decisions.",
  keywords: [
    "Office space in Noida blog",
    "Best sector for office space in Noida",
    "Noida commercial real estate insights",
    "Sector 62 office guide",
    "Noida Expressway office trends",
    "commercial leasing guide Noida",
  ],
  alternates: {
    canonical: "https://officespaceinnoida.com/blogs",
  },
  openGraph: {
    title: "Commercial Real Estate Blogs & Guides | Office Space in Noida",
    description:
      "Explore expert commercial real estate insights, Noida office space rental trends, sector comparisons & leasing checklists.",
    url: "https://officespaceinnoida.com/blogs",
    siteName: "Noida Office Spaces",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Commercial Real Estate Blogs & Guides | Office Space in Noida",
    description:
      "Explore expert commercial real estate insights, Noida office space rental trends, sector comparisons & leasing checklists.",
  },
};

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-main)]">
      <BlogIndexClient />
    </main>
  );
}
