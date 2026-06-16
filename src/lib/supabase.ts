import { createClient } from "@supabase/supabase-js";

/**
 * Single anon-key client. All privileged work happens inside SECURITY DEFINER
 * RPCs (submit_rsvp, get_party_by_token, admin_*), so no service-role secret is
 * needed. Admin RPCs self-gate on ADMIN_SECRET, passed only from server code.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  // Surfaces a clear error during build/dev if env is missing.
  console.warn("Supabase env vars are not set — RSVP will not work until configured.");
}

export const supabase = createClient(url ?? "", anon ?? "", {
  auth: { persistSession: false },
});
