"use client";

import React, { useState, useEffect } from "react";
import { leadService } from "@/services/leadService";
import { cn } from "@/utils/cn";
import LuxurySelect from "@/components/ui/LuxurySelect";

const NOIDA_AREA_OPTIONS = [
  { value: "Sector 62", label: "Sector 62" },
  { value: "Sector 63", label: "Sector 63" },
  { value: "Sector 125", label: "Sector 125" },
  { value: "Sector 126", label: "Sector 126" },
  { value: "Sector 132", label: "Sector 132" },
  { value: "Sector 135", label: "Sector 135" },
  { value: "Sector 142", label: "Sector 142" },
  { value: "Noida Expressway", label: "Noida Expressway" },
  { value: "Other", label: "Other Sectors" },
];

const SPACE_TYPE_OPTIONS = [
  { value: "IT & Corporate Offices", label: "IT & Corporate Offices" },
  { value: "Managed Offices", label: "Managed Offices" },
  { value: "Coworking Spaces", label: "Coworking Spaces" },
  { value: "Plug & Play Offices", label: "Plug & Play Offices" },
  { value: "Commercial Bare Shell", label: "Commercial Bare Shell" },
  { value: "Built-to-Suit", label: "Built-to-Suit" },
];

export interface RequirementFormData {
  fullName?: string;
  phone?: string;
  email?: string;
  company?: string;
  area?: string;
  spaceType?: string;
  requirements?: string;
}

export interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  company?: string;
  area?: string;
  spaceType?: string;
}

export interface RequirementFormProps {
  initialData?: RequirementFormData;
  onSubmit?: (data: RequirementFormData) => Promise<void> | void;
  isSubmitting?: boolean;
  isModal?: boolean;
  badge?: string;
  title?: string;
  subtitle?: string;
  onSuccess?: (data: RequirementFormData) => void;
  className?: string;
}

/**
 * RequirementForm Component
 * 
 * Production-ready luxury requirement form with 100% strict validation:
 * 1. Full Name (required, min 2 chars, letters only)
 * 2. Phone Number (required, strictly 10 digits only, Indian mobile format 6-9)
 * 3. Email Address (required, standard valid email regex)
 * 4. Preferred Area (required, custom luxury dropdown)
 * 5. Space Type (required, custom luxury dropdown)
 * 6. Company Name (optional, if provided min 2 chars)
 * 
 * Connected to MERN Backend (leadService.createLead) to store inquiries in MongoDB.
 */
