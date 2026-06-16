# Stuti & Rushil — Wedding Website + RSVP

A premium, mobile-first wedding site for **Stuti Suri (Punjabi) weds Rushil Kaul (Kashmiri Pandit)**,
27–28 February 2027, Jim Corbett. Cinematic storytelling front end + a duplicate-proof RSVP system.

## Stack
- **Next.js 16** (App Router, React 19, TypeScript) + **Tailwind v4**
- **GSAP** (SplitText hero), **Framer Motion** (RSVP form), **Lenis** (smooth scroll, touch-gated)
- **Supabase** (Postgres + RLS + `SECURITY DEFINER` RPCs) — project `stuti-weds-rushil` (ap-south-1)
- Designed for **Vercel** deploy

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```
Env lives in `.env.local` (already set; gitignored). See `.env.example` for the shape.

## Routes
- `/` — the wedding site. Hero → Story → Celebrations → Gallery → Families → RSVP.
- `/?t=<magic_token>` — pre-listed household "claim" experience (greets them, pre-fills family).
- `/admin` — password-protected dashboard (password = `ADMIN_SECRET` in `.env.local`).
- `/admin/export` — CSV of all guests.

## RSVP model (why counts are always right)
**One `guests` row = one real person = counted once.** Every entry path resolves to the same row.
- **Hybrid entry:** public link for anyone; pre-listed households recognised by `?t=token` and pre-filled.
- **Anchor-gated dedup** (`find_or_create_guest`): matches on email → phone → (party+name), with a
  **veto** when non-null email/phone conflict — so two real same-name people are never merged.
- **Idempotent:** re-adding the same family / RSVPing twice updates the same rows (UNIQUE on
  `(guest_id, event_id)`); no double counts.
- **Fuzzy look-alikes** go to the **admin review queue**, never auto-merged.
- **Declined** = "will be missed". **Self-added** (no token) = quarantined, excluded from counts
  until you approve them in `/admin`.

Counting views: `v_live_guests`, `v_headcount`, `v_event_counts` (all filter merged + unapproved).

## Pre-listing guests (optional, strengthens dedup)
Create a household and share its magic link `https://<site>/?t=<token>`:
```sql
-- one household
insert into parties (magic_token, display_name, is_prelisted, is_approved, anchor_email)
values (replace(gen_random_uuid()::text,'-','')||replace(gen_random_uuid()::text,'-',''),
        'The Sharma Family', true, true, 'sharma@email.com')
returning magic_token;

-- its members (use the returned party id)
insert into guests (party_id, full_name, name_normalized, age_band, source, is_approved)
values ('<party_id>', 'Aarav Sharma', normalize_name('Aarav Sharma'), 'adult', 'prelisted', true);
```
Run these in the Supabase SQL editor. The `magic_token` is the `?t=` value to send that household.

## Admin actions
The dashboard exposes: live unique headcount (attending / will-be-missed / adults / kids),
per-celebration counts, the duplicate-review queue (merge either way / reject), pending self-added
guests, and CSV export. All admin DB calls are gated by `ADMIN_SECRET`.

## Still to do (needs your input)
- **Real content:** parents' names (Families section), Our-Story copy, final event times/venues.
  Edit `src/lib/content.ts` (site copy) and the `events` table (RSVP source of truth) — keep slugs in sync.
- **Photos:** drop into `/public/gallery` and swap the gradient tiles in `src/components/Gallery.tsx`.
  Optionally stylise via Higgsfield (account has credits; upload your photos through its widget).
- **Venue reveal:** set `wedding.venue` in `src/lib/content.ts` and the `events.venue` column when public.
- **Deploy:** `vercel` / connect the repo; set the three env vars in the Vercel project.
- **Optional hardening:** Cloudflare Turnstile on the RSVP form (server action has the hook point).

## Security notes
- All tables are RLS default-deny. Only `events` + `meal_options` are anon-readable. Everything else
  flows through `SECURITY DEFINER` RPCs. No service-role key is used or stored.
- `ADMIN_SECRET` is server-only (httpOnly cookie + env); never shipped to the browser.
- Rate limiting: 15 submissions / 10 min / IP (`check_rate_limit`, hashed IP).
