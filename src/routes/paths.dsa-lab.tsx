import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { PathLayout } from "@/components/PathLayout";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle2, Circle, Terminal, ListChecks, Send, Trophy, Lightbulb } from "lucide-react";
import { PROBLEMS, TOPICS, topicIcon, type Difficulty, type DsaTopic } from "@/data/dsa-problems";
import { awardBadge, useBadges } from "@/hooks/use-badges";
import { Mascot } from "@/components/Mascot";

export const Route = createFileRoute("/paths/dsa-lab")({
  head: () => ({
    meta: [
      { title: "DSA Lab — 50+ Coding Problems · Vidyashala Hub" },
      { name: "description", content: "Solve 50+ DSA problems across Arrays, Strings, Linked List, DP, Graphs, Sorting and more. Run commands, submit, earn badges." },
    ],
  }),
  component: DsaLab,
});

const LANGS = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
  { id: "java", label: "Java" },
] as const;

const DIFFS: ("All" | Difficulty)[] = ["All", "Easy", "Medium", "Hard"];

const diffColor = (d: Difficulty) =>
  d === "Easy" ? "text-emerald-500" : d === "Medium" ? "text-amber-500" : "text-rose-500";
const diffDot = (d: Difficulty) =>
  d === "Easy" ? "bg-emerald-500" : d === "Medium" ? "bg-amber-500" : "bg-rose-500";

const STORAGE_KEY = "vidyashala_dsa_completed";

