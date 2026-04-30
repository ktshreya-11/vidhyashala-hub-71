import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy, Calendar } from "lucide-react";
import { useBadges } from "@/hooks/use-badges";
import { BackButton } from "@/components/BackButton";
import { Mascot } from "@/components/Mascot";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/badges")({
  head: () => ({
    meta: [
      { title: "Your Badges — Vidyashala Hub" },
      { name: "description", content: "Badges you have earned by completing courses and DSA challenges." },
    ],
  }),
  component: BadgesPage,
});

function BadgesPage() {
  const { badges, count, clear } = useBadges();
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <BackButton variant="light" fallback="/dashboard" />
        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Achievements</div>
            <h1 className="mt-1 font-display text-4xl font-bold">Your badges</h1>
            <p className="mt-2 text-sm text-muted-foreground">{count} earned · keep solving to unlock more.</p>
          </div>
          <Mascot variant="astro" size={120} className="hidden md:block" />
        </div>

        {count === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <Trophy className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No badges yet. Solve a problem in the DSA Lab to earn your first one.</p>
            <Link to="/paths/dsa-lab" className="mt-4 inline-block rounded-full bg-gradient-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:opacity-90">
              Open DSA Lab
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {badges.map((b) => (
                <div key={b.id + b.earnedAt} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-elegant">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div className="text-4xl">{b.icon}</div>
                    <div className="mt-3 font-display text-base font-bold leading-tight">{b.title}</div>
                    <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-primary">{b.topic}</div>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {b.difficulty}
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="h-3 w-3" /> {new Date(b.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={clear} className="mt-8 text-xs text-muted-foreground hover:text-destructive">Clear all badges</button>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
