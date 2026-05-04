import { useState } from "react";
import { GitBranch, Cloud, Activity, Cpu, ShieldCheck, ArrowRight, X } from "lucide-react";

type Tool = {
  icon: typeof GitBranch;
  title: string;
  desc: string;
  detail: {
    intro: string;
    points: string[];
    example: string;
  };
};

const tools: Tool[] = [
  {
    icon: GitBranch,
    title: "Versioned Workspaces",
    desc: "Git-backed branches per teammate. Roll back any decision.",
    detail: {
      intro: "Every teammate gets their own isolated branch tied to a shared mainline. Switch, diff, and merge without leaving the war-room.",
      points: ["Per-user feature branches with auto-sync", "Visual diff against main", "One-click rollback to any prior state", "Protected mainline with mentor reviews"],
      example: "Push an experiment to your own branch, get reviewed, and squash-merge into main — all without a terminal.",
    },
  },
  {
    icon: Cloud,
    title: "Edge Compute",
    desc: "Code runs at the edge near every contributor — sub-50ms RTT worldwide.",
    detail: {
      intro: "Your dev environments run on the closest edge node, so previews and tests feel local for everyone on the team.",
      points: ["300+ edge locations", "Sub-50ms cold-start", "Auto-scales per session", "Streaming logs to every client"],
      example: "A teammate in Lagos and one in Tokyo both see the same preview update in under 100ms.",
    },
  },
  {
    icon: Activity,
    title: "Live Telemetry",
    desc: "Heartbeats, traces, and on-call rotation built into the war-room.",
    detail: {
      intro: "See who's online, what's running, and what's broken — without bolting on a separate observability stack.",
      points: ["Presence indicators per file", "Distributed traces inline", "Custom alert thresholds", "On-call rotation calendar"],
      example: "A failing test pings the on-call engineer and surfaces the exact stack trace in chat.",
    },
  },
  {
    icon: Cpu,
    title: "Distributed Build",
    desc: "Parallelize tests + compiles across the team's idle compute.",
    detail: {
      intro: "Builds shard themselves across all available teammate machines and edge workers, cutting CI from minutes to seconds.",
      points: ["Auto-shard test suites", "Cache layers shared team-wide", "Idle-machine reclamation", "Deterministic, hashed artifacts"],
      example: "A 12-minute monorepo test suite finishes in 38 seconds when 6 teammates are online.",
    },
  },
  {
    icon: ShieldCheck,
    title: "Zero-Trust Access",
    desc: "Per-task scoped tokens. Mentors review without seeing secrets.",
    detail: {
      intro: "Permissions are scoped to a single task and expire automatically. Mentors review your work without ever touching production credentials.",
      points: ["Just-in-time scoped tokens", "Secret redaction in reviews", "Audit log per action", "SSO + hardware keys supported"],
      example: "A mentor reviews your Stripe integration without ever seeing the API key.",
    },
  },
];

export function BuildWithGlobal() {
  const [expanded, setExpanded] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden bg-black py-24 text-white">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(1 0 0 / 0.08) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-glow">
              <Activity className="h-3 w-3" /> Build with Global
            </div>
            <h2 className="mt-5 font-display text-4xl font-bold leading-tight md:text-6xl">
              Distributed Engineering{" "}
              <span className="bg-gradient-to-r from-primary-glow via-white to-primary-glow bg-clip-text text-transparent">
                Tools
              </span>
            </h2>
            <p className="mt-5 max-w-lg text-base text-white/65">
              Less "let's hop on a call." More shipping. A toolchain designed for teammates spread across timezones — async by default, real-time when it matters.
            </p>
            <button
              onClick={() => setExpanded((s) => !s)}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-elegant"
            >
              {expanded ? "Hide the toolkit" : "Explore the toolkit"}
              <ArrowRight className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : "group-hover:translate-x-1"}`} />
            </button>
          </div>

          <div
            className={`grid gap-3 transition-all duration-500 sm:grid-cols-2 ${
              expanded ? "max-h-[2000px] opacity-100" : "max-h-[420px] opacity-100"
            }`}
          >
            {tools.map(({ icon: Icon, title, desc }, i) => (
              <button
                key={title}
                onClick={() => expanded && setOpenIdx(i)}
                disabled={!expanded}
                className={`group rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/[0.06] ${
                  expanded ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary-glow ring-1 ring-primary/30">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-display text-base font-semibold">{title}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-white/60">{desc}</p>
                {expanded && (
                  <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary-glow">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {openIdx !== null && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur"
          onClick={() => setOpenIdx(null)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-primary/30 bg-[oklch(0.13_0.04_258)] p-8 text-white shadow-elegant"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenIdx(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            {(() => {
              const t = tools[openIdx];
              const Icon = t.icon;
              return (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-2xl font-bold">{t.title}</h3>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-white/75">{t.detail.intro}</p>
                  <ul className="mt-5 space-y-2">
                    {t.detail.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-white/85">
                        <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary-glow shadow-[0_0_10px_oklch(0.75_0.2_258)]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-white/80">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-primary-glow">In practice</div>
                    <p className="mt-1">{t.detail.example}</p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
}
