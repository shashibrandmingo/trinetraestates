"use client";

import React, { useState, useMemo } from "react";
import { BlogPost, blogsData } from "@/data/blogsData";
import BlogHero from "./BlogHero";
import BlogGrid from "./BlogGrid";

export default function BlogIndexClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredPosts = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    const queryTokens = trimmedQuery.split(/\s+/).filter(Boolean);

    return blogsData.filter((post) => {
      // 1. Category Filter Matching
      if (selectedCategory && selectedCategory !== "All Categories") {
        const catLower = selectedCategory.toLowerCase();
        const postCatLower = post.category.toLowerCase();
        const titleLower = post.title.toLowerCase();

        const categoryMatches =
          postCatLower.includes(catLower) ||
          catLower.includes(postCatLower) ||
          (catLower.includes("furnished") && titleLower.includes("furnished")) ||
          (catLower.includes("sector") && postCatLower.includes("sector"));

        if (!categoryMatches) return false;
      }

      // 2. Real-Time Production Keyword Search Query
      if (queryTokens.length > 0) {
        // Build comprehensive searchable corpus across all post properties
        const corpus = [
          post.title,
          post.category,
          post.excerpt,
          post.author.name,
          post.author.role,
          post.slug.replace(/-/g, " "),
          post.tableOfContents?.map((t) => t.title).join(" ") || "",
          post.quickSummary?.map((q) => `${q.ifYouAre} ${q.startWith} ${q.why}`).join(" ") || "",
          post.sections?.map((s) => `${s.heading} ${s.subheading || ""} ${s.rentBadge || ""} ${s.bestFor || ""} ${s.paragraphs.join(" ")}`).join(" ") || "",
          post.comparisonTable?.map((c) => `${c.sector} ${c.bestFor} ${c.avgRent} ${c.metroAccess}`).join(" ") || "",
          post.faqs?.map((f) => `${f.question} ${f.answer}`).join(" ") || "",
        ]
          .join(" ")
          .toLowerCase();

        // Every token typed by the user must match in the corpus (e.g. "sector 62 rent", "expressway office")
        const allTokensMatch = queryTokens.every((token) => corpus.includes(token));
        return allTokensMatch;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
  };

  return (
    <>
      {/* ── Minimal, Clean Hero Section (Controlled Search Input & Category) ── */}
      <BlogHero
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSearch={setSearchQuery}
        onCategoryChange={setSelectedCategory}
      />

      {/* ── Responsive Blog Cards Grid (Connected to Hero Search) ── */}
      <BlogGrid
        posts={filteredPosts}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onResetFilters={handleResetFilters}
      />
    </>
  );
}
