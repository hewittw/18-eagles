import type { Metadata } from "next";
import { Suspense } from "react";
import { Placeholder } from "../../_components/Placeholder";
import { LogRound } from "./_form/LogRound";

export const metadata: Metadata = { title: "Log a round", description: "Add a round you've already played, as a total or hole by hole." };

// LogRound reads ?course=slug, so it renders on the client inside Suspense.
export default function LogRoundPage() {
  return (
    <Suspense fallback={<Placeholder label="Opening a blank card" />}>
      <LogRound />
    </Suspense>
  );
}
