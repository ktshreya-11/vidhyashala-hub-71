import { Link } from "@tanstack/react-router";
import { Code2, ShieldCheck, Briefcase, Radio, ArrowUpRight } from "lucide-react";

const paths = [
  {
    to: "/paths/dsa-lab",
    icon: Code2,
    title: "DSA Lab",
    tag: "Coding",
    desc: "Solve problems in a built-in VS Code editor with multi-language support — LeetCode-style, in your hub.",
    accent: "from-primary to-primary-glow",
  },
  {
    to: "/paths/blockchain-badging",
    icon: ShieldCheck,
    title: "Blockchain Badging",
    tag: "Verification",
    desc: "Upload your badge URLs, save them on-chain, and verify their authenticity in one click.",
    accent: "from-primary-glow to-primary",
  },
  {
    to: "/paths/industry-link",
    icon: Briefcase,
    title: "Industry Link",
    tag: "Mentorship",
    desc: "Professionals post real-world tasks. Students browse, submit, and track progress with reviews.",
    accent: "from-primary to-primary-glow",
  },
  {
    to: "/paths/live-collaboration",
    icon: Radio,
    title: "Live Collaboration",
    tag: "Teamwork",
    desc: "Step into a Virtual War-Room — distributed teams plan, build, and ship projects together.",
    accent: "from-primary-glow to-primary",
  },
] as const;

export function Paths() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Explore Paths
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
              Four ways to <span className="text-gradient">level up</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Pick a path, dive in, and start building tangible proof of your skills.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {paths.map(({ to, icon: Icon, title, tag, desc, accent }) => (
            <Link
              key={to}
              to={to}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-elegant"
            >
              {/* glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
              {/* grid pattern */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              <div className="relative flex items-start justify-between">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} shadow-glow`}>
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/50 transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
                </div>
              </div>

              <div className="relative mt-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">{tag}</span>
                <h3 className="mt-2 font-display text-2xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
