import { MessagesSquare, Trophy, BookOpen, Compass } from "lucide-react";

const features = [
  { icon: MessagesSquare, title: "Group Chats", desc: "Create study hubs, share notes, and learn together in real time." },
  { icon: Compass, title: "Career Sim", desc: "Simulate real careers — from data scientist to founder — and find your fit." },
  { icon: Trophy, title: "Earn Badges", desc: "Level up with verifiable achievements as you complete milestones." },
  { icon: BookOpen, title: "Curated Paths", desc: "Personalized roadmaps built around your goals and skill level." },
];

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-bold md:text-5xl">
          Everything you need to <span className="text-gradient">grow</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Tools built for students who refuse to learn alone.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-elegant"
          >
            <div className="absolute inset-0 bg-gradient-glow opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
