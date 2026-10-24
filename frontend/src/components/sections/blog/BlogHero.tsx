"use client";

import React, { useState } from "react";
import Container from "@/components/ui/Container";

interface BlogHeroProps {
  searchQuery?: string;
  selectedCategory?: string;
  onSearch?: (query: string) => void;
  onCategoryChange?: (category: string) => void;
}

const CATEGORIES = [
  "All Categories",
  "Sector Guides",
  "Commercial Leasing Advice",
  "Furnished vs Bare Shell",
  "Rental Rates & Trends",
];

export default function BlogHero({
  searchQuery = "",
  selectedCategory = "All Categories",
  onSearch,
  onCategoryChange,
}: BlogHeroProps) {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    const gridElem = document.getElementById("articles-section");
    if (gridElem) {
      gridElem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (onCategoryChange) {
      onCategoryChange(val);
    }
  };

  return (
    <section className="relative w-full pt-6 sm:pt-14 lg:pt-18 pb-6 sm:pb-12 bg-[var(--bg-main)]">
      {/* Subtle Warm Luxury Ambient Glow in Center (Matches Website FAQ Style — NO Grid Lines) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[var(--gold-light)]/50 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow Divider (Matches Website's Exact Brand System) */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-1.5 sm:mb-2.5">
            <span className="w-6 sm:w-12 h-[1px] bg-[var(--gold)]/60 rounded-full" />
            <span className="text-[9.5px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--gold)]">
              COMMERCIAL REAL ESTATE INSIGHTS
            </span>
            <span className="w-6 sm:w-12 h-[1px] bg-[var(--gold)]/60 rounded-full" />
          </div>

          {/* Main Short, Punchy SEO Heading */}
          <h1 className="text-[21px] sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-[var(--text-heading)] leading-snug sm:leading-tight tracking-tight">
            Office Space in <span className="text-[var(--gold)]">Noida Blogs</span>
          </h1>

          {/* Sub-content — Simple, Natural, Human (No AI Fluff) */}
          <p className="text-[12.5px] sm:text-[14.5px] md:text-[15px] text-[var(--text-body)] leading-relaxed font-normal mt-1 sm:mt-2 mb-3.5 sm:mb-7 max-w-xl mx-auto">
            Latest commercial market updates, sector leasing guides, and verified workspace advice in Noida.
          </p>

          {/* Clean, Ultra-Compact Floating Search Bar (Real-Time Search, Production Ready) */}
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="max-w-2xl mx-auto bg-white rounded-xl sm:rounded-full p-1.5 sm:p-2 border border-[var(--border-card)] shadow-[0_4px_16px_-4px_rgba(10,35,60,0.06)] hover:border-[var(--gold)]/50 focus-within:border-[var(--gold)] focus-within:ring-2 focus-within:ring-[var(--gold)]/10 transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-2">
              {/* Row 1 on Mobile / Left on Desktop: Search Input Field */}
              <div className="flex-1 flex items-center gap-2 px-2.5 sm:px-3 py-1">
                <i
                  className="fa-solid fa-magnifying-glass text-[var(--text-muted)] text-[12px] sm:text-[13.5px] shrink-0"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    if (onSearch) onSearch(e.target.value);
                  }}
                  placeholder="Search articles, sectors (62, 132, 142), topics..."
                  aria-label="Search articles"
                  className="w-full bg-transparent text-[12.5px] sm:text-[14px] text-[var(--text-heading)] placeholder-[var(--text-muted)] outline-none border-none font-normal"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onSearch) onSearch("");
                    }}
                    className="text-gray-400 hover:text-gray-600 text-xs px-1 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                )}
              </div>

              {/* Row 2 on Mobile (Side-by-Side) / Inline on Desktop */}
              <div className="flex items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-gray-100 pt-1.5 sm:pt-0 sm:pl-2">
                {/* Category Dropdown (Compact, Never Overflows) */}
                <div className="relative flex-1 sm:flex-initial">
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    aria-label="Filter by category"
                    className="w-full appearance-none bg-[var(--bg-subtle)] sm:bg-transparent text-[11.5px] sm:text-[13px] font-medium text-[var(--text-heading)] pl-2.5 pr-6 py-1.5 sm:py-2 rounded-lg sm:rounded-full outline-none border-none cursor-pointer hover:text-[var(--gold)] transition-colors truncate"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <i
                    className="fa-solid fa-chevron-down text-[8px] sm:text-[9.5px] text-[var(--text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>

                {/* Compact Gold Search Button */}
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-full bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-white text-[12px] sm:text-[13.5px] font-semibold transition-all duration-200 shadow-2xs hover:shadow-xs shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}
