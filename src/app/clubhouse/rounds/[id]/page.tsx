import { Suspense } from "react";
import type { Metadata } from "next";
import { Placeholder } from "../../_components/Placeholder";
import { RoundCard } from "./RoundCard";

export const metadata: Metadata = { title: "Your card" };

export default function RoundPage({ params }: PageProps<"/clubhouse/rounds/[id]">) {
  return (
    <Suspense fallback={<Placeholder label="Fetching the card" />}>
      {params.then(({ id }) => <RoundCard key={id} id={id} />)}
    </Suspense>
  );
}
