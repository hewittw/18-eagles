import type { Metadata } from "next";
import { AppShell } from "@/components/golf";
import { ToastProvider } from "@/components/ui";

export const metadata: Metadata = {
  title: { default: "Clubhouse", template: "%s · 18 Eagles" },
  description: "Your golf journal: your handicap, every card, and the next round.",
};

// The tool's shared frame: skip link, the wordmark, the same five tabs on every page, and the toast region.
export default function ClubhouseLayout({ children }: LayoutProps<"/clubhouse">) {
  return (
    <ToastProvider>
      <AppShell>{children}</AppShell>
    </ToastProvider>
  );
}
