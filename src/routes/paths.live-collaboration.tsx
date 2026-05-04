import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { PathLayout } from "@/components/PathLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Paperclip, Users, Plus, Trash2, Send, Code2, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/paths/live-collaboration")({
  head: () => ({
    meta: [
      { title: "Live Collaboration — Real-time Project Rooms | Vidyashala" },
      { name: "description", content: "Create rooms and collaborate in real-time: live code editing, chat, and file sharing." },
    ],
  }),
  component: LiveCollab,
});

type Msg = { user: string; text: string; at: number };
type FileItem = { name: string; size: number; at: number; by: string };
type Room = {
  id: string;
  name: string;
  members: string[];
  code: string;
  messages: Msg[];
  files: FileItem[];
  createdAt: number;
};

const KEY = "live-collab-rooms";
const ME_KEY = "live-collab-me";

const STARTER_CODE = `// Live shared editor — edit and watch the preview update.
<!doctype html>
<html><body style="font-family:system-ui;padding:2rem;background:#0b1020;color:#e6eaf2">
  <h1 style="background:linear-gradient(90deg,#60a5fa,#a78bfa);-webkit-background-clip:text;color:transparent">
    Hello team 👋
  </h1>
  <p>Type below — your collaborators see this instantly.</p>
</body></html>`;

