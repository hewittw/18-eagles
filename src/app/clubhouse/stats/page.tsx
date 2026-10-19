import type { Metadata } from "next";
import { Stats } from "./_stats/Stats";

export const metadata: Metadata = { title: "Stats", description: "Your playing over time: scoring, putting, clubs, holes, and how your index is made." };

export default function StatsPage() {
  return <Stats />;
}
