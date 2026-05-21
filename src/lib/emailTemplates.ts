import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM = "SpendLens <onboarding@resend.dev>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://yoursite.com";

interface AffectedAudit {
  auditId: string;
  changedTools: string[];
}

interface SendReauditEmailParams {
  email: string;
  affected: AffectedAudit[];
  currentSnapshot: { version: string };
}

export async function sendReauditEmail({
  email,
  affected,
  currentSnapshot,
}: SendReauditEmailParams): Promise<void> {
  const allChangedTools = [...new Set(affected.flatMap((a) => a.changedTools))];
  const toolList = allChangedTools.join(", ");

  // Use the first audit ID for the re-run link
  // (if they have multiple affected audits, link to the most recent one)
  const primaryAuditId = affected[affected.length - 1].auditId;
  const diffUrl = `${BASE_URL}/audit/${primaryAuditId}/diff`;

  const auditLinks = affected
    .map(
      (a) =>
        `<li><a href="${BASE_URL}/audit/${a.auditId}/diff">Re-run audit ${a.auditId.slice(0, 8)}...</a> — pricing changed for: ${a.changedTools.join(", ")}</li>`
    )
    .join("");

  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Your SpendLens audit is out of date — ${toolList} pricing has changed`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your AI spend audit needs a refresh</h2>
        <p>Pricing has changed for: <strong>${toolList}</strong></p>
        <p>
          Your previous audit was based on pricing data from ${currentSnapshot.version}.
          These changes may affect which tools we'd recommend for your stack.
        </p>

        <h3>Affected audits</h3>
        <ul>${auditLinks}</ul>

        <p style="margin-top: 24px;">
          <a href="${diffUrl}" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Re-run your audit
          </a>
        </p>

        <hr style="margin-top: 40px; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="font-size: 12px; color: #6b7280;">
          You're receiving this because you ran an audit on SpendLens.
          <a href="${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error(`Resend error for ${email}:`, error);
    throw new Error(`Failed to send email to ${email}`);
  }
}