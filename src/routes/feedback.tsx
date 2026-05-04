import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, Sparkles } from "lucide-react";
import { USERS, SEED_POSTS, type Post } from "@/data/feedback";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback Wall — Vidyashala Hub" },
      { name: "description", content: "A social wall where the Vidyashala community shares experiences." },
    ],
  }),
  component: Feedback,
});

const KEY = "vidyashala_feedback";

function Feedback() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [draft, setDraft] = useState("");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  useEffect(() => { const raw = localStorage.getItem(KEY); setPosts(raw ? JSON.parse(raw) : SEED_POSTS); }, []);
  const persist = (p: Post[]) => { setPosts(p); localStorage.setItem(KEY, JSON.stringify(p)); };

  const post = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    persist([{ id: crypto.randomUUID(), user: "aarav", text: draft.trim(), likes: 0, tag: "Experience", at: Date.now() }, ...posts]);
    setDraft("");
  };

  const like = (id: string) => {
    setLiked({ ...liked, [id]: !liked[id] });
    persist(posts.map((p) => (p.id === id ? { ...p, likes: p.likes + (liked[id] ? -1 : 1) } : p)));
  };

  const timeAgo = (t: number) => {
    const d = (Date.now() - t) / 1000;
    if (d < 60) return "just now";
    if (d < 3600) return `${Math.floor(d / 60)}m`;
    if (d < 86400) return `${Math.floor(d / 3600)}h`;
    return `${Math.floor(d / 86400)}d`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-gradient-hero py-14">
          <div className="absolute inset-0 bg-gradient-glow opacity-60" />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <div className="flex justify-center"><BackButton /></div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
              <Sparkles className="h-3 w-3" /> Community Wall
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold text-white md:text-5xl">Real stories. Real people.</h1>
            <p className="mt-3 text-sm text-white/70">Share what's working, what's not, and what changed for you.</p>
          </div>
        </section>

        <div className="mx-auto max-w-2xl px-6 py-10">
          {/* Composer */}
          <form onSubmit={post} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Share an experience with the hub..." rows={3} className="border-0 bg-transparent focus-visible:ring-0" />
            <div className="mt-2 flex justify-end">
              <Button type="submit" className="bg-gradient-primary text-primary-foreground hover:opacity-90">Post</Button>
            </div>
          </form>

          {/* Feed */}
          <div className="mt-6 space-y-4">
            {posts.map((p) => {
              const u = USERS[p.user] ?? USERS.aarav;
              return (
                <article key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-card transition-colors hover:border-primary/40">
                  <header className="flex items-center gap-3">
                    <Link to="/u/$username" params={{ username: u.username }} className="shrink-0">
                      <div className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${u.color} text-sm font-bold text-primary-foreground transition-transform hover:scale-110 shadow-glow`}>
                        <img src={u.avatar} alt={u.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                      </div>
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link to="/u/$username" params={{ username: u.username }} className="font-semibold hover:text-primary">
                        {u.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">{u.role} · {timeAgo(p.at)}</div>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{p.tag}</span>
                  </header>
                  <p className="mt-4 text-sm leading-relaxed">{p.text}</p>
                  <footer className="mt-4 flex items-center gap-1 border-t border-border pt-3">
                    <button onClick={() => like(p.id)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors ${liked[p.id] ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                      <Heart className={`h-3.5 w-3.5 transition-all ${liked[p.id] ? "fill-primary scale-110" : ""}`} /> {p.likes}
                    </button>
                    <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-primary">
                      <MessageCircle className="h-3.5 w-3.5" /> Reply
                    </button>
                    <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-primary">
                      <Share2 className="h-3.5 w-3.5" /> Share
                    </button>
                  </footer>
                </article>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
