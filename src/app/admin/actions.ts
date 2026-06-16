"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

const COOKIE = "admin_session";

export async function currentSecret(): Promise<string | null> {
  const c = await cookies();
  const v = c.get(COOKIE)?.value ?? null;
  return v && v === process.env.ADMIN_SECRET ? v : null;
}

export async function adminLogin(_prev: unknown, formData: FormData) {
  const secret = String(formData.get("secret") ?? "");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return { error: "Incorrect password." };
  }
  const c = await cookies();
  c.set(COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function adminLogout() {
  const c = await cookies();
  c.delete(COOKIE);
  redirect("/admin");
}

async function withSecret<T>(fn: (s: string) => Promise<T>): Promise<T | null> {
  const s = await currentSecret();
  if (!s) return null;
  return fn(s);
}

export async function loadDashboard() {
  return withSecret(async (s) => {
    const [summary, queue, guests] = await Promise.all([
      supabase.rpc("admin_summary", { p_secret: s }),
      supabase.rpc("admin_dedup_queue", { p_secret: s }),
      supabase.rpc("admin_guests", { p_secret: s }),
    ]);
    return {
      summary: summary.data,
      queue: queue.data ?? [],
      guests: guests.data ?? [],
    };
  });
}

export async function mergeGuests(formData: FormData) {
  await withSecret(async (s) => {
    await supabase.rpc("admin_merge", {
      p_secret: s,
      p_keep: String(formData.get("keep")),
      p_merge: String(formData.get("merge")),
    });
  });
  redirect("/admin");
}

export async function rejectCandidate(formData: FormData) {
  await withSecret(async (s) => {
    await supabase.rpc("admin_reject_candidate", {
      p_secret: s,
      p_candidate: String(formData.get("candidate")),
    });
  });
  redirect("/admin");
}

export async function approveParty(formData: FormData) {
  await withSecret(async (s) => {
    await supabase.rpc("admin_approve_party", {
      p_secret: s,
      p_party: String(formData.get("party")),
    });
  });
  redirect("/admin");
}
