import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AuthRole = "student" | "professional";
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: AuthRole;
  provider: "email" | "google" | "phone";
  avatar?: string;
  joinedAt: number;
};

const META_KEY = "vidyashala_auth_meta"; // role+provider+name fallback

type Meta = { role: AuthRole; provider: AuthUser["provider"]; name?: string };

function readMeta(): Meta {
  if (typeof window === "undefined") return { role: "student", provider: "email" };
  try {
    return { role: "student", provider: "email", ...JSON.parse(localStorage.getItem(META_KEY) || "{}") };
  } catch {
    return { role: "student", provider: "email" };
  }
}

function writeMeta(m: Partial<Meta>) {
  const cur = readMeta();
  localStorage.setItem(META_KEY, JSON.stringify({ ...cur, ...m }));
}

function toUser(session: any | null): AuthUser | null {
  if (!session?.user) return null;
  const u = session.user;
  const meta = readMeta();
  const name =
    u.user_metadata?.display_name ||
    meta.name ||
    (u.email ? u.email.split("@")[0] : "User");
  return {
    id: u.id,
    name,
    email: u.email ?? "",
    phone: u.phone ?? "",
    role: (u.user_metadata?.role as AuthRole) || meta.role,
    provider: (u.app_metadata?.provider as AuthUser["provider"]) || meta.provider || "email",
    avatar: u.user_metadata?.avatar_url,
    joinedAt: u.created_at ? new Date(u.created_at).getTime() : Date.now(),
  };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let alive = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!alive) return;
      setUser(toUser(session));
      setHydrated(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setUser(toUser(data.session));
      setHydrated(true);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Compatibility with previous API. `login` here doesn't issue auth — call
  // signUp/signIn directly. We keep it to set local meta + role.
  const login = (u: Partial<AuthUser> & { role?: AuthRole; name?: string }) => {
    writeMeta({ role: u.role, provider: u.provider, name: u.name });
  };
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return {
    user: hydrated ? user : null,
    isAuthed: hydrated && !!user,
    login,
    logout,
    hydrated,
  };
}

// Convenience signup/signin helpers callable from forms.
export async function signUpWithEmail(opts: {
  email: string;
  password: string;
  name: string;
  role: AuthRole;
}) {
  writeMeta({ role: opts.role, provider: "email", name: opts.name });
  const { data, error } = await supabase.auth.signUp({
    email: opts.email,
    password: opts.password,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
      data: { display_name: opts.name, role: opts.role },
    },
  });
  if (error) throw error;
  // Best-effort: ensure profile + user_role rows exist
  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      display_name: opts.name,
      is_professional: opts.role === "professional",
    });
    await supabase.from("user_roles").upsert({ user_id: data.user.id, role: opts.role });
  }
  return data;
}

export async function signInWithEmail(opts: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: opts.email,
    password: opts.password,
  });
  if (error) throw error;
  return data;
}
