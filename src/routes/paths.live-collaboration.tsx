import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PathLayout } from "@/components/PathLayout";
import { Button } from "@/components/ui/button";
import { Code2, Layers, Server, Database, Boxes, PlayCircle, BookOpen, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/paths/live-collaboration")({
  head: () => ({
    meta: [
      { title: "Web Development — Vidyashala Hub" },
      { name: "description", content: "Full-stack MERN/MEAN courses with a live preview coding environment." },
    ],
  }),
  component: WebDev,
});

type Course = {
  id: string;
  name: string;
  stack: "MERN" | "MEAN" | "Frontend" | "Backend";
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  modules: string[];
  icon: typeof Code2;
};

const COURSES: Course[] = [
  {
    id: "mern",
    name: "MERN Full-Stack",
    stack: "MERN",
    level: "Intermediate",
    duration: "8 weeks",
    icon: Boxes,
    modules: ["MongoDB schemas", "Express APIs", "React + hooks", "Node.js & auth", "Deploy to Vercel"],
  },
  {
    id: "mean",
    name: "MEAN Full-Stack",
    stack: "MEAN",
    level: "Intermediate",
    duration: "8 weeks",
    icon: Layers,
    modules: ["MongoDB", "Express", "Angular components", "RxJS state", "CI/CD pipeline"],
  },
  {
    id: "fe",
    name: "Modern Frontend",
    stack: "Frontend",
    level: "Beginner",
    duration: "6 weeks",
    icon: Code2,
    modules: ["HTML & CSS", "JavaScript ES2024", "React + TS", "Tailwind & UI", "Performance"],
  },
  {
    id: "be",
    name: "Backend Engineering",
    stack: "Backend",
    level: "Advanced",
    duration: "10 weeks",
    icon: Server,
    modules: ["REST & GraphQL", "Auth & RBAC", "PostgreSQL & Redis", "Queues & workers", "Observability"],
  },
];

const SAMPLE = `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      body { font-family: system-ui; padding: 2rem; background: #0b1020; color: #e6eaf2; }
      h1 { background: linear-gradient(90deg,#60a5fa,#a78bfa); -webkit-background-clip: text; color: transparent; }
      button { padding: .6rem 1rem; border-radius: .6rem; border: 0; background: #2563eb; color: white; cursor: pointer; }
    </style>
  </head>
  <body>
    <h1>Hello from Web Dev Lab 👋</h1>
    <p>Edit the HTML on the left — preview updates instantly.</p>
    <button onclick="alert('It works!')">Click me</button>
  </body>
</html>`;

function WebDev() {
  const [activeId, setActiveId] = useState("mern");
  const [done, setDone] = useState<Record<string, number[]>>({});
  const [code, setCode] = useState(SAMPLE);

  const active = COURSES.find((c) => c.id === activeId)!;
  const completed = done[activeId] ?? [];
  const progress = Math.round((completed.length / active.modules.length) * 100);

  const toggle = (i: number) => {
    const cur = completed.includes(i) ? completed.filter((x) => x !== i) : [...completed, i];
    setDone({ ...done, [activeId]: cur });
  };

  const previewSrc = useMemo(() => `data:text/html;charset=utf-8,${encodeURIComponent(code)}`, [code]);

  return (
    <PathLayout
      eyebrow="Build · Web Development"
      title="Ship full-stack apps from your browser."
      subtitle="MERN & MEAN courses with a built-in coding environment and instant live preview."
    >
      {/* Course picker */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {COURSES.map((c) => {
          const Icon = c.icon;
          const isActive = activeId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`group rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                isActive ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="mt-3 text-sm font-semibold">{c.name}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{c.stack} · {c.level} · {c.duration}</div>
            </button>
          );
        })}
      </div>

      {/* Modules + progress */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <BookOpen className="h-3.5 w-3.5" /> Modules · {active.name}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Your progress</span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-gradient-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <ol className="mt-5 space-y-2">
            {active.modules.map((m, i) => {
              const isDone = completed.includes(i);
              return (
                <li key={m}>
                  <button
                    onClick={() => toggle(i)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all hover:-translate-y-0.5 ${
                      isDone ? "border-primary/40 bg-primary/10" : "border-border bg-background/50 hover:border-primary/40"
                    }`}
                  >
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${isDone ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs">{i + 1}</span>}
                    </div>
                    <span className={isDone ? "line-through opacity-70" : ""}>{m}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Live coding environment */}
        <div className="rounded-3xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <PlayCircle className="h-3.5 w-3.5" /> Live Preview
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setCode(SAMPLE)}>Reset</Button>
            </div>
          </div>
          <div className="grid gap-0 md:grid-cols-2">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="h-[420px] w-full resize-none border-r border-border bg-[oklch(0.18_0.02_260)] p-4 font-mono text-xs text-emerald-300 outline-none"
            />
            <iframe
              title="preview"
              src={previewSrc}
              sandbox="allow-scripts"
              className="h-[420px] w-full bg-white"
            />
          </div>
          <div className="flex items-center gap-2 border-t border-border px-5 py-3 text-[11px] text-muted-foreground">
            <Database className="h-3.5 w-3.5 text-primary" />
            Edits update the preview instantly · sandboxed iframe
          </div>
        </div>
      </div>
    </PathLayout>
  );
}
