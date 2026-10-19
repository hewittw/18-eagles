import { Suspense } from "react";
import type { Metadata } from "next";
import { Placeholder } from "../../../_components/Placeholder";
import { HoleScreen } from "./HoleScreen";

export const metadata: Metadata = { title: "Playing a hole" };

// Round ids are made in the browser, so params are runtime data: read them inside Suspense (Cache Components).
export default function HolePage({ params }: PageProps<"/clubhouse/rounds/[id]/[hole]">) {
  return (
    <Suspense fallback={<Placeholder label="Walking to the tee" />}>
      {params.then(({ id, hole }) => (
        <HoleScreen key={`${id}-${hole}`} id={id} holeParam={hole} />
      ))}
    </Suspense>
  );
}
