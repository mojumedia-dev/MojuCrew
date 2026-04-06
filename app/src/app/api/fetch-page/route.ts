import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Boilerplate patterns to drop entirely
const JUNK_PATTERNS = [
  /^skip\s+to/i,
  /^cookie/i,
  /^accept\s+(all\s+)?cookies?/i,
  /^we use cookies/i,
  /privacy\s+policy/i,
  /terms\s+(of\s+)?(service|use)/i,
  /^©\s*\d{4}/,
  /^copyright\s+©?/i,
  /^all rights reserved/i,
  /^follow\s+us/i,
  /^subscribe\s+(to\s+our\s+)?newsletter/i,
  /^sign\s+up\s+for/i,
  /^(click|tap)\s+here/i,
  /^read\s+more/i,
  /^learn\s+more/i,
  /^view\s+all/i,
  /^see\s+all/i,
  /^back\s+to\s+top/i,
  /^share\s+(this|on)/i,
  /^(facebook|twitter|instagram|linkedin|youtube|tiktok|pinterest)$/i,
  /^(home|about|contact|blog|shop|cart|menu|search)$/i,
  /^\s*[\|\/•\-–—]\s*$/,
  /^\s*\d+\s*$/, // lone numbers
  // Shopify / e-commerce UI
  /^regular\s+price/i,
  /^sale\s+price/i,
  /^unit\s+price/i,
  /^sold\s+out/i,
  /^add\s+to\s+cart/i,
  /^add\s+to\s+bag/i,
  /^out\s+of\s+stock/i,
  /^choosing\s+a\s+selection/i,
  /^opens\s+in\s+a\s+new/i,
  /^quantity/i,
  /^(view|check\s+out|continue\s+shopping)$/i,
  /^item\s+added\s+to/i,
  /^view\s+cart$/i,
  /^×$|^&times;$/,
];

function isJunkLine(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length < 3) return true;
  // Very short lines that look like nav items (under 25 chars, no sentence punctuation)
  if (trimmed.length < 25 && !/[.?!,:;]/.test(trimmed) && /^[A-Z]/.test(trimmed) && trimmed.split(" ").length <= 3) {
    // Keep short lines that look like labels (e.g. "Monday–Friday", "$45/session")
    if (!/[$€£\d–\-@]/.test(trimmed)) return true;
  }
  return JUNK_PATTERNS.some((p) => p.test(trimmed));
}

function extractText(html: string): string {
  // Remove entire noisy blocks
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "")
    .replace(/<form[\s\S]*?<\/form>/gi, "")
    // Shopify-specific: product card price blocks
    .replace(/<[^>]*class="[^"]*price[^"]*"[\s\S]*?<\/[^>]+>/gi, "")
    .replace(/<[^>]*class="[^"]*product-card[^"]*"[\s\S]*?<\/[^>]+>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // Convert block elements to newlines
  text = text
    .replace(/<\/?(p|div|section|article|h[1-6]|li|br|tr|td|th)[^>]*>/gi, "\n")
    .replace(/<\/?(ul|ol|table|tbody|thead)[^>]*>/gi, "\n");

  // Strip remaining tags
  text = text.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&#\d+;/g, " ")  // other numeric entities
    .replace(/&\w+;/g, " ");  // any remaining entities

  // Strip non-printable / weird unicode characters
  // eslint-disable-next-line no-control-regex
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Collapse inline whitespace
  text = text.replace(/\t/g, " ").replace(/[ ]{2,}/g, " ");

  // Split into lines, filter junk, deduplicate
  const seen = new Set<string>();
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => {
      if (!l || isJunkLine(l)) return false;
      if (seen.has(l.toLowerCase())) return false;
      seen.add(l.toLowerCase());
      return true;
    });

  text = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();

  // Cap at 8000 chars
  if (text.length > 8000) {
    text = text.slice(0, 8000) + "\n\n[Content truncated — add more URLs or paste extra sections manually]";
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
