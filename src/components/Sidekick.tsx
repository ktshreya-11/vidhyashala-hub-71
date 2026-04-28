import { useState } from "react";
import { Bot, X, MessageSquare, Code2, Compass, Send, Sparkles, ExternalLink, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "communication" | "coding" | "project";

const MODES: { id: Mode; label: string; icon: typeof MessageSquare; tagline: string; color: string }[] = [
  { id: "communication", label: "Communication", icon: MessageSquare, tagline: "Sharpen how you speak & write", color: "from-primary to-primary-glow" },
  { id: "coding", label: "Coding Helper", icon: Code2, tagline: "Logic videos in Hindi & English", color: "from-primary-glow to-primary" },
  { id: "project", label: "Project Helper", icon: Compass, tagline: "Roadmaps & historical data", color: "from-primary to-primary-glow" },
];

const COMM_TIPS = [
  "Try the 'rule of three' — group ideas in threes for clarity.",
  "Replace 'just' and 'maybe' with confident verbs.",
  "Mirror the listener's pace for instant rapport.",
  "Pause for 1 full second after a key point. It lands harder.",
];

const CODE_VIDEOS = [
  { title: "Recursion explained (Hindi)", channel: "CodeWithHarry", url: "https://www.youtube.com/results?search_query=recursion+codewithharry" },
  { title: "Big-O Notation in 10 mins", channel: "Apna College", url: "https://www.youtube.com/results?search_query=big+o+apna+college" },
  { title: "Dynamic Programming intro (English)", channel: "Striver", url: "https://www.youtube.com/results?search_query=dp+striver" },
  { title: "Graphs from scratch (Hinglish)", channel: "Love Babbar", url: "https://www.youtube.com/results?search_query=graphs+love+babbar" },
];

const ROADMAPS = [
  { title: "Frontend Engineer · 2024", milestones: ["HTML/CSS", "JS deep-dive", "React + TS", "Testing", "System design"] },
  { title: "Data Scientist · 2024", milestones: ["Python + NumPy", "Stats & probability", "Pandas/SQL", "ML fundamentals", "MLOps"] },
  { title: "Product Manager · 2024", milestones: ["Discovery", "Specs & wireframes", "Metrics", "Stakeholders", "Launch"] },
];

export function Sidekick() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("communication");
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hey 👋 I'm your Sidekick. Pick a mode above and ask anything." },
  ]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const user = input.trim();
    setInput("");
    setChat((c) => [...c, { role: "user", text: user }]);
    setTimeout(() => {
      const reply =
        mode === "communication"
          ? `Quick coaching tip: ${COMM_TIPS[Math.floor(Math.random() * COMM_TIPS.length)]}`
          : mode === "coding"
          ? `Try this: break the problem into the smallest sub-problem you can solve, then build up. Want a video on it?`
          : `Here's a path: research → spec → MVP → ship → measure → iterate. Each phase has a deliverable.`;
      setChat((c) => [...c, { role: "ai", text: reply }]);
    }, 500);
  };

  const active = MODES.find((m) => m.id === mode)!;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open AI Co-Pilot"
        className={`fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant transition-all hover:scale-110 hover:shadow-glow animate-pulse-glow ${
          open ? "scale-0 opacity-0" : ""
        }`}
      >
        <Bot className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background text-[10px] font-bold text-primary border border-primary">
          AI
        </span>
      </button>

      {/* Panel */}
      <div
        className={`fixed bottom-6 right-6 z-40 w-[calc(100vw-3rem)] max-w-[400px] origin-bottom-right rounded-3xl border border-border bg-card shadow-elegant transition-all duration-300 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"
        }`}
        style={{ height: "min(620px, calc(100vh - 3rem))" }}
      >
        {/* Header */}
        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-hero p-5">
          <div className="absolute inset-0 bg-gradient-glow opacity-60" />
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-display text-lg font-bold text-white">Sidekick</div>
                <div className="text-xs text-white/70">{active.tagline}</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mode tabs */}
          <div className="relative mt-4 flex gap-1 rounded-full bg-black/30 p-1 backdrop-blur">
            {MODES.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[11px] font-medium transition-all ${
                    mode === m.id ? "bg-white text-background shadow-sm" : "text-white/70 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {m.label.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex h-[calc(100%-148px)] flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {mode === "communication" && (
              <div className="rounded-xl border border-primary/20 bg-accent/30 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-primary">Today's drill</div>
                <p className="mt-1 text-xs">{COMM_TIPS[0]}</p>
              </div>
            )}
            {mode === "coding" && (
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-primary">Recommended videos</div>
                {CODE_VIDEOS.map((v) => (
                  <a key={v.title} href={v.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-2 rounded-lg border border-border bg-background/50 p-2.5 text-xs transition-colors hover:border-primary/60">
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{v.title}</div>
                      <div className="text-[10px] text-muted-foreground">{v.channel}</div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
                  </a>
                ))}
              </div>
            )}
            {mode === "project" && (
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-primary">Roadmaps · historical data</div>
                {ROADMAPS.map((r) => (
                  <div key={r.title} className="rounded-lg border border-border bg-background/50 p-3">
                    <div className="flex items-center gap-2">
                      <Map className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-semibold">{r.title}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {r.milestones.map((m) => (
                        <span key={m} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">{m}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* chat */}
            {chat.map((c, i) => (
              <div key={i} className={`flex ${c.role === "user" ? "justify-end" : ""}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                  c.role === "user" ? "bg-gradient-primary text-primary-foreground" : "bg-muted"
                }`}>
                  {c.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Ask ${active.label}...`} className="h-9 text-xs" />
            <Button type="submit" size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
