import { notFound } from "next/navigation";
import { getAuditResult } from "@/lib/auditStore.server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { runAudit } from "@/lib/auditEngine";
import { generateAuditSummary } from "@/lib/aiService";
import { detectPricingChanges, getCurrentPricingSnapshot } from "@/lib/pricingCatalog";
import DiffClient from "./DiffClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DiffPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch original audit with pricing snapshot
  const { data, error } = await supabase
    .from("audits")
    .select("results, pricing_snapshot, created_at, user_email, tools_data")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const oldResult = data.results;
  const oldSnapshot = data.pricing_snapshot;

  // Check what changed
  const changedTools = oldSnapshot ? detectPricingChanges(oldSnapshot) : [];

  // Re-run audit with current pricing
  const newResult = runAudit(data.tools_data);
  newResult.aiSummary = await generateAuditSummary(newResult);

  const currentSnapshot = getCurrentPricingSnapshot();

  return (
    <DiffClient
      oldResult={oldResult}
      newResult={newResult}
      changedTools={changedTools}
      oldSnapshot={oldSnapshot}
      currentSnapshot={currentSnapshot}
      auditId={id}
      createdAt={data.created_at}
    />
  );
}