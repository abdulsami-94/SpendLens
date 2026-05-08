import { NextResponse } from "next/server";

import { getAuditResult } from "@/lib/auditStore.server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const result = await getAuditResult(id);

  if (!result) {
    return NextResponse.json(
      { message: "Audit result not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
