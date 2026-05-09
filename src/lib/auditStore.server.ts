import { supabase } from "@/lib/supabase";
import type { AuditResult } from "@/lib/auditEngine";

export async function saveAuditResult(result: AuditResult): Promise<void> {
  const { error } = await supabase
    .from("audits")
    .insert({
      id: result.id,
      tools_data: result.inputData,
      results: result,
    });

  if (error) {
    console.error("Error saving audit result:", error);
    throw new Error("Failed to save audit result to Supabase");
  }
}

export async function getAuditResult(id: string): Promise<AuditResult | null> {
  const { data, error } = await supabase
    .from("audits")
    .select("results")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    console.error("Error fetching audit result:", error);
    throw new Error("Failed to fetch audit result from Supabase");
  }

  return data.results as AuditResult;
}
