import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell, RouteFocus } from "@/components/golf";
import { ToastProvider } from "@/components/ui";

export const metadata: Metadata = {
  title: { default: "Clubhouse", template: "%s · 18 Eagles" },
  description: "Your golf journal: your handicap, every card, and the next round.",
};

// The tool's shared frame: skip link, the wordmark, the same five tabs on every page, the toast region,
// and focus moved to each new page's <h1> after a client-side route change.
export default function ClubhouseLayout({ children }: LayoutProps<"/clubhouse">) {
  return (
    <ToastProvider>
      <Suspense fallback={null}>
        <RouteFocus />
      </Suspense>
      <AppShell>{children}</AppShell>
    </ToastProvider>
  );
}
