import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { TrendingUp, Users, Trophy, BookOpen } from "lucide-react";

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
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <BackButton variant="light" />
          <div>
            <p className="text-sm text-muted-foreground">Welcome back 👋</p>
            <h1 className="mt-1 font-display text-4xl font-bold">Your Dashboard</h1>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="mt-4 font-display text-3xl font-bold">{value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2">
              <h2 className="font-display text-xl font-semibold">Your Active Hubs</h2>
              <ul className="mt-4 divide-y divide-border">
                {["Calculus Crew", "Frontend Friday", "UPSC Prep 2026", "Startup Lab"].map((h) => (
                  <li key={h} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-sm font-bold text-primary-foreground">
                        {h[0]}
                      </div>
                      <span className="font-medium">{h}</span>
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
