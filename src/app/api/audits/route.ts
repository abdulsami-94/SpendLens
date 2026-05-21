import { NextResponse } from "next/server";

import { runAudit } from "@/lib/auditEngine";
import { saveAuditResult } from "@/lib/auditStore.server";
import { generateAuditSummary } from "@/lib/aiService";
import type { SpendFormData } from "@/types";

export async function POST(request: Request) {
  console.log("API POST /api/audits triggered, GEMINI_API_KEY defined:", !!process.env.GEMINI_API_KEY);
  const body = await request.json() as SpendFormData & { email?: string };
  const result = runAudit(body);
  
  result.aiSummary = await generateAuditSummary(result);
  
  await saveAuditResult(result, body.email);

  return NextResponse.json({ id: result.id }, { status: 201 });
}