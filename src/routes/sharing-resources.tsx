import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Share2, Send, Link2, FileText, Folder, BookOpen } from "lucide-react";
import { pushNotification } from "@/hooks/use-notifications";

export const Route = createFileRoute("/sharing-resources")({
  head: () => ({
    meta: [
      { title: "Sharing Resources — Vidyashala" },
      { name: "description", content: "Search users and instantly share links, files, notes, projects, and learning materials." },
    ],
  }),
  component: SharingPage,
});

const USERS = [
  { username: "aarav", name: "Aarav Singh", role: "Frontend · React", avatar: "🦊" },
  { username: "priya", name: "Priya Patel", role: "ML Engineer", avatar: "🦉" },
  { username: "rahul", name: "Rahul Verma", role: "Backend · Go", avatar: "🤖" },
  { username: "sneha", name: "Sneha Iyer", role: "Cybersecurity", avatar: "🧑‍🚀" },
  { username: "vivek", name: "Vivek Rao", role: "DevOps", avatar: "🦝" },
  { username: "anika", name: "Anika Sharma", role: "Data Science", avatar: "🐼" },
  { username: "kabir", name: "Kabir Khanna", role: "Mobile · Flutter", avatar: "🦁" },
  { username: "meera", name: "Meera Nair", role: "Product Design", avatar: "🦄" },
];

const KINDS = [
  { id: "link", label: "Link", icon: Link2 },
  { id: "file", label: "File", icon: FileText },
  { id: "note", label: "Note", icon: BookOpen },
  { id: "project", label: "Project", icon: Folder },
] as const;

function SharingPage() {
  const [q, setQ] = useState("");
  const [target, setTarget] = useState<typeof USERS[number] | null>(null);
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("link");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const filtered = USERS.filter((u) => (q.trim() === "" ? true : (u.name + u.username + u.role).toLowerCase().includes(q.toLowerCase())));

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target || !title.trim()) return;
    pushNotification({ kind: "hub", title: `Shared with ${target.name}`, body: `${title} (${kind})` });
    setTitle(""); setContent(""); setTarget(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
          <div className="absolute inset-0 bg-gradient-glow opacity-60" />
          <div className="relative mx-auto max-w-7xl px-6 py-14">
            <BackButton />
            <h1 className="mt-5 flex items-center gap-3 font-display text-4xl font-bold text-white md:text-5xl">
              <Share2 className="h-9 w-9" /> Sharing Resources
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/75">
              Search any user on Vidyashala and share links, files, notes, projects, or learning materials in one tap.
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[1fr,420px]">
          <div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users by name, username, or role..." className="pl-9 h-12" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {filtered.map((u) => (
                <div key={u.username} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
                  <Link to="/u/$username" params={{ username: u.username }} className="text-3xl">{u.avatar}</Link>
                  <div className="flex-1 min-w-0">
                    <Link to="/u/$username" params={{ username: u.username }} className="font-display font-semibold hover:text-primary">{u.name}</Link>
                    <div className="text-xs text-muted-foreground">@{u.username} · {u.role}</div>
                  </div>
                  <Button size="sm" onClick={() => setTarget(u)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share
                  </Button>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No users match "{q}"</div>
              )}
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24 lg:h-fit">
            <h2 className="font-display text-lg font-bold">{target ? `Share with ${target.name}` : "Pick a user to share"}</h2>
            {target ? (
              <form onSubmit={send} className="mt-4 space-y-3">
                <div className="flex gap-2">
                  {KINDS.map((k) => {
                    const Icon = k.icon;
                    return (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => setKind(k.id)}
                        className={`flex flex-1 flex-col items-center gap-1 rounded-lg border p-2 text-xs font-medium transition ${kind === k.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                      >
                        <Icon className="h-4 w-4" />
                        {k.label}
                      </button>
                    );
                  })}
                </div>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={kind === "link" ? "https://..." : "Title"} />
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Add a message (optional)" rows={3} />
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setTarget(null)}>Cancel</Button>
                  <Button type="submit" className="flex-1 bg-gradient-primary text-primary-foreground"><Send className="mr-1.5 h-3.5 w-3.5" /> Send</Button>
                </div>
              </form>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Click "Share" next to any user on the left to start.</p>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
