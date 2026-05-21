import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { detectPricingChanges, getCurrentPricingSnapshot } from "@/lib/pricingCatalog";
import { sendReauditEmail } from "@/lib/emailTemplates";

export async function POST() {
  // 1. Fetch all audits that haven't been notified yet and have an email
  const { data: audits, error } = await supabase
    .from("audits")
    .select("id, user_email, pricing_snapshot, results")
    .not("user_email", "is", null)
    .is("notified_at", null);

  if (error) {
    console.error("Error fetching audits:", error);
    return NextResponse.json({ error: "Failed to fetch audits" }, { status: 500 });
  }

  if (!audits || audits.length === 0) {
    return NextResponse.json({ message: "No audits to check", notified: 0 });
  }

  // 2. Group by email, find which ones have stale pricing
  const affectedByEmail = new Map<string, { auditId: string; changedTools: string[] }[]>();

  for (const audit of audits) {
    if (!audit.pricing_snapshot) continue;

    const changedTools = detectPricingChanges(audit.pricing_snapshot);
    if (changedTools.length === 0) continue;

    const email = audit.user_email as string;
    if (!affectedByEmail.has(email)) {
      affectedByEmail.set(email, []);
    }
    affectedByEmail.get(email)!.push({ auditId: audit.id, changedTools });
  }

  if (affectedByEmail.size === 0) {
    return NextResponse.json({ message: "No pricing changes detected", notified: 0 });
  }

  // 3. Send one consolidated email per user
  const currentSnapshot = getCurrentPricingSnapshot();
  const notifiedIds: string[] = [];

  for (const [email, affected] of affectedByEmail) {
    try {
      await sendReauditEmail({ email, affected, currentSnapshot });

      // 4. Mark all their affected audits as notified
      const ids = affected.map((a) => a.auditId);
    const { error: updateError } = await supabase
        .from("audits")
        .update({ notified_at: new Date().toISOString() })
        .in("id", ids);

    if (updateError) {
        console.error("Failed to update notified_at:", updateError);    
    }

      notifiedIds.push(...ids);
    } catch (err) {
      console.error(`Failed to notify ${email}:`, err);
    }
  }

  return NextResponse.json({
    message: "Detection complete",
    notified: notifiedIds.length,
    emails_sent: affectedByEmail.size,
  });
}