export default function RequirementForm({
  initialData = {},
  onSubmit,
  isSubmitting: externalSubmitting = false,
  isModal = false,
  badge = "GET STARTED",
  title = "Share Your Requirements",
  subtitle = "Our team will get in touch with the best options for you.",
  onSuccess,
  className,
}: RequirementFormProps) {
  const [formData, setFormData] = useState<RequirementFormData>({
    fullName: initialData.fullName || "",
    phone: initialData.phone || "",
    email: initialData.email || "",
    company: initialData.company || "",
    area: initialData.area || "",
    spaceType: initialData.spaceType || "",
    requirements: initialData.requirements || "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<RequirementFormData | null>(null);
  const [generalError, setGeneralError] = useState("");

  const handleResetForm = () => {
    setSubmitted(false);
    setSubmittedData(null);
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      company: "",
      area: "",
      spaceType: "",
      requirements: "",
    });
    setErrors({});
    setGeneralError("");
  };

  // Sync initialData if modal reopens with a new card context
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({
        ...prev,
        fullName: initialData.fullName !== undefined ? initialData.fullName : prev.fullName,
        phone: initialData.phone !== undefined ? initialData.phone : prev.phone,
        email: initialData.email !== undefined ? initialData.email : prev.email,
        company: initialData.company !== undefined ? initialData.company : prev.company,
        area: initialData.area !== undefined ? initialData.area : prev.area,
        spaceType: initialData.spaceType !== undefined ? initialData.spaceType : prev.spaceType,
        requirements: initialData.requirements !== undefined ? initialData.requirements : prev.requirements,
      }));
    }
  }, [initialData]);

  // Single field validation helper
  const validateField = (field: keyof FormErrors, value: string): string => {
    switch (field) {
      case "fullName": {
        const trimmed = value.trim();
        if (!trimmed) return "Full Name is required";
        if (trimmed.length < 2) return "Name must be at least 2 characters";
        if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return "Name can only contain letters";
        return "";
      }
      case "phone": {
        const digits = value.replace(/\D/g, "");
        if (!digits) return "Phone number is required";
        if (digits.length !== 10) return `Enter exactly 10 digits (${digits.length}/10)`;
        if (!/^[6-9]/.test(digits)) return "Must start with 6, 7, 8 or 9";
        return "";
      }
      case "email": {
        const trimmed = value.trim();
        if (!trimmed) return "Email address is required";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmed)) return "Enter a valid email (e.g. name@company.com)";
        return "";
      }
      case "area": {
        if (!value || !value.trim()) return "Please select your preferred area";
        return "";
      }
      case "spaceType": {
        if (!value || !value.trim()) return "Please select type of space";
        return "";
      }
      case "company": {
        const trimmed = value.trim();
        if (trimmed && trimmed.length < 2) return "Company name must be at least 2 characters";
        return "";
      }
      default:
        return "";
    }
  };

  // Full Name handler
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, fullName: val }));
    if (errors.fullName) {
      const err = validateField("fullName", val);
      if (!err) setErrors((prev) => ({ ...prev, fullName: "" }));
    }
    if (generalError) setGeneralError("");
  };

  // Phone handler - strictly 10 digits only
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow only numeric digits, max length 10
    const digitsOnly = raw.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: digitsOnly }));

    if (errors.phone) {
      const err = validateField("phone", digitsOnly);
      if (!err) setErrors((prev) => ({ ...prev, phone: "" }));
    }
    if (generalError) setGeneralError("");
  };

  // Email handler
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, email: val }));
    if (errors.email) {
      const err = validateField("email", val);
      if (!err) setErrors((prev) => ({ ...prev, email: "" }));
    }
    if (generalError) setGeneralError("");
  };

  // Generic input handler (company, requirements)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (generalError) setGeneralError("");
  };

  // Dropdown handlers
  const handleAreaChange = (val: string) => {
    setFormData((prev) => ({ ...prev, area: val }));
    if (errors.area && val) {
      setErrors((prev) => ({ ...prev, area: "" }));
    }
    if (generalError) setGeneralError("");
  };

  const handleSpaceTypeChange = (val: string) => {
    setFormData((prev) => ({ ...prev, spaceType: val }));
    if (errors.spaceType && val) {
      setErrors((prev) => ({ ...prev, spaceType: "" }));
    }
    if (generalError) setGeneralError("");
  };

  // Blur validation
  const handleBlur = (field: keyof FormErrors) => {
    const val = formData[field] || "";
    const fieldError = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  // Validate entire form before submission
  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};

    const nameErr = validateField("fullName", formData.fullName || "");
    if (nameErr) newErrors.fullName = nameErr;

    const phoneErr = validateField("phone", formData.phone || "");
    if (phoneErr) newErrors.phone = phoneErr;

    const emailErr = validateField("email", formData.email || "");
    if (emailErr) newErrors.email = emailErr;

    const areaErr = validateField("area", formData.area || "");
    if (areaErr) newErrors.area = areaErr;

    const spaceErr = validateField("spaceType", formData.spaceType || "");
    if (spaceErr) newErrors.spaceType = spaceErr;

    if (formData.company) {
      const compErr = validateField("company", formData.company);
      if (compErr) newErrors.company = compErr;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validateAll();
    if (!isValid) {
      setGeneralError("Please fix the highlighted errors before submitting.");
      return;
    }

    setGeneralError("");
    setLoading(true);

    try {
      const detailedNotes = [
        formData.requirements?.trim(),
        isModal ? "(Via Website Modal)" : "(Via Website Form)",
      ].filter(Boolean).join(" ");

      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Direct MERN backend API submission to /api/leads
        // Uses valid enum 'Website Enquiry' defined in backend Lead model schema
        await leadService.createLead({
          name: formData.fullName!.trim(),
          phone: formData.phone!.trim(),
          email: formData.email!.trim(),
          company: formData.company?.trim() || undefined,
          preferredSector: formData.area || undefined,
          propertyTitle: formData.spaceType || undefined,
          notes: detailedNotes || undefined,
          source: "Website Enquiry",
          status: "Lead",
          clientType: "Corporate",
        });
      }

      setSubmittedData({ ...formData });
      setSubmitted(true);
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        company: "",
        area: "",
        spaceType: "",
        requirements: "",
      });
      setErrors({});
      setGeneralError("");
      if (onSuccess) onSuccess(formData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setGeneralError(message);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitting = externalSubmitting || loading;

  const formContent = (
    <>
      {/* Form Header */}
      <div className="mb-2.5 sm:mb-3 text-left">
        <div className="inline-flex items-center gap-2 mb-0.5">
          <span className="w-4 h-[2px] bg-[var(--gold)] rounded-full inline-block" />
          <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            {badge}
          </span>
        </div>
        <h3 className="text-lg sm:text-xl md:text-[22px] font-bold text-[var(--text-heading)] mt-0.5 leading-snug tracking-tight">
          {title}
        </h3>
        <p className="text-[11px] sm:text-[11.5px] text-[var(--text-body)] mt-0.5 font-normal leading-normal">
          {subtitle}
        </p>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} noValidate className="space-y-2 text-left">
        {/* Full Name */}
        <div>
          <div className="relative flex items-center">
            <span
              className={cn(
                "absolute left-2.5 pointer-events-none text-[10.5px] transition-colors",
                errors.fullName ? "text-rose-400" : "text-[var(--text-muted)]"
              )}
            >
              <i className="fa-regular fa-user" aria-hidden="true" />
            </span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleNameChange}
              onBlur={() => handleBlur("fullName")}
              placeholder="Full Name *"
              required
              className={cn(
                "w-full rounded-lg border pl-7.5 pr-3 py-1.5 text-[11.5px] text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none transition-all",
                errors.fullName
                  ? "border-rose-400 bg-rose-50/15 focus:border-rose-500 ring-1 ring-rose-300/40"
                  : "border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 focus:border-[var(--gold)] focus:bg-[var(--bg-surface)]"
              )}
            />
          </div>
          {errors.fullName && (
            <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1 pl-1 pt-0.5 animate-fade-in">
              <i className="fa-solid fa-circle-exclamation text-[9px]" aria-hidden="true" />
              <span>{errors.fullName}</span>
            </span>
          )}
        </div>

        {/* Phone Number (Strict 10 Digits) */}
        <div>
          <div className="relative flex items-center">
            <span
              className={cn(
                "absolute left-2.5 pointer-events-none text-[10.5px] transition-colors",
                errors.phone ? "text-rose-400" : "text-[var(--text-muted)]"
              )}
            >
              <i className="fa-solid fa-phone" aria-hidden="true" />
            </span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur("phone")}
              placeholder="Phone Number (10 digits) *"
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]*"
              required
              className={cn(
                "w-full rounded-lg border pl-7.5 pr-12 py-1.5 text-[11.5px] text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none transition-all",
                errors.phone
                  ? "border-rose-400 bg-rose-50/15 focus:border-rose-500 ring-1 ring-rose-300/40"
                  : "border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 focus:border-[var(--gold)] focus:bg-[var(--bg-surface)]"
              )}
            />
            {/* Real-time 10-digit counter */}
            <span
              className={cn(
                "absolute right-2.5 text-[9.5px] font-mono pointer-events-none font-semibold transition-colors",
                (formData.phone?.length || 0) === 10
                  ? "text-[var(--gold)]"
                  : "text-[var(--text-muted)]/70"
              )}
            >
              {formData.phone?.length || 0}/10
            </span>
          </div>
          {errors.phone && (
            <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1 pl-1 pt-0.5 animate-fade-in">
              <i className="fa-solid fa-circle-exclamation text-[9px]" aria-hidden="true" />
              <span>{errors.phone}</span>
            </span>
          )}
        </div>

        {/* Email Address */}
        <div>
          <div className="relative flex items-center">
            <span
              className={cn(
                "absolute left-2.5 pointer-events-none text-[10.5px] transition-colors",
                errors.email ? "text-rose-400" : "text-[var(--text-muted)]"
              )}
            >
              <i className="fa-regular fa-envelope" aria-hidden="true" />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur("email")}
              placeholder="Email Address *"
              required
              className={cn(
                "w-full rounded-lg border pl-7.5 pr-3 py-1.5 text-[11.5px] text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none transition-all",
                errors.email
                  ? "border-rose-400 bg-rose-50/15 focus:border-rose-500 ring-1 ring-rose-300/40"
                  : "border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 focus:border-[var(--gold)] focus:bg-[var(--bg-surface)]"
              )}
            />
          </div>
          {errors.email && (
            <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1 pl-1 pt-0.5 animate-fade-in">
              <i className="fa-solid fa-circle-exclamation text-[9px]" aria-hidden="true" />
              <span>{errors.email}</span>
            </span>
          )}
        </div>

        {/* Company Name */}
        <div>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-[var(--text-muted)] pointer-events-none text-[10.5px]">
              <i className="fa-regular fa-building" aria-hidden="true" />
            </span>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              onBlur={() => handleBlur("company")}
              placeholder="Company Name (Optional)"
              className={cn(
                "w-full rounded-lg border pl-7.5 pr-3 py-1.5 text-[11.5px] text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none transition-all",
                errors.company
                  ? "border-rose-400 bg-rose-50/15 focus:border-rose-500 ring-1 ring-rose-300/40"
                  : "border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 focus:border-[var(--gold)] focus:bg-[var(--bg-surface)]"
              )}
            />
          </div>
          {errors.company && (
            <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1 pl-1 pt-0.5 animate-fade-in">
              <i className="fa-solid fa-circle-exclamation text-[9px]" aria-hidden="true" />
              <span>{errors.company}</span>
            </span>
          )}
        </div>

        {/* Preferred Area in Noida */}
        <div>
          <LuxurySelect
            name="area"
            value={formData.area || ""}
            onChange={handleAreaChange}
            placeholder="Preferred Area in Noida *"
            icon="fa-solid fa-map-location-dot"
            options={NOIDA_AREA_OPTIONS}
            error={errors.area}
          />
          {errors.area && (
            <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1 pl-1 pt-0.5 animate-fade-in">
              <i className="fa-solid fa-circle-exclamation text-[9px]" aria-hidden="true" />
              <span>{errors.area}</span>
            </span>
          )}
        </div>

        {/* Type of Space */}
        <div>
          <LuxurySelect
            name="spaceType"
            value={formData.spaceType || ""}
            onChange={handleSpaceTypeChange}
            placeholder="Type of Space *"
            icon="fa-regular fa-rectangle-list"
            options={SPACE_TYPE_OPTIONS}
            error={errors.spaceType}
          />
          {errors.spaceType && (
            <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1 pl-1 pt-0.5 animate-fade-in">
              <i className="fa-solid fa-circle-exclamation text-[9px]" aria-hidden="true" />
              <span>{errors.spaceType}</span>
            </span>
          )}
        </div>

        {/* Any Additional Requirements */}
        <div className="relative flex items-center">
          <span className="absolute left-2.5 text-[var(--text-muted)] pointer-events-none text-[10.5px]">
            <i className="fa-regular fa-comment-dots" aria-hidden="true" />
          </span>
          <input
            type="text"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Any Additional Requirements (Optional)"
            className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 pl-7.5 pr-3 py-1.5 text-[11.5px] text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] focus:bg-[var(--bg-surface)] transition-all"
          />
        </div>

        {/* General Error Banner */}
        {generalError && (
          <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-600 font-medium flex items-center gap-1.5 animate-fade-in">
            <i className="fa-solid fa-circle-exclamation text-xs text-rose-500 flex-shrink-0" aria-hidden="true" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-blue w-full py-2 sm:py-2.5 px-4 text-[11.5px] sm:text-xs font-semibold tracking-normal group cursor-pointer disabled:opacity-75 transition-all mt-1"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <i className="fa-solid fa-circle-notch fa-spin text-xs" aria-hidden="true" />
              <span>Submitting...</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <span>Get Office Space Options</span>
              <i className="fa-solid fa-arrow-right text-[9.5px] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </span>
          )}
        </button>

        {/* Security Tag */}
        <div className="text-center pt-0.5">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[10.5px] text-[var(--text-muted)]">
            <i className="fa-solid fa-lock text-[9px]" aria-hidden="true" />
            <span>Your requirements are confidential & secure.</span>
          </span>
        </div>
      </form>
    </>
  );

  {/* Luxury Success Card replacing the form */}
  const successContent = (
    <div className="py-5 sm:py-6 px-1.5 sm:px-3 flex flex-col items-center justify-center text-center animate-scale-in">
      {/* Animated Luxury Gold Checkmark Circle */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--gold-light)] border-2 border-[var(--gold)]/50 flex items-center justify-center text-[var(--gold)] mb-3 shadow-[0_8px_24px_-4px_rgba(157,116,72,0.25)]">
        <i className="fa-solid fa-check text-2xl sm:text-3xl text-[var(--gold)]" aria-hidden="true" />
      </div>

      <div className="inline-flex items-center gap-2 mb-1">
        <span className="w-3.5 h-[2px] bg-[var(--gold)] rounded-full inline-block" />
        <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
          REQUEST RECEIVED
        </span>
        <span className="w-3.5 h-[2px] bg-[var(--gold)] rounded-full inline-block" />
      </div>

      <h3 className="text-xl sm:text-[22px] font-bold text-[var(--text-heading)] mt-0.5 leading-snug">
        Thank You!
      </h3>

      <p className="text-xs sm:text-[12.5px] text-[var(--text-body)] mt-1.5 leading-relaxed max-w-[290px]">
        {submittedData?.fullName ? `Thank you, ${submittedData.fullName}. ` : ""}
        We have received your requirements. Our workspace advisory team will connect with you shortly on{" "}
        <strong className="text-[var(--text-heading)] font-semibold">{submittedData?.phone || "your phone"}</strong>.
      </p>

      {/* Inquiry Summary Box */}
      <div className="mt-3.5 w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl p-3 text-left space-y-1.5">
        <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Inquiry Details
        </div>
        <div className="text-xs text-[var(--text-heading)] font-medium flex items-center gap-2">
          <i className="fa-solid fa-map-location-dot text-[11px] text-[var(--gold)] w-3.5 text-center" />
          <span>{submittedData?.area || "Noida"}</span>
        </div>
        <div className="text-xs text-[var(--text-heading)] font-medium flex items-center gap-2">
          <i className="fa-regular fa-rectangle-list text-[11px] text-[var(--gold)] w-3.5 text-center" />
          <span>{submittedData?.spaceType || "Commercial Space"}</span>
        </div>
      </div>

      {/* Submit Another Requirement Button */}
      <button
        type="button"
        onClick={handleResetForm}
        className="btn btn-outline-gold text-[11.5px] px-4 py-2 mt-4 rounded-lg flex items-center gap-2 transition-all cursor-pointer"
      >
        <i className="fa-solid fa-rotate-left text-[10px]" />
        <span>Submit Another Requirement</span>
      </button>
    </div>
  );

  const renderedContent = submitted ? successContent : formContent;

  if (isModal) {
    return <div className="w-full">{renderedContent}</div>;
  }

  return (
    <div className={cn("form-card w-full max-w-[380px] bg-[var(--bg-surface)] rounded-2xl p-4 sm:p-5 shadow-[0_12px_36px_-6px_rgba(10,35,60,0.18),0_4px_12px_-2px_rgba(10,35,60,0.06)] border border-[var(--border-card)]", className)}>
      {renderedContent}
    </div>
  );
}
