import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Languages as LangIcon, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/languages")({
  head: () => ({
    meta: [
      { title: "Programming Languages — Concepts & Usage | Vidyashala" },
      { name: "description", content: "Detailed guides for Python, Java, C++, JavaScript, Go and more — concepts, ecosystem, and real-world usage." },
    ],
  }),
  component: LanguagesPage,
});

const langs = [
  { slug: "python", name: "Python", color: "from-yellow-400 to-blue-500", tag: "Beginner-friendly · ML/AI", concepts: ["Dynamic typing & duck typing", "List/dict/set comprehensions", "Decorators & generators", "Async/await with asyncio"], usage: "Data science, ML (PyTorch, TensorFlow), backend (Django, FastAPI), automation, scripting.", companies: "Google, Netflix, Instagram, NASA, Spotify" },
  { slug: "javascript", name: "JavaScript", color: "from-yellow-300 to-amber-500", tag: "Web · Everywhere", concepts: ["Event loop & promises", "Closures & prototypes", "ES modules", "TypeScript supersets"], usage: "Frontend (React, Vue), backend (Node), mobile (React Native), desktop (Electron).", companies: "Meta, Airbnb, Netflix, Microsoft, Uber" },
  { slug: "java", name: "Java", color: "from-orange-500 to-red-600", tag: "Enterprise · Android", concepts: ["JVM & garbage collection", "OOP, generics", "Streams & lambdas", "Concurrency (Executors)"], usage: "Enterprise backends (Spring), Android (alongside Kotlin), big data (Hadoop, Kafka).", companies: "Amazon, Google, LinkedIn, Uber, banks worldwide" },
  { slug: "cpp", name: "C++", color: "from-blue-500 to-indigo-700", tag: "Performance · Systems", concepts: ["Pointers & references", "RAII & smart pointers", "Templates & STL", "Move semantics"], usage: "Game engines (Unreal), trading systems, browsers (Chrome), embedded.", companies: "Adobe, Bloomberg, Nvidia, EA, Microsoft" },
  { slug: "go", name: "Go", color: "from-cyan-400 to-sky-600", tag: "Cloud · Concurrency", concepts: ["Goroutines & channels", "Interfaces (structural)", "Defer/panic/recover", "Static binaries"], usage: "Cloud infra (Docker, Kubernetes), microservices, CLI tools.", companies: "Google, Cloudflare, Uber, Twitch" },
  { slug: "rust", name: "Rust", color: "from-orange-600 to-rose-700", tag: "Safe · Systems", concepts: ["Ownership & borrowing", "Lifetimes", "Pattern matching", "Zero-cost abstractions"], usage: "OS kernels, WebAssembly, browsers (Servo, Firefox), CLI tools.", companies: "Mozilla, Discord, Cloudflare, Microsoft" },
];

function LanguagesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
          <div className="absolute inset-0 bg-gradient-glow opacity-60" />
          <div className="relative mx-auto max-w-7xl px-6 py-14">
            <BackButton />
            <h1 className="mt-5 flex items-center gap-3 font-display text-4xl font-bold text-white md:text-5xl">
              <LangIcon className="h-9 w-9" /> Programming Languages
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/75">
              Pick a language and dive deep — core concepts, where it's used in industry, and which companies hire for it.
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {langs.map((l) => (
            <Link
              key={l.slug}
              to="/languages/$slug"
              params={{ slug: l.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-elegant"
            >
              <div className={`h-2 bg-gradient-to-r ${l.color}`} />
              <div className="p-6">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">{l.tag}</div>
                <h2 className="mt-1 font-display text-2xl font-bold">{l.name}</h2>
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{l.usage}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Read full guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const LANGS = langs;
