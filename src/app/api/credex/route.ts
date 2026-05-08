import { NextResponse } from "next/server";

import {
  appendLeadCapture,
  type LeadCaptureRecord,
} from "@/lib/leadCaptureStore.server";

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<LeadCaptureRecord>;
  const email = payload.email?.trim().toLowerCase();
  const company = payload.company?.trim();

  if (!email || !company || !isValidEmail(email) || !payload.auditId) {
    return NextResponse.json(
      { message: "Add a work email and company name." },
      { status: 400 }
    );
  }

  await appendLeadCapture({
    auditId: payload.auditId,
    company,
    email,
    monthlySavings: payload.monthlySavings,
    submittedAt: new Date().toISOString(),
    type: "credex",
  });

  return NextResponse.json(
    {
      message: "Saved. Credex can now follow up with bulk-credit options.",
    },
    { status: 201 }
  );
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
