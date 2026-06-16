"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { ALL_EVENT_SLUGS, couple } from "@/lib/content";
import { submitRsvp, type RsvpInput } from "@/app/actions";
import { MotifDivider, OmMark, HexagonMonogram } from "./motifs";

type PrelistedGuest = { id: string; name: string; age_band: string };
type Party = {
  party_id: string;
  display_name: string | null;
  allow_companions: boolean;
  max_party_size: number;
  guests: PrelistedGuest[];
} | null;

type Extra = { name: string; age_band: "adult" | "child" | "infant" };

const card =
  "relative mx-auto max-w-xl rounded-[28px] border border-gold/40 bg-cream p-7 shadow-card sm:p-10";

export default function Rsvp({ token, party }: { token: string | null; party: Party }) {
  const prelisted = party?.guests ?? [];
  const [phase, setPhase] = useState<"ask" | "form" | "done">("ask");
  const [attending, setAttending] = useState(true);

  // primary + extras seeded from a pre-listed household when available
  const [primaryName, setPrimaryName] = useState(prelisted[0]?.name ?? "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [extras, setExtras] = useState<Extra[]>(
    prelisted.slice(1).map((g) => ({ name: g.name, age_band: (g.age_band as Extra["age_band"]) ?? "adult" })),
  );
  const [meal, setMeal] = useState("No preference");
  const [notes, setNotes] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ attending: boolean; count: number } | null>(null);

  const addExtra = () => setExtras((e) => [...e, { name: "", age_band: "adult" }]);
  const setExtra = (i: number, patch: Partial<Extra>) =>
    setExtras((e) => e.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const removeExtra = (i: number) => setExtras((e) => e.filter((_, idx) => idx !== i));

  async function onSubmit() {
    setError(null);
    setBusy(true);
    const input: RsvpInput = {
      token,
      attending,
      meal,
      notes,
      // events aren't shown yet; an "attending" guest is recorded across the 2 days
      events: [...ALL_EVENT_SLUGS],
      primary: { name: primaryName, email, phone, age_band: "adult" },
      companions: extras,
    };
    const res = await submitRsvp(input);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setResult({ attending: res.attending, count: res.guestCount });
    setPhase("done");
  }

  return (
    <section id="rsvp" className="section-pad relative px-6">
      <LazyMotion features={domAnimation}>
        <div className="mx-auto mb-10 max-w-xl text-center">
          <p className="font-script text-xl text-saffron">आपका स्वागत है</p>
          <h2 className="mt-2 font-display text-4xl text-red sm:text-5xl">Will you be there?</h2>
          <MotifDivider className="mt-6" />
        </div>

        {/* ornamental corners */}
        <AnimatePresence mode="wait">
          {phase === "ask" && (
            <m.div
              key="ask"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className={`${card} text-center`}
            >
              <OmMark className="text-3xl text-saffron" />
              <p className="mt-3 text-lg leading-relaxed text-ink/85">
                {party?.display_name ? (
                  <>
                    Dear{" "}
                    <span className="font-display text-2xl text-red">{party.display_name}</span>,
                    it would mean so much to have you with us.
                  </>
                ) : (
                  <>It would mean the world to us to have you there.</>
                )}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    setAttending(true);
                    setPhase("form");
                  }}
                  className="rounded-full bg-red px-8 py-3 font-display text-lg text-cream transition-transform hover:scale-[1.03]"
                >
                  Yes, I&apos;ll be there
                </button>
                <button
                  onClick={() => {
                    setAttending(false);
                    setPhase("form");
                  }}
                  className="rounded-full border border-gold px-8 py-3 font-display text-lg text-ink transition-colors hover:bg-cream-deep"
                >
                  Sadly, I can&apos;t make it
                </button>
              </div>
            </m.div>
          )}

          {phase === "form" && (
            <m.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className={card}
            >
              <Field label="Your full name">
                <input
                  className={inputCls}
                  value={primaryName}
                  onChange={(e) => setPrimaryName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  autoComplete="name"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email" hint="so we never count you twice">
                  <input
                    className={inputCls}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    inputMode="email"
                    autoComplete="email"
                  />
                </Field>
                <Field label="Phone" hint="so we never count you twice">
                  <input
                    className={inputCls}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 …"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </Field>
              </div>

              {attending && (
                <>
                  {/* family members */}
                  <div className="mt-3">
                    <p className="text-base font-medium text-ink">Who is coming with you?</p>
                    <p className="mt-1 text-sm text-ink-soft">
                      {prelisted.length > 1
                        ? "We have added your family below. Please add or remove anyone so the names are just right."
                        : "Add everyone joining you by name, so we can save a seat for each of them."}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {extras.map((x, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <input
                            className={`${inputCls} flex-1`}
                            value={x.name}
                            onChange={(e) => setExtra(i, { name: e.target.value })}
                            placeholder="Their full name"
                          />
                          <select
                            className={`${inputCls} w-24`}
                            value={x.age_band}
                            onChange={(e) =>
                              setExtra(i, { age_band: e.target.value as Extra["age_band"] })
                            }
                          >
                            <option value="adult">Adult</option>
                            <option value="child">Child</option>
                            <option value="infant">Infant</option>
                          </select>
                          <button
                            onClick={() => removeExtra(i)}
                            className="px-2 text-red-deep"
                            aria-label="Remove"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                    {(party?.allow_companions ?? true) && (
                      <button
                        onClick={addExtra}
                        className="mt-3 w-full rounded-xl border border-dashed border-gold/60 py-2.5 text-sm font-medium text-red transition-colors hover:bg-cream-deep/40"
                      >
                        + Add a guest by name
                      </button>
                    )}
                  </div>

                  <Field label="Meal preference" hint="optional, it just helps us plan">
                    <div className="flex flex-wrap gap-2">
                      {["Vegetarian", "Non-vegetarian", "Jain", "No preference"].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMeal(m)}
                          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                            meal === m
                              ? "border-pine bg-pine text-cream"
                              : "border-gold/50 text-ink-soft hover:border-pine"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </Field>
                </>
              )}

              <Field
                label={attending ? "A little note for us (optional)" : "Leave us a message"}
              >
                <textarea
                  className={`${inputCls} min-h-20`}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={attending ? "We are so happy for you both!" : "Sending you all my love."}
                />
              </Field>

              {error && <p className="mt-3 text-sm text-red-deep">{error}</p>}

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setPhase("ask")}
                  className="text-sm text-ink-soft hover:text-red"
                >
                  Back
                </button>
                <button
                  onClick={onSubmit}
                  disabled={busy}
                  className="rounded-full bg-red px-8 py-3 font-display text-lg text-cream transition-transform hover:scale-[1.03] disabled:opacity-60"
                >
                  {busy ? "Sending…" : "Send my RSVP"}
                </button>
              </div>
            </m.div>
          )}

          {phase === "done" && result && (
            <m.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${card} text-center`}
            >
              <HexagonMonogram className="mx-auto h-14 w-14 text-gold" />
              {result.attending ? (
                <>
                  <h3 className="mt-4 font-display text-4xl text-red">We can&apos;t wait!</h3>
                  <p className="mt-3 text-ink/85">
                    Thank you, we have saved your spot
                    {result.count > 1 ? ` for all ${result.count} of you` : ""}. It truly makes
                    us so happy.
                  </p>
                  <div className="mt-6 rounded-2xl border border-dashed border-gold/60 bg-cream-deep/40 p-5">
                    <p className="font-script text-lg text-saffron">शुभ विवाह</p>
                    <p className="mt-1 font-display text-2xl text-ink">
                      Your invitation card is on its way
                    </p>
                    <p className="mt-1 text-sm uppercase tracking-[0.25em] text-gold-deep">
                      Coming soon
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="mt-4 font-display text-4xl text-red">We&apos;ll miss you</h3>
                  <p className="mt-3 text-ink/85">
                    We are sad you can&apos;t be with us, but thank you for letting us know. You
                    will be in our hearts on the day.
                  </p>
                  <p className="mt-4 font-script text-xl text-saffron">
                    {couple.bride.first} &amp; {couple.groom.first}
                  </p>
                </>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </section>
  );
}

const inputCls =
  "mt-1 w-full rounded-xl border border-gold/40 bg-cream-deep/30 px-4 py-2.5 text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-red";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-4 block">
      <span className="text-sm font-medium text-ink">
        {label}
        {hint && <span className="ml-2 text-xs font-normal text-ink-soft">· {hint}</span>}
      </span>
      {children}
    </label>
  );
}
