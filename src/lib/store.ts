"use client";
// The only persistence: one JSON document in localStorage, read through useSyncExternalStore so every
// component sees the same data, updates are instant, and other tabs stay in sync.
import { useSyncExternalStore } from "react";
import type { Club, HoleEntry, Profile, Round, Store } from "./types";

export const STORAGE_KEY = "18eagles:v1";

export const DEFAULT_BAG: Club[] = [
  { id: "dr", name: "Driver", short: "Dr", kind: "wood", inBag: true },
  { id: "3w", name: "3-wood", short: "3w", kind: "wood", inBag: true },
  { id: "5w", name: "5-wood", short: "5w", kind: "wood", inBag: true },
  { id: "4h", name: "4-hybrid", short: "4h", kind: "hybrid", inBag: true },
  { id: "5i", name: "5-iron", short: "5i", kind: "iron", inBag: true },
  { id: "6i", name: "6-iron", short: "6i", kind: "iron", inBag: true },
  { id: "7i", name: "7-iron", short: "7i", kind: "iron", inBag: true },
  { id: "8i", name: "8-iron", short: "8i", kind: "iron", inBag: true },
  { id: "9i", name: "9-iron", short: "9i", kind: "iron", inBag: true },
  { id: "pw", name: "Pitching wedge", short: "PW", kind: "wedge", inBag: true },
  { id: "gw", name: "Gap wedge (50°)", short: "50°", kind: "wedge", inBag: true },
  { id: "sw", name: "Sand wedge (56°)", short: "56°", kind: "wedge", inBag: true },
  { id: "lw", name: "Lob wedge (60°)", short: "60°", kind: "wedge", inBag: true },
  { id: "pt", name: "Putter", short: "Pt", kind: "putter", inBag: true },
  { id: "3i", name: "3-iron", short: "3i", kind: "iron", inBag: false },
  { id: "4i", name: "4-iron", short: "4i", kind: "iron", inBag: false },
  { id: "3h", name: "3-hybrid", short: "3h", kind: "hybrid", inBag: false },
  { id: "7w", name: "7-wood", short: "7w", kind: "wood", inBag: false },
];

const EMPTY_PROFILE: Profile = { name: null, enteredIndex: null, goal: null, homeCourse: null, lastTee: {}, welcomedAt: null, bagSetAt: null };

export function emptyStore(): Store {
  return { v: 1, profile: { ...EMPTY_PROFILE }, bag: DEFAULT_BAG.map((c) => ({ ...c })), rounds: [], customCourses: [], honorsSeen: [], lastVisit: null };
}

export const emptyEntry = (): HoleEntry => ({ strokes: null, putts: null, fairway: null, penalties: 0, shots: [], note: "" });

// ---------- the external store ----------
let cache: Store | null = null;
const listeners = new Set<() => void>();

function read(): Store {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Store>) : null;
    cache = parsed && parsed.v === 1 ? { ...emptyStore(), ...parsed, profile: { ...EMPTY_PROFILE, ...parsed.profile } } : emptyStore();
  } catch {
    cache = emptyStore(); // corrupted or blocked storage: start clean rather than crash
  }
  return cache;
}

// A failed save (storage full, or blocked by the browser) is never silent: the change is kept in memory, the
// app shows "Couldn't save" with Try again (SaveProblem), and the next successful write clears it.
let saveFailed = false;
const saveListeners = new Set<() => void>();
function persist(next: Store) {
  let ok = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    ok = false; // keep working in memory
  }
  if (ok !== !saveFailed) {
    saveFailed = !ok;
    saveListeners.forEach((l) => l());
  }
  return ok;
}

function write(next: Store) {
  cache = next;
  persist(next);
  listeners.forEach((l) => l());
}

/** True while the latest change couldn't be written to this device. */
export function useSaveFailed(): boolean {
  return useSyncExternalStore(
    (l) => { saveListeners.add(l); return () => { saveListeners.delete(l); }; },
    () => saveFailed,
    () => false,
  );
}

/** Try writing the in-memory cards to this device again. Returns whether it worked. */
export function retrySave(): boolean {
  return persist(read());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

// The server (and the first hydration pass) can't see localStorage. `ready: false` lets pages show a quiet
// placeholder instead of flashing the first-visit screen at a returning golfer.
type Snap = { ready: boolean; store: Store };
const SERVER: Snap = { ready: false, store: emptyStore() };
let clientSnap: Snap | null = null;
function getSnapshot(): Snap {
  const s = read();
  if (!clientSnap || clientSnap.store !== s) clientSnap = { ready: true, store: s };
  return clientSnap;
}

export function useStore(): Snap {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER);
}

export function update(fn: (s: Store) => Store) {
  write(fn(read()));
}

export function resetAll() {
  write(emptyStore());
}

export function exportJSON(): string {
  return JSON.stringify(read(), null, 2);
}

export function importJSON(text: string): string | null {
  try {
    const s = JSON.parse(text) as Store;
    if (s.v !== 1 || !Array.isArray(s.rounds)) return "That file isn't an 18 Eagles export. Choose a file saved from the Locker.";
    write({ ...emptyStore(), ...s, profile: { ...EMPTY_PROFILE, ...s.profile } });
    return null;
  } catch {
    return "That file couldn't be read. Choose the .json file saved from the Locker.";
  }
}

// ---------- helpers used across pages ----------
export const newId = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

export function todayISO(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function upsertRound(r: Round) {
  update((s) => ({ ...s, rounds: s.rounds.some((x) => x.id === r.id) ? s.rounds.map((x) => (x.id === r.id ? r : x)) : [...s.rounds, r] }));
}

export function setEntry(roundId: string, hole: number, patch: Partial<HoleEntry>) {
  update((s) => ({
    ...s,
    rounds: s.rounds.map((r) =>
      r.id !== roundId ? r : { ...r, lastHole: hole, entries: { ...r.entries, [hole]: { ...emptyEntry(), ...r.entries[hole], ...patch } } },
    ),
  }));
}

export function patchProfile(p: Partial<Profile>) {
  update((s) => ({ ...s, profile: { ...s.profile, ...p } }));
}
