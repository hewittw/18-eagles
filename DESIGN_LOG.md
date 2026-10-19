# Design Log — Assignment 3

Running log of real decisions: what we chose, why, what we rejected, and where the user pushed back.
Append as decisions happen, newest at the bottom.

---

## 2026-10-19 · Choosing the tool
- Read all Week 3 materials first: the assignment PDF, the text of all 95 slides, and the 62-minute
  walkthrough transcript.
- **The agent first suggested** a lacrosse practice planner (the user is MLAX president), then compared
  the user's two ideas: a golf round tracker and a pickleball Elo ladder. Against the rubric, pickleball
  fit slightly better on paper (a faster first visit, a natural one-column form). The agent said the
  deciding question was which one the user actually plays.
- **The user picked golf.** The user also asked the agent to set aside their detailed spec and follow the assignment.

## 2026-10-19 · Hub or standalone
- The agent recommended a standalone tool, with the process work living in the README.
- **The user overrode this:** they want a hub like Week 2, to see progress at a glance, and will submit the
  tool's own route as the Vercel link. So `/` is the hub, and the tool lives under its own prefix with its own nav.

## 2026-10-19 · Direction
- **The user's brief:** sleek, unique, exclusively golfy. Modern, but like a clubhouse and locker room. A remix
  of the Rancho Santa Fe Golf Club site's feel and old-school Masters tradition. "High-end, perfect golf."
- **The user's feature asks:** a home page with the handicap in big numbers, interactive breakdowns with filters
  over time, a course picker with course images, a hole-by-hole screen with score, club per shot, and notes,
  with great accessible buttons. It has to work on mobile and desktop, tested at every size, with accessibility
  owned by the agent.
- **Process:** one mood board and one full design system, built by Opus subagents, while the agent and
  the user work out the flows together.
- **Scaffold:** Next.js 16.4.2 + Tailwind v4 (create-next-app, src/ dir, TS), generated in a temp dir and moved
  into `week3/hw3`. Carried over from Week 2: a slim AGENTS.md with on-demand docs, the `verify-ui` skill, the
  matrix and shot scripts, and the chrome-devtools deny rule.
