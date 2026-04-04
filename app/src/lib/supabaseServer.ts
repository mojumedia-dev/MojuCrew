import { createClient } from "@supabase/supabase-js";

// Server-side client — uses secret key, never exposed to the browser.
export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}
