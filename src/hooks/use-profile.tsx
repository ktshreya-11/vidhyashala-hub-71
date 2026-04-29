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
  joined: Date.now(),
  progress: 32,
};

function read(): Profile {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function write(p: Profile) {
  localStorage.setItem(KEY, JSON.stringify(p));
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

export function useProfile() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const profile = useSyncExternalStore(subscribe, read, () => DEFAULT);

  const setRole = (role: Role) => write({ ...profile, role });
  const setProfile = (patch: Partial<Profile>) => write({ ...profile, ...patch });

  return { profile: hydrated ? profile : DEFAULT, setRole, setProfile, hydrated };
}
