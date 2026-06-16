"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";

export type Companion = { name: string; age_band?: "adult" | "child" | "infant" };

export type RsvpInput = {
  token?: string | null;
  attending: boolean;
  meal?: string;
  notes?: string;
  events?: string[];
  primary: { name: string; email?: string; phone?: string; age_band?: "adult" | "child" | "infant" };
  companions?: Companion[];
};

export type RsvpResult =
  | { ok: true; attending: boolean; guestCount: number; token: string }
  | { ok: false; error: string };

async function ipHash(): Promise<string> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "0.0.0.0").split(",")[0].trim();
  return createHash("sha256").update(`${ip}:stuti-rushil`).digest("hex");
}

export async function submitRsvp(input: RsvpInput): Promise<RsvpResult> {
  const name = input.primary?.name?.trim();
  if (!name || name.length < 2) return { ok: false, error: "Please enter your full name." };
  if (input.attending && (!input.events || input.events.length === 0))
    return { ok: false, error: "Please choose at least one celebration to attend." };

  try {
    const allowed = await supabase.rpc("check_rate_limit", { p_ip_hash: await ipHash() });
    if (allowed.data === false)
      return { ok: false, error: "That is a lot of tries in a short time. Please give it a few minutes and try again." };

    const { data, error } = await supabase.rpc("submit_rsvp", {
      payload: {
        token: input.token ?? null,
        attending: input.attending,
        meal: input.meal ?? null,
        notes: input.notes ?? null,
        events: input.attending ? (input.events ?? []) : [],
        primary: {
          name,
          email: input.primary.email ?? null,
          phone: input.primary.phone ?? null,
          age_band: input.primary.age_band ?? "adult",
        },
        companions: (input.companions ?? [])
          .filter((c) => c.name?.trim())
          .map((c) => ({ name: c.name.trim(), age_band: c.age_band ?? "adult" })),
      },
    });

    if (error) return { ok: false, error: "Something went wrong saving your RSVP. Please try again." };
    return {
      ok: true,
      attending: data.attending,
      guestCount: data.guest_count ?? 1,
      token: data.token,
    };
  } catch {
    return { ok: false, error: "Something went wrong on our side. Please try again in a moment." };
  }
}

/** Look up a pre-listed household by magic token (for the hybrid "claim" prefill). */
export async function getParty(token: string) {
  if (!token) return null;
  const { data } = await supabase.rpc("get_party_by_token", { p_token: token });
  return data ?? null;
}
