// Resend wrapper for transactional email. Keeps sender + retries + logging
// in one place so callers don't have to think about it.
//
// Required env: RESEND_API_KEY, RESEND_FROM (e.g. "MojuCrew <alerts@yourdomain.com>")

interface SendOpts {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(opts: SendOpts): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not configured" };
  const from = process.env.RESEND_FROM ?? "MojuCrew <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    return { ok: false, error: `${res.status}: ${err.slice(0, 200)}` };
  }
  return { ok: true };
}

interface NegativeReviewAlertOpts {
  to: string;
  businessName: string;
  locationName: string;
  rating: number;
  reviewerName: string | null;
  reviewText: string | null;
  postedAt: string | null;
  dashboardUrl: string;
}

export async function sendNegativeReviewAlert(
  opts: NegativeReviewAlertOpts,
): Promise<{ ok: boolean; error?: string }> {
  const stars = "★".repeat(opts.rating) + "☆".repeat(5 - opts.rating);
  const subject = `${opts.rating}-star review at ${opts.locationName}`;
  const reviewer = opts.reviewerName ?? "Anonymous";
  const text = opts.reviewText?.trim() ?? "(no comment)";
  const when = opts.postedAt
    ? new Date(opts.postedAt).toLocaleString()
    : "just now";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; max-width: 560px; margin: 0 auto;">
      <div style="border-left: 4px solid #dc2626; padding: 0.5rem 0 0.5rem 1rem; margin-bottom: 1.5rem;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #dc2626; font-weight: 700;">Negative review</div>
        <div style="font-size: 22px; font-weight: 700; margin-top: 0.25rem;">${escapeHtml(opts.businessName)}</div>
        <div style="font-size: 14px; color: #666;">${escapeHtml(opts.locationName)}</div>
      </div>
      <div style="background: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
        <div style="font-size: 18px; color: #d97706; margin-bottom: 0.5rem;">${stars} (${opts.rating}/5)</div>
        <div style="font-size: 13px; color: #666; margin-bottom: 0.75rem;">From <strong>${escapeHtml(reviewer)}</strong> · ${when}</div>
        <div style="font-size: 15px; line-height: 1.6; color: #1a1a1a; white-space: pre-wrap;">${escapeHtml(text)}</div>
      </div>
      <p style="font-size: 14px; color: #666; line-height: 1.5;">
        MojuReviews flagged this for human attention rather than auto-replying. Open the dashboard to draft a response, or reply directly in Google Business Profile.
      </p>
      <p style="margin-top: 1.5rem;">
        <a href="${opts.dashboardUrl}" style="display: inline-block; background: #1a1a1a; color: #fff; text-decoration: none; padding: 0.75rem 1.25rem; border-radius: 6px; font-weight: 600; font-size: 14px;">Open MojuReviews</a>
      </p>
    </div>
  `;

  const plain = `Negative review at ${opts.businessName} — ${opts.locationName}\n\n${opts.rating}/5 stars from ${reviewer}\n${when}\n\n${text}\n\nOpen MojuReviews: ${opts.dashboardUrl}`;

  return sendEmail({ to: opts.to, subject, html, text: plain });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
