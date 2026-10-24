"use client";

import React from "react";
import Container from "@/components/ui/Container";
import { BlogPost } from "@/data/blogsData";
import BlogCard from "./BlogCard";

interface BlogGridProps {
  posts: BlogPost[];
  searchQuery?: string;
  selectedCategory?: string;
  onResetFilters?: () => void;
}

export default function BlogGrid({
  posts,
  searchQuery,
  selectedCategory,
  onResetFilters,
}: BlogGridProps) {
  const hasActiveFilter = Boolean(
    (searchQuery && searchQuery.trim() !== "") ||
      (selectedCategory && selectedCategory !== "All Categories")
  );

  return (
    <section id="articles-section" className="py-8 sm:py-12 lg:py-14 bg-[var(--bg-main)]">
      <Container>
        {/* Section Subhead & Filter Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-7 pb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-heading)] tracking-tight">
              Latest Articles & Guides
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[var(--gold-light)] text-[var(--gold)] text-[11px] font-semibold">
              {posts.length} {posts.length === 1 ? "Article" : "Articles"}
            </span>
          </div>

          {hasActiveFilter && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--text-muted)]">
                Showing results for:{" "}
                <strong className="text-[var(--text-heading)]">
                  {searchQuery || selectedCategory}
                </strong>
              </span>
              {onResetFilters && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="text-[var(--gold)] hover:underline font-semibold cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Blog Cards Grid (Responsive 1/2/3 Columns) ── */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-[var(--border-card)] max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-[var(--gold-light)] text-[var(--gold)] flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-magnifying-glass text-lg" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-heading)] mb-1.5">
              No articles found
            </h3>
            <p className="text-xs text-[var(--text-body)] mb-4">
              We couldn’t find any blogs matching &ldquo;{searchQuery || selectedCategory}&rdquo;. Try another keyword or browse all articles.
            </p>
            {onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="px-4 py-2 rounded-full bg-[var(--gold)] text-white text-xs font-semibold hover:bg-[var(--gold-hover)] transition-colors cursor-pointer"
              >
                View All Articles
              </button>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
