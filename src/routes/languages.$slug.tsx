import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { LANGS } from "./languages";
import { ArrowLeft, Building2, Cpu, Sparkles } from "lucide-react";

export const Route = createFileRoute("/languages/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.toUpperCase()} — Language Guide | Vidyashala` },
      { name: "description", content: `Concepts, usage, and ecosystem for ${params.slug}.` },
    ],
  }),
  component: LangDetail,
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <p>Language not found.</p>
      <Link to="/languages" className="text-primary underline">Back to languages</Link>
    </div>
  ),
});

function LangDetail() {
  const { slug } = Route.useParams();
  const lang = LANGS.find((l) => l.slug === slug);
  if (!lang) throw notFound();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        <section className={`relative overflow-hidden border-b border-border bg-gradient-to-br ${lang.color}`}>
          <div className="relative mx-auto max-w-5xl px-6 py-16">
            <BackButton fallback="/languages" />
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{lang.tag}</div>
            <h1 className="mt-3 font-display text-5xl font-bold text-white md:text-7xl">{lang.name}</h1>
            <p className="mt-4 max-w-2xl text-white/90">{lang.usage}</p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl space-y-10 px-6 py-12">
          <section>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold"><Sparkles className="h-5 w-5 text-primary" /> Core Concepts</h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {lang.concepts.map((c) => (
                <li key={c} className="rounded-xl border border-border bg-card p-4 text-sm">{c}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold"><Cpu className="h-5 w-5 text-primary" /> Where It's Used</h2>
            <p className="mt-3 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">{lang.usage}</p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold"><Building2 className="h-5 w-5 text-primary" /> Companies Hiring</h2>
            <p className="mt-3 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">{lang.companies}</p>
          </section>

          <section className="rounded-2xl border border-border bg-gradient-primary p-8 text-primary-foreground">
            <h2 className="font-display text-2xl font-bold">Ready to practice?</h2>
            <p className="mt-2 text-sm opacity-90">Solve problems in the DSA Lab using {lang.name} and earn topic badges.</p>
            <Link to="/paths/dsa-lab" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 font-semibold text-background hover:bg-white/90">
              Open DSA Lab <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
