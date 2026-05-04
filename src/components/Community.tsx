import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle, Quote } from "lucide-react";
import { USERS, SEED_POSTS } from "@/data/feedback";

export function Community() {
  const featured = SEED_POSTS.slice(0, 4);

  return (
    <section className="relative bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Heart className="h-3 w-3" /> Community
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
              Loved by people who <span className="text-gradient">ship</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Real students, real outcomes. Tap any face to visit their profile.
            </p>
          </div>
          <Link
            to="/feedback"
            className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-xs font-medium transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
          >
            Open community wall →
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {featured.map((p) => {
            const u = USERS[p.user];
            if (!u) return null;
            return (
              <article
                key={p.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-elegant"
              >
                <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10 transition-colors group-hover:text-primary/25" />
                <p className="text-sm leading-relaxed">"{p.text}"</p>
                <footer className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <Link
                    to="/u/$username"
                    params={{ username: u.username }}
                    className="shrink-0"
                    aria-label={`Visit ${u.name}'s profile`}
                  >
                    <div
                      className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${u.color} text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-110`}
                    >
                      <img src={u.avatar} alt={u.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/u/$username"
                      params={{ username: u.username }}
                      className="block truncate text-sm font-semibold transition-colors hover:text-primary"
                    >
                      {u.name}
                    </Link>
                    <div className="truncate text-xs text-muted-foreground">{u.role} · {u.city}</div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {p.likes}</span>
                    <span className="inline-flex items-center gap-1"><MessageCircle className="h-3 w-3" /> 0</span>
                  </div>
                </footer>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
