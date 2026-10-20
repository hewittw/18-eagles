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
  { n: "01", title: "Research", href: "/research", status: "done", note: "How GHIN, 18Birdies, and Arccos welcome a new golfer, and what we take from each." },
  { n: "02", title: "Mood board", href: "/mood-board", status: "done", note: "The Members' Ledger: ceremonial, tailored, sunlit. 29 artifacts remixing the Rancho Santa Fe feel and old-school Masters ceremony." },
  { n: "03", title: "Design system", href: "/design-system", status: "done", note: "The app's real component library: every component in every state, 33 color pairs measured, keyboard-checked." },
  { n: "04", title: "Flows", href: "/flows", status: "done", note: "The first visit, playing a round, and coming back, as a diagram (also in the README)." },
  { n: "05", title: "18 Eagles", href: TOOL_HREF, status: "done", note: "The tool itself: a name and three setup questions, the hole-by-hole card, handicap, stats, the next-round challenge and the Trophy Room. The submitted link." },
];

// The assignment's checklist (docs/assignment.md), tracked here so progress is visible at a glance.
export const checklist: { item: string; status: Status }[] = [
  { item: "A tool built around its flows, a page for each step, shared navigation", status: "done" },
  { item: "Flows as a diagram, shown in the README", status: "done" },
  { item: "Onboarding research: three similar apps", status: "done" },
  { item: "A first visit that gives someone new something useful right away", status: "done" },
  { item: "A form with errors next to the field that keeps what was typed", status: "done" },
  { item: "A reason to come back, and it remembers you", status: "done" },
  { item: "Keyboard access, real labels, contrast checked", status: "done" },
  { item: "First-run check by the agent, in the README", status: "done" },
  { item: "Live on Vercel, with a commit history that shows progress", status: "done" },
];
