"use client";

import React, { useState, useRef, useEffect } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import { leadService } from "@/services/leadService";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ENQUIRY FORM COMPONENT - COMPACT, REUSABLE & 100% PRODUCTION-READY
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface EnquiryFormData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  lookingFor: string;
  preferredLocation: string;
  areaRequired: string;
  additionalRequirements: string;
}

export interface EnquiryFormProps {
  onSuccess?: (data: EnquiryFormData) => void;
  isModal?: boolean;
  initialLookingFor?: string;
  initialPreferredLocation?: string;
  defaultSector?: string;
  propertyName?: string;
  propertySlug?: string;
  compact?: boolean;
  buttonText?: string;
}

const LOOKING_FOR_OPTIONS = [
  "Furnished Offices",
  "Unfurnished Offices",
  "Coworking Spaces",
  "Managed Offices",
  "Retail Spaces",
  "Commercial Bare Shell",
];

export default function EnquiryForm({
  onSuccess,
  isModal = false,
  initialLookingFor = "",
  initialPreferredLocation = "",
  defaultSector = "",
  propertyName = "",
  propertySlug = "",
  compact = false,
  buttonText = "Send Enquiry",
}: EnquiryFormProps) {
  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    lookingFor: initialLookingFor || "Furnished Offices",
    preferredLocation: defaultSector || initialPreferredLocation || "",
    areaRequired: "",
    additionalRequirements: propertyName ? `Enquiry for ${propertyName}` : "",
  });

  // Sync props if modal opens with different location
  useEffect(() => {
    if (initialPreferredLocation) {
      setFormData((prev) => ({ ...prev, preferredLocation: initialPreferredLocation }));
    }
  }, [initialPreferredLocation]);

  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── INPUT HANDLERS ───
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Strict 10-digit number filter for phone
    if (name === "phone") {
      const cleanDigits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: cleanDigits }));
      if (errors.phone && cleanDigits.length === 10) {
        setErrors((prev) => ({ ...prev, phone: undefined }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on change
    if (errors[name as keyof EnquiryFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectLookingFor = (option: string) => {
    setFormData((prev) => ({ ...prev, lookingFor: option }));
    setIsDropdownOpen(false);
    if (errors.lookingFor) {
      setErrors((prev) => ({ ...prev, lookingFor: undefined }));
    }
  };

  // ─── VALIDATION ───
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EnquiryFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Min 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Must be 10 digits";
    } else if (!/^[6-9]/.test(formData.phone)) {
      newErrors.phone = "Must start with 6-9";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── FORM SUBMISSION ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const areaParsed = formData.areaRequired ? parseInt(formData.areaRequired.replace(/\D/g, ""), 10) || 0 : 0;
      const notesArr = [];
      if (formData.lookingFor) notesArr.push(`Looking For: ${formData.lookingFor}`);
      if (formData.preferredLocation) notesArr.push(`Location: ${formData.preferredLocation}`);
      if (formData.areaRequired) notesArr.push(`Area: ${formData.areaRequired}`);
      if (formData.additionalRequirements) notesArr.push(`Requirements: ${formData.additionalRequirements}`);

      const result = await leadService.submitLead({
        name: formData.fullName.trim(),
        company: formData.companyName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        clientType: "Corporate",
        preferredSector: formData.preferredLocation.trim() || "Sector 62",
        requirementSqFt: areaParsed,
        notes: notesArr.join(" | "),
        portal: "trinetraestates",
        source: isModal ? "Website Enquiry (Trinetra Popup)" : "Website Enquiry (Trinetra GetInTouch)",
      });

      if (result.success) {
        setIsSubmitted(true);
        if (onSuccess) {
          onSuccess(formData);
        }
        setFormData({
          fullName: "",
          companyName: "",
          email: "",
          phone: "",
          lookingFor: "",
          preferredLocation: "",
          areaRequired: "",
          additionalRequirements: "",
        });
      } else {
        setServerError(result.message || "Unable to send enquiry. Please try again.");
      }
    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* ── SUCCESS MESSAGE BANNER ── */}
      {isSubmitted ? (
        <div className="bg-[#fcfbf9] border border-[#c69960]/40 rounded-xl p-5 sm:p-6 text-center space-y-2.5 shadow-sm animate-fade-in">
          <div className="w-10 h-10 rounded-full bg-[#c69960]/15 text-[#c69960] flex items-center justify-center mx-auto">
            <i className="fa-solid fa-check text-lg" />
          </div>
          <h3 className="font-heading text-base sm:text-lg font-medium text-[#141414]">
            Enquiry Sent Successfully!
          </h3>
          <p className="text-[11.5px] sm:text-xs text-zinc-600 font-sans max-w-sm mx-auto leading-relaxed">
            Our commercial real-estate specialist will connect with you within 30 minutes.
          </p>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#c69960] hover:text-[#b3874f] pt-1 cursor-pointer font-sans"
          >
            <span>Submit another requirement</span>
            <i className="fa-solid fa-arrow-right text-[9px]" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3" noValidate>
          {serverError && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* ── ROW 1: Full Name & Company Name ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Full Name */}
            <div>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-[#faf9f6] border transition-all duration-200 ${
                  errors.fullName
                    ? "border-red-400 ring-1 ring-red-300"
                    : "border-black/[0.08] hover:border-black/20 focus-within:border-[var(--color-gold)] focus-within:ring-2 focus-within:ring-[var(--color-gold)]/20 focus-within:bg-white"
                }`}
              >
                <i className="fa-regular fa-user text-xs text-zinc-400 shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <label htmlFor="fullName" className="text-[9.5px] font-semibold text-zinc-500 font-sans uppercase tracking-wider leading-none">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none pt-0.5 font-sans font-normal"
                  />
                </div>
              </div>
              {errors.fullName && (
                <span className="block text-[9.5px] text-red-500 font-sans mt-0.5 pl-1">
                  {errors.fullName}
                </span>
              )}
            </div>

            {/* Company Name */}
            <div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#faf9f6] border border-black/[0.08] hover:border-black/20 focus-within:border-[var(--color-gold)] focus-within:ring-2 focus-within:ring-[var(--color-gold)]/20 focus-within:bg-white transition-all duration-200">
                <i className="fa-regular fa-building text-xs text-zinc-400 shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <label htmlFor="companyName" className="text-[9.5px] font-semibold text-zinc-500 font-sans uppercase tracking-wider leading-none">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className="w-full bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none pt-0.5 font-sans font-normal"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── ROW 2: Email Address & Phone Number ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Email Address */}
            <div>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-[#faf9f6] border transition-all duration-200 ${
                  errors.email
                    ? "border-red-400 ring-1 ring-red-300"
                    : "border-black/[0.08] hover:border-black/20 focus-within:border-[var(--color-gold)] focus-within:ring-2 focus-within:ring-[var(--color-gold)]/20 focus-within:bg-white"
                }`}
              >
                <i className="fa-regular fa-envelope text-xs text-zinc-400 shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <label htmlFor="email" className="text-[9.5px] font-semibold text-zinc-500 font-sans uppercase tracking-wider leading-none">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none pt-0.5 font-sans font-normal"
                  />
                </div>
              </div>
              {errors.email && (
                <span className="block text-[9.5px] text-red-500 font-sans mt-0.5 pl-1">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Phone Number (Strict 10-digit) */}
            <div>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-[#faf9f6] border transition-all duration-200 ${
                  errors.phone
                    ? "border-red-400 ring-1 ring-red-300"
                    : "border-black/[0.08] hover:border-black/20 focus-within:border-[var(--color-gold)] focus-within:ring-2 focus-within:ring-[var(--color-gold)]/20 focus-within:bg-white"
                }`}
              >
                <i className="fa-solid fa-phone text-xs text-zinc-400 shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <label htmlFor="phone" className="text-[9.5px] font-semibold text-zinc-500 font-sans uppercase tracking-wider leading-none">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-xs text-zinc-500 font-medium font-sans select-none">
                      +91
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10-digit number"
                      className="w-full bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none font-sans font-normal tracking-wide"
                    />
                  </div>
                </div>
              </div>
              {errors.phone && (
                <span className="block text-[9.5px] text-red-500 font-sans mt-0.5 pl-1">
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          {/* ── ROW 3: Custom Looking For Dropdown ── */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#faf9f6] border border-black/[0.08] hover:border-black/20 focus-within:border-[var(--color-gold)] cursor-pointer transition-all duration-200 select-none"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <i className="fa-solid fa-magnifying-glass text-xs text-zinc-400 shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[9.5px] font-semibold text-zinc-500 font-sans uppercase tracking-wider leading-none">
                    Looking For
                  </span>
                  <span className={`text-xs pt-0.5 font-sans truncate ${formData.lookingFor ? "text-zinc-900 font-medium" : "text-zinc-400"}`}>
                    {formData.lookingFor || "Select an option"}
                  </span>
                </div>
              </div>
              <i
                className={`fa-solid fa-chevron-down text-[10px] text-zinc-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180 text-[var(--color-gold)]" : ""
                }`}
              />
            </div>

            {/* Animated Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-xl border border-black/10 shadow-xl py-1 overflow-hidden animate-fade-in">
                {LOOKING_FOR_OPTIONS.map((opt) => {
                  const isSelected = formData.lookingFor === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectLookingFor(opt)}
                      className={`w-full text-left px-3.5 py-2 text-xs font-sans transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-[var(--color-gold)]/10 text-[#c69960] font-semibold"
                          : "text-zinc-700 hover:bg-neutral-50 hover:text-zinc-900"
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && (
                        <i className="fa-solid fa-check text-[10px] text-[#c69960]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── ROW 4: Preferred Location & Area Required ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Preferred Location */}
            <div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#faf9f6] border border-black/[0.08] hover:border-black/20 focus-within:border-[var(--color-gold)] focus-within:ring-2 focus-within:ring-[var(--color-gold)]/20 focus-within:bg-white transition-all duration-200">
                <i className="fa-solid fa-location-dot text-xs text-zinc-400 shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <label htmlFor="preferredLocation" className="text-[9.5px] font-semibold text-zinc-500 font-sans uppercase tracking-wider leading-none">
                    Preferred Location
                  </label>
                  <input
                    id="preferredLocation"
                    name="preferredLocation"
                    type="text"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    placeholder="e.g. Sector 62, Noida"
                    className="w-full bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none pt-0.5 font-sans font-normal"
                  />
                </div>
              </div>
            </div>

            {/* Area Required */}
            <div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#faf9f6] border border-black/[0.08] hover:border-black/20 focus-within:border-[var(--color-gold)] focus-within:ring-2 focus-within:ring-[var(--color-gold)]/20 focus-within:bg-white transition-all duration-200">
                <i className="fa-solid fa-vector-square text-xs text-zinc-400 shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <label htmlFor="areaRequired" className="text-[9.5px] font-semibold text-zinc-500 font-sans uppercase tracking-wider leading-none">
                    Area Required (Sq. Ft.)
                  </label>
                  <input
                    id="areaRequired"
                    name="areaRequired"
                    type="text"
                    value={formData.areaRequired}
                    onChange={handleChange}
                    placeholder="e.g. 500 - 5,000"
                    className="w-full bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none pt-0.5 font-sans font-normal"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── ROW 5: Additional Requirements (Textarea) ── */}
          <div>
            <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-[#faf9f6] border border-black/[0.08] hover:border-black/20 focus-within:border-[var(--color-gold)] focus-within:ring-2 focus-within:ring-[var(--color-gold)]/20 focus-within:bg-white transition-all duration-200">
              <i className="fa-regular fa-file-lines text-xs text-zinc-400 shrink-0 mt-0.5" />
              <div className="flex flex-col flex-1 min-w-0">
                <label htmlFor="additionalRequirements" className="text-[9.5px] font-semibold text-zinc-500 font-sans uppercase tracking-wider leading-none">
                  Additional Requirements
                </label>
                <textarea
                  id="additionalRequirements"
                  name="additionalRequirements"
                  rows={2}
                  value={formData.additionalRequirements}
                  onChange={handleChange}
                  placeholder="Tell us more about your specific requirements..."
                  className="w-full bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none pt-0.5 font-sans font-normal resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── SUBMIT BUTTON ── */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-5 rounded-xl bg-[#b58b53] hover:bg-[#a07742] text-white font-heading font-medium text-xs sm:text-[13px] tracking-wide flex items-center justify-center gap-2 shadow-md shadow-[#b58b53]/25 hover:shadow-lg hover:shadow-[#b58b53]/35 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-xs" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{buttonText}</span>
                  <i className="fa-solid fa-arrow-right text-[11px] transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>

          {/* ── SECURITY NOTE ── */}
          <div className="flex items-center justify-center gap-1.5 pt-0.5 text-center">
            <i className="fa-solid fa-lock text-[10px] text-zinc-400" />
            <span className="text-[10px] text-zinc-500 font-sans">
              Your information is 100% secure with us.
            </span>
          </div>
        </form>
      )}
    </div>
  );
}
