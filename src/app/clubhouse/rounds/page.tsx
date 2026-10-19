import type { Metadata } from "next";
import { Cards } from "./_list/Cards";

export const metadata: Metadata = { title: "Cards", description: "Every round you've played, newest first, with the cards that count toward your index marked." };

export default function CardsPage() {
  return <Cards />;
}
