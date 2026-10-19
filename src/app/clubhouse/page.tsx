import type { Metadata } from "next";
import { Clubhouse } from "./_components/Clubhouse";

export const metadata: Metadata = { title: "Clubhouse" };

export default function ClubhousePage() {
  return <Clubhouse />;
}
