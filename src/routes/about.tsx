import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { Target, Heart, Zap } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Vidyashala Hub" },
      { name: "description", content: "Learn about Vidyashala's mission to make collaborative learning accessible to every student." },
      { property: "og:title", content: "About Vidyashala Hub" },
      { property: "og:description", content: "Our mission, values, and the team building the future of learning." },
    ],
  }),
  component: About,
});

const values = [
  { icon: Target, title: "Purpose-driven", desc: "Every feature exists to help a student grow." },
  { icon: Heart, title: "Community first", desc: "Learning is better, faster, and more fun together." },
  { icon: Zap, title: "Move fast", desc: "We ship weekly so you learn weekly." },
];

function About() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-hero py-24">
          <div className="absolute inset-0 bg-gradient-glow" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <h1 className="font-display text-5xl font-bold text-white md:text-6xl">About Vidyashala</h1>
            <p className="mt-6 text-lg text-white/70">
              We're building the hub where ambitious students meet, learn, and launch their careers — together.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-8 shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-border bg-card p-10 shadow-card">
            <h2 className="font-display text-3xl font-bold">Our story</h2>
            <p className="mt-4 text-muted-foreground">
              Vidyashala began as a simple idea: students learn best when they have a hub — a place
              to ask questions, chat with peers, and explore careers without pressure. Today, we're
              proud to support thousands of learners from across India and beyond, helping them
              build skills, friendships, and futures.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
