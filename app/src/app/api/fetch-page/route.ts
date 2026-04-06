import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

function extractText(html: string): string {
  // Remove script, style, nav, header, footer, aside blocks entirely
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // Convert block elements to newlines
  text = text
    .replace(/<\/?(p|div|section|article|h[1-6]|li|br|tr)[^>]*>/gi, "\n")
    .replace(/<\/?(ul|ol|table)[^>]*>/gi, "\n");

  // Strip remaining tags
  text = text.replace(/<[^>]+>/g, "");

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");

  // Collapse whitespace
  text = text
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Cap at 8000 chars to keep knowledge base manageable
  if (text.length > 8000) {
    text = text.slice(0, 8000) + "\n\n[Content truncated — paste more sections manually if needed]";
  }

  return text;
}

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await req.json() as { url: string };
  if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

  // Basic URL validation
  let parsed: URL;
  try {
    parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Invalid protocol");
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const res = await fetch(parsed.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MojuChat/1.0)",
        "Accept": "text/html",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Page returned ${res.status}` }, { status: 400 });
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return NextResponse.json({ error: "URL must point to an HTML page" }, { status: 400 });
    }

    const html = await res.text();
    const text = extractText(html);

    if (text.length < 50) {
      return NextResponse.json({ error: "Could not extract readable content from this page" }, { status: 400 });
    }

    return NextResponse.json({ text, charCount: text.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch page";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
