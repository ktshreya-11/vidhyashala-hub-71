import { Link } from "@tanstack/react-router";
import { FileCode2, ArrowRight, Sparkles, Layers } from "lucide-react";
import labsImg from "@/assets/section-labs.jpg";

export function ExploreLabsCallout() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.12_0.04_258)] py-24 text-white">
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-primary/20 opacity-40 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-glow">
            <Sparkles className="h-3.5 w-3.5" /> Standalone · Explore Labs
          </div>
          <h3 className="mt-5 font-display text-3xl font-bold leading-tight md:text-5xl">
            A separate VS Code-style IDE
          </h3>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
            Not tied to a problem set. Open a multi-file workspace, switch between JavaScript, Python, C++, Java, HTML, CSS, and more — then save your work locally.
          </p>
          <ul className="mt-7 space-y-3 text-sm text-white/80">
            {[
              "Multi-file project tree with create/delete",
              "Six languages in the same workspace",
              "Integrated console + Save-to-disk",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary-glow shadow-[0_0_10px_oklch(0.75_0.2_258)]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/tools/ide"
            className="group mt-9 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-elegant"
          >
            Launch Explore Labs
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-elegant">
          <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
            <Layers className="h-3 w-3 text-primary-glow" /> Multi-language IDE
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <img src={labsImg} alt="Explore Labs IDE" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
      </div>
    </section>
  );
}

// Re-export icon for tree-shaking neutral usage
export const ExploreLabsIcon = FileCode2;
