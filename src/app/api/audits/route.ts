import { NextResponse } from "next/server";

import { runAudit } from "@/lib/auditEngine";
import { saveAuditResult } from "@/lib/auditStore.server";
import { generateAuditSummary } from "@/lib/aiService";
import type { SpendFormData } from "@/types";

export async function POST(request: Request) {
  console.log("API POST /api/audits triggered, GEMINI_API_KEY defined:", !!process.env.GEMINI_API_KEY);
  const data = (await request.json()) as SpendFormData;
  const result = runAudit(data);
  
  // Generate AI Summary
  result.aiSummary = await generateAuditSummary(result);
  
  await saveAuditResult(result, data.email);

  return NextResponse.json({ id: result.id }, { status: 201 });
}
