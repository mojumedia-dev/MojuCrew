import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabaseServer";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LeadInfo {
  name: string;
  email: string;
}

async function syncLead(config: Record<string, unknown>, name: string, email: string): Promise<void> {
  const platform = config.platform as string;
  const [firstName, ...rest] = name.trim().split(" ");
  const lastName = rest.join(" ");

  try {
    if (platform === "shopify") {
      const storeUrl = (config.shopifyStoreUrl as string)?.replace(/^https?:\/\//, "").replace(/\/$/, "");
      const token = config.shopifyApiToken as string;
      if (!storeUrl || !token) return;
      await fetch(`https://${storeUrl}/admin/api/2024-01/customers.json`, {
        method: "POST",
        headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" },
        body: JSON.stringify({ customer: { first_name: firstName, last_name: lastName || "", email, tags: "MojuChat" } }),
      });

    } else if (platform === "hubspot") {
      const token = config.hubspotToken as string;
      if (!token) return;
      await fetch("https://api.hubspot.com/crm/v3/objects/contacts", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ properties: { firstname: firstName, lastname: lastName || "", email } }),
      });

    } else if (platform === "ghl") {
      const apiKey = config.ghlApiKey as string;
      const locationId = config.ghlLocationId as string;
      if (!apiKey || !locationId) return;
      await fetch("https://services.leadconnectorhq.com/contacts/", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Version": "2021-07-28", "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName: lastName || "", email, locationId }),
      });

    } else if (platform === "mailchimp") {
      const apiKey = config.mailchimpApiKey as string;
      const listId = config.mailchimpListId as string;
      if (!apiKey || !listId) return;
      const dc = apiKey.split("-").pop() ?? "us1";
      await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          merge_fields: { FNAME: firstName, LNAME: lastName || "" },
        }),
      });

    } else if (platform === "woocommerce") {
      const storeUrl = (config.wooStoreUrl as string)?.replace(/\/$/, "");
      const ck = config.wooConsumerKey as string;
      const cs = config.wooConsumerSecret as string;
      if (!storeUrl || !ck || !cs) return;
      await fetch(`${storeUrl}/wp-json/wc/v3/customers`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${ck}:${cs}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, first_name: firstName, last_name: lastName || "" }),
      });

    } else if (platform === "activecampaign") {
      const account = config.acAccountName as string;
      const token = config.acApiToken as string;
      if (!account || !token) return;
      await fetch(`https://${account}.api-us1.com/api/3/contacts`, {
        method: "POST",
        headers: { "Api-Token": token, "Content-Type": "application/json" },
        body: JSON.stringify({ contact: { firstName, lastName: lastName || "", email } }),
      });

    } else if (platform === "wix") {
      const apiKey = config.wixApiKey as string;
      const siteId = config.wixSiteId as string;
      if (!apiKey || !siteId) return;
      await fetch("https://www.wixapis.com/contacts/v4/contacts", {
        method: "POST",
        headers: {
          "Authorization": apiKey,
          "wix-site-id": siteId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          info: {
            name: { first: firstName, last: lastName || "" },
            emails: [{ tag: "MAIN", email }],
          },
        }),
      });
    }
  } catch (e) {
    console.error(`Lead sync error [${platform}]:`, e);
  }
}

