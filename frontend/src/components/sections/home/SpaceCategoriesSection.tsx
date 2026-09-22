"use client";

import React, { useState } from "react";
import Container from "@/components/ui/Container";
import { useInView } from "@/hooks/useInView";

export interface CategoryItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
}

export interface SpaceCategoriesSectionProps {
  onSelectCategory?: (category: CategoryItem) => void;
}

export default function SpaceCategoriesSection({ onSelectCategory }: SpaceCategoriesSectionProps) {
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: true });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const categories: CategoryItem[] = [
    {
      id: "startup-office",
      icon: "fa-solid fa-rocket",
      title: "Startup Office",
      subtitle: "For early stage teams",
    },
    {
      id: "10-25-seats",
      icon: "fa-solid fa-user-group",
      title: "10 – 25 Seats",
      subtitle: "Growing startups",
    },
    {
      id: "25-50-seats",
      icon: "fa-solid fa-people-group",
      title: "25 – 50 Seats",
      subtitle: "Mid-sized teams",
    },
    {
      id: "50-100-seats",
      icon: "fa-regular fa-building",
      title: "50 – 100 Seats",
      subtitle: "Established firms",
    },
    {
      id: "100-plus-seats",
      icon: "fa-solid fa-city",
      title: "100+ Seats",
      subtitle: "Large enterprises",
    },
    {
      id: "corporate-office",
      icon: "fa-solid fa-briefcase",
      title: "Corporate Office",
      subtitle: "Custom built HQs",
    },
  ];

  const handleCardClick = (category: CategoryItem) => {
    setSelectedId(category.id);
    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  return (
    <section
      id="space-categories"
      ref={sectionRef}
      className="space-categories-section global-section-padding bg-[var(--bg-main)] relative overflow-hidden"
    >
      {/* Subtle Luxury Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-[var(--gold-light)]/20 via-[var(--gold-light)]/40 to-[var(--gold-light)]/20 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-7 sm:mb-10 transition-opacity duration-500 ${
            isInView ? "animate-fade-up" : "opacity-0"
          }`}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center justify-center gap-3">
            <span className="w-8 sm:w-10 h-[2px] bg-[var(--gold)] rounded-full" />
            <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.2em] uppercase text-[var(--gold)]">
              FIND YOUR IDEAL SPACE
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-[var(--text-heading)] leading-tight tracking-tight mt-2.5">
            What are you <span className="text-[var(--gold)]">looking for?</span>
          </h2>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-4.5">
          {categories.map((category, idx) => {
            const isActive = selectedId === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCardClick(category)}
                aria-label={`Select ${category.title}`}
                className={`group relative rounded-2xl py-3.5 sm:py-4 lg:py-4.5 px-3 sm:px-3.5 flex flex-col items-center justify-between text-center transition-all duration-300 cursor-pointer min-h-[160px] sm:min-h-[170px] lg:min-h-[178px] ${
                  isActive
                    ? "bg-[var(--gold-light)]/75 border-2 border-[var(--gold)] shadow-[0_10px_24px_-6px_rgba(157,116,72,0.22)] -translate-y-1"
                    : "bg-[var(--bg-surface)] border border-[var(--border-card)] shadow-[0_3px_12px_-3px_rgba(10,35,60,0.06)] hover:bg-[var(--gold-light)]/60 hover:border-[var(--gold)] hover:-translate-y-1.5 hover:shadow-[0_12px_26px_-6px_rgba(157,116,72,0.18)]"
                } ${
                  isInView
                    ? `animate-fade-up delay-${Math.min((idx + 1) * 75, 450)}`
                    : "opacity-0"
                }`}
              >
                {/* Center Icon */}
                <div
                  className={`w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-white text-[var(--gold)] shadow-sm scale-105"
                      : "bg-[var(--gold-light)] text-[var(--gold)] group-hover:bg-white group-hover:scale-110 group-hover:shadow-sm"
                  }`}
                >
                  <i
                    className={`${category.icon} text-lg sm:text-xl transition-transform duration-300 group-hover:scale-105`}
                    aria-hidden="true"
                  />
                </div>

                {/* Category Title */}
                <div className="my-1.5 sm:my-2">
                  <div
                    className={`text-[13px] sm:text-[14px] font-bold leading-tight tracking-tight transition-colors duration-200 ${
                      isActive
                        ? "text-[var(--text-heading)]"
                        : "text-[var(--text-heading)] group-hover:text-[var(--gold)]"
                    }`}
                  >
                    {category.title}
                  </div>
                </div>

                {/* Circular Arrow Button */}
                <div
                  className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-[var(--gold)] text-white border border-[var(--gold)] shadow-sm"
                      : "bg-transparent border border-[var(--border-subtle)] text-[var(--text-muted)] group-hover:border-[var(--gold)] group-hover:bg-[var(--gold)] group-hover:text-white"
                  }`}
                >
                  <i
                    className="fa-solid fa-arrow-right text-[9.5px] sm:text-[10.5px] transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
