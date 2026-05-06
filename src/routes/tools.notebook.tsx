import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Whiteboard } from "@/components/Whiteboard";
import { Notebook as NotebookIcon, Plus, Trash2, Pin, ImagePlus, X, Download, Share2, PenTool, FileText } from "lucide-react";

export const Route = createFileRoute("/tools/notebook")({
  head: () => ({
    meta: [
      { title: "Notebook — Vidyashala Hub" },
      { name: "description", content: "A digital journal — write notes, save images, and delete entries." },
    ],
  }),
  component: Notebook,
});

type Note = { id: string; title: string; body: string; image?: string; color: string; createdAt: number };
const KEY = "vidyashala_notes";
const COLORS = [
  "from-primary to-primary-glow",
  "from-primary-glow to-primary",
  "from-amber-500 to-primary",
  "from-emerald-500 to-primary",
];

function Notebook() {
  const [tab, setTab] = useState<"notes" | "whiteboard">("notes");
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setNotes(JSON.parse(raw));
  }, []);

  const persist = (n: Note[]) => {
    setNotes(n);
    localStorage.setItem(KEY, JSON.stringify(n));
  };

  const onPickImage = (file?: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image too large (max 2MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !body.trim() && !image) return;
    persist([
      {
        id: crypto.randomUUID(),
        title: title.trim() || "Untitled",
        body: body.trim(),
        image,
        color: COLORS[notes.length % COLORS.length],
        createdAt: Date.now(),
      },
      ...notes,
    ]);
    setTitle("");
    setBody("");
    setImage(undefined);
    if (fileRef.current) fileRef.current.value = "";
  };

  const remove = (id: string) => persist(notes.filter((n) => n.id !== id));

  const download = (n: Note) => {
    const text = `# ${n.title}\n\n${n.body}\n\n---\nSaved: ${new Date(n.createdAt).toLocaleString()}\nFrom Vidyashala Notebook`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${n.title.replace(/[^a-z0-9]+/gi, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const share = async (n: Note) => {
    const text = `📝 ${n.title}\n\n${n.body}\n\n— shared from Vidyashala Notebook`;
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title: n.title, text });
        return;
      }
    } catch { /* fall through */ }
    try { await navigator.clipboard.writeText(text); alert("Note copied to clipboard — paste anywhere to share."); }
    catch { alert("Sharing not supported on this device."); }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
          <div className="absolute inset-0 bg-gradient-glow opacity-60" />
          <div className="relative mx-auto max-w-7xl px-6 py-12">
            <BackButton />
            <h1 className="mt-5 flex items-center gap-3 font-display text-4xl font-bold text-white md:text-5xl">
              <NotebookIcon className="h-8 w-8 text-white" /> Notebook
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              A digital journal — capture thoughts, paste lecture screenshots, delete what you don't need. Saved locally.
            </p>
          </div>
        </section>

        <div className="mx-auto w-full max-w-7xl px-6 py-10">
          <form onSubmit={add} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="border-0 bg-transparent text-lg font-semibold focus-visible:ring-0"
            />
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Start writing..."
              rows={3}
              className="mt-1 border-0 bg-transparent focus-visible:ring-0"
            />

            {image && (
              <div className="relative mt-3 overflow-hidden rounded-xl border border-border">
                <img src={image} alt="Preview" className="max-h-64 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImage(undefined)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <ImagePlus className="h-3.5 w-3.5" /> Attach image
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => onPickImage(e.target.files?.[0])}
              />
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
                <div
                  key={n.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-elegant"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${n.color}`} />
                  {n.image && (
                    <img src={n.image} alt={n.title} className="h-40 w-full object-cover" loading="lazy" />
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <Pin className="h-4 w-4 shrink-0 text-primary" />
                      <div className="flex items-center gap-1 opacity-0 transition-all group-hover:opacity-100">
                        <button onClick={() => download(n)} className="rounded-md p-1 text-muted-foreground hover:bg-primary/10 hover:text-primary" aria-label="Download" title="Download .txt">
                          <Download className="h-4 w-4" />
                        </button>
                        <button onClick={() => share(n)} className="rounded-md p-1 text-muted-foreground hover:bg-primary/10 hover:text-primary" aria-label="Share" title="Share">
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => remove(n.id)} className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-semibold">{n.title}</h3>
                    {n.body && (
                      <p className="mt-2 line-clamp-6 whitespace-pre-wrap text-sm text-muted-foreground">{n.body}</p>
                    )}
                    <div className="mt-4 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
