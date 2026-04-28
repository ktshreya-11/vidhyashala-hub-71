import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PathLayout } from "@/components/PathLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Video, VideoOff, Send, Plus, Circle, Globe2, Users, Activity } from "lucide-react";

export const Route = createFileRoute("/paths/live-collaboration")({
  head: () => ({
    meta: [
      { title: "Live Collaboration — Vidyashala Hub" },
      { name: "description", content: "Virtual War-Room for distributed teams to plan and ship together." },
    ],
  }),
  component: WarRoom,
});

type Member = { id: string; name: string; role: string; city: string; status: "live" | "idle" | "offline"; color: string };
type Lane = "todo" | "doing" | "done";
type Card = { id: string; title: string; lane: Lane; owner: string };
type Msg = { id: string; user: string; text: string; at: number };

const MEMBERS: Member[] = [
  { id: "1", name: "Aarav S.", role: "Lead", city: "Bengaluru", status: "live", color: "from-primary to-primary-glow" },
  { id: "2", name: "Mei L.", role: "Design", city: "Singapore", status: "live", color: "from-primary-glow to-primary" },
  { id: "3", name: "Diego R.", role: "Backend", city: "Mexico City", status: "idle", color: "from-primary to-primary-glow" },
  { id: "4", name: "Lena K.", role: "QA", city: "Berlin", status: "live", color: "from-primary-glow to-primary" },
  { id: "5", name: "Yuki T.", role: "DevOps", city: "Tokyo", status: "offline", color: "from-primary to-primary-glow" },
];

const SEED_CARDS: Card[] = [
  { id: "c1", title: "Auth flow redesign", lane: "todo", owner: "Mei L." },
  { id: "c2", title: "Set up CI pipeline", lane: "doing", owner: "Yuki T." },
  { id: "c3", title: "Schema migration v2", lane: "doing", owner: "Diego R." },
  { id: "c4", title: "Hub onboarding tour", lane: "done", owner: "Aarav S." },
];

function WarRoom() {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(false);
  const [cards, setCards] = useState<Card[]>(SEED_CARDS);
  const [newCard, setNewCard] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "m1", user: "Mei L.", text: "Pushed the new auth wireframes 🎨", at: Date.now() - 60000 },
    { id: "m2", user: "Diego R.", text: "Migration ready for review.", at: Date.now() - 30000 },
  ]);
  const [draft, setDraft] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight }); }, [msgs]);

  const moveCard = (id: string, dir: 1 | -1) => {
    const order: Lane[] = ["todo", "doing", "done"];
    setCards(cards.map((c) => {
      if (c.id !== id) return c;
      const i = order.indexOf(c.lane);
      const next = order[Math.max(0, Math.min(2, i + dir))];
      return { ...c, lane: next };
    }));
  };

  const addCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.trim()) return;
    setCards([...cards, { id: crypto.randomUUID(), title: newCard, lane: "todo", owner: "You" }]);
    setNewCard("");
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMsgs([...msgs, { id: crypto.randomUUID(), user: "You", text: draft, at: Date.now() }]);
    setDraft("");
  };

  const lanes: { id: Lane; label: string; color: string }[] = [
    { id: "todo", label: "To Do", color: "bg-muted" },
    { id: "doing", label: "In Progress", color: "bg-primary/20" },
    { id: "done", label: "Shipped", color: "bg-emerald-500/20" },
  ];

  return (
    <PathLayout
      eyebrow="Teamwork • War-Room"
      title="Where distributed teams ship."
      subtitle="A real-time war-room for global teams — see your squad, run the board, talk through it."
    >
      {/* Top bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-card md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> LIVE
          </div>
          <div className="text-sm">
            <span className="font-semibold">Project Aurora</span>
            <span className="ml-2 text-muted-foreground">• 5 members across 5 cities</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setMic(!mic)} variant="outline" size="sm" className={mic ? "border-primary text-primary" : ""}>
            {mic ? <Mic className="mr-1.5 h-4 w-4" /> : <MicOff className="mr-1.5 h-4 w-4" />}
            {mic ? "Mic on" : "Muted"}
          </Button>
          <Button onClick={() => setCam(!cam)} variant="outline" size="sm" className={cam ? "border-primary text-primary" : ""}>
            {cam ? <Video className="mr-1.5 h-4 w-4" /> : <VideoOff className="mr-1.5 h-4 w-4" />}
            {cam ? "Cam on" : "Cam off"}
          </Button>
          <Button size="sm" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Leave</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr_320px]">
        {/* Members */}
        <aside className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <Users className="h-3.5 w-3.5" /> Team ({MEMBERS.length})
          </div>
          <ul className="mt-4 space-y-3">
            {MEMBERS.map((m) => (
              <li key={m.id} className="flex items-center gap-3">
                <div className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${m.color} text-sm font-bold text-primary-foreground`}>
                  {m.name.split(" ").map((n) => n[0]).join("")}
                  <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${
                    m.status === "live" ? "bg-emerald-500" : m.status === "idle" ? "bg-amber-500" : "bg-muted-foreground"
                  }`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{m.name}</div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Globe2 className="h-3 w-3" /> {m.city} • {m.role}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl border border-border bg-background/50 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Activity className="h-3.5 w-3.5" /> Activity
            </div>
            <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              <div><span className="text-foreground">Mei</span> moved a card → Doing</div>
              <div><span className="text-foreground">Diego</span> opened PR #42</div>
              <div><span className="text-foreground">Lena</span> joined the room</div>
            </div>
          </div>
        </aside>

        {/* Kanban board */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">War Board</h3>
            <form onSubmit={addCard} className="flex items-center gap-2">
              <Input value={newCard} onChange={(e) => setNewCard(e.target.value)} placeholder="New task..." className="h-8 w-48 text-xs" />
              <Button type="submit" size="sm" variant="outline"><Plus className="h-3.5 w-3.5" /></Button>
            </form>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {lanes.map((lane) => (
              <div key={lane.id} className="rounded-xl border border-border bg-background/40 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${lane.color}`} />
                    <span className="text-xs font-semibold uppercase tracking-wider">{lane.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{cards.filter((c) => c.lane === lane.id).length}</span>
                </div>
                <div className="space-y-2">
                  {cards.filter((c) => c.lane === lane.id).map((c) => (
                    <div key={c.id} className="group rounded-lg border border-border bg-card p-3 shadow-card transition-all hover:border-primary/60">
                      <div className="text-sm font-medium">{c.title}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.owner}</div>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button onClick={() => moveCard(c.id, -1)} className="rounded px-1.5 text-xs text-muted-foreground hover:text-primary">←</button>
                          <button onClick={() => moveCard(c.id, 1)} className="rounded px-1.5 text-xs text-muted-foreground hover:text-primary">→</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <aside className="flex flex-col rounded-2xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <Circle className="h-2 w-2 fill-current" /> War Chat
            </div>
            <span className="text-[10px] text-muted-foreground">end-to-end</span>
          </div>
          <div ref={chatRef} className="flex-1 space-y-3 overflow-y-auto p-4" style={{ maxHeight: "380px" }}>
            {msgs.map((m) => (
              <div key={m.id} className={`flex ${m.user === "You" ? "justify-end" : ""}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  m.user === "You" ? "bg-gradient-primary text-primary-foreground" : "bg-muted"
                }`}>
                  {m.user !== "You" && <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider opacity-70">{m.user}</div>}
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Message the war-room..." className="h-9" />
            <Button type="submit" size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </aside>
      </div>
    </PathLayout>
  );
}
