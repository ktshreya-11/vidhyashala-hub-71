import { ReactNode } from "react";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";

export function PathLayout({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
          <div className="absolute inset-0 bg-gradient-glow opacity-60" />
          <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
            <BackButton />
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
              {eyebrow}
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-base text-white/70">{subtitle}</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">{children}</section>
      </main>
      <Footer />
    </div>
  );
}
