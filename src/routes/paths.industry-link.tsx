import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PathLayout } from "@/components/PathLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CheckCircle2, Circle, Plus, User } from "lucide-react";

export const Route = createFileRoute("/paths/industry-link")({
  head: () => ({
    meta: [
      { title: "Industry Link — Task Board | Vidyashala" },
      { name: "description", content: "Upload tasks, solve problems, and track who completed what across the community." },
    ],
  }),
  component: IndustryLink,
});

type Submission = { user: string; at: number; solution: string };
type Task = {
  id: string;
  title: string;
  description: string;
  category: string;
  postedBy: string;
  createdAt: number;
  submissions: Submission[];
};

const KEY = "industry-link-tasks";
const ME_KEY = "industry-link-me";

const SEED: Task[] = [
  {
    id: "t1",
    title: "Fix off-by-one in pagination",
    description: "Our API returns one extra row on the last page. Find the bug and submit a patch.",
    category: "Bug Fix",
    postedBy: "Acme Corp",
    createdAt: Date.now() - 86400000,
    submissions: [{ user: "priya", at: Date.now() - 3600000, solution: "Changed `<=` to `<` in slice()." }],
  },
  {
    id: "t2",
    title: "Two-Sum in O(n)",
    description: "Given an array and a target, return indices of two numbers that add up to target.",
    category: "Coding",
    postedBy: "InterviewPrep",
    createdAt: Date.now() - 7200000,
    submissions: [],
  },
  {
    id: "t3",
    title: "Build a responsive pricing page",
    description: "Three tiers, mobile-first, dark mode. Submit a CodeSandbox link.",
    category: "Project",
    postedBy: "DesignHub",
    createdAt: Date.now() - 1800000,
    submissions: [],
  },
];

function load(): Task[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : SEED;
  } catch {
    return SEED;
  }
}

function IndustryLink() {
  const [tasks, setTasks] = useState<Task[]>(SEED);
  const [me, setMe] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [solution, setSolution] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft] = useState({ title: "", description: "", category: "Coding" });

  useEffect(() => {
    setTasks(load());
    setMe(localStorage.getItem(ME_KEY) || "");
  }, []);

  const persist = (next: Task[]) => {
    setTasks(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const saveMe = (v: string) => {
    setMe(v);
    localStorage.setItem(ME_KEY, v);
  };

  const submit = (id: string) => {
    if (!me.trim() || !solution.trim()) return;
    const next = tasks.map((t) =>
      t.id === id
        ? { ...t, submissions: [...t.submissions, { user: me.trim(), at: Date.now(), solution: solution.trim() }] }
        : t,
    );
    persist(next);
    setSolution("");
    setOpenId(null);
  };

  const add = () => {
    if (!draft.title.trim()) return;
    const t: Task = {
      id: `t${Date.now()}`,
      title: draft.title.trim(),
      description: draft.description.trim(),
      category: draft.category,
      postedBy: me.trim() || "anonymous",
      createdAt: Date.now(),
      submissions: [],
    };
    persist([t, ...tasks]);
    setDraft({ title: "", description: "", category: "Coding" });
    setShowNew(false);
  };

  return (
    <PathLayout
      eyebrow="Industry Link · Task Board"
      title="Real tasks. Real submissions. Real proof."
      subtitle="Anyone can post a task. Anyone can solve it. Everyone sees who cracked what."
    >
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <Input
            placeholder="Your handle (e.g. priya)"
            value={me}
            onChange={(e) => saveMe(e.target.value)}
            className="h-9 w-56"
          />
        </div>
        <Button onClick={() => setShowNew((s) => !s)}>
          <Plus className="h-4 w-4" /> Upload Task
        </Button>
      </div>

      {showNew && (
        <div className="mb-6 rounded-2xl border border-primary/40 bg-primary/5 p-5">
          <Input
            placeholder="Task title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <Textarea
            className="mt-3"
            placeholder="Describe the task…"
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
          <div className="mt-3 flex items-center gap-3">
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              className="h-9 rounded-md border border-border bg-background px-2 text-sm"
            >
              <option>Coding</option>
              <option>Bug Fix</option>
              <option>Project</option>
              <option>Design</option>
            </select>
            <Button onClick={add}>Publish</Button>
            <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {tasks.map((t) => {
          const solved = t.submissions.length > 0;
          const isOpen = openId === t.id;
          return (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{t.category}</Badge>
                    <Badge className={solved ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}>
                      {solved ? <><CheckCircle2 className="mr-1 h-3 w-3" /> Solved</> : <><Circle className="mr-1 h-3 w-3" /> Unsolved</>}
                    </Badge>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Briefcase className="h-3 w-3" /> Posted by <span className="font-semibold">{t.postedBy}</span>
                  </div>
                </div>
                <Button size="sm" variant={isOpen ? "secondary" : "default"} onClick={() => setOpenId(isOpen ? null : t.id)}>
                  {isOpen ? "Close" : "Solve"}
                </Button>
              </div>

              {t.submissions.length > 0 && (
                <div className="mt-4 rounded-xl border border-border bg-background/50 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">Solved by</div>
                  <ul className="mt-2 space-y-2">
                    {t.submissions.map((s, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-semibold text-foreground">@{s.user}</span>
                        <span className="text-muted-foreground"> — {s.solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {isOpen && (
                <div className="mt-4 rounded-xl border border-primary/40 bg-primary/5 p-3">
                  <Textarea
                    placeholder="Paste your solution, link, or explanation…"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <Button size="sm" onClick={() => submit(t.id)} disabled={!me.trim() || !solution.trim()}>
                      Submit
                    </Button>
                    {!me.trim() && <span className="text-xs text-muted-foreground">Set your handle above first.</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PathLayout>
  );
}