function load(): Room[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

function LiveCollab() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [me, setMe] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [chat, setChat] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const r = load();
    setRooms(r);
    setActiveId(r[0]?.id ?? null);
    setMe(localStorage.getItem(ME_KEY) || "");
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setRooms(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = (next: Room[]) => {
    setRooms(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const saveMe = (v: string) => { setMe(v); localStorage.setItem(ME_KEY, v); };

  const active = rooms.find((r) => r.id === activeId) || null;

  const create = () => {
    if (!newRoom.trim() || !me.trim()) return;
    const r: Room = {
      id: `r${Date.now()}`,
      name: newRoom.trim(),
      members: [me.trim()],
      code: STARTER_CODE,
      messages: [],
      files: [],
      createdAt: Date.now(),
    };
    const next = [r, ...rooms];
    persist(next);
    setActiveId(r.id);
    setNewRoom("");
  };

  const join = (id: string) => {
    if (!me.trim()) return;
    const next = rooms.map((r) =>
      r.id === id && !r.members.includes(me.trim()) ? { ...r, members: [...r.members, me.trim()] } : r,
    );
    persist(next);
    setActiveId(id);
  };

  const remove = (id: string) => {
    const next = rooms.filter((r) => r.id !== id);
    persist(next);
    if (activeId === id) setActiveId(next[0]?.id ?? null);
  };

  const updateActive = (patch: Partial<Room>) => {
    if (!active) return;
    persist(rooms.map((r) => (r.id === active.id ? { ...r, ...patch } : r)));
  };

  const sendChat = () => {
    if (!active || !chat.trim() || !me.trim()) return;
    updateActive({ messages: [...active.messages, { user: me.trim(), text: chat.trim(), at: Date.now() }] });
    setChat("");
  };

  const onFiles = (files: FileList | null) => {
    if (!active || !files || !me.trim()) return;
    const items = Array.from(files).map((f) => ({ name: f.name, size: f.size, at: Date.now(), by: me.trim() }));
    updateActive({ files: [...active.files, ...items] });
  };

  const previewSrc = useMemo(
    () => (active ? `data:text/html;charset=utf-8,${encodeURIComponent(active.code)}` : ""),
    [active?.code],
  );

  return (
    <PathLayout
      eyebrow="Live Collaboration · Real-time"
      title="Code together. Chat together. Ship together."
      subtitle="Spin up a project room. Two or more teammates can edit code live, chat, and share files."
    >
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <Input placeholder="Your handle" value={me} onChange={(e) => saveMe(e.target.value)} className="h-9 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="New room name"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            className="h-9 w-56"
          />
          <Button onClick={create} disabled={!newRoom.trim() || !me.trim()}>
            <Plus className="h-4 w-4" /> Create
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Rooms list */}
        <aside className="rounded-2xl border border-border bg-card p-3">
          <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">Rooms</div>
          {rooms.length === 0 && (
            <p className="px-2 py-3 text-xs text-muted-foreground">No rooms yet. Create one above.</p>
          )}
          <ul className="mt-1 space-y-1">
            {rooms.map((r) => (
              <li key={r.id} className="group flex items-center gap-1">
                <button
                  onClick={() => (r.members.includes(me) ? setActiveId(r.id) : join(r.id))}
                  className={`flex-1 truncate rounded-lg px-3 py-2 text-left text-sm transition ${
                    activeId === r.id ? "bg-primary/15 text-foreground" : "hover:bg-muted"
                  }`}
                >
                  <div className="font-semibold truncate">{r.name}</div>
                  <div className="text-[10px] text-muted-foreground">{r.members.length} member{r.members.length !== 1 && "s"}</div>
                </button>
                <button onClick={() => remove(r.id)} className="rounded p-1 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Active room */}
        <div>
          {!active ? (
            <div className="grid h-[420px] place-items-center rounded-2xl border border-dashed border-border bg-card text-sm text-muted-foreground">
              Pick or create a room to start collaborating.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold">{active.name}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      {active.members.map((m) => (
                        <Badge key={m} variant="secondary">@{m}</Badge>
                      ))}
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-500">● Live</Badge>
                </div>
              </div>

              {/* Live editor + preview */}
              <div className="rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary">
                  <span className="inline-flex items-center gap-2"><Code2 className="h-3.5 w-3.5" /> Shared editor</span>
                  <span className="inline-flex items-center gap-2"><PlayCircle className="h-3.5 w-3.5" /> Live preview</span>
                </div>
                <div className="grid gap-0 md:grid-cols-2">
                  <textarea
                    value={active.code}
                    onChange={(e) => updateActive({ code: e.target.value })}
                    spellCheck={false}
                    className="h-[360px] w-full resize-none border-r border-border bg-[oklch(0.18_0.02_260)] p-4 font-mono text-xs text-emerald-300 outline-none"
                  />
                  <iframe title="preview" src={previewSrc} sandbox="allow-scripts" className="h-[360px] w-full bg-white" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Chat */}
                <div className="rounded-2xl border border-border bg-card">
                  <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <MessageSquare className="h-3.5 w-3.5" /> Chat
                  </div>
                  <div className="h-56 space-y-2 overflow-y-auto p-3">
                    {active.messages.length === 0 && <p className="text-xs text-muted-foreground">No messages yet.</p>}
                    {active.messages.map((m, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-semibold text-primary">@{m.user}</span>
                        <span className="text-muted-foreground"> · {new Date(m.at).toLocaleTimeString()}</span>
                        <div>{m.text}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 border-t border-border p-2">
                    <Input
                      value={chat}
                      onChange={(e) => setChat(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendChat()}
                      placeholder="Message your team…"
                      className="h-9"
                    />
                    <Button size="sm" onClick={sendChat}><Send className="h-4 w-4" /></Button>
                  </div>
                </div>

                {/* Files */}
                <div className="rounded-2xl border border-border bg-card">
                  <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <span className="inline-flex items-center gap-2"><Paperclip className="h-3.5 w-3.5" /> Shared files</span>
                    <Button size="sm" variant="ghost" onClick={() => fileRef.current?.click()}>Add files</Button>
                    <input ref={fileRef} type="file" multiple hidden onChange={(e) => onFiles(e.target.files)} />
                  </div>
                  <div className="h-56 space-y-2 overflow-y-auto p-3">
                    {active.files.length === 0 && <p className="text-xs text-muted-foreground">No files shared yet.</p>}
                    {active.files.map((f, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                        <div className="truncate">
                          <div className="font-semibold truncate">{f.name}</div>
                          <div className="text-[10px] text-muted-foreground">{(f.size / 1024).toFixed(1)} KB · @{f.by}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PathLayout>
  );
}
