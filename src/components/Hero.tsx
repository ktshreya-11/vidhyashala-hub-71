import { Users, Briefcase, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      <div className="absolute inset-0 bg-gradient-glow" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, oklch(1 0 0 / 0.15) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          New: AI-powered career simulations are live
        </div>

        <h1 className="animate-fade-up font-display text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl" style={{ animationDelay: "0.1s" }}>
          Learn together.
          <br />
          <span className="bg-gradient-to-r from-primary-glow via-white to-primary-glow bg-clip-text text-transparent">
            Build your future.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl animate-fade-up text-base text-white/70 md:text-lg" style={{ animationDelay: "0.2s" }}>
          Vidyashala Hub connects students through study groups, real-time chats, and immersive
          career simulations — earn badges as you grow.
        </p>

        <div className="mt-10 flex animate-fade-up flex-col gap-4 sm:flex-row" style={{ animationDelay: "0.3s" }}>
          <Button
            size="lg"
            className="group h-14 rounded-full bg-white px-8 font-display text-base font-semibold text-background shadow-elegant transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-glow"
          >
            <Users className="mr-2 h-5 w-5" />
            Join Hub
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="group h-14 rounded-full border-2 border-white/30 bg-white/5 px-8 font-display text-base font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/10 hover:text-white"
          >
            <Briefcase className="mr-2 h-5 w-5" />
            Try Career Sim
          </Button>
        </div>

        <div className="mt-16 grid w-full max-w-3xl animate-fade-up grid-cols-3 gap-6 border-t border-white/10 pt-8" style={{ animationDelay: "0.4s" }}>
          {[
            { v: "12K+", l: "Active learners" },
            { v: "350+", l: "Career paths" },
            { v: "98%", l: "Satisfaction" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-3xl font-bold text-white md:text-4xl">{s.v}</div>
              <div className="mt-1 text-xs text-white/60 md:text-sm">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
