import { Link } from "@tanstack/react-router";
import { GitBranch, Cloud, Activity, Cpu, ShieldCheck, ArrowRight } from "lucide-react";

const tools = [
  { icon: GitBranch, title: "Versioned Workspaces", desc: "Git-backed branches per teammate. Roll back any decision." },
  { icon: Cloud, title: "Edge Compute", desc: "Code runs at the edge near every contributor — sub-50ms RTT worldwide." },
  { icon: Activity, title: "Live Telemetry", desc: "Heartbeats, traces, and on-call rotation built into the war-room." },
  { icon: Cpu, title: "Distributed Build", desc: "Parallelize tests + compiles across the team's idle compute." },
  { icon: ShieldCheck, title: "Zero-Trust Access", desc: "Per-task scoped tokens. Mentors review without seeing secrets." },
];

export function BuildWithGlobal() {
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
            <Link
              to="/paths/live-collaboration"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-elegant"
            >
              Explore the toolkit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {tools.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/[0.06]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary-glow ring-1 ring-primary/30">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-display text-base font-semibold">{title}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
