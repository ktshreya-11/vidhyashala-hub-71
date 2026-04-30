import { useEffect, useState, useSyncExternalStore } from "react";
import { pushNotification } from "@/hooks/use-notifications";

export type Badge = {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Course";
  icon: string;
  earnedAt: number;
};

const KEY = "vidyashala_badges";
const EVENT = "vidyashala:badges";

const EMPTY: Badge[] = [];
let cachedRaw: string | null = null;
let cachedItems: Badge[] = EMPTY;

function read(): Badge[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cachedRaw) return cachedItems;
    cachedRaw = raw;
    cachedItems = raw ? (JSON.parse(raw) as Badge[]) : EMPTY;
    return cachedItems;
  } catch {
    return cachedItems;
  }
}

function write(items: Badge[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  cachedRaw = localStorage.getItem(KEY);
  cachedItems = items;
  window.dispatchEvent(new CustomEvent(EVENT));
}

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};

const getServerSnapshot = () => EMPTY;

export function awardBadge(b: Omit<Badge, "earnedAt">) {
  if (typeof window === "undefined") return false;
  const current = read();
  if (current.some((x) => x.id === b.id)) return false;
  const next: Badge = { ...b, earnedAt: Date.now() };
  write([next, ...current]);
  pushNotification({
    kind: "badge",
    title: "🏆 Badge unlocked: " + b.title,
    body: "Topic: " + b.topic + " · " + b.difficulty,
  });
  return true;
}

export function useBadges() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const items = useSyncExternalStore(subscribe, read, getServerSnapshot);
  return {
    badges: hydrated ? items : EMPTY,
    count: hydrated ? items.length : 0,
    clear: () => write([]),
  };
}
