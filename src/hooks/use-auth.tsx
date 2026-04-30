import { useEffect, useState, useSyncExternalStore } from "react";

export type AuthRole = "student" | "professional";
export type AuthUser = {
  name: string;
  email: string;
  phone?: string;
  role: AuthRole;
  provider: "email" | "google" | "phone";
  avatar?: string;
  joinedAt: number;
};

const KEY = "vidyashala_auth_user";
const EVENT = "vidyashala:auth";

let cachedRaw: string | null = null;
let cachedUser: AuthUser | null = null;

function read(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cachedRaw) return cachedUser;
    cachedRaw = raw;
    cachedUser = raw ? (JSON.parse(raw) as AuthUser) : null;
    return cachedUser;
  } catch {
    return cachedUser;
  }
}

function write(u: AuthUser | null) {
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
  cachedRaw = u ? JSON.stringify(u) : null;
  cachedUser = u;
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

const getServerSnapshot = () => null;

export function useAuth() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const user = useSyncExternalStore(subscribe, read, getServerSnapshot);

  const login = (u: AuthUser) => write(u);
  const logout = () => write(null);

  return {
    user: hydrated ? user : null,
    isAuthed: hydrated && !!user,
    login,
    logout,
    hydrated,
  };
}
