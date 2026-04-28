import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PathLayout } from "@/components/PathLayout";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Code2,
  Palette,
  BarChart3,
  Briefcase,
  Server,
  ShieldCheck,
  Trophy,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/paths/career-sim")({
  head: () => ({
    meta: [
      { title: "Career Sim & Earned Badges — Vidyashala Hub" },
      { name: "description", content: "Simulate real careers and showcase verified blockchain badges in your gallery." },
    ],
  }),
  component: CareerSim,
});

type Path = {
  id: string;
  title: string;
  icon: typeof Code2;
  tagline: string;
  steps: string[];
  outcome: string;
  accent: string;
};

const PATHS: Path[] = [
  {
    id: "fe",
    title: "Frontend Engineer",
    icon: Code2,
    tagline: "Build the surfaces millions touch.",
    steps: ["HTML/CSS basics", "JavaScript & TypeScript", "React + state management", "Testing & accessibility", "Design systems"],
    outcome: "Ship a polished SaaS dashboard end-to-end.",
    accent: "from-primary to-primary-glow",
  },
  {
    id: "ds",
    title: "Data Scientist",
    icon: BarChart3,
    tagline: "Turn raw data into decisions.",
    steps: ["Python & NumPy", "Statistics & probability", "Pandas + SQL", "ML fundamentals", "MLOps & deployment"],
    outcome: "Deploy a churn-prediction model to production.",
    accent: "from-primary-glow to-primary",
  },
  {
    id: "pm",
    title: "Product Manager",
    icon: Briefcase,
    tagline: "Connect users, business, and engineering.",
    steps: ["Discovery & interviews", "Specs & wireframes", "Metrics & experiments", "Stakeholder alignment", "Launch & iterate"],
    outcome: "Run a feature from idea to launch with metrics.",
    accent: "from-primary to-primary-glow",
  },
  {
    id: "design",
    title: "Product Designer",
    icon: Palette,
    tagline: "Design experiences that feel inevitable.",
    steps: ["Visual fundamentals", "Figma mastery", "Interaction design", "User research", "Design systems"],
    outcome: "Redesign an app and present a case study.",
    accent: "from-primary-glow to-primary",
  },
  {
    id: "be",
    title: "Backend Engineer",
    icon: Server,
    tagline: "Build the engine behind the experience.",
    steps: ["Linux + networking", "Databases (SQL/NoSQL)", "APIs & auth", "Scalability patterns", "Observability"],
    outcome: "Build a multi-tenant SaaS backend.",
    accent: "from-primary to-primary-glow",
  },
  {
    id: "founder",
    title: "Startup Founder",
    icon: Sparkles,
    tagline: "Solve a problem people will pay you to fix.",
    steps: ["Find a real problem", "Validate fast", "Build an MVP", "First 10 customers", "Fundraise or bootstrap"],
    outcome: "Launch a paid MVP within 60 days.",
    accent: "from-primary-glow to-primary",
  },
];

type Badge = { id: string; name: string; url: string; hash: string; addedAt: number };

function CareerSim() {
  const [activeId, setActiveId] = useState<string>("fe");
  const [completed, setCompleted] = useState<Record<string, number[]>>({});
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("vidyashala_badges");
    if (raw) setBadges(JSON.parse(raw));
    const c = localStorage.getItem("vidyashala_career_progress");
    if (c) setCompleted(JSON.parse(c));
  }, []);

  const active = PATHS.find((p) => p.id === activeId)!;
  const activeCompleted = completed[activeId] ?? [];

  const toggleStep = (idx: number) => {
    const cur = activeCompleted.includes(idx)
      ? activeCompleted.filter((i) => i !== idx)
      : [...activeCompleted, idx];
    const next = { ...completed, [activeId]: cur };
    setCompleted(next);
    localStorage.setItem("vidyashala_career_progress", JSON.stringify(next));
  };

  const progress = Math.round((activeCompleted.length / active.steps.length) * 100);

  return (
    <PathLayout
      eyebrow="Career Sim · Discover"
      title="Try the career. Earn the proof."
      subtitle="Branching career paths with milestone tracking — and a gallery of every blockchain-verified badge you've ever uploaded."
    >
      {/* Path picker */}
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {PATHS.map((p) => {
          const Icon = p.icon;
          const isActive = activeId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                isActive
                  ? "border-primary bg-primary/10 shadow-glow"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${p.accent} shadow-glow`}>
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="mt-3 text-sm font-semibold">{p.title}</div>
            </button>
          );
        })}
      </div>

      {/* Active path */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-card">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${active.accent} shadow-glow`}>
              <active.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">{active.title}</h2>
              <p className="text-sm text-muted-foreground">{active.tagline}</p>
            </div>
          </div>

          {/* progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Your progress</span>
              <span className="text-muted-foreground">{progress}% complete</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* steps */}
          <ol className="mt-6 space-y-2">
            {active.steps.map((step, i) => {
              const done = activeCompleted.includes(i);
              return (
                <li key={step}>
                  <button
                    onClick={() => toggleStep(i)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all hover:-translate-y-0.5 ${
                      done
                        ? "border-primary/40 bg-primary/10 text-foreground"
                        : "border-border bg-background/50 hover:border-primary/40"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                        done ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs">{i + 1}</span>}
                    </div>
                    <span className={done ? "line-through opacity-70" : ""}>{step}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <Trophy className="h-5 w-5 shrink-0 text-primary" />
            <div className="text-sm">
              <div className="font-semibold">Outcome</div>
              <div className="text-muted-foreground">{active.outcome}</div>
            </div>
          </div>
        </div>

        {/* Badge gallery */}
        <div className="rounded-3xl border border-border bg-card p-7 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-bold">Earned Badges</h3>
            </div>
            <span className="text-xs text-muted-foreground">{badges.length} verified</span>
          </div>

          {badges.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center">
              <Trophy className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">
                No badges yet. Mint your first one in Blockchain Badging.
              </p>
              <a
                href="/paths/blockchain-badging"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Go mint a badge <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {badges.map((b) => (
                <a
                  key={b.id}
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-border bg-background/50 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/60"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/20 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
                  <div className="relative flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                      <ShieldCheck className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{b.name}</div>
                      <div className="mt-0.5 truncate font-mono text-[10px] text-primary">{b.hash}</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          <Button
            asChild
            variant="outline"
            className="mt-6 w-full border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <a href="/paths/blockchain-badging">
              <Compass className="mr-2 h-4 w-4" /> Add a new badge
            </a>
          </Button>
        </div>
      </div>
    </PathLayout>
  );
}
