"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { PageHeader } from "@/components/golf";
import { Button, ButtonLink, Callout, Card, ChoiceGroup, ConfirmDialog, Field, NumberInput, SectionHeading, Select, TextInput, ToggleChip, useToast } from "@/components/ui";
import { formatIndex } from "@/lib/handicap";
import { useClub } from "@/lib/hooks";
import { sampleSeason } from "@/lib/sample";
import { honors } from "@/lib/stats";
import { exportJSON, importJSON, patchProfile, resetAll, todayISO, update } from "@/lib/store";
import type { ClubKind, Goal } from "@/lib/types";
import { parseIndex } from "@/lib/validate";
import { Page, Placeholder } from "../_components/Placeholder";

const KINDS: { kind: ClubKind; label: string }[] = [
  { kind: "wood", label: "Woods" },
  { kind: "hybrid", label: "Hybrids" },
  { kind: "iron", label: "Irons" },
  { kind: "wedge", label: "Wedges" },
  { kind: "putter", label: "Putter" },
];

const GOALS: { value: Goal; label: string; hint: string }[] = [
  { value: "100", label: "Break 100", hint: "99 or better" },
  { value: "90", label: "Break 90", hint: "89 or better" },
  { value: "80", label: "Break 80", hint: "79 or better" },
  { value: "scratch", label: "Scratch", hint: "Index 0.0" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return y && m && d ? `${d} ${MONTHS[m - 1]} ${y}` : iso;
};

export function Locker() {
  const { ready, store, handicap, courses } = useClub();
  const router = useRouter();
  const toast = useToast();
  const [indexText, setIndexText] = useState<string | null>(null); // null = show the saved value
  const [indexError, setIndexError] = useState<string>();
  const [importError, setImportError] = useState<string>();
  const [dialog, setDialog] = useState<"sample" | "erase" | null>(null);

  if (!ready) return <Placeholder label="Opening your locker" />;

  const { profile, bag } = store;
  const inBag = bag.filter((c) => c.inBag).length;
  const earned = honors(store.rounds, store.customCourses, handicap.history);
  const countedRounds = new Set(handicap.differentials.flatMap((d) => d.roundIds)).size;
  const shownIndex = indexText ?? (profile.enteredIndex != null ? formatIndex(profile.enteredIndex) : "");
  const goal = GOALS.find((g) => g.value === profile.goal);

  function saveIndex(e: FormEvent) {
    e.preventDefault();
    if (!shownIndex.trim()) {
      setIndexError("Enter your Handicap Index, like 12.4. To go without one, use “Remove my index”.");
      document.getElementById("l-index")?.focus();
      return;
    }
    const r = parseIndex(shownIndex);
    if (r.error) {
      setIndexError(r.error);
      document.getElementById("l-index")?.focus();
      return;
    }
    setIndexError(undefined);
    setIndexText(null);
    patchProfile({ enteredIndex: r.value, welcomedAt: profile.welcomedAt ?? Date.now() });
    toast({ message: `Index saved: ${formatIndex(r.value)}` });
  }

  function exportData() {
    const blob = new Blob([exportJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `18-eagles-${todayISO()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast({ message: "Saved a copy to your downloads" });
  }

  async function importData(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const before = exportJSON();
    const err = importJSON(await file.text());
    setImportError(err ?? undefined);
    if (err) {
      document.getElementById("l-import")?.focus();
      return;
    }
    setIndexText(null);
    toast({ message: `Imported ${file.name}`, action: { label: "Undo", onClick: () => importJSON(before) } });
  }

  return (
    <Page>
      <PageHeader eyebrow="The bag and your settings" title="Locker" />

      {/* The locker door: a brass nameplate with the essentials */}
      <div className="tex-locker on-green mt-8 border border-green-3 px-5 py-8 sm:px-10">
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="grid grid-cols-6 gap-1.5 sm:hidden" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => <span key={i} className="h-1.5 rounded-full bg-black/35" />)}
          </div>
          <div className="brass-plate relative px-10 py-5 text-center">
            <Screw className="left-2.5 top-1/2 -translate-y-1/2" />
            <Screw className="right-2.5 top-1/2 -translate-y-1/2" />
            <p className="caps text-[0.75rem] tracking-[0.3em]">Locker No. 18</p>
            <p className="mt-1 font-display text-[2.1rem] leading-none uppercase tracking-[0.06em]">
              {handicap.display != null ? formatIndex(handicap.display) : "No index yet"}
            </p>
            <p className="mt-1.5 font-serif text-[0.95rem] italic">
              {handicap.source === "computed" ? `Calculated from ${countedRounds} rounds` : handicap.source === "entered" ? "Handicap Index, as entered" : `${handicap.roundsToFirst} rounds to your first index`}
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-4 text-center sm:grid-cols-1 sm:text-left">
            <div><dt className="caps text-label text-gold">In the bag</dt><dd className="font-numeral text-[1.6rem] font-semibold tabular-nums">{inBag} clubs</dd></div>
            <div><dt className="caps text-label text-gold">Goal</dt><dd className="font-numeral text-[1.6rem] font-semibold">{goal ? goal.label : "None yet"}</dd></div>
            <div><dt className="caps text-label text-gold">Honors</dt><dd className="font-numeral text-[1.6rem] font-semibold tabular-nums">{earned.length}</dd></div>
          </dl>
        </div>
      </div>

      {/* I · The bag */}
      <section aria-labelledby="bag-h" className="mt-14">
        <SectionHeading id="bag-h" numeral="I" title="Your bag" lede="The clubs you carry become the club buttons on the hole screen. Tap one to take it out or put it back." />
        <p className="caps mt-5 text-label text-ink" role="status" aria-live="polite">{inBag} of {bag.length} clubs in the bag</p>
        {inBag > 14 && (
          <Callout className="mt-3 max-w-measure" tone="gold" title="One over the limit">
            The Rules allow 14 clubs; you have {inBag}. Take {inBag - 14 === 1 ? "one" : inBag - 14} out before a competition.
          </Callout>
        )}
        {inBag === 0 && (
          <Callout className="mt-3 max-w-measure" title="An empty bag">Put at least a putter back in, so the hole screen has clubs to tap.</Callout>
        )}
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {KINDS.map(({ kind, label }) => {
            const clubs = bag.filter((c) => c.kind === kind);
            if (!clubs.length) return null;
            return (
              <div key={kind} className="min-w-0 border-t border-ink pt-3" role="group" aria-labelledby={`k-${kind}`}>
                <h3 id={`k-${kind}`} className="caps text-label text-gold-ink">{label} · {clubs.filter((c) => c.inBag).length} in</h3>
                <ul className="mt-2 flex flex-wrap gap-1.5" role="list">
                  {clubs.map((c) => (
                    <li key={c.id}>
                      <ToggleChip
                        pressed={c.inBag}
                        onPressedChange={(p) => update((s) => ({ ...s, bag: s.bag.map((x) => (x.id === c.id ? { ...x, inBag: p } : x)) }))}
                      >
                        {c.name}
                      </ToggleChip>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* II · Handicap and goal */}
      <section aria-labelledby="hcp-h" className="mt-16">
        <SectionHeading id="hcp-h" numeral="II" title="Handicap and goal" />
        <div className="mt-6 grid max-w-xl gap-8">
          <form noValidate onSubmit={saveIndex} className="grid gap-3">
            <Field
              id="l-index"
              label="Your Handicap Index"
              hint="From your GHIN or club card, like 12.4. A plus handicap is written +1.2."
              error={indexError}
            >
              {(a) => (
                <NumberInput
                  {...a}
                  decimal
                  inputMode="text"
                  pattern={undefined}
                  value={shownIndex}
                  onChange={(e) => { setIndexText(e.target.value); if (indexError) setIndexError(undefined); }}
                  className="max-w-[10rem]"
                />
              )}
            </Field>
            <p className="text-[0.95rem] text-ink-2">
              {handicap.source === "computed" ? (
                <>The index you see is <strong className="font-medium text-ink">calculated from {countedRounds} rounds</strong>: {formatIndex(handicap.index)}. The one you enter here is kept for reference only.</>
              ) : handicap.source === "entered" ? (
                <>The index you see is <strong className="font-medium text-ink">as entered</strong>. After {handicap.roundsToFirst} more {handicap.roundsToFirst === 1 ? "round" : "rounds"} it’s calculated from your cards.</>
              ) : (
                <>No index yet. Enter one, or post {handicap.roundsToFirst} rounds and it’s calculated from your cards.</>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" variant="primary">Save index</Button>
              {profile.enteredIndex != null && (
                <Button
                  variant="quiet"
                  onClick={() => {
                    const was = profile.enteredIndex;
                    patchProfile({ enteredIndex: null });
                    setIndexText(null);
                    setIndexError(undefined);
                    toast({ message: "Removed your entered index", action: { label: "Undo", onClick: () => patchProfile({ enteredIndex: was }) } });
                  }}
                >
                  Remove my index
                </Button>
              )}
            </div>
          </form>

          <ChoiceGroup
            legend="Your goal"
            hint="Saved when you choose. The Clubhouse and Stats measure your progress against it."
            layout="grid"
            value={profile.goal}
            onChange={(g) => { patchProfile({ goal: g }); toast({ message: `Goal saved: ${GOALS.find((x) => x.value === g)?.label}` }); }}
            options={GOALS}
          />

          <Field label="Home course" hint="Chosen for you on the Clubhouse Tee off card.">
            {(a) => (
              <Select
                {...a}
                value={profile.homeCourse ?? ""}
                onChange={(e) => { patchProfile({ homeCourse: e.target.value || null }); toast({ message: `Home course: ${courses.find((c) => c.slug === e.target.value)?.name ?? "none"}` }); }}
              >
                {!profile.homeCourse && <option value="">Choose a course</option>}
                {[...courses].sort((x, y) => x.name.localeCompare(y.name)).map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </Select>
            )}
          </Field>
        </div>
      </section>

      {/* III · Honors */}
      <section aria-labelledby="hon-h" className="mt-16">
        <SectionHeading id="hon-h" numeral="III" title="Honors" lede="Small milestones, earned on the course and kept here." />
        <div className="tex-locker on-green mt-6 border border-green-3 p-5 sm:p-8">
          {earned.length ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {earned.map((h) => (
                <li key={h.id} className="brass-plate relative px-8 py-4 text-center">
                  <Screw className="left-2 top-2" />
                  <Screw className="right-2 top-2" />
                  <Screw className="bottom-2 left-2" />
                  <Screw className="bottom-2 right-2" />
                  <h3 className="caps text-[0.74rem] tracking-[0.24em]">{h.title}</h3>
                  <p className="mt-1 font-numeral text-[1.5rem] font-semibold leading-tight">{h.detail}</p>
                  <p className="font-serif text-[0.95rem] italic">
                    {h.roundId ? (
                      <Link href={`/clubhouse/rounds/${h.roundId}`} className="underline decoration-1 underline-offset-[3px] is-hover:decoration-2 focus-visible:outline-[#2a1f0a]">
                        {day(h.date)}<span className="sr-only">: see the card</span>
                      </Link>
                    ) : (
                      day(h.date)
                    )}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid justify-items-start gap-4 sm:justify-items-center sm:text-center">
              <p className="font-serif text-lede text-on-green">Your first honor comes with your first card.</p>
              <div className="flex flex-wrap gap-2">
                <ButtonLink href="/clubhouse" tone="green" variant="secondary">Tee off</ButtonLink>
                <ButtonLink href="/clubhouse/rounds/new" tone="green" variant="quiet">Log a round you’ve played</ButtonLink>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* IV · Your data */}
      <section aria-labelledby="data-h" className="mt-16">
        <SectionHeading id="data-h" numeral="IV" title="Your data" lede="Saved on this device only. There's no account, so keep a copy if the cards matter to you." />
        <div className="mt-6 grid max-w-xl gap-8">
          <div className="grid gap-2">
            <h3 className="font-display text-title text-ink">Keep a copy</h3>
            <p className="text-ink-2">Download every card, your bag, and your settings as one file.</p>
            <div><Button onClick={exportData} variant="secondary">Export my data</Button></div>
          </div>

          <div className="grid gap-2">
            <h3 className="font-display text-title text-ink">Bring a copy back</h3>
            <Field id="l-import" label="Import a saved file" hint="Choose a .json file exported from the Locker. It replaces what's here; you can undo right after." error={importError}>
              {(a) => <TextInput {...a} type="file" accept="application/json,.json" onChange={importData} className="cursor-pointer py-2.5 file:mr-3 file:cursor-pointer file:border file:border-ink file:bg-paper-3 file:px-3 file:py-1 file:font-medium" />}
            </Field>
          </div>

          <Card texture="linen" padding="md" className="grid gap-3">
            <h3 className="font-display text-title text-ink">Demo tools</h3>
            <p className="text-ink-2">See the app full: 13 rounds over four months at Rancho Santa Fe, Torrey Pines, Pebble Beach, and St Andrews. This replaces your rounds, bag, and settings.</p>
            <div><Button variant="secondary" onClick={() => setDialog("sample")}>Load a sample season</Button></div>
          </Card>

          <div className="grid gap-2 border-t border-rule pt-6">
            <h3 className="font-display text-title text-ink">Erase everything</h3>
            <p className="text-ink-2">Removes every card, your index, goal, bag, honors, and any courses you added, and starts fresh.</p>
            <div><Button variant="danger" onClick={() => setDialog("erase")}>Erase everything</Button></div>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={dialog === "sample"}
        title="Replace your data with a sample season?"
        body={<p>Your {store.rounds.length === 1 ? "1 card" : `${store.rounds.length} cards`}, bag, and settings are replaced by 13 sample rounds. Courses you added are kept. Export a copy first if you want to come back to your own.</p>}
        confirmLabel="Load the sample"
        cancelLabel="Keep my data"
        onCancel={() => setDialog(null)}
        onConfirm={() => {
          const sample = sampleSeason(store.customCourses);
          update(() => ({ ...sample, customCourses: store.customCourses }));
          setDialog(null);
          setIndexText(null);
          toast({ message: `Loaded a sample season: ${sample.rounds.length} rounds` });
        }}
      />
      <ConfirmDialog
        open={dialog === "erase"}
        danger
        title="Erase everything?"
        body={<p>Every card, your index and goal, your bag, honors, and added courses are deleted from this device. This can’t be undone.</p>}
        confirmLabel="Erase everything"
        cancelLabel="Keep my data"
        onCancel={() => setDialog(null)}
        onConfirm={() => {
          resetAll();
          try {
            Object.keys(window.localStorage).filter((k) => k.startsWith("18eagles:draft:")).forEach((k) => window.localStorage.removeItem(k));
          } catch {}
          setDialog(null);
          router.push("/clubhouse");
        }}
      />
    </Page>
  );
}

function Screw({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute size-2.5 rounded-full ${className}`}
      style={{ background: "radial-gradient(circle at 35% 35%, #f1dfb2, #8a6a2c 70%)", boxShadow: "inset 0 0 0 .5px rgb(0 0 0 / .4)" }}
    >
      <span className="absolute left-1/2 top-[15%] h-[70%] w-px -translate-x-1/2 rotate-45 bg-[#5a4317]" />
    </span>
  );
}
