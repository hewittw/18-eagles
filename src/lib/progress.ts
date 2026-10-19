// What the hub shows. Update the status as each part lands.
export type Status = "done" | "in progress" | "next";

export type Part = {
  n: string;
  title: string;
  href: string;
  status: Status;
  note: string;
};

export const TOOL_HREF = "/clubhouse";

export const parts: Part[] = [
  { n: "01", title: "Research", href: "/research", status: "in progress", note: "How GHIN, 18Birdies, and Arccos welcome a new golfer, and what we take from each." },
  { n: "02", title: "Mood board", href: "/mood-board", status: "in progress", note: "Clubhouse and locker room: the Rancho Santa Fe feel remixed with old-school Masters tradition." },
  { n: "03", title: "Design system", href: "/design-system", status: "next", note: "Every component in every state, built from the mood board, with contrast measured." },
  { n: "04", title: "Flows", href: "/flows", status: "in progress", note: "The first visit, playing a round, and coming back, as a diagram (also in the README)." },
  { n: "05", title: "18 Eagles", href: TOOL_HREF, status: "next", note: "The tool itself: handicap, courses, the hole-by-hole card, and breakdowns. The submitted link." },
];

// The assignment's checklist (docs/assignment.md), tracked here so progress is visible at a glance.
export const checklist: { item: string; status: Status }[] = [
  { item: "A tool built around its flows, a page for each step, shared navigation", status: "next" },
  { item: "Flows as a diagram, shown in the README", status: "in progress" },
  { item: "Onboarding research: three similar apps", status: "in progress" },
  { item: "A first visit that gives someone new something useful right away", status: "next" },
  { item: "A form with errors next to the field that keeps what was typed", status: "next" },
  { item: "A reason to come back, and it remembers you", status: "next" },
  { item: "Keyboard access, real labels, contrast checked", status: "next" },
  { item: "First-run check by the agent, in the README", status: "next" },
  { item: "Live on Vercel, with a commit history that shows progress", status: "in progress" },
];
