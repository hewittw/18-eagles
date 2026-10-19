"use client";
import { usePathname } from "next/navigation";
import { AppNav, type NavKey } from "./AppNav";

/** Works out the current tab from the URL (inside Suspense, so dynamic routes still prerender a shell). */
export function CurrentNav({ variant }: { variant: "bar" | "tabs" }) {
  const path = usePathname() ?? "";
  const current: NavKey | undefined =
    path.startsWith("/clubhouse/courses") || path.startsWith("/clubhouse/play") ? "courses"
    : path.startsWith("/clubhouse/rounds") || path.startsWith("/clubhouse/round") ? "cards"
    : path.startsWith("/clubhouse/stats") ? "stats"
    : path.startsWith("/clubhouse/locker") ? "locker"
    : path === "/clubhouse" || path === "/clubhouse/" ? "clubhouse"
    : undefined;
  return <AppNav current={current} variant={variant} />;
}
