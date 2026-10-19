import { fmtToPar } from "@/components/golf";
import { cx } from "@/components/ui";

/** One figure in a ledger row: a brass caps label, the board numeral, and one line saying what it means. */
export function Figure({ label, value, explain, missing }: { label: string; value: string | null; explain: string; missing: string }) {
  return (
    <div className="min-w-0 border-t border-ink pt-3">
      <dt className="caps text-label text-gold-ink">{label}</dt>
      <dd className="mt-1">
        <span className={cx("block font-numeral font-semibold leading-none tabular-nums", value == null ? "text-[2rem] text-ink-2" : "text-[2.6rem] text-ink")}>
          {value ?? <><span aria-hidden="true">—</span><span className="sr-only">No data yet.</span></>}
        </span>
        <span className={cx("mt-2 block text-[0.95rem] leading-snug", value == null ? "font-serif italic text-link" : "text-ink-2")}>{value == null ? missing : explain}</span>
      </dd>
    </div>
  );
}

/** The card's Out and In cells, on Locker Green: average to par on each nine, and a plain-words verdict. */
export function FrontBack({ front, back }: { front: number | null; back: number | null }) {
  const r = (n: number) => Math.round(n * 10) / 10;
  const diff = front != null && back != null ? r(back - front) : null;
  const verdict =
    diff == null
      ? "Score full nines hole by hole to compare your front and back."
      : Math.abs(diff) < 0.3
        ? "Your two nines are level. No fade, no slow start."
        : diff > 0
          ? `You give back ${diff.toFixed(1)} a round on the back nine. Stamina, or the scorecard getting in your head?`
          : `You find ${Math.abs(diff).toFixed(1)} a round on the back nine. The front is where the strokes go.`;
  const cell = (name: string, sub: string, v: number | null) => (
    <div className="tex-locker on-green flex min-w-0 flex-col items-center justify-center border border-green-3 px-4 py-5 text-center">
      <p className="caps text-label text-gold">{name}</p>
      <p className="mt-1 font-numeral text-[2.8rem] font-semibold leading-none tabular-nums text-on-green">{v == null ? "—" : fmtToPar(r(v))}</p>
      <p className="mt-1 text-[0.92rem] text-paper-3">{sub}</p>
    </div>
  );
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,22rem)_1fr] md:items-center md:gap-10">
      <div>
        <h3 className="font-serif text-[1.25rem] font-bold leading-tight text-ink">Front nine vs back nine</h3>
        <p className="mt-1 text-[0.95rem] text-ink-2">Average to par on each nine.</p>
        <div className="mt-4 grid grid-cols-2 gap-1.5">
          {cell("Out", "Holes 1–9", front)}
          {cell("In", "Holes 10–18", back)}
        </div>
      </div>
      <p className="max-w-measure font-serif text-lede text-ink">{verdict}</p>
    </div>
  );
}
