import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Briefcase, Mail, Phone, Lock, User, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type AuthRole, signUpWithEmail } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { Mascot } from "@/components/Mascot";
import { BackButton } from "@/components/BackButton";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — Vidyashala Hub" },
      { name: "description", content: "Create your Vidyashala Hub account as Student or Professional." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setRole, setProfile } = useProfile();
  const [role, setRoleState] = useState<AuthRole>("student");
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!name.trim()) { setErr("Please enter your name."); return; }
    if (tab !== "email") { setErr("Phone signup not enabled — please use email."); return; }
    if (!email.includes("@") || password.length < 6) { setErr("Valid email + 6+ char password required."); return; }
    setBusy(true);
    try {
      await signUpWithEmail({ email, password, name: name.trim(), role });
      login({ role, provider: "email", name: name.trim() });
      setRole(role);
      setProfile({ name: name.trim(), username: name.trim().toLowerCase().replace(/\s+/g, "-").slice(0, 20) || "user" });
      toast.success("Welcome to Vidyashala!");
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      setErr(e?.message || "Sign up failed");
    } finally {
      setBusy(false);
    }
  };

  const google = () => toast.info("Google sign-in is not configured yet — use email.");

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[minmax(380px,420px)_1fr] lg:py-16">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant order-2 lg:order-1">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <BackButton variant="light" fallback="/" />
          </div>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display text-xl font-bold">Create account</div>
              <div className="text-xs text-muted-foreground">Join 12k+ learners on Vidyashala</div>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-2">
            {(["student", "professional"] as AuthRole[]).map((r) => {
              const active = role === r;
              const Icon = r === "student" ? GraduationCap : Briefcase;
              return (
                <button key={r} onClick={() => setRoleState(r)} type="button"
                  className={"flex items-center justify-between rounded-xl border p-3 text-left transition-all " + (active ? "border-primary bg-primary/10 ring-1 ring-primary/40" : "border-border hover:border-primary/40")}>
                  <div className="flex items-center gap-2">
                    <Icon className={"h-4 w-4 " + (active ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-xs font-semibold capitalize">{r}</span>
                  </div>
                  {active && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              );
            })}
          </div>

          <button onClick={google} type="button"
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold transition-all hover:border-primary/60 hover:bg-primary/5">
            <GoogleIcon /> Continue with Google
          </button>

          <div className="my-3 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>

          <div className="mb-3 flex rounded-lg border border-border p-1 text-xs">
            {(["email", "phone"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} type="button"
                className={"flex-1 rounded-md py-1.5 font-semibold capitalize transition-colors " + (tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>{t}</button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label className="mb-1 block text-xs">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Sharma" className="pl-9" />
              </div>
            </div>
            {tab === "email" ? (
              <div>
                <Label className="mb-1 block text-xs">Email (Gmail or any)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@gmail.com" className="pl-9" />
                </div>
              </div>
            ) : (
              <div>
                <Label className="mb-1 block text-xs">Phone (Contact)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+91 98765 43210" className="pl-9" />
                </div>
              </div>
            )}
            <div>
              <Label className="mb-1 block text-xs">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="At least 6 characters" className="pl-9" />
              </div>
            </div>
            {err && <div className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</div>}
            <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
              {busy ? "Creating..." : <>Create account <ArrowRight className="ml-1 h-4 w-4" /></>}
            </Button>
          </form>

          <div className="mt-5 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </div>
        </div>

        <div className="hidden flex-col justify-between rounded-3xl border border-white/10 bg-black/30 p-10 text-white lg:flex order-1 lg:order-2">
          <div>
            <BackButton variant="dark" fallback="/" />
            <h1 className="mt-8 font-display text-5xl font-bold leading-tight">
              Start learning with <br /><span className="bg-gradient-to-r from-primary-glow to-white bg-clip-text text-transparent">smart mentors</span>
            </h1>
            <p className="mt-4 max-w-md text-white/70">Join hubs, complete coding labs, earn verifiable badges, and ship real projects.</p>
          </div>
          <div className="flex items-end justify-between">
            <Mascot variant="astro" size={180} />
            <Mascot variant="fox" size={140} />
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.12c-.22-.66-.35-1.37-.35-2.12s.13-1.46.35-2.12V7.04H2.18C1.43 8.54 1 10.22 1 12s.43 3.46 1.18 4.96l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
  );
}
