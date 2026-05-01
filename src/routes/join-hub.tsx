import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users, Plus, Trash2, Send, Mic, MicOff, Paperclip, MessageSquare, LogIn, Hash, X,
} from "lucide-react";
import { pushNotification } from "@/hooks/use-notifications";

export const Route = createFileRoute("/join-hub")({
  head: () => ({
    meta: [
      { title: "Join Hub — Project Collaboration | Vidyashala" },
      { name: "description", content: "Create or join project-based hubs. Chat, share resources, message members and ship together." },
    ],
  }),
  component: JoinHubPage,
});

type Member = { id: string; name: string; username: string; avatar: string };
type Message = { id: string; author: string; text: string; ts: number; kind?: "text" | "voice" | "file" };
type Resource = { id: string; title: string; url: string; ts: number };
type Hub = {
  id: string;
  name: string;
  topic: string;
  description: string;
  joined: boolean;
  owner: string;
  members: Member[];
  messages: Message[];
  resources: Resource[];
  createdAt: number;
};

const KEY = "vidyashala_hubs";

const SEED_MEMBERS: Member[] = [
  { id: "u1", name: "Aarav Singh", username: "aarav", avatar: "🦊" },
  { id: "u2", name: "Priya Patel", username: "priya", avatar: "🦉" },
  { id: "u3", name: "Rahul Verma", username: "rahul", avatar: "🤖" },
  { id: "u4", name: "Sneha Iyer", username: "sneha", avatar: "🧑‍🚀" },
];

const seedHubs = (): Hub[] => [
  {
    id: "h1",
    name: "AI Resume Roaster",
    topic: "Machine Learning",
    description: "Building a GPT-powered resume reviewer for college seniors.",
    joined: false,
    owner: "Aarav Singh",
    members: SEED_MEMBERS.slice(0, 3),
    messages: [
      { id: "m1", author: "Aarav Singh", text: "Demo deadline Friday. Frontend ready?", ts: Date.now() - 3600000 },
      { id: "m2", author: "Priya Patel", text: "Yes, just polishing the upload UX.", ts: Date.now() - 3000000 },
    ],
    resources: [
      { id: "r1", title: "OpenAI API docs", url: "https://platform.openai.com/docs", ts: Date.now() - 86400000 },
    ],
    createdAt: Date.now() - 7 * 86400000,
  },
  {
    id: "h2",
    name: "Campus Food Delivery",
    topic: "Web Development",
    description: "Hyperlocal food order app for hostel students. MERN stack.",
    joined: false,
    owner: "Sneha Iyer",
    members: SEED_MEMBERS.slice(1, 4),
    messages: [{ id: "m3", author: "Sneha Iyer", text: "Stripe integration needed by next week.", ts: Date.now() - 7200000 }],
    resources: [],
    createdAt: Date.now() - 14 * 86400000,
  },
];

function loadHubs(): Hub[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
    const seed = seedHubs();
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  } catch {
    return [];
  }
}

