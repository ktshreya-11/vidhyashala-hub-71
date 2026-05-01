import { Link } from "@tanstack/react-router";
import { Users, Briefcase, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pushNotification } from "@/hooks/use-notifications";
import { Mascot } from "@/components/Mascot";

export function Hero() {
  const onJoinHub = () => {
    pushNotification({
      kind: "hub",
      title: "You joined a Hub",
      body: "Welcome to the War-Room. New messages from your team are waiting.",
    });
  };

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

      <div className="pointer-events-none absolute left-4 top-24 hidden lg:block"><Mascot variant="owl" size={140} /></div>
      <div className="pointer-events-none absolute right-4 top-32 hidden lg:block"><Mascot variant="robot" size={140} /></div>
      <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          New: AI-powered career simulations are live
        </div>

        <h1
          className="animate-fade-up font-display text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
          style={{ animationDelay: "0.1s" }}
        >
          Learn together.
          <br />
          <span className="bg-gradient-to-r from-primary-glow via-white to-primary-glow bg-clip-text text-transparent">
            Build your future.
          </span>
        </h1>

        <p
          className="mt-6 max-w-2xl animate-fade-up text-base text-white/70 md:text-lg"
          style={{ animationDelay: "0.2s" }}
        >
          Vidyashala Hub connects students through study groups, real-time chats, and immersive
          career simulations — earn badges as you grow.
        </p>

        <div
          className="mt-10 flex animate-fade-up flex-col gap-4 sm:flex-row"
          style={{ animationDelay: "0.3s" }}
        >
          <Button
            asChild
            size="lg"
            onClick={onJoinHub}
            className="group h-14 rounded-full bg-white px-8 font-display text-base font-semibold text-background shadow-elegant transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-glow"
          >
            <Link to="/join-hub">
              <Users className="mr-2 h-5 w-5" />
              Join Hub
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="group h-14 rounded-full border-2 border-white/30 bg-white/5 px-8 font-display text-base font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/10 hover:text-white"
          >
            <Link to="/explore">
              <Briefcase className="mr-2 h-5 w-5" />
              Explore
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
