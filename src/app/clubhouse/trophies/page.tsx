import type { Metadata } from "next";
import { TrophyRoom } from "./TrophyRoom";

export const metadata: Metadata = {
  title: "Trophy Room",
  description: "This week's trophies, the crystal, and your career milestones, all won from your own cards.",
};

export default function TrophiesPage() {
  return <TrophyRoom />;
}
