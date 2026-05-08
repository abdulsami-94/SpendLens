import { NextResponse } from "next/server";

import {
  appendLeadCapture,
  type LeadCaptureRecord,
} from "@/lib/leadCaptureStore.server";

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<LeadCaptureRecord>;
  const email = payload.email?.trim().toLowerCase();

  if (!email || !isValidEmail(email) || !payload.auditId) {
    return NextResponse.json(
      { message: "Enter a valid email address." },
      { status: 400 }
    );
  }

  await appendLeadCapture({
    auditId: payload.auditId,
    email,
    submittedAt: new Date().toISOString(),
    type: "notify",
  });

  return NextResponse.json(
    { message: "Saved. We will notify you when pricing shifts." },
    { status: 201 }
  );
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