function DsaLab() {
  const [topic, setTopic] = useState<"All" | DsaTopic>("All");
  const [diff, setDiff] = useState<"All" | Difficulty>("All");
  const [activeId, setActiveId] = useState<string>(PROBLEMS[0].id);
  const [lang, setLang] = useState<typeof LANGS[number]>(LANGS[0]);
  const [code, setCode] = useState<string>(PROBLEMS[0].starter);
  const [output, setOutput] = useState<string>("// Run your code or step through commands to see output");
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const { count: badgeCount } = useBadges();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setCompleted(JSON.parse(raw));
  }, []);

  const persist = (c: Record<string, boolean>) => {
    setCompleted(c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  };

  const active = useMemo(() => PROBLEMS.find((p) => p.id === activeId)!, [activeId]);
  const visible = useMemo(
    () => PROBLEMS.filter((p) =>
      (topic === "All" || p.topic === topic) &&
      (diff === "All" || p.difficulty === diff)
    ),
    [topic, diff]
  );

  const completedCount = Object.values(completed).filter(Boolean).length;

  const pickProblem = (id: string) => {
    const p = PROBLEMS.find((x) => x.id === id)!;
    setActiveId(id);
    setCode(p.starter);
    setStepIdx(0);
    setOutput("// Loaded: " + p.title);
  };

  const runStep = () => {
    if (stepIdx >= active.commands.length) {
      setOutput("// All commands executed. Click Submit to claim your badge.");
      return;
    }
    const cmd = active.commands[stepIdx];
    setOutput((o) => o + "\n$ " + cmd + "\n  ✓ ok");
    setStepIdx((i) => i + 1);
  };

  const run = async () => {
    setRunning(true);
    setOutput("// Running...");
    await new Promise((r) => setTimeout(r, 400));
    if (lang.id === "javascript") {
      const logs: string[] = [];
      try {
        const fn = new Function("console", code);
        fn({ log: (...a: unknown[]) => logs.push(a.map(String).join(" ")) });
        setOutput(logs.join("\n") || "// (no output)");
      } catch (e) {
        setOutput("Error: " + (e as Error).message);
      }
    } else {
      setOutput("// Simulated " + lang.label + " runtime\nExecution finished in 12ms");
    }
    setRunning(false);
  };

  const submit = () => {
    if (stepIdx < active.commands.length) {
      setOutput((o) => o + "\n// ⚠ Run all " + active.commands.length + " commands before submitting.");
      return;
    }
    persist({ ...completed, [active.id]: true });
    awardBadge({
      id: "dsa-" + active.id,
      title: active.title,
      topic: active.topic,
      difficulty: active.difficulty,
      icon: topicIcon[active.topic],
    });
    setOutput("// 🏆 Submission accepted! Badge unlocked: " + active.title);
  };

  return (
    <PathLayout
      eyebrow="Coding · DSA Lab"
      title="50+ problems. Read. Run. Submit."
      subtitle="Click a problem, read the lesson, run the listed commands one by one, then submit to earn a badge."
    >
      {/* Stats bar with mascot */}
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <ListChecks className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Solved</div>
              <div className="font-display text-xl font-bold">
                {completedCount} <span className="text-sm text-muted-foreground">/ {PROBLEMS.length}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {DIFFS.map((d) => (
              <button key={d} onClick={() => setDiff(d)}
                className={"rounded-full px-3 py-1.5 text-xs font-semibold transition-all " + (diff === d ? "bg-primary text-primary-foreground shadow-glow" : "border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground")}>
                {d}
              </button>
            ))}
          </div>
          <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-foreground">
            <Trophy className="h-3.5 w-3.5 text-amber-500" /> {badgeCount} badges
          </Link>
        </div>
        <div className="hidden items-center justify-center rounded-2xl border border-border bg-card p-3 lg:flex">
          <Mascot variant="robot" size={88} />
        </div>
      </div>

      {/* Topic chips */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        <button onClick={() => setTopic("All")}
          className={"rounded-full px-3 py-1.5 text-xs font-semibold transition-all " + (topic === "All" ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground")}>
          All ({PROBLEMS.length})
        </button>
        {TOPICS.map((t) => {
          const cnt = PROBLEMS.filter((p) => p.topic === t).length;
          if (cnt === 0) return null;
          return (
            <button key={t} onClick={() => setTopic(t)}
              className={"rounded-full px-3 py-1.5 text-xs font-semibold transition-all " + (topic === t ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground")}>
              <span className="mr-1">{topicIcon[t]}</span>{t} ({cnt})
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Problem list */}
        <div className="rounded-2xl border border-border bg-card p-3 shadow-card">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {visible.length} Problems
          </div>
          <ul className="max-h-[600px] space-y-1 overflow-y-auto">
            {visible.map((p) => {
              const isActive = p.id === activeId;
              const done = !!completed[p.id];
              return (
                <li key={p.id}>
                  <button onClick={() => pickProblem(p.id)}
                    className={"group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all " + (isActive ? "bg-primary/10 ring-1 ring-primary/40" : "hover:bg-muted/60")}>
                    <div className={"flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border " + (done ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500" : "border-border text-muted-foreground")}>
                      {done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[10px]">{p.num}</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{p.title}</div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className={"h-1.5 w-1.5 rounded-full " + diffDot(p.difficulty)} />
                        <span className={"text-[10px] font-semibold " + diffColor(p.difficulty)}>{p.difficulty}</span>
                        <span className="text-[10px] text-muted-foreground">· {p.topic}</span>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right pane */}
        <div className="space-y-6">
          {/* Lesson content */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
                <span className="text-base">{topicIcon[active.topic]}</span>
                <span className="text-muted-foreground">{active.topic}</span>
                <span className="text-muted-foreground">·</span>
                <span className={"h-2 w-2 rounded-full " + diffDot(active.difficulty)} />
                <span className={diffColor(active.difficulty)}>{active.difficulty}</span>
              </div>
              {completed[active.id] && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-500">
                  <CheckCircle2 className="h-3 w-3" /> Badge earned
                </span>
              )}
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold">
              {active.num}. {active.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{active.description}</p>

            <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> Lesson
              </div>
              <p className="text-sm leading-relaxed">{active.content}</p>
              <div className="mt-2 text-xs text-muted-foreground"><strong>Hint:</strong> {active.hint}</div>
            </div>

            {active.examples.map((ex, i) => (
              <div key={i} className="mt-3 space-y-1 rounded-xl bg-muted/50 p-4 font-mono text-xs">
                <div><span className="text-muted-foreground">Input:</span> {ex.input}</div>
                <div><span className="text-muted-foreground">Output:</span> {ex.output}</div>
              </div>
            ))}
          </div>

          {/* Commands runner */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Run commands to complete</div>
              <div className="text-xs font-semibold text-primary">{stepIdx} / {active.commands.length}</div>
            </div>
            <ol className="space-y-1.5">
              {active.commands.map((c, i) => (
                <li key={i} className={"flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs transition-colors " + (i < stepIdx ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-500" : i === stepIdx ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground")}>
                  {i < stepIdx ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                  <span>$ {c}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3 flex gap-2">
              <Button onClick={runStep} disabled={stepIdx >= active.commands.length} size="sm" variant="outline">
                <Play className="mr-1.5 h-3.5 w-3.5" /> Run next command
              </Button>
              <Button onClick={() => setStepIdx(0)} size="sm" variant="ghost">Reset</Button>
            </div>
          </div>

          {/* Editor */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/50 px-4 py-2">
              <div className="flex items-center gap-1">
                {LANGS.map((l) => (
                  <button key={l.id} onClick={() => setLang(l)}
                    className={"rounded-md px-3 py-1.5 text-xs font-medium transition-colors " + (lang.id === l.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
                    {l.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={run} disabled={running} size="sm" variant="outline">
                  <Play className="mr-1.5 h-3.5 w-3.5" /> {running ? "Running..." : "Run code"}
                </Button>
                <Button onClick={submit} size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  {completed[active.id] ? "Submitted ✓" : "Submit"}
                </Button>
              </div>
            </div>

            <Editor
              height="360px"
              language={lang.id}
              value={code}
              onChange={(v) => setCode(v ?? "")}
              theme="vs-dark"
              options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 16 } }}
            />

            <div className="border-t border-border bg-background/80 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <Terminal className="h-3.5 w-3.5" /> Console
              </div>
              <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap font-mono text-xs text-foreground">{output}</pre>
            </div>
          </div>
        </div>
      </div>
    </PathLayout>
  );
}
