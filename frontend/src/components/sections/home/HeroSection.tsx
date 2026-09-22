"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import RequirementForm, { RequirementFormData } from "@/components/forms/RequirementForm";

export interface HeroSectionProps {
  onFormSubmit?: (data: RequirementFormData) => Promise<void> | void;
}

export default function HeroSection({ onFormSubmit }: HeroSectionProps) {
  const badges = [
    {
      icon: "fa-solid fa-location-dot",
      line1: "Prime",
      line2: "Locations",
    },
    {
      icon: "fa-regular fa-building",
      line1: "Verified",
      line2: "Properties",
    },
    {
      icon: "fa-regular fa-handshake",
      line1: "Expert",
      line2: "Assistance",
    },
    {
      icon: "fa-solid fa-headset",
      line1: "End-to-End",
      line2: "Support",
    },
  ];

  return (
    <section id="home" className="hero-section relative w-full bg-[var(--primary)] min-h-[520px] lg:min-h-[580px] flex items-center py-6 sm:py-8 lg:py-10">
      {/* Background Hero Banner Image with Executive Deep Navy Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/bgbanners/hero.png"
          alt="Luxury Office Spaces in Noida"
          className="w-full h-full object-cover object-center"
        />
        {/* Balanced luxury blue gradient overlay: smooth vertical gradient on mobile, horizontal on desktop */}
        <div className="hero-banner-overlay" />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6">
          {/* Left Column: Hero Content & Highlights */}
          <div className="w-full lg:w-[60%] xl:w-[62%] space-y-3.5 sm:space-y-4 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 animate-fade-down">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] uppercase text-[var(--text-light-muted)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] lg:drop-shadow-none">
                PREMIUM &nbsp;|&nbsp; FLEXIBLE &nbsp;|&nbsp; STRATEGIC
              </span>
            </div>

            {/* Main Title (H1) */}
            <h1 className="hero-title drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] lg:drop-shadow-sm animate-fade-up delay-100">
              Find the Perfect <br className="hidden sm:inline" />
              Office Space <br className="hidden sm:inline" />
              in <span className="text-[var(--gold)]">Noida</span>
            </h1>

            {/* Subtitle Description */}
            <p className="hero-subtitle text-xs sm:text-sm md:text-[14px] !text-[var(--text-light)] leading-relaxed max-w-lg font-normal drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] lg:drop-shadow-sm animate-fade-up delay-200">
              Modern workspaces for ambitious businesses. <br />
              From startups to enterprises — we help you <br />
              find the right space to grow.
            </p>

            {/* 4 Feature Badges */}
            <div className="grid grid-cols-4 gap-2.5 sm:flex sm:items-center sm:gap-6 lg:gap-7 pt-0.5 animate-fade-up delay-300">
              {badges.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center group cursor-default"
                >
                  <div className="w-[50px] h-[50px] sm:w-[58px] sm:h-[58px] lg:w-[62px] lg:h-[62px] rounded-2xl border border-white/30 sm:border-white/25 bg-white/[0.05] sm:bg-white/[0.02] backdrop-blur-[2px] sm:backdrop-blur-[1.5px] flex items-center justify-center text-[var(--gold-bright)] group-hover:border-[var(--gold-bright)] group-hover:bg-white/[0.08] group-hover:scale-105 transition-all duration-300 shadow-sm">
                    <i
                      className={`${item.icon} text-[22px] sm:text-[26px] lg:text-[28px] text-[var(--gold-bright)] drop-shadow-sm`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="text-[11px] sm:text-[12px] font-semibold text-[var(--text-white)] leading-tight mt-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] lg:drop-shadow-none">
                    <div>{item.line1}</div>
                    <div>{item.line2}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-1.5 animate-fade-up delay-400">
              <Link
                href="#office-spaces"
                className="btn btn-gold px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-[13.5px] tracking-wide"
              >
                <span>Explore Office Spaces</span>
                <i
                  className="fa-solid fa-arrow-right text-[11.5px]"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Requirement Form Card */}
          <div className="w-full lg:w-[40%] xl:w-[38%] flex justify-center lg:justify-end lg:pr-3 xl:pr-6 animate-scale-in delay-200">
            <RequirementForm onSubmit={onFormSubmit} />
          </div>
        </div>
      </Container>
    </section>
  );
}
