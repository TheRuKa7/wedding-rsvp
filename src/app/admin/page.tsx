import Login from "./Login";
import {
  currentSecret,
  loadDashboard,
  adminLogout,
  mergeGuests,
  rejectCandidate,
  approveParty,
} from "./actions";

export const dynamic = "force-dynamic";

type EventCount = { name: string; day: number; adults: number; kids: number; declined: number };
type QueueRow = {
  candidate_id: string;
  score: number;
  a_id: string;
  a_name: string;
  a_email: string | null;
  a_phone: string | null;
  a_party: string | null;
  b_id: string;
  b_name: string;
  b_email: string | null;
  b_phone: string | null;
  b_party: string | null;
};
type GuestRow = {
  guest: string;
  age_band: string;
  party: string;
  email: string | null;
  phone: string | null;
  source: string;
  status: string;
  is_approved: boolean;
  dedup_status: string;
};

export default async function AdminPage() {
  if (!(await currentSecret())) return <Login />;
  const data = await loadDashboard();
  if (!data) return <Login />;

  const h = data.summary?.headcount ?? {};
  const events: EventCount[] = data.summary?.events ?? [];
  const queue = data.queue as QueueRow[];
  const guests = data.guests as GuestRow[];
  const pending = guests.filter((g) => !g.is_approved);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-red">RSVP Dashboard</h1>
        <form action={adminLogout}>
          <button className="text-sm text-ink-soft hover:text-red">Log out</button>
        </form>
      </header>

      {/* headline counts */}
      <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Attending (people)" value={h.attending_people ?? 0} big />
        <Stat label="Will be missed" value={h.declined_people ?? 0} />
        <Stat label="Adults" value={h.adults_total ?? 0} />
        <Stat label="Children / infants" value={h.kids_total ?? 0} />
      </section>

      {/* per-event */}
      <h2 className="mt-12 font-display text-2xl text-ink">Per celebration</h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-gold/30">
        <table className="w-full text-sm">
          <thead className="bg-cream-deep/40 text-left text-ink-soft">
            <tr>
              <th className="p-3">Event</th>
              <th className="p-3">Day</th>
              <th className="p-3">Adults</th>
              <th className="p-3">Kids</th>
              <th className="p-3">Declined</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.name} className="border-t border-gold/20">
                <td className="p-3 font-medium">{e.name}</td>
                <td className="p-3">{e.day}</td>
                <td className="p-3">{e.adults}</td>
                <td className="p-3">{e.kids}</td>
                <td className="p-3">{e.declined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* duplicate review queue */}
      <h2 className="mt-12 font-display text-2xl text-ink">
        Duplicate review queue{" "}
        <span className="text-base text-ink-soft">({queue.length} open)</span>
      </h2>
      {queue.length === 0 ? (
        <p className="mt-2 text-sm text-ink-soft">Nothing to review. No possible duplicates.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {queue.map((q) => (
            <li key={q.candidate_id} className="rounded-xl border border-gold/30 p-4">
              <p className="text-xs uppercase tracking-wide text-ink-soft">
                Possible duplicate · score {q.score.toFixed(2)}
              </p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <Person name={q.a_name} email={q.a_email} phone={q.a_phone} party={q.a_party} />
                <Person name={q.b_name} email={q.b_email} phone={q.b_phone} party={q.b_party} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={mergeGuests}>
                  <input type="hidden" name="keep" value={q.a_id} />
                  <input type="hidden" name="merge" value={q.b_id} />
                  <button className="rounded-full bg-red px-4 py-1.5 text-sm text-cream">
                    Merge → keep {q.a_name}
                  </button>
                </form>
                <form action={mergeGuests}>
                  <input type="hidden" name="keep" value={q.b_id} />
                  <input type="hidden" name="merge" value={q.a_id} />
                  <button className="rounded-full bg-red px-4 py-1.5 text-sm text-cream">
                    Merge → keep {q.b_name}
                  </button>
                </form>
                <form action={rejectCandidate}>
                  <input type="hidden" name="candidate" value={q.candidate_id} />
                  <button className="rounded-full border border-gold px-4 py-1.5 text-sm text-ink">
                    Not a duplicate
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* self-added parties awaiting approval */}
      {pending.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-2xl text-ink">
            Awaiting approval{" "}
            <span className="text-base text-ink-soft">
              ({pending.length} self-added, excluded from counts)
            </span>
          </h2>
          <ul className="mt-3 space-y-2">
            {pending.map((g, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-xl border border-gold/30 p-3 text-sm"
              >
                <span>
                  <strong>{g.guest}</strong> · {g.party} · {g.email ?? g.phone ?? "no contact"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-ink-soft">
            Approve via the guest&apos;s party (run admin_approve_party, or wire a button per party).
          </p>
        </>
      )}

      {/* full guest list + export */}
      <div className="mt-12 flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink">
          All guests <span className="text-base text-ink-soft">({guests.length})</span>
        </h2>
        <a
          href="/admin/export"
          className="rounded-full border border-gold px-4 py-1.5 text-sm text-red hover:bg-cream-deep"
        >
          Export CSV
        </a>
      </div>
      <div className="mt-3 overflow-x-auto rounded-xl border border-gold/30">
        <table className="w-full text-sm">
          <thead className="bg-cream-deep/40 text-left text-ink-soft">
            <tr>
              <th className="p-3">Guest</th>
              <th className="p-3">Party</th>
              <th className="p-3">Age</th>
              <th className="p-3">Status</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Source</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g, i) => (
              <tr key={i} className="border-t border-gold/20">
                <td className="p-3 font-medium">
                  {g.guest}
                  {!g.is_approved && <span className="ml-2 text-xs text-saffron-deep">pending</span>}
                  {g.dedup_status === "candidate" && (
                    <span className="ml-2 text-xs text-red">dup?</span>
                  )}
                </td>
                <td className="p-3">{g.party}</td>
                <td className="p-3">{g.age_band}</td>
                <td className="p-3">{g.status}</td>
                <td className="p-3">{g.email ?? g.phone ?? "·"}</td>
                <td className="p-3">{g.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Stat({ label, value, big }: { label: string; value: number; big?: boolean }) {
  return (
    <div className="rounded-xl border border-gold/30 p-4">
      <div className={`font-display text-red ${big ? "text-5xl" : "text-4xl"}`}>{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-ink-soft">{label}</div>
    </div>
  );
}

function Person({
  name,
  email,
  phone,
  party,
}: {
  name: string;
  email: string | null;
  phone: string | null;
  party: string | null;
}) {
  return (
    <div className="rounded-lg bg-cream-deep/30 p-3">
      <p className="font-medium">{name}</p>
      <p className="text-xs text-ink-soft">{party ?? "·"}</p>
      <p className="text-xs text-ink-soft">{email ?? phone ?? "no contact anchor"}</p>
    </div>
  );
}
