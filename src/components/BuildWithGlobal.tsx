import { useEffect, useMemo, useRef, useState } from "react";
import { GitBranch, Cloud, Activity, Cpu, ShieldCheck, ArrowRight, X, Save, RotateCcw, Check, AlertCircle, Play, Pause, Users, Loader2, Maximize, Compass } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ToolKey = "drafts" | "grading" | "analytics" | "groups" | "exam";

type Tool = {
  key: ToolKey;
  icon: typeof GitBranch;
  title: string;
  desc: string;
};

const tools: Tool[] = [
  { key: "drafts", icon: GitBranch, title: "Versioned Workspaces", desc: "Save drafts as versions and restore any prior state." },
  { key: "analytics", icon: Cloud, title: "Live Telemetry", desc: "Live study timer that syncs to your profile every 60s." },
  { key: "grading", icon: Activity, title: "Instant Grading", desc: "Validate answers with instant green/red feedback." },
  { key: "groups", icon: Cpu, title: "Distributed Build", desc: "Join a real-time shared workspace with your teammates." },
  { key: "exam", icon: ShieldCheck, title: "Zero-Trust Access", desc: "Exam Mode: hide UI, go fullscreen, focus only." },
];

export function BuildWithGlobal() {
  const [expanded, setExpanded] = useState(false);
  const [openKey, setOpenKey] = useState<ToolKey | null>(null);
  const [tour, setTour] = useState<number | null>(null);

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
              Real-time backend tooling — drafts, grading, telemetry, group rooms, and exam mode. Everything synced to your profile.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setExpanded((s) => !s)}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-elegant"
              >
                {expanded ? "Hide the toolkit" : "Explore the toolkit"}
                <ArrowRight className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : "group-hover:translate-x-1"}`} />
              </button>
              <button
                onClick={() => { setExpanded(true); setTour(0); }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary-glow transition-all hover:bg-primary/20"
              >
                <Compass className="h-4 w-4" /> Feature Tour
              </button>
            </div>
          </div>

          <div
            className={`grid gap-3 transition-all duration-500 sm:grid-cols-2 ${
              expanded ? "max-h-[2000px] opacity-100" : "max-h-[420px] opacity-100"
            }`}
          >
            {tools.map(({ icon: Icon, title, desc, key }) => (
              <button
                key={key}
                onClick={() => expanded && setOpenKey(key)}
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
                    Open <ArrowRight className="h-3 w-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Tour overlay */}
      {tour !== null && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur" onClick={() => setTour(null)}>
          <div className="relative w-full max-w-md rounded-3xl border border-primary/30 bg-[oklch(0.13_0.04_258)] p-7 text-white shadow-elegant" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setTour(null)} className="absolute right-4 top-4 rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-primary-glow">Step {tour + 1} of {tools.length}</div>
            <h3 className="mt-2 font-display text-2xl font-bold">{tools[tour].title}</h3>
            <p className="mt-3 text-sm text-white/75">{tools[tour].desc}</p>
            <div className="mt-6 flex items-center justify-between">
              <button onClick={() => setTour(Math.max(0, tour - 1))} disabled={tour === 0} className="text-xs text-white/60 disabled:opacity-30">← Back</button>
              <div className="flex gap-1.5">
                {tools.map((_, i) => <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === tour ? "bg-primary-glow" : "bg-white/20"}`} />)}
              </div>
              {tour < tools.length - 1 ? (
                <button onClick={() => setTour(tour + 1)} className="rounded-full bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Next →</button>
              ) : (
                <button onClick={() => { setTour(null); setOpenKey(tools[0].key); }} className="rounded-full bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Try it</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail modal with live features */}
      {openKey && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur" onClick={() => setOpenKey(null)}>
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-primary/30 bg-[oklch(0.13_0.04_258)] p-8 text-white shadow-elegant" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenKey(null)} className="absolute right-4 top-4 rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
            {openKey === "drafts" && <DraftsPanel />}
            {openKey === "grading" && <GradingPanel />}
            {openKey === "analytics" && <AnalyticsPanel />}
            {openKey === "groups" && <GroupsPanel />}
            {openKey === "exam" && <ExamPanel />}
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------------- DRAFTS ---------------- */
function DraftsPanel() {
  const [content, setContent] = useState("");
  const [drafts, setDrafts] = useState<{ id: string; version: number; content: string; created_at: string }[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const load = async () => {
    if (!userId) return;
    const { data } = await supabase.from("drafts").select("*").eq("user_id", userId).order("version", { ascending: false }).limit(10);
    setDrafts(data ?? []);
  };
  useEffect(() => { load(); }, [userId]);

  const save = async () => {
    if (!userId) return toast.error("Sign in to save drafts");
    const nextVersion = (drafts[0]?.version ?? 0) + 1;
    const { error } = await supabase.from("drafts").insert({ user_id: userId, content, version: nextVersion });
    if (error) return toast.error(error.message);
    toast.success(`Saved as v${nextVersion}`);
    load();
  };

  const restore = (c: string, v: number) => { setContent(c); toast.success(`Restored v${v}`); };

  return (
    <>
      <Header icon={GitBranch} title="Versioned Drafts" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write something..." className="mt-4 h-32 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/40 focus:border-primary outline-none" />
      <button onClick={save} className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2 text-xs font-semibold text-primary-foreground"><Save className="h-3.5 w-3.5" /> Save Version</button>
      <div className="mt-5 max-h-48 space-y-2 overflow-y-auto">
        {drafts.length === 0 && <p className="text-xs text-white/50">{userId ? "No drafts yet." : "Sign in to save and view drafts."}</p>}
        {drafts.map((d) => (
          <div key={d.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
            <div><span className="font-semibold text-primary-glow">v{d.version}</span> <span className="ml-2 text-white/50">{new Date(d.created_at).toLocaleString()}</span><div className="mt-0.5 truncate text-white/70 max-w-md">{d.content || <em className="text-white/30">(empty)</em>}</div></div>
            <button onClick={() => restore(d.content, d.version)} className="inline-flex items-center gap-1 rounded-full border border-primary/40 px-3 py-1 text-[11px] text-primary-glow hover:bg-primary/10"><RotateCcw className="h-3 w-3" /> Restore</button>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- GRADING ---------------- */
function GradingPanel() {
  const [questions, setQuestions] = useState<{ question_key: string; question: string; answer: string }[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});

  useEffect(() => { supabase.from("solutions").select("*").then(({ data }) => setQuestions(data ?? [])); }, []);

  const check = (k: string, correct: string) => {
    const ok = (answers[k] ?? "").trim().toLowerCase() === correct.trim().toLowerCase();
    setResults((r) => ({ ...r, [k]: ok }));
  };

  return (
    <>
      <Header icon={Activity} title="Instant Grading" />
      <p className="mt-2 text-sm text-white/60">Type answers — get instant green/red feedback from the database.</p>
      <div className="mt-5 space-y-3">
        {questions.map((q) => {
          const r = results[q.question_key];
          return (
            <div key={q.question_key} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-sm font-medium">{q.question}</div>
              <div className="mt-2 flex gap-2">
                <input value={answers[q.question_key] ?? ""} onChange={(e) => setAnswers({ ...answers, [q.question_key]: e.target.value })}
                  className={`flex-1 rounded-lg border bg-white/5 px-3 py-1.5 text-sm text-white outline-none transition-colors ${
                    r === true ? "border-green-500" : r === false ? "border-red-500" : "border-white/10 focus:border-primary"
                  }`} placeholder="Your answer..." />
                <button onClick={() => check(q.question_key, q.answer)} className="rounded-lg bg-primary/20 px-3 py-1.5 text-xs font-semibold text-primary-glow hover:bg-primary/30">Check</button>
                {r === true && <Check className="h-5 w-5 self-center text-green-500" />}
                {r === false && <AlertCircle className="h-5 w-5 self-center text-red-500" />}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ---------------- ANALYTICS / STUDY TIMER ---------------- */
function AnalyticsPanel() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [totalSynced, setTotalSynced] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const lastSyncRef = useRef(0);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const { data: p } = await supabase.from("profiles").select("study_seconds").eq("id", uid).maybeSingle();
        if (p) setTotalSynced(p.study_seconds ?? 0);
      }
    });
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  // Sync every 60s while running
  useEffect(() => {
    if (!userId) return;
    const sync = async () => {
      const delta = seconds - lastSyncRef.current;
      if (delta <= 0) return;
      const newTotal = totalSynced + delta;
      const { error } = await supabase.from("profiles").update({ study_seconds: newTotal, updated_at: new Date().toISOString() }).eq("id", userId);
      if (!error) { setTotalSynced(newTotal); lastSyncRef.current = seconds; toast.success(`Synced ${delta}s to profile`); }
    };
    const t = setInterval(sync, 60_000);
    return () => clearInterval(t);
  }, [userId, seconds, totalSynced]);

  const fmt = (s: number) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <>
      <Header icon={Cloud} title="Live Study Timer" />
      <p className="mt-2 text-sm text-white/60">Auto-syncs to your profile every 60 seconds.</p>
      <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-6 text-center">
        <div className="font-display text-5xl font-bold tabular-nums text-primary-glow">{fmt(seconds)}</div>
        <div className="mt-2 text-xs text-white/50">Session • Total on profile: {fmt(totalSynced)}</div>
      </div>
      <div className="mt-4 flex justify-center gap-3">
        <button onClick={() => setRunning((r) => !r)} className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-2 text-sm font-semibold text-primary-foreground">
          {running ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Start</>}
        </button>
      </div>
      {!userId && <p className="mt-4 text-center text-xs text-white/50">Sign in to persist your study time.</p>}
    </>
  );
}

/* ---------------- GROUPS ---------------- */
function GroupsPanel() {
  const [rooms, setRooms] = useState<{ id: string; name: string; shared_text: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => { supabase.from("group_rooms").select("*").then(({ data }) => setRooms(data ?? [])); }, []);

  const join = async (id: string) => {
    setJoining(true);
    await new Promise((r) => setTimeout(r, 900));
    const room = rooms.find((r) => r.id === id);
    setText(room?.shared_text ?? "");
    setActiveId(id);
    setJoining(false);
  };

  // Realtime subscribe
  useEffect(() => {
    if (!activeId) return;
    const ch = supabase.channel(`room:${activeId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "group_rooms", filter: `id=eq.${activeId}` }, (payload) => {
        const next = (payload.new as { shared_text: string }).shared_text;
        setText((cur) => (cur === next ? cur : next));
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [activeId]);

  const onChange = async (v: string) => {
    setText(v);
    if (activeId) await supabase.from("group_rooms").update({ shared_text: v, updated_at: new Date().toISOString() }).eq("id", activeId);
  };

  return (
    <>
      <Header icon={Users} title="Group Rooms" />
      {!activeId && (
        <div className="mt-4 space-y-2">
          {rooms.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-sm font-medium">{r.name}</div>
              <button onClick={() => join(r.id)} disabled={joining} className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60">
                {joining ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Connecting...</> : "Join"}
              </button>
            </div>
          ))}
        </div>
      )}
      {activeId && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-white/60">
            <span>● Live • {rooms.find((r) => r.id === activeId)?.name}</span>
            <button onClick={() => setActiveId(null)} className="text-primary-glow hover:underline">Leave</button>
          </div>
          <textarea value={text} onChange={(e) => onChange(e.target.value)} placeholder="Type — others see it instantly..." className="h-56 w-full resize-none rounded-xl border border-primary/30 bg-white/5 p-3 text-sm text-white outline-none focus:border-primary" />
        </div>
      )}
    </>
  );
}

/* ---------------- EXAM MODE ---------------- */
function ExamPanel() {
  const [on, setOn] = useState(() => typeof document !== "undefined" && document.body.classList.contains("exam-mode"));

  // Cleanup if panel unmounts while still on
  useEffect(() => () => { document.body.classList.remove("exam-mode"); }, []);

  const toggle = async () => {
    const next = !on;
    setOn(next);
    document.body.classList.toggle("exam-mode", next);
    try {
      if (next && !document.fullscreenElement) await document.documentElement.requestFullscreen();
      else if (!next && document.fullscreenElement) await document.exitFullscreen();
    } catch {}
    const { data } = await supabase.auth.getUser();
    if (data.user) await supabase.from("profiles").update({ exam_mode: next }).eq("id", data.user.id);
  };

  return (
    <>
      <Header icon={Maximize} title="Exam Mode" />
      <p className="mt-2 text-sm text-white/60">Hide navbar & sidebar UI and enter fullscreen for distraction-free focus.</p>
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-lg font-semibold">Focus mode is {on ? "ON" : "OFF"}</div>
            <p className="mt-1 text-xs text-white/55">Hides navigation and switches to fullscreen.</p>
          </div>
          <button onClick={toggle} className={`relative h-7 w-14 rounded-full transition-colors ${on ? "bg-gradient-primary" : "bg-white/15"}`}>
            <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all ${on ? "left-7" : "left-0.5"}`} />
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------------- shared header ---------------- */
function Header({ icon: Icon, title }: { icon: typeof GitBranch; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow"><Icon className="h-6 w-6" /></div>
      <h3 className="font-display text-2xl font-bold">{title}</h3>
    </div>
  );
}
