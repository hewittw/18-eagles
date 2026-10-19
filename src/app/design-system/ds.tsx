// Layout pieces for /design-system only (not part of the component library).
import type { ReactNode } from "react";
import { cx } from "@/components/ui/cx";

export function Section({ id, numeral, eyebrow, title, lede, children, tone = "paper" }: { id: string; numeral: string; eyebrow: string; title: string; lede?: ReactNode; children: ReactNode; tone?: "paper" | "green" }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-ink pt-10 first:border-t-0 first:pt-0 sm:pt-14">
      <div className="grid gap-x-10 gap-y-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end">
        <div className="min-w-0">
          <p className="caps text-label text-gold-ink">
            <span className="font-display text-[1.05rem] tracking-normal normal-case">{numeral}</span> · {eyebrow}
          </p>
          <h2 id={`${id}-h`} className={cx("mt-2 font-display text-display-2 text-balance", tone === "green" ? "text-on-green" : "text-ink")}>{title}</h2>
        </div>
        {lede && <p className="max-w-measure font-serif text-lede text-ink-2 lg:pb-1.5">{lede}</p>}
      </div>
      <div className="rule-double mt-5 text-ink" aria-hidden="true" />
      <div className="mt-10 grid gap-16 sm:mt-12">{children}</div>
    </section>
  );
}

/** One component: name, import line, what it's for, how to use it, then specimens and a live demo. */
export function Spec({ id, name, from, summary, use, children, wide }: { id: string; name: string; from: "ui" | "golf" | "charts"; summary: ReactNode; use: ReactNode[]; children: ReactNode; /** Text above, specimens full width (for big parts). */ wide?: boolean }) {
  const intro = (
    <div className="min-w-0">
      <h3 id={`${id}-h`} className="font-display text-title text-ink">{name}</h3>
      <p className="mt-1 font-numeral text-[0.95rem] text-ink-2">
        <code className="block">{`import { ${name.split(" ")[0]} }`}</code>
        <code className="block">{`from "@/components/${from === "charts" ? "golf" : from}"`}</code>
      </p>
      <div className="mt-3 text-[1rem] leading-relaxed text-ink">{summary}</div>
    </div>
  );
  const how = (
    <div className="min-w-0">
      <h4 className={cx("caps text-[0.75rem] text-gold-ink", !wide && "mt-5")}>How to use</h4>
      <ul className="mt-2 grid gap-1.5 text-[0.95rem] leading-snug text-ink-2">
        {use.map((u, i) => (
          <li key={i} className="flex gap-2.5"><span aria-hidden="true" className="mt-[0.55em] size-1 shrink-0 rounded-full bg-gold-ink" /><span className="min-w-0">{u}</span></li>
        ))}
      </ul>
    </div>
  );
  return (
    <article id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 min-w-0">
      {wide ? (
        <div className="grid gap-6">
          <div className="grid gap-x-10 gap-y-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">{intro}<div className="lg:pt-2">{how}</div></div>
          <div className="grid min-w-0 content-start gap-6">{children}</div>
        </div>
      ) : (
        <div className="grid gap-x-10 gap-y-5 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
          <div className="min-w-0">{intro}{how}</div>
          <div className="grid min-w-0 content-start gap-6">{children}</div>
        </div>
      )}
    </article>
  );
}

/**
 * A grid of static specimens. `inert` takes them out of the tab order and the accessibility tree: they're
 * pictures of states. The live demo next to them is the real, interactive control.
 */
export function States({ children, cols = "auto", tone = "paper", label = "States" }: { children: ReactNode; cols?: "auto" | "wide" | "2"; tone?: "paper" | "green"; label?: string }) {
  return (
    <figure className="min-w-0">
      <figcaption className="caps mb-2 flex items-center justify-between gap-3 text-[0.72rem] text-ink-2">
        <span>{label}</span>
        <span className="font-sans text-[0.8rem] font-normal normal-case tracking-normal">Specimens, not controls</span>
      </figcaption>
      <div
        inert
        className={cx(
          "grid border-l border-t border-rule [&>*]:border-b [&>*]:border-r [&>*]:border-rule",
          cols === "auto" && "grid-cols-[repeat(auto-fill,minmax(min(100%,9.5rem),1fr))]",
          cols === "wide" && "grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))]",
          cols === "2" && "grid-cols-1 sm:grid-cols-2",
          tone === "green" && "on-green",
        )}
      >
        {children}
      </div>
    </figure>
  );
}

export function State({ label, force, children, tone = "paper", className }: { label: string; force?: "hover" | "pressed" | "focus"; children: ReactNode; tone?: "paper" | "green" | "linen"; className?: string }) {
  return (
    <div className={cx("flex min-w-0 flex-col gap-3 p-4", tone === "green" ? "tex-locker on-green" : tone === "linen" ? "tex-linen" : "bg-paper", className)}>
      <span className={cx("caps text-[0.68rem]", tone === "green" ? "text-gold" : "text-ink-2")}>{label}</span>
      <div data-force={force} className="flex min-w-0 flex-1 flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

/** The live, interactive example. */
export function Demo({ title = "Try it", children, className, tone = "paper" }: { title?: string; children: ReactNode; className?: string; tone?: "paper" | "green" }) {
  return (
    <div className={cx("min-w-0 border p-4 sm:p-6", tone === "green" ? "tex-locker on-green border-green-3" : "border-ink bg-paper-2", className)}>
      <p className={cx("caps mb-4 flex items-center gap-2 text-[0.72rem]", tone === "green" ? "text-gold" : "text-gold-ink")}>
        <span aria-hidden="true" className={cx("size-1.5 rounded-full", tone === "green" ? "bg-gold" : "bg-green")} />
        {title}
      </p>
      {children}
    </div>
  );
}
