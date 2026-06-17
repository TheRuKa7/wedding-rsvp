/*
  RSVP-only site. We intentionally do NOT publish event names, venue, or themes yet.
  Event slugs are kept private here only so an "attending" RSVP can be recorded
  against the two-day celebration in the database.
*/

export const couple = {
  bride: { first: "Stuti", last: "Suri", tradition: "Punjabi" },
  groom: { first: "Rushil", last: "Kaul", tradition: "Kashmiri Pandit" },
} as const;

export const wedding = {
  dates: "27 & 28 February 2027",
  datesShort: "27–28 Feb 2027",
  venue: "The Jungle Trail Corbett Resort & Spa",
  venueCity: "Jim Corbett, Uttarakhand",
  detailsTeaser:
    "Join us at The Jungle Trail Corbett Resort & Spa in Jim Corbett. The full itinerary will follow very soon. For now, please save our dates and let us know you can come.",
  hashtag: "#StutiWedsRushil",
} as const;

export const saveTheDate = {
  invocation: "शुभ विवाह",
  intro: "With joyful hearts, we request you to save the dates",
  forText: "for the wedding of",
  note: "A formal invitation will follow.",
} as const;

// The invitation is hosted by the bride's parents (this RSVP gathers their guest list).
export const hosts = {
  parents: "Atul & Rita Suri",
  inviteLine: "request the pleasure of your company at the wedding of their beloved daughter",
  groomParents: "Anil & Neetu Kaul",
} as const;

export const story = {
  title: "Two families, one celebration",
  hindi: "शुभ विवाह",
  paragraphs: [
    "Stuti is Punjabi and Rushil is Kashmiri Pandit. We are bringing our two families and traditions together for two days of celebration.",
    "We would love for you to be there with us. Please let us know you are coming.",
  ],
} as const;

export const comingSoon = {
  hindi: "जल्द ही",
  title: "We are still planning the fun parts",
  body: "The events, the timings and all the little details are coming together beautifully. We will share the full itinerary with you very soon.",
  badge: "Itinerary coming soon",
} as const;

export const moments = {
  title: "This is us",
  caption: "We honestly cannot wait to celebrate with the people we love. We hope that means you.",
} as const;

/** Private: not rendered. Used only to record an attending RSVP across the two days. */
export const ALL_EVENT_SLUGS = [
  "mehndi-maenziraat",
  "sangeet",
  "haldi",
  "chooda-devgon",
  "lagan-nethar",
  "reception",
] as const;

export const nav = [
  { label: "Our Story", href: "#story" },
  { label: "Us", href: "#gallery" },
  { label: "RSVP", href: "#rsvp" },
] as const;
