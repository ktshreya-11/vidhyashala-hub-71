import { useEffect, useState, useSyncExternalStore } from "react";

export type Notif = {
  id: string;
  title: string;
  body: string;
  at: number;
  read: boolean;
  kind: "hub" | "task" | "badge" | "system";
};

const KEY = "vidyashala_notifs";
const EVENT = "vidyashala:notifs";

const EMPTY: Notif[] = [];
let cachedRaw: string | null = null;
let cachedItems: Notif[] = EMPTY;

function read(): Notif[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cachedRaw) return cachedItems;
    cachedRaw = raw;
    cachedItems = raw ? JSON.parse(raw) : EMPTY;
    return cachedItems;
  } catch {
    return cachedItems;
  }
}

function write(items: Notif[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  cachedRaw = localStorage.getItem(KEY);
  cachedItems = items;
  window.dispatchEvent(new CustomEvent(EVENT));
}

const getServerSnapshot = () => EMPTY;

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};

export function pushNotification(n: Omit<Notif, "id" | "at" | "read">) {
  if (typeof window === "undefined") return;
  const next: Notif = { ...n, id: crypto.randomUUID(), at: Date.now(), read: false };
  write([next, ...read()].slice(0, 30));
}

export function useNotifications() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const items = useSyncExternalStore(subscribe, read, () => []);

  const markAllRead = () => write(items.map((n) => ({ ...n, read: true })));
  const clear = () => write([]);
  const unread = items.filter((n) => !n.read).length;

  return { items: hydrated ? items : [], unread: hydrated ? unread : 0, markAllRead, clear };
}
