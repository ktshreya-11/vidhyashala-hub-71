import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { MapPin, Calendar, Award } from "lucide-react";
import { USERS, SEED_POSTS, type FeedbackUser } from "@/data/feedback";

export const Route = createFileRoute("/u/$username")({
  loader: ({ params }) => {
    const user = USERS[params.username];
    if (!user) throw notFound();
    return { user };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.user.name ?? "Profile"} — Vidyashala Hub` },
      { name: "description", content: loaderData?.user.bio ?? "Vidyashala member profile." },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="mx-auto flex max-w-md flex-1 items-center justify-center px-6 py-20 text-center">
        <div>
          <h1 className="font-display text-3xl font-bold">User not found</h1>
          <Link to="/feedback" className="mt-4 inline-block text-sm text-primary hover:underline">← Back to feedback wall</Link>
        </div>
      </main>
      <Footer />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-destructive">{error.message}</div>
  ),
  component: Profile,
});

function Profile() {
  const { user } = Route.useLoaderData() as { user: FeedbackUser };
  const userPosts = SEED_POSTS.filter((p) => p.user === user.username);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        {/* Cover */}
        <section className="relative h-48 overflow-hidden bg-gradient-hero">
          <div className="absolute inset-0 bg-gradient-glow opacity-60" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative mx-auto max-w-4xl px-6 pt-6">
            <BackButton fallback="/feedback" label="Back" />
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-6">
          {/* Profile header */}
          <div className="-mt-16 flex flex-col items-start gap-6 md:flex-row md:items-end">
            <div className={`flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br ${user.color} font-display text-4xl font-bold text-primary-foreground shadow-elegant ring-8 ring-background`}>
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="pb-2">
              <h1 className="font-display text-3xl font-bold">{user.name}</h1>
              <p className="mt-1 text-sm text-primary">{user.role}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {user.city}</span>
                <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Joined {user.joinedYear}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">About</h2>
            <p className="mt-2 text-sm leading-relaxed">{user.bio}</p>

            <h2 className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Badges</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {user.badges.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Award className="h-3 w-3" /> {b}
                </span>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div className="mt-8 mb-12">
            <h2 className="font-display text-xl font-semibold">Posts ({userPosts.length})</h2>
            <div className="mt-4 space-y-3">
              {userPosts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No posts yet.</div>
              ) : (
                userPosts.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                    <div className="text-xs text-primary">{p.tag}</div>
                    <p className="mt-1.5 text-sm">{p.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
