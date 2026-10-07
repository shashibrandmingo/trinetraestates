import { LeadRequirementPayload, LeadSubmissionResponse } from "@/types/lead";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

export const leadService = {
  /**
   * Submit client inquiry to MongoDB backend
   */
  submitLead: async (payload: LeadRequirementPayload): Promise<LeadSubmissionResponse> => {
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          portal: payload.portal || "trinetraestates",
          source: payload.source || "Website Enquiry",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        return {
          success: false,
          message: json.message || "Failed to submit enquiry. Please try again.",
        };
      }

      return {
        success: true,
        message: json.message || "Enquiry submitted successfully! Our expert will call you shortly.",
        leadId: json.data?.leadId || json.data?._id,
        data: json.data,
      };
    } catch (err: any) {
      console.error("[LeadService] Submit error:", err);
      return {
        success: false,
        message: err?.message || "Network connection error. Please try again.",
      };
    }
  },
};
