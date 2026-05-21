import { supabaseAdmin as supabase } from "@/lib/supabase";
import type { AuditResult } from "@/lib/auditEngine";
import { getCurrentPricingSnapshot } from "@/lib/pricingCatalog";

export type PublicAuditResult = Omit<AuditResult, "inputData"> & {
  createdAt: string;
};

const sensitiveKeys = new Set(["email", "company", "companyName"]);

function stripSensitiveValues<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripSensitiveValues(item)) as unknown as T;
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((acc, [key, entryValue]) => {
      if (sensitiveKeys.has(key)) {
        return acc;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      acc[key as keyof typeof acc] = stripSensitiveValues(entryValue) as any;
      return acc;
    }, {} as Record<string, unknown>) as T;
  }

  return value;
}

export function sanitizeAuditResult(result: AuditResult): PublicAuditResult {
  const cloned = JSON.parse(JSON.stringify(result)) as Record<string, unknown>;
  delete cloned.inputData;
  return stripSensitiveValues(cloned) as PublicAuditResult;
}

export async function saveAuditResult(result: AuditResult, userEmail?: string): Promise<void> {
  const { error } = await supabase
    .from("audits")
    .insert({
      id: result.id,
      tools_data: result.inputData,
      results: result,
      user_email: userEmail ?? null,
      pricing_snapshot: getCurrentPricingSnapshot(),
    });

  if (error) {
    console.error("Error saving audit result:", error);
    throw new Error("Failed to save audit result to Supabase");
  }
}

export async function getAuditResult(id: string): Promise<(AuditResult & { createdAt: string }) | null> {
  const { data, error } = await supabase
    .from("audits")
    .select("results, created_at")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    console.error("Error fetching audit result:", error);
    throw new Error("Failed to fetch audit result from Supabase");
  }

  return { ...(data.results as AuditResult), createdAt: data.created_at };
}
