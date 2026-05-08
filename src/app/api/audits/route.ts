import { NextResponse } from "next/server";

import { runAudit } from "@/lib/auditEngine";
import { saveAuditResult } from "@/lib/auditStore.server";
import type { SpendFormData } from "@/types";

export async function POST(request: Request) {
  const data = (await request.json()) as SpendFormData;
  const result = runAudit(data);
  await saveAuditResult(result);

  return NextResponse.json({ id: result.id }, { status: 201 });
}
