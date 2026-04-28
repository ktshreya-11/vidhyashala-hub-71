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
    eyebrow: "Explore Labs · IDE",
    title: "A full VS Code-style IDE in your browser",
    desc: "Forget generic chat. Open a real IDE with a multi-language compiler, syntax highlighting, and a live console — solve problems where you already think.",
    bullets: ["Monaco editor — same engine as VS Code", "JavaScript, Python, C++, Java", "Inline test runner & console"],
    cta: "Open the Lab",
    icon: Code2,
    image: labsImg,
    black: true,
  },
  {
    to: "/tools/notebook",
    eyebrow: "Notebook · Journal",
    title: "A digital journal that actually sticks",
    desc: "Write notes, drop in images, and delete entries you no longer need. Your second brain — clean, fast, and always with you.",
    bullets: ["Rich text + image attachments", "Color-coded cards", "One-tap delete & restore"],
    cta: "Open Notebook",
    icon: Notebook,
    image: dsaImg,
    black: false,
  },
  {
    to: "/paths/career-sim",
    eyebrow: "Career Sim · Badges",
    title: "Simulate a career. Earn proof.",
    desc: "Step into roles before you commit. Explore Engineer, Designer, PM and more — then collect verifiable, on-chain badges along the way.",
    bullets: ["Branching career paths", "Earned badges gallery", "Blockchain-verified proof"],
    cta: "Try Career Sim",
    icon: Compass,
    image: careerImg,
    black: true,
  },
  {
    to: "/paths/live-collaboration",
    eyebrow: "War-Room · Industry Link",
    title: "Build with global, distributed teams",
    desc: "A war-room UI for serious project work — kanban, presence, and chat in one canvas. Plus a real Industry Link dashboard where pros review student tasks.",
    bullets: ["Live presence & chat", "Drag-and-drop kanban", "Mentor review workflow"],
    cta: "Enter War-Room",
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
