import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import {
  Users, Code2, Notebook, Beaker, Trophy, Briefcase, Share2, Languages as LangIcon,
  ShieldCheck, MessageSquare, Search, Compass, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Vidyashala — Complete Feature Guide" },
      { name: "description", content: "A detailed guide to every tool, lab, and feature on Vidyashala — what it does, when to use it, how to get started." },
    ],
  }),
  component: ExplorePage,
});

const sections = [
  {
    icon: Users, title: "Join Hub", to: "/join-hub" as const,
    what: "Project-based collaboration spaces. Create a hub for your idea, invite teammates, chat in real time, share resources, message members directly via their profile, and delete the hub once you ship.",
    when: "Use when you have a project idea and need 2–6 collaborators with persistent chat and shared files.",
  },
  {
    icon: Code2, title: "DSA Lab", to: "/paths/dsa-lab" as const,
    what: "In-browser coding environment with multi-language support, instant error display, 50+ practice problems (basic to advanced), and short Hindi/English help videos. Earn topic badges as you solve.",
    when: "Use daily to build problem-solving muscle. Filter by Easy / Medium / Hard.",
  },
  {
    icon: Briefcase, title: "Simulate a Career (Courses)", to: "/paths/career-sim" as const,
    what: "Structured learning tracks — Frontend, Backend, Cybersecurity, CCNA, and more. Each course has modules to complete and awards a badge.",
    when: "Pick when you want a guided weeks-long roadmap rather than ad-hoc tutorials.",
  },
  {
    icon: LangIcon, title: "Languages", to: "/languages" as const,
    what: "Deep pages for Python, Java, C++, JavaScript, Go and more — concepts, syntax, real-world usage, ecosystem, learning resources.",
    when: "Use when picking a language or revising fundamentals before an interview.",
  },
  {
    icon: Beaker, title: "Open the Lab", to: "/tools/labs" as const,
    what: "Domain cards for ML, AI, Robotics, Cybersecurity. Each leads to a page explaining concepts, tools used in industry, the companies hiring, and hands-on resources.",
    when: "Use when exploring which specialization to commit to.",
  },
  {
    icon: Notebook, title: "Notebook", to: "/tools/notebook" as const,
    what: "A digital journal — write notes with images, view all saved notes later, download as .txt, and share via link.",
    when: "Use during lectures and self-study to capture insights you'll need later.",
  },
  {
    icon: Share2, title: "Sharing Resources", to: "/sharing-resources" as const,
    what: "Search other users by name and share links, files, notes, projects, or learning materials directly with them.",
    when: "Use when a friend asks for that one PDF, GitHub repo, or roadmap you have.",
  },
  {
    icon: MessageSquare, title: "Live Collaboration", to: "/paths/live-collaboration" as const,
    what: "Build projects with a teammate using a GitHub-like flow — branches, commits, and pull-request style reviews built into the room.",
    when: "Use when two students want to co-build with version history.",
  },
  {
    icon: ShieldCheck, title: "Blockchain Badging", to: "/paths/blockchain-badging" as const,
    what: "Save, view, download, and share earned badges (Web Development, DSA with Python, etc.) with tamper-proof on-chain hashes.",
    when: "Use when applying for internships — share verifiable proof of skill.",
  },
  {
    icon: Trophy, title: "Achievements", to: "/badges" as const,
    what: "Gallery of every badge you've unlocked from courses, DSA topics, and labs.",
    when: "Visit before you update your resume or LinkedIn.",
  },
];

function ExplorePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
          <div className="absolute inset-0 bg-gradient-glow opacity-60" />
          <div className="relative mx-auto max-w-7xl px-6 py-16">
            <BackButton />
            <h1 className="mt-5 flex items-center gap-3 font-display text-4xl font-bold text-white md:text-6xl">
              <Compass className="h-10 w-10 text-white" /> Explore Vidyashala
            </h1>
            <p className="mt-3 max-w-2xl text-base text-white/75">
              One platform, many tools. Here's a quick guide to everything you can do — what each feature is, when to use it, and where to start.
            </p>
            <div className="mt-6 flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur md:max-w-md">
              <Search className="h-4 w-4" />
              <span>Tip: use the global search at the top to jump to any feature instantly.</span>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-12 md:grid-cols-2">
          {sections.map(({ icon: Icon, title, to, what, when }) => (
            <Link
              key={title}
              to={to}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-elegant"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">What it is — </strong>{what}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">When to use — </strong>{when}</p>
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
