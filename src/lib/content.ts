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
  detailsTeaser:
    "We are still putting everything together. The venue and all the little details will follow very soon. For now, please save our dates and let us know you can come.",
  hashtag: "#StutiWedsRushil",
} as const;

export const saveTheDate = {
  invocation: "शुभ विवाह",
  intro: "With joyful hearts, we request you to save the dates",
  forText: "for the wedding of",
  note: "A formal invitation will follow.",
} as const;

export const story = {
  title: "How we found each other",
  hindi: "हमारी कहानी",
  paragraphs: [
    "Stuti grew up with the colour and warmth of a Punjabi home. Rushil grew up with the quiet beauty of Kashmir. Somewhere in between, we found each other, and it just felt like home.",
    "Now we are bringing our two families together, and we would love for you to be right there with us when we do.",
  ],
} as const;

export const comingSoon = {
  hindi: "जल्द ही",
  title: "We are still planning the fun parts",
  body: "The venue, the events and all the little details are coming together beautifully. We will share everything with you soon. The one thing we would love to know now is whether you will be there.",
  badge: "More details soon",
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
