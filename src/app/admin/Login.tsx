"use client";

import { useActionState } from "react";
import { adminLogin } from "./actions";

export default function Login() {
  const [state, action, pending] = useActionState(adminLogin, null as { error?: string } | null);
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <form action={action} className="w-full max-w-sm rounded-2xl border border-gold/40 p-8 shadow-card">
        <h1 className="font-display text-3xl text-red">Admin</h1>
        <p className="mt-1 text-sm text-ink-soft">Stuti &amp; Rushil · RSVP dashboard</p>
        <input
          name="secret"
          type="password"
          placeholder="Password"
          autoFocus
          className="mt-6 w-full rounded-xl border border-gold/40 bg-cream-deep/30 px-4 py-2.5 outline-none focus:border-red"
        />
        {state?.error && <p className="mt-2 text-sm text-red-deep">{state.error}</p>}
        <button
          disabled={pending}
          className="mt-4 w-full rounded-full bg-red py-2.5 font-display text-lg text-cream disabled:opacity-60"
        >
          {pending ? "…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
