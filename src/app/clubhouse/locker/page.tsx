import type { Metadata } from "next";
import { Locker } from "./Locker";

export const metadata: Metadata = {
  title: "Locker",
  description: "Your bag, your Handicap Index and goal, your honors, and your saved data.",
};

export default function LockerPage() {
  return <Locker />;
}
