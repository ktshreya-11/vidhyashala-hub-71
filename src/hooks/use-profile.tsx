import { useEffect, useState, useSyncExternalStore } from "react";

export type Role = "student" | "professional";
export type Profile = {
  name: string;
  username: string;
  role: Role;
  joined: number;
  progress: number; // 0-100
};

const KEY = "vidyashala_profile";
const EVENT = "vidyashala:profile";

const DEFAULT: Profile = {
  name: "Guest Learner",
  username: "guest",
  role: "student",
  joined: 0,
  progress: 32,
};

let cachedRaw: string | null = null;
let cachedProfile: Profile = DEFAULT;

function read(): Profile {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cachedRaw) return cachedProfile;
    cachedRaw = raw;
    cachedProfile = raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
    return cachedProfile;
  } catch {
    return cachedProfile;
  }
}

function write(p: Profile) {
  localStorage.setItem(KEY, JSON.stringify(p));
  cachedRaw = localStorage.getItem(KEY);
  cachedProfile = p;
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

const getServerSnapshot = () => DEFAULT;

export function useProfile() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const profile = useSyncExternalStore(subscribe, read, getServerSnapshot);

  const setRole = (role: Role) => write({ ...profile, role });
  const setProfile = (patch: Partial<Profile>) => write({ ...profile, ...patch });

  return { profile: hydrated ? profile : DEFAULT, setRole, setProfile, hydrated };
}
