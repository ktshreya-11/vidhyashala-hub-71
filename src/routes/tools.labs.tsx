import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { FlaskConical, Upload, FileText, Download, Trash2, Tag, Brain, Cpu, Bot, ShieldCheck, ArrowUpRight, Building2, BookOpen, Wrench } from "lucide-react";


const DOMAINS = [
  {
    id: "ml",
    name: "Machine Learning",
    icon: Brain,
    color: "from-blue-500 to-cyan-400",
    blurb: "Models that learn patterns from data — regression, classification, deep nets.",
    concepts: ["Supervised vs Unsupervised", "Neural networks", "Gradient descent", "Overfitting & regularization", "Evaluation metrics"],
    tools: ["Python", "scikit-learn", "PyTorch", "TensorFlow", "Jupyter"],
    realworld: "Recommendations (Netflix), fraud detection (Stripe), medical imaging.",
    companies: ["Google", "OpenAI", "Meta AI", "Anthropic", "Tesla"],
    resources: ["fast.ai course", "Andrew Ng — Coursera ML", "Kaggle competitions"],
  },
  {
    id: "ai",
    name: "Artificial Intelligence",
    icon: Cpu,
    color: "from-violet-500 to-fuchsia-500",
    blurb: "Reasoning systems — LLMs, agents, planning, computer vision, NLP.",
    concepts: ["Transformers", "Prompt engineering", "RAG", "Agentic workflows", "Multi-modal models"],
    tools: ["LangChain", "LlamaIndex", "Hugging Face", "OpenAI API", "Vector DBs"],
    realworld: "ChatGPT, Copilot, autonomous agents, image generation.",
    companies: ["OpenAI", "Anthropic", "DeepMind", "Mistral", "Cohere"],
    resources: ["DeepLearning.AI", "Hugging Face course", "Papers with Code"],
  },
  {
    id: "robotics",
    name: "Robotics",
    icon: Bot,
    color: "from-amber-500 to-orange-500",
    blurb: "Sense, plan, act — embedded systems, control, kinematics, ROS.",
    concepts: ["Kinematics & dynamics", "SLAM", "PID control", "Sensor fusion", "Path planning"],
    tools: ["ROS 2", "Gazebo", "Arduino", "Raspberry Pi", "C++/Python"],
    realworld: "Warehouse robots (Amazon), surgical robots, drones, autonomous cars.",
    companies: ["Boston Dynamics", "iRobot", "ABB", "Tesla", "Waymo"],
    resources: ["ROS tutorials", "Modern Robotics — Coursera", "MIT OCW 6.832"],
  },
  {
    id: "cyber",
    name: "Cybersecurity",
    icon: ShieldCheck,
    color: "from-emerald-500 to-teal-500",
    blurb: "Defend systems — pentesting, network security, cryptography, threat hunting.",
    concepts: ["OWASP Top 10", "Cryptography", "Network security", "Threat modeling", "Incident response"],
    tools: ["Burp Suite", "Wireshark", "Metasploit", "Nmap", "Kali Linux"],
    realworld: "Bug bounties, SOC operations, red-team / blue-team engagements.",
    companies: ["CrowdStrike", "Palo Alto", "Cloudflare", "Google Project Zero"],
    resources: ["TryHackMe", "HackTheBox", "PortSwigger Web Academy"],
  },
] as const;

export const Route = createFileRoute("/tools/labs")({
  head: () => ({
    meta: [
      { title: "Labs — Vidyashala Hub" },
      { name: "description", content: "Share PDFs, assignments, and study material with your hub." },
    ],
  }),
  component: Labs,
});

type Resource = { id: string; name: string; size: number; type: string; tag: string; author: string; data: string; addedAt: number };
const KEY = "vidyashala_labs";
const formatSize = (b: number) => (b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

function Labs() {
  const [items, setItems] = useState<Resource[]>([]);
  const [tag, setTag] = useState("Assignment");
  const [author, setAuthor] = useState("Anonymous");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { const raw = localStorage.getItem(KEY); if (raw) setItems(JSON.parse(raw)); }, []);
  const persist = (n: Resource[]) => { setItems(n); localStorage.setItem(KEY, JSON.stringify(n)); };

  const upload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const newItems: Resource[] = [];
    for (const f of Array.from(files)) {
      if (f.size > 4 * 1024 * 1024) { alert(`${f.name} is too large (max 4MB for demo).`); continue; }
      const data = await new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(f); });
      newItems.push({ id: crypto.randomUUID(), name: f.name, size: f.size, type: f.type || "application/octet-stream", tag, author, data, addedAt: Date.now() });
    }
    persist([...newItems, ...items]);
  };

  const remove = (id: string) => persist(items.filter((i) => i.id !== id));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        <BackButton variant="light" />
        <h1 className="mt-4 flex items-center gap-3 font-display text-4xl font-bold">
          <FlaskConical className="h-8 w-8 text-primary" /> Labs
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Explore frontier domains, then share PDFs and notes with your hub.</p>

        {/* Domain Cards */}
        <section className="mt-10">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold">Explore Domains</h2>
            <span className="text-xs text-muted-foreground">{DOMAINS.length} fields · click to expand</span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {DOMAINS.map((d) => <DomainCard key={d.id} d={d} />)}
          </div>
        </section>


        {/* Uploader */}
        <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-card md:grid-cols-[1fr_auto]">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Tag</label>
              <select value={tag} onChange={(e) => setTag(e.target.value)} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option>Assignment</option><option>Lecture</option><option>Reference</option><option>Solution</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Your name</label>
              <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1" />
            </div>
          </div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files); }}
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center transition-colors hover:border-primary hover:bg-primary/10"
          >
            <Upload className="h-6 w-6 text-primary" />
            <div className="text-sm font-semibold">Drop or click to upload</div>
            <div className="text-[10px] text-muted-foreground">PDF, DOCX, images · max 4MB</div>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
          </div>
        </div>

        {/* List */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold">Shared resources <span className="text-muted-foreground">({items.length})</span></h2>
          {items.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border p-16 text-center text-sm text-muted-foreground">
              Nothing here yet — be the first to share 🧪
            </div>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {items.map((r) => (
                <div key={r.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-elegant">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{r.name}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{formatSize(r.size)} · by {r.author}</div>
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        <Tag className="h-2.5 w-2.5" /> {r.tag}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <a href={r.data} download={r.name} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                      <Download className="h-3.5 w-3.5" /> Download
                    </a>
                    <button onClick={() => remove(r.id)} className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive" aria-label="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
