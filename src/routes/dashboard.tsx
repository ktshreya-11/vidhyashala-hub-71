import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { useProfile } from "@/hooks/use-profile";
import { TrendingUp, Users, Trophy, BookOpen, GraduationCap, Briefcase, Check, X } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Vidyashala Hub" },
      { name: "description", content: "Your personal learning dashboard — track hubs, progress, and earned badges." },
      { property: "og:title", content: "Dashboard — Vidyashala Hub" },
      { property: "og:description", content: "Track your learning hubs, progress and badges." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { icon: Users, label: "Active Hubs", value: "8" },
  { icon: BookOpen, label: "Courses", value: "12" },
  { icon: Trophy, label: "Badges", value: "24" },
  { icon: TrendingUp, label: "Streak", value: "47d" },
];

function Dashboard() {
  const { profile, setRole } = useProfile();
  const isPro = profile.role === "professional";
  const initials = profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <BackButton variant="light" />

          {/* Profile card */}
          <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <div className="relative h-32 bg-gradient-hero">
              <div className="absolute inset-0 bg-gradient-glow opacity-50" />
            </div>
            <div className="relative -mt-12 px-6 pb-6 md:flex md:items-end md:justify-between md:gap-6">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-card bg-gradient-primary text-2xl font-bold text-primary-foreground shadow-glow">
                  {initials || "VH"}
                </div>
                <div className="pb-2">
                  <p className="text-xs text-muted-foreground">Welcome back 👋</p>
                  <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{profile.name}</h1>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                        isPro
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {isPro ? <Briefcase className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
                      {isPro ? "Professional" : "Student"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">@{profile.username}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-1 rounded-full border border-border bg-background p-1 md:mt-0">
                {(["student", "professional"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      profile.role === r
                        ? "bg-gradient-primary text-primary-foreground shadow-glow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r === "student" ? <GraduationCap className="h-3.5 w-3.5" /> : <Briefcase className="h-3.5 w-3.5" />}
                    {r === "student" ? "Student" : "Pro"}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="border-t border-border px-6 py-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-widest text-muted-foreground">Overall Progress</span>
                <span className="font-bold text-foreground">{profile.progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-primary shadow-glow transition-all"
                  style={{ width: `${profile.progress}%` }}
                />
              </div>
              <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-background/50 p-3">
                  <div className="font-semibold text-foreground">Permissions</div>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li className="flex items-center gap-1.5">
                      {isPro ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-rose-500" />}
                      Task Upload
                    </li>
                    <li className="flex items-center gap-1.5">
                      {isPro ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-rose-500" />}
                      Review Submissions
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-500" /> Browse Tasks
                    </li>
                    <li className="flex items-center gap-1.5">
                      {isPro ? <X className="h-3 w-3 text-rose-500" /> : <Check className="h-3 w-3 text-emerald-500" />}
                      Submit Tasks
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg border border-border bg-background/50 p-3">
                  <div className="font-semibold text-foreground">Member since</div>
                  <div className="mt-2 text-muted-foreground">
                    {new Date(profile.joined).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="mt-4 font-display text-3xl font-bold text-foreground">{value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2">
              <h2 className="font-display text-xl font-semibold text-foreground">Your Active Hubs</h2>
              <ul className="mt-4 divide-y divide-border">
                {["Calculus Crew", "Frontend Friday", "UPSC Prep 2026", "Startup Lab"].map((h) => (
                  <li key={h} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-sm font-bold text-primary-foreground">
                        {h[0]}
                      </div>
                      <span className="font-medium text-foreground">{h}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Open →</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-primary p-6 text-primary-foreground shadow-elegant">
              <Trophy className="h-8 w-8" />
              <h3 className="mt-4 font-display text-xl font-bold">Career Sim</h3>
              <p className="mt-2 text-sm opacity-90">Complete this week's challenge to earn the "Product Thinker" badge.</p>
              <button className="mt-6 rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5">
                Start now
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
