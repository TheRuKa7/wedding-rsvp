import { currentSecret } from "../actions";
import { supabase } from "@/lib/supabase";

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const secret = await currentSecret();
  if (!secret) return new Response("Unauthorized", { status: 401 });

  const { data, error } = await supabase.rpc("admin_guests", { p_secret: secret });
  if (error) return new Response("Error", { status: 500 });

  const cols = [
    "guest",
    "age_band",
    "party",
    "email",
    "phone",
    "source",
    "status",
    "is_approved",
    "dedup_status",
  ];
  const header = cols.join(",");
  const rows = (data ?? []).map((r: Record<string, unknown>) =>
    cols.map((c) => csvCell(r[c])).join(","),
  );
  const csv = [header, ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="stuti-rushil-rsvps.csv"`,
    },
  });
}