function JoinHubPage() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [draft, setDraft] = useState("");
  const [resTitle, setResTitle] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [recording, setRecording] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setHubs(loadHubs()), []);

  const persist = (next: Hub[]) => {
    setHubs(next);
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(next));
  };

  const active = hubs.find((h) => h.id === activeId);

  const createHub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const me: Member = { id: "me", name: "You", username: "you", avatar: "🧑‍💻" };
    const hub: Hub = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      topic: newTopic.trim() || "General",
      description: newDesc.trim(),
      joined: true,
      owner: "You",
      members: [me, ...SEED_MEMBERS.slice(0, 2)],
      messages: [],
      resources: [],
      createdAt: Date.now(),
    };
    persist([hub, ...hubs]);
    setActiveId(hub.id);
    setShowCreate(false);
    setNewName(""); setNewTopic(""); setNewDesc("");
    pushNotification({ kind: "hub", title: `Hub created: ${hub.name}` });
  };

  const joinHub = (id: string) => {
    persist(hubs.map((h) => h.id === id ? { ...h, joined: true, members: [{ id: "me", name: "You", username: "you", avatar: "🧑‍💻" }, ...h.members] } : h));
    pushNotification({ kind: "hub", title: "Joined hub" });
  };

  const deleteHub = (id: string) => {
    if (!confirm("Delete this hub? This cannot be undone.")) return;
    persist(hubs.filter((h) => h.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const sendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !active) return;
    const msg: Message = { id: crypto.randomUUID(), author: "You", text: draft.trim(), ts: Date.now() };
    persist(hubs.map((h) => h.id === active.id ? { ...h, messages: [...h.messages, msg] } : h));
    setDraft("");
  };

  const sendVoice = () => {
    if (!active) return;
    if (!recording) { setRecording(true); return; }
    setRecording(false);
    const msg: Message = { id: crypto.randomUUID(), author: "You", text: "🎙️ Voice note (0:08) — mock", ts: Date.now(), kind: "voice" };
    persist(hubs.map((h) => h.id === active.id ? { ...h, messages: [...h.messages, msg] } : h));
  };

  const onPickFile = (file?: File) => {
    if (!file || !active) return;
    const msg: Message = { id: crypto.randomUUID(), author: "You", text: `📎 ${file.name}`, ts: Date.now(), kind: "file" };
    persist(hubs.map((h) => h.id === active.id ? { ...h, messages: [...h.messages, msg] } : h));
  };

  const addResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !resUrl.trim() || !active) return;
    const r: Resource = { id: crypto.randomUUID(), title: resTitle.trim(), url: resUrl.trim(), ts: Date.now() };
    persist(hubs.map((h) => h.id === active.id ? { ...h, resources: [r, ...h.resources] } : h));
    setResTitle(""); setResUrl("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
          <div className="absolute inset-0 bg-gradient-glow opacity-60" />
          <div className="relative mx-auto max-w-7xl px-6 py-12">
            <BackButton />
            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="flex items-center gap-3 font-display text-4xl font-bold text-white md:text-5xl">
                  <Users className="h-9 w-9 text-white" /> Join Hub
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/70">
                  Project-based collaboration. Create a hub, invite teammates, chat in real time, share resources, and delete it when you ship.
                </p>
              </div>
              <Button onClick={() => setShowCreate(true)} className="h-12 rounded-full bg-white px-6 font-semibold text-background hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" /> Create Hub
              </Button>
            </div>
          </div>
        </section>

        <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[340px,1fr]">
          <aside className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">All Hubs · {hubs.length}</div>
            {hubs.map((h) => (
              <button
                key={h.id}
                onClick={() => setActiveId(h.id)}
                className={`group block w-full rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                  activeId === h.id ? "border-primary bg-primary/5 shadow-elegant" : "border-border bg-card hover:border-primary/60"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary" />
                    <span className="font-display font-semibold text-foreground">{h.name}</span>
                  </div>
                  {h.joined && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">JOINED</span>}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{h.description || "No description"}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{h.topic}</span>
                  <span>{h.members.length} members</span>
                </div>
              </button>
            ))}
            {hubs.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No hubs yet. Create one above.
              </div>
            )}
          </aside>

          <section className="rounded-2xl border border-border bg-card shadow-card">
            {!active ? (
              <div className="flex h-[520px] flex-col items-center justify-center text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/40" />
                <p className="mt-4 font-display text-lg font-semibold">Select a hub to start collaborating</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">Pick a hub from the left to chat, share resources, and message members.</p>
              </div>
            ) : (
              <div className="flex h-[680px] flex-col">
                <div className="flex items-start justify-between gap-3 border-b border-border p-5">
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">#{active.name}</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">{active.topic} · Owner: {active.owner}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!active.joined && (
                      <Button size="sm" onClick={() => joinHub(active.id)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <LogIn className="mr-1.5 h-3.5 w-3.5" /> Join
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => deleteHub(active.id)} className="border-destructive/30 text-destructive hover:bg-destructive/10">
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </div>

                <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[1fr,260px]">
                  <div className="flex flex-col overflow-hidden border-r border-border">
                    <div className="flex-1 space-y-3 overflow-y-auto p-5">
                      {active.messages.length === 0 && (
                        <div className="py-12 text-center text-sm text-muted-foreground">No messages yet — say hi 👋</div>
                      )}
                      {active.messages.map((m) => (
                        <div key={m.id} className={`flex ${m.author === "You" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.author === "You" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                            <div className="text-[10px] font-semibold uppercase opacity-70">{m.author}</div>
                            <div className="mt-0.5 whitespace-pre-wrap">{m.text}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={sendMsg} className="flex items-center gap-2 border-t border-border p-3">
                      <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-primary" aria-label="Attach">
                        <Paperclip className="h-4 w-4" />
                      </button>
                      <input ref={fileRef} type="file" hidden onChange={(e) => onPickFile(e.target.files?.[0])} />
                      <button
                        type="button"
                        onClick={sendVoice}
                        className={`rounded-full p-2 transition ${recording ? "bg-destructive text-destructive-foreground animate-pulse" : "text-muted-foreground hover:bg-muted hover:text-primary"}`}
                        aria-label="Voice"
                      >
                        {recording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </button>
                      <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={recording ? "Recording..." : "Type a message..."} disabled={recording} />
                      <Button type="submit" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>

                  <aside className="hidden flex-col overflow-y-auto p-4 md:flex">
                    <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Members</div>
                    <div className="mt-2 space-y-1.5">
                      {active.members.map((m) => (
                        <Link
                          key={m.id}
                          to="/u/$username"
                          params={{ username: m.username }}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
                        >
                          <span className="text-lg">{m.avatar}</span>
                          <span className="flex-1 truncate">{m.name}</span>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Resources</div>
                    <form onSubmit={addResource} className="mt-2 space-y-1.5">
                      <Input value={resTitle} onChange={(e) => setResTitle(e.target.value)} placeholder="Title" className="h-8 text-xs" />
                      <Input value={resUrl} onChange={(e) => setResUrl(e.target.value)} placeholder="https://..." className="h-8 text-xs" />
                      <Button size="sm" className="w-full" type="submit">Add</Button>
                    </form>
                    <div className="mt-3 space-y-1.5">
                      {active.resources.map((r) => (
                        <a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-border p-2 text-xs hover:border-primary hover:text-primary">
                          {r.title}
                        </a>
                      ))}
                    </div>
                  </aside>
                </div>
              </div>
            )}
          </section>
        </div>

        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowCreate(false)}>
            <form
              onSubmit={createHub}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-elegant"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold">Create a new Hub</h3>
                <button type="button" onClick={() => setShowCreate(false)} className="rounded-full p-1 hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3">
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Hub name (e.g. AI Resume Roaster)" autoFocus />
                <Input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="Topic (e.g. Machine Learning)" />
                <Textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="What's the project about?" rows={3} />
              </div>
              <Button type="submit" className="mt-4 w-full bg-gradient-primary text-primary-foreground">
                <Plus className="mr-1.5 h-4 w-4" /> Create Hub
              </Button>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
