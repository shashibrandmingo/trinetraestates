/**
 * Lead & Requirement Inquiry Types
 */
export interface LeadRequirementPayload {
  name: string;
  phone: string;
  email: string;
  company?: string;
  clientType?: string;
  preferredSector?: string;
  requirementSqFt?: number;
  budget?: number;
  notes?: string;
  source?: string;
  portal?: string;
}

export interface LeadSubmissionResponse {
  success: boolean;
  message: string;
  leadId?: string;
  data?: any;
}
