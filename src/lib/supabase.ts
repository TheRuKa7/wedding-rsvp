import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client. Used only inside server actions / route handlers,
 * so it can read non-public env names too. All privileged work happens inside
 * SECURITY DEFINER RPCs (submit_rsvp, get_party_by_token, admin_* / verify_admin_password),
 * so the publishable (anon) key is sufficient and safe to ship — RLS denies everything else.
 *
 * The literal fallbacks are the project's PUBLIC url + publishable key (safe to embed),
 * so the app works even if env vars are not configured on the host. The service-role key
 * and database password are never referenced here.
 */
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.RK_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://xmjhcoroliwulnzqzcpa.supabase.co";

const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.RK_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.RK_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_vMhvF8DxnpAGA80vuvDsyw_CnjnIHxt";

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
