import { supabase } from "@/lib/supabase";

export interface LeadCaptureRecord {
  auditId: string;
  submittedAt: string;
  type: "credex" | "notify";
  email: string;
  company?: string;
  monthlySavings?: number;
}

export async function appendLeadCapture(record: LeadCaptureRecord): Promise<void> {
  const { error } = await supabase
    .from("leads")
    .insert({
      email: record.email,
      company: record.company,
      audit_id: record.auditId,
      type: record.type, // Track where the lead came from
    });

  if (error) {
    console.error("Error saving lead capture:", error);
    throw new Error("Failed to save lead capture to Supabase");
  }
}
