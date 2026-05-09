import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      email: string;
      company?: string;
      role?: string;
      teamSize?: string;
      auditId: string;
    };

    const { email, company, role, teamSize, auditId } = body;

    // Save lead to Supabase
    const { error: dbError } = await supabase.from("leads").insert([
      {
        email,
        company: company || null,
        role: role || null,
        team_size: teamSize || null,
        audit_id: auditId,
      },
    ]);

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 }
      );
    }

    // Send confirmation email
    const { error: emailError } = await resend.emails.send({
      from: "SpendLens <onboarding@resend.dev>",
      to: email,
      subject: "Your AI Spend Audit is Ready",
      html: `
        <h2>Your audit is complete!</h2>
        <p>We've analyzed your AI tool spend and identified potential savings.</p>
        <p><a href="https://yoursite.com/audit/${auditId}">View your full audit report</a></p>
        <p>Questions? Reply to this email or visit our help center.</p>
        <p>— SpendLens Team</p>
      `,
    });

    if (emailError) {
      console.error("Email error:", emailError);
      // Don't fail the request if email fails, lead is saved
    }

    return NextResponse.json(
      { success: true, message: "Lead captured and email sent" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { error: "Failed to process lead" },
      { status: 500 }
    );
  }
}
