"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/data/blogsData";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group bg-white rounded-2xl border border-[var(--border-card)] hover:border-[var(--gold)]/60 shadow-[0_4px_16px_-4px_rgba(10,35,60,0.05)] hover:shadow-[0_12px_32px_-8px_rgba(10,35,60,0.12)] transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* ── Top Cover Image with Smooth Zoom ── */}
      <Link
        href={`/blogs/${post.slug}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 block"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
      </Link>

      {/* ── Card Content Body ── */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Pill & Read Time Row (Compact) */}
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#faf5ef] text-[var(--gold)] border border-[var(--gold-border)]/60 tracking-wide">
              {post.category}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 font-normal">
              <i className="fa-regular fa-clock text-[10px]" aria-hidden="true" />
              {post.readTime}
            </span>
          </div>

          {/* Title Heading (Compact font size, no underline on hover) */}
          <h3 className="text-[13px] sm:text-[14px] font-semibold text-[var(--text-heading)] group-hover:text-[var(--gold)] transition-colors line-clamp-2 leading-snug mb-2">
            <Link href={`/blogs/${post.slug}`} className="no-underline hover:no-underline">
              {post.title}
            </Link>
          </h3>

          {/* Explore Article Link */}
          <div className="mb-3 sm:mb-3.5">
            <Link
              href={`/blogs/${post.slug}`}
              className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--gold)] hover:text-[var(--gold-hover)] no-underline hover:no-underline group/link"
            >
              <span>Explore Article</span>
              <i className="fa-solid fa-arrow-right text-[9.5px] group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ── Divider & Bottom Author Row ── */}
        <div className="pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center justify-between gap-2.5 text-xs">
          {/* Author Details with Avatar */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-[var(--gold-bright)] flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs border border-[var(--gold-border)]/40">
              {post.author.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="min-w-0 leading-tight">
              <span className="block text-[11.5px] font-semibold text-[var(--text-heading)] truncate">
                {post.author.name}
              </span>
              <span className="block text-[10px] text-[var(--text-muted)] truncate">
                {post.author.role}
              </span>
            </div>
          </div>

          {/* Publication Date */}
          <div className="text-[10.5px] text-[var(--text-muted)] shrink-0 flex items-center gap-1">
            <i className="fa-regular fa-calendar text-[9.5px]" aria-hidden="true" />
            <span>{post.publishedAt}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
