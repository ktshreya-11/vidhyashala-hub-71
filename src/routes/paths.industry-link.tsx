import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PathLayout } from "@/components/PathLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, GraduationCap, Plus, Star, CheckCircle2, Clock, Send } from "lucide-react";

export const Route = createFileRoute("/paths/industry-link")({
  head: () => ({
    meta: [
      { title: "Industry Link — Vidyashala Hub" },
      { name: "description", content: "A role-based portal connecting students with industry professionals." },
    ],
  }),
  component: IndustryLink,
});

type Status = "open" | "submitted" | "reviewed";
type Task = {
  id: string;
  title: string;
  company: string;
  desc: string;
  status: Status;
  submission?: string;
  review?: { rating: number; note: string };
  createdAt: number;
};

const STORAGE_KEY = "vidyashala_industry_tasks";

const SEED: Task[] = [
  { id: "t1", title: "Design a landing page for a fintech startup", company: "Northwind Capital", desc: "Wireframe + hi-fi Figma mock for a B2B fintech homepage. 48-hour brief.", status: "open", createdAt: Date.now() - 86400000 },
  { id: "t2", title: "Build a REST API for inventory tracking", company: "Loom Logistics", desc: "Node + Postgres. Endpoints: items, stock, transfers. Include README.", status: "open", createdAt: Date.now() - 3600000 },
];

function IndustryLink() {
  const [role, setRole] = useState<"student" | "professional">("student");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // pro form
  const [pTitle, setPTitle] = useState(""); const [pCompany, setPCompany] = useState(""); const [pDesc, setPDesc] = useState("");
  // student submit
  const [submission, setSubmission] = useState("");
  // pro review
  const [reviewNote, setReviewNote] = useState(""); const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    setTasks(raw ? JSON.parse(raw) : SEED);
  }, []);

  const persist = (t: Task[]) => { setTasks(t); localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle.trim() || !pCompany.trim()) return;
    persist([{ id: crypto.randomUUID(), title: pTitle, company: pCompany, desc: pDesc, status: "open", createdAt: Date.now() }, ...tasks]);
    setPTitle(""); setPCompany(""); setPDesc("");
  };

  const submit = (id: string) => {
    if (!submission.trim()) return;
    persist(tasks.map((t) => (t.id === id ? { ...t, submission, status: "submitted" } : t)));
    setSubmission(""); setActiveId(null);
  };

  const review = (id: string) => {
    persist(tasks.map((t) => (t.id === id ? { ...t, review: { rating: reviewRating, note: reviewNote }, status: "reviewed" } : t)));
    setReviewNote(""); setReviewRating(5); setActiveId(null);
  };

  const active = tasks.find((t) => t.id === activeId);

  const statusBadge = (s: Status) => {
    const map = {
      open: { icon: Clock, label: "Open", cls: "bg-primary/10 text-primary border-primary/30" },
      submitted: { icon: Send, label: "Submitted", cls: "bg-amber-500/10 text-amber-500 border-amber-500/30" },
      reviewed: { icon: CheckCircle2, label: "Reviewed", cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" },
    } as const;
    const m = map[s];
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${m.cls}`}>
        <m.icon className="h-3 w-3" /> {m.label}
      </span>
    );
  };

  return (
    <PathLayout
      eyebrow="Mentorship • Industry Link"
      title="Real tasks. Real reviews."
      subtitle="A role-based portal — Professionals post tasks, Students browse, submit, and grow with feedback."
    >
      {/* Role switcher */}
      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-card">
        {(["student", "professional"] as const).map((r) => (
          <button
            key={r}
            onClick={() => { setRole(r); setActiveId(null); }}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              role === r ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {r === "student" ? <GraduationCap className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
            {r === "student" ? "Student" : "Professional"}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Task list */}
        <div className="space-y-3">
          {role === "professional" && (
            <form onSubmit={addTask} className="rounded-2xl border border-primary/40 bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <Plus className="h-3.5 w-3.5" /> Post a new task
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Input value={pTitle} onChange={(e) => setPTitle(e.target.value)} placeholder="Task title" />
                <Input value={pCompany} onChange={(e) => setPCompany(e.target.value)} placeholder="Company / Org" />
              </div>
              <Textarea value={pDesc} onChange={(e) => setPDesc(e.target.value)} placeholder="Brief description, scope, deadline..." className="mt-3" rows={3} />
              <Button type="submit" className="mt-3 bg-gradient-primary text-primary-foreground hover:opacity-90">Post Task</Button>
            </form>
          )}

          {tasks.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`block w-full rounded-2xl border bg-card p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/60 ${
                activeId === t.id ? "border-primary" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-primary">{t.company}</div>
                  <h3 className="mt-1 font-display text-lg font-semibold">{t.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{t.desc}</p>
                </div>
                {statusBadge(t.status)}
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {active ? (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="text-xs font-medium text-primary">{active.company}</div>
              <h3 className="mt-1 font-display text-xl font-bold">{active.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{active.desc}</p>

              {active.submission && (
                <div className="mt-5 rounded-xl bg-muted/50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Submission</div>
                  <p className="mt-1.5 text-sm">{active.submission}</p>
                </div>
              )}
              {active.review && (
                <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < active.review!.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                  <p className="mt-2 text-sm">{active.review.note}</p>
                </div>
              )}

              {role === "student" && active.status === "open" && (
                <div className="mt-5">
                  <Textarea value={submission} onChange={(e) => setSubmission(e.target.value)} placeholder="Paste your submission link or notes..." rows={3} />
                  <Button onClick={() => submit(active.id)} className="mt-3 w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                    <Send className="mr-2 h-4 w-4" /> Submit
                  </Button>
                </div>
              )}

              {role === "professional" && active.status === "submitted" && (
                <div className="mt-5">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button key={i} onClick={() => setReviewRating(i + 1)} aria-label={`Rate ${i+1}`}>
                        <Star className={`h-5 w-5 ${i < reviewRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                      </button>
                    ))}
                  </div>
                  <Textarea value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} placeholder="Leave constructive feedback..." rows={3} className="mt-3" />
                  <Button onClick={() => review(active.id)} className="mt-3 w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                    Submit Review
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              Select a task to view details.
            </div>
          )}
        </aside>
      </div>
    </PathLayout>
  );
}
