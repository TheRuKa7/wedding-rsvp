"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { ALL_EVENT_SLUGS, couple, wedding } from "@/lib/content";
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

type Age = "adult" | "child" | "infant";
type Guest = { name: string; age_band: Age };

const AGES: { v: Age; label: string }[] = [
  { v: "adult", label: "Adult" },
  { v: "child", label: "Child" },
  { v: "infant", label: "Infant" },
];

const card =
  "relative mx-auto max-w-xl rounded-[28px] border border-gold/40 bg-cream p-7 shadow-card sm:p-10";
const fieldInput =
  "mt-1.5 w-full rounded-xl border border-gold/40 bg-cream-deep/25 px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-red";

export default function Rsvp({ token, party }: { token: string | null; party: Party }) {
  const prelisted = party?.guests ?? [];
  const [phase, setPhase] = useState<"ask" | "form" | "done">("ask");
  const [attending, setAttending] = useState(true);

  const [primaryName, setPrimaryName] = useState(prelisted[0]?.name ?? "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Additional people in the party (you are counted separately via your name above).
  const [guests, setGuests] = useState<Guest[]>(
    prelisted.length > 1
      ? prelisted.slice(1).map((g) => ({ name: g.name, age_band: (g.age_band as Age) ?? "adult" }))
      : [],
  );

  const [meal, setMeal] = useState("No preference");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ attending: boolean; count: number } | null>(null);

  const addGuest = () => setGuests((g) => [...g, { name: "", age_band: "adult" }]);
  const patchGuest = (i: number, p: Partial<Guest>) =>
    setGuests((g) => g.map((x, idx) => (idx === i ? { ...x, ...p } : x)));
  const removeGuest = (i: number) => setGuests((g) => g.filter((_, idx) => idx !== i));

  async function onSubmit() {
    setError(null);
    setBusy(true);
    const input: RsvpInput = {
      token,
      attending,
      meal,
      notes,
      events: [...ALL_EVENT_SLUGS],
      primary: { name: primaryName, email, phone, age_band: "adult" },
      companions: guests.filter((g) => g.name.trim()),
    };
    const res = await submitRsvp(input);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setResult({ attending: res.attending, count: res.guestCount });
    setPhase("done");
  }

  return (
    <section id="rsvp" className="section-pad relative px-6">
      <LazyMotion features={domAnimation}>
        <div className="mx-auto mb-10 max-w-xl text-center">
          <p className="font-script text-xl text-saffron-deep">आपका स्वागत है</p>
          <h2 className="mt-2 font-display text-4xl text-red sm:text-5xl">Will you be there?</h2>
          <MotifDivider className="mt-6" />
        </div>

        <AnimatePresence mode="wait">
          {phase === "ask" && (
            <m.div
              key="ask"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className={`${card} text-center`}
            >
              <OmMark className="text-3xl text-saffron-deep" />
              <p className="mt-3 text-lg leading-relaxed text-ink/85">
                {party?.display_name ? (
                  <>
                    Dear{" "}
                    <span className="font-display text-2xl text-red">{party.display_name}</span>, it
                    would mean so much to have you with us.
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
              <label className="block">
                <span className="text-sm font-medium text-ink">Your full name</span>
                <input
                  className={fieldInput}
                  value={primaryName}
                  onChange={(e) => setPrimaryName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  autoComplete="name"
                />
              </label>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-ink">
                    Email <span className="font-normal text-ink-soft">· optional</span>
                  </span>
                  <input
                    className={fieldInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    inputMode="email"
                    autoComplete="email"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-ink">
                    Phone <span className="font-normal text-ink-soft">· optional</span>
                  </span>
                  <input
                    className={fieldInput}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 …"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </label>
              </div>
              {attending && (
                <p className="mt-2 text-xs text-ink-soft">
                  Email or phone helps us make sure no one is counted twice.
                </p>
              )}

              {attending && (
                <>
                  <div className="mt-6">
                    <p className="text-base font-medium text-ink">Who else is coming with you?</p>
                    <p className="mt-1 text-sm text-ink-soft">
                      You are already counted. Add each family member or friend below by name.
                    </p>

                    <ul className="mt-4 space-y-3">
                      {guests.map((g, i) => (
                        <li
                          key={i}
                          className="rounded-2xl border border-gold/40 bg-cream-deep/15 p-3"
                        >
                          <input
                            className="w-full rounded-lg border border-gold/40 bg-cream px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-ink-soft/55 focus:border-red"
                            value={g.name}
                            onChange={(e) => patchGuest(i, { name: e.target.value })}
                            placeholder={`Guest ${i + 1} — full name`}
                          />
                          <div className="mt-2.5 flex items-center justify-between gap-2">
                            <div className="flex gap-1.5">
                              {AGES.map((a) => (
                                <button
                                  key={a.v}
                                  type="button"
                                  onClick={() => patchGuest(i, { age_band: a.v })}
                                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                                    g.age_band === a.v
                                      ? "border-pine bg-pine text-cream"
                                      : "border-gold/50 text-ink-soft hover:border-pine"
                                  }`}
                                >
                                  {a.label}
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeGuest(i)}
                              className="text-sm text-red-deep/80 hover:text-red-deep"
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {(party?.allow_companions ?? true) && (
                      <button
                        type="button"
                        onClick={addGuest}
                        className="mt-3 w-full rounded-xl border border-dashed border-gold/60 py-3 font-display text-lg text-red transition-colors hover:bg-cream-deep/40"
                      >
                        {guests.length === 0 ? "+ Add a guest" : "+ Add another guest"}
                      </button>
                    )}
                  </div>

                  <div className="mt-6">
                    <span className="text-sm font-medium text-ink">
                      Meal preference{" "}
                      <span className="font-normal text-ink-soft">· optional</span>
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["Vegetarian", "Non-vegetarian", "Jain", "No preference"].map((mm) => (
                        <button
                          key={mm}
                          type="button"
                          onClick={() => setMeal(mm)}
                          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                            meal === mm
                              ? "border-pine bg-pine text-cream"
                              : "border-gold/50 text-ink-soft hover:border-pine"
                          }`}
                        >
                          {mm}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <label className="mt-6 block">
                <span className="text-sm font-medium text-ink">
                  {attending ? "A little note for us" : "Leave us a message"}{" "}
                  <span className="font-normal text-ink-soft">· optional</span>
                </span>
                <textarea
                  className={`${fieldInput} min-h-20`}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={attending ? "We are so happy for you both!" : "Sending you all my love."}
                />
              </label>

              {error && <p className="mt-3 text-sm text-red-deep">{error}</p>}

              <div className="mt-6 flex items-center justify-between">
                <button onClick={() => setPhase("ask")} className="text-sm text-ink-soft hover:text-red">
                  Back
                </button>
                <button
                  onClick={onSubmit}
                  disabled={busy || !primaryName.trim()}
                  className="rounded-full bg-red px-8 py-3 font-display text-lg text-cream transition-transform hover:scale-[1.03] disabled:opacity-50"
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
                    {result.count > 1 ? ` for all ${result.count} of you` : ""}. It truly makes us
                    so happy.
                  </p>
                  <p className="mt-3 text-sm text-ink/80">
                    See you at {wedding.venue}, {wedding.venueCity}.
                  </p>
                  <div className="mt-6 rounded-2xl border border-dashed border-gold/60 bg-cream-deep/40 p-5">
                    <p className="font-script text-lg text-saffron-deep">शुभ विवाह</p>
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
                    We are sad you can&apos;t be with us, but thank you for letting us know. You will
                    be in our hearts on the day.
                  </p>
                  <p className="mt-4 font-script text-xl text-saffron-deep">
                    {couple.bride.first} with {couple.groom.first}
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
