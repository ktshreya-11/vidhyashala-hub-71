import { Link } from "@tanstack/react-router";
import { Code2, Notebook, Compass, Briefcase, ArrowRight, Sparkles } from "lucide-react";
import labsImg from "@/assets/section-labs.jpg";
import dsaImg from "@/assets/section-dsa.jpg";
import careerImg from "@/assets/section-career.jpg";
import warroomImg from "@/assets/section-warroom.jpg";

type Section = {
  to: string;
  eyebrow: string;
  title: string;
  desc: string;
  bullets: string[];
  cta: string;
  icon: typeof Code2;
  image: string;
  // alternating background — true = pure black, false = deep navy
  black: boolean;
};

const sections: Section[] = [
  {
    to: "/paths/dsa-lab",
    eyebrow: "Explore Labs · DSA",
    title: "A focused DSA lab in your browser",
    desc: "Pick easy, medium or hard problems. A clean editor, instant test runner, and clear feedback.",
    bullets: ["In-browser code runner", "Easy/Medium/Hard filters", "Mark complete & track progress"],
    cta: "Open the Lab",
    icon: Code2,
    image: labsImg,
    black: true,
  },
  {
    to: "/tools/notebook",
    eyebrow: "Notebook · Journal · Whiteboard",
    title: "Digital journal + whiteboard mode",
    desc: "Write notes, drop in images, switch to a freehand whiteboard with sticky notes — synced to your account.",
    bullets: ["Rich notes + images", "Whiteboard sketching", "Sticky notes with positions"],
    cta: "Open Notebook",
    icon: Notebook,
    image: dsaImg,
    black: false,
  },
  {
    to: "/paths/career-sim",
    eyebrow: "Career Sim · Courses · Badges",
    title: "Pick a career. Take the modules. Earn the badge.",
    desc: "Engineer, PM or Designer — each path comes with curated learning modules. Complete them to unlock a verifiable digital badge.",
    bullets: ["Per-career learning modules", "Earned badges saved to your profile", "Blockchain-style verification"],
    cta: "Try Career Sim",
    icon: Compass,
    image: careerImg,
    black: true,
  },
  {
    to: "/paths/live-collaboration",
    eyebrow: "Global Workspace · Realtime",
    title: "Build with global, distributed teams",
    desc: "A real-time shared Kanban board. Drag cards across columns and watch them sync instantly for everyone in the room.",
    bullets: ["Realtime Kanban (Supabase)", "Drag & drop with hello-pangea/dnd", "Open to all signed-in students"],
    cta: "Enter Workspace",
    icon: Briefcase,
    image: warroomImg,
    black: false,
  },
];

export function Features() {
  return (
    <section className="relative">
      {/* Heading band */}
      <div className="relative bg-black py-20 text-white">
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary-glow" /> Everything you need to grow
          </div>
          <h2 className="mt-5 font-display text-4xl font-bold md:text-6xl">
            One platform.{" "}
            <span className="bg-gradient-to-r from-primary-glow via-white to-primary-glow bg-clip-text text-transparent">
              Four superpowers.
            </span>
          </h2>
          <p className="mt-4 text-base text-white/60">
            Not buttons. Not modals. Full, working tools — built for students who ship.
          </p>
        </div>
      </div>

      {sections.map((s, i) => {
        const reverse = i % 2 === 1;
        const Icon = s.icon;
        return (
          <div
            key={s.to}
            className={`relative overflow-hidden text-white ${
              s.black ? "bg-black" : "bg-[oklch(0.12_0.04_258)]"
            }`}
          >
            {/* glow blob */}
            <div
              className={`pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-primary/20 opacity-40 blur-3xl ${
                reverse ? "-left-40 top-1/2" : "-right-40 top-1/3"
              }`}
            />
            <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 md:py-32 lg:grid-cols-2 lg:gap-16">
              {/* Text */}
              <div className={reverse ? "lg:order-2" : "lg:order-1"}>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-glow">
                  <Icon className="h-3.5 w-3.5" /> {s.eyebrow}
                </div>
                <h3 className="mt-5 font-display text-3xl font-bold leading-tight md:text-5xl">
                  {s.title}
                </h3>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
                  {s.desc}
                </p>

                <ul className="mt-7 space-y-3">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-white/80">
                      <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary-glow shadow-[0_0_10px_oklch(0.75_0.2_258)]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={s.to}
                  className="group mt-9 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                >
                  {s.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Image */}
              <div className={reverse ? "lg:order-1" : "lg:order-2"}>
                <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-elegant transition-all hover:-translate-y-1 hover:border-primary/40">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    width={1280}
                    height={960}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
