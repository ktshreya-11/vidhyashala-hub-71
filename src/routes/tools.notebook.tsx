import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Notebook as NotebookIcon, Plus, Trash2, Pin } from "lucide-react";

export const Route = createFileRoute("/tools/notebook")({
  head: () => ({
    meta: [
      { title: "Notebook — Vidyashala Hub" },
      { name: "description", content: "Capture ideas. Create and delete notes in your personal notebook." },
    ],
  }),
  component: Notebook,
});

type Note = { id: string; title: string; body: string; color: string; createdAt: number };
const KEY = "vidyashala_notes";
const COLORS = ["from-primary to-primary-glow", "from-primary-glow to-primary", "from-amber-500 to-primary", "from-emerald-500 to-primary"];

function Notebook() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState(""); const [body, setBody] = useState("");

  useEffect(() => { const raw = localStorage.getItem(KEY); if (raw) setNotes(JSON.parse(raw)); }, []);
  const persist = (n: Note[]) => { setNotes(n); localStorage.setItem(KEY, JSON.stringify(n)); };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    persist([{ id: crypto.randomUUID(), title: title.trim(), body: body.trim(), color: COLORS[notes.length % COLORS.length], createdAt: Date.now() }, ...notes]);
    setTitle(""); setBody("");
  };
  const remove = (id: string) => persist(notes.filter((n) => n.id !== id));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary">← Home</Link>
            <h1 className="mt-2 flex items-center gap-3 font-display text-4xl font-bold">
              <NotebookIcon className="h-8 w-8 text-primary" /> Notebook
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Capture thoughts, lectures, and todos. Saved locally to your device.</p>
          </div>
          <div className="hidden text-right text-sm text-muted-foreground md:block">
            <div className="font-display text-3xl font-bold text-foreground">{notes.length}</div>
            <div>notes</div>
          </div>
        </div>

        <form onSubmit={add} className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-card">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title..." className="border-0 bg-transparent text-lg font-semibold focus-visible:ring-0" />
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Start writing..." rows={3} className="mt-1 border-0 bg-transparent focus-visible:ring-0" />
          <div className="mt-3 flex justify-end">
            <Button type="submit" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              <Plus className="mr-1.5 h-4 w-4" /> Add Note
            </Button>
          </div>
        </form>

        {notes.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
            No notes yet. Write your first one above ✍️
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((n) => (
              <div key={n.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-elegant">
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${n.color}`} />
                <div className="flex items-start justify-between gap-2">
                  <Pin className="h-4 w-4 shrink-0 text-primary" />
                  <button onClick={() => remove(n.id)} className="rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold">{n.title}</h3>
                {n.body && <p className="mt-2 line-clamp-6 whitespace-pre-wrap text-sm text-muted-foreground">{n.body}</p>}
                <div className="mt-4 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {new Date(n.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