function buildSystemPrompt(config: Record<string, unknown>): string {
  const bizName = (config.businessName as string) ?? "this business";
  const industry = (config.industry as string) ?? "";
  const tone = (config.tone as string) ?? "Friendly";
  const bookingUrl = (config.bookingUrl as string) ?? "";
  const knowledgeBase = (config.knowledgeBase as string) ?? "";
  const faqs = (config.faqs as Array<{ q: string; a: string }>) ?? [];
  const captureLeads = config.captureLeads as boolean;

  const toneGuide: Record<string, string> = {
    Professional: "Maintain a professional, polished tone.",
    Friendly: "Be warm, approachable, and friendly.",
    Casual: "Keep it casual and conversational.",
    Concise: "Be brief and to the point.",
  };

  let prompt = `You are a helpful AI assistant for ${bizName}${industry ? `, a ${industry} business` : ""}.\n\n`;
  prompt += `Tone: ${toneGuide[tone] ?? toneGuide.Friendly}\n\n`;

  if (knowledgeBase) {
    prompt += `Knowledge base:\n${knowledgeBase}\n\n`;
  }

  if (faqs.length > 0) {
    prompt += `Frequently asked questions:\n`;
    for (const faq of faqs) {
      if (faq.q && faq.a) prompt += `Q: ${faq.q}\nA: ${faq.a}\n`;
    }
    prompt += "\n";
  }

  if (bookingUrl) {
    prompt += `Booking URL: ${bookingUrl} — guide users here when they want to book, schedule, or make an appointment.\n\n`;
  }

  prompt += `Guidelines:\n`;
  prompt += `- Answer questions about ${bizName} based on the knowledge base above.\n`;
  prompt += `- If you don't know the answer, say so honestly and suggest the user contact ${bizName} directly.\n`;
  prompt += `- Keep responses concise. Use short paragraphs with a blank line between them. Never write a wall of text.\n`;
  prompt += `- For lists, use short bullet points (- item) on separate lines.\n`;
  prompt += `- Do NOT use markdown formatting. No asterisks for bold or italic, no backticks, no # headers.\n`;
  prompt += `- Never construct, guess, or make up URLs. Only share URLs explicitly provided in this prompt.\n`;
  if (bookingUrl) {
    prompt += `- When someone wants to book or schedule, direct them to ${bookingUrl}.\n`;
  }
  if (captureLeads) {
    prompt += `- At a natural point in the conversation, politely ask for the user's name and email so the team can follow up.\n`;
  }

  return prompt;
}

export async function POST(req: NextRequest) {
  // CORS for cross-origin widget requests
  const origin = req.headers.get("origin") ?? "*";

  try {
    const { key, messages, leadInfo } = await req.json() as {
      key: string;
      messages: Message[];
      leadInfo?: LeadInfo;
    };

    if (!key) {
      return NextResponse.json({ error: "Missing key" }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": origin },
      });
    }

    const supabase = createServerSupabase();

    // Look up bot config by chat key
    const { data: rows, error: dbErr } = await supabase
      .from("bot_configs")
      .select("config, user_id")
      .eq("bot_id", "chat");

    const row = rows?.find(
      (r) => (r.config as Record<string, unknown>).chatKey === key
    );

    if (dbErr || !row) {
      return NextResponse.json({ error: "Invalid key" }, {
        status: 404,
        headers: { "Access-Control-Allow-Origin": origin },
      });
    }

    const config = row.config as Record<string, unknown>;

    // Sync lead to the configured platform
    if (leadInfo?.name && leadInfo?.email) {
      await syncLead(config, leadInfo.name, leadInfo.email);
    }

    const systemPrompt = buildSystemPrompt(config);

    // Call Claude API
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: systemPrompt,
        messages: messages.slice(-20), // keep last 20 messages for context
      }),
    });

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      console.error("Claude API error:", err);
      return NextResponse.json({ error: "AI unavailable" }, {
        status: 502,
        headers: { "Access-Control-Allow-Origin": origin },
      });
    }

    const claudeData = await claudeRes.json() as {
      content: Array<{ type: string; text: string }>;
    };
    const reply = claudeData.content.find((c) => c.type === "text")?.text ?? "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply }, {
      headers: { "Access-Control-Allow-Origin": origin },
    });
  } catch (e) {
    console.error("Chat route error:", e);
    return NextResponse.json({ error: "Server error" }, {
      status: 500,
      headers: { "Access-Control-Allow-Origin": origin },
    });
  }
}

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "*";
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
