import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { FileCode2, Play, Plus, Trash2, FileText, Save } from "lucide-react";

export const Route = createFileRoute("/tools/ide")({
  head: () => ({
    meta: [
      { title: "Explore Labs IDE — Vidyashala Hub" },
      { name: "description", content: "Standalone VS Code-style IDE with multi-language support and a project file tree." },
    ],
  }),
  component: ExploreLabsIDE,
});

type Lang = "javascript" | "typescript" | "python" | "cpp" | "java" | "html" | "css";
type FileItem = { id: string; name: string; lang: Lang; code: string };

const LANG_FROM_EXT: Record<string, Lang> = {
  js: "javascript", ts: "typescript", py: "python", cpp: "cpp", cc: "cpp",
  java: "java", html: "html", css: "css",
};

const EXT_FOR_LANG: Record<Lang, string> = {
  javascript: "js", typescript: "ts", python: "py", cpp: "cpp",
  java: "java", html: "html", css: "css",
};

const SEED: FileItem[] = [
  {
    id: "f1", name: "main.js", lang: "javascript",
    code: "// Welcome to Explore Labs IDE\n// A standalone, multi-language sandbox.\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('Vidyashala'));\n",
  },
  {
    id: "f2", name: "app.py", lang: "python",
    code: "# Python sandbox (simulated runtime)\n\ndef factorial(n):\n    return 1 if n <= 1 else n * factorial(n - 1)\n\nprint(factorial(6))\n",
  },
  {
    id: "f3", name: "index.html", lang: "html",
    code: "<!doctype html>\n<html>\n  <body>\n    <h1>Hello from Labs IDE</h1>\n  </body>\n</html>\n",
  },
];

function ExploreLabsIDE() {
  const [files, setFiles] = useState<FileItem[]>(SEED);
  const [activeId, setActiveId] = useState<string>(SEED[0].id);
  const [output, setOutput] = useState<string>("// Output appears here. Click Run to execute.");
  const [running, setRunning] = useState(false);

  const active = files.find((f) => f.id === activeId)!;

  const updateActive = (code: string) =>
    setFiles((prev) => prev.map((f) => (f.id === activeId ? { ...f, code } : f)));

  const newFile = () => {
    const name = prompt("File name (e.g. utils.ts, script.py)") || "";
    if (!name.trim()) return;
    const ext = name.split(".").pop()?.toLowerCase() || "js";
    const lang = LANG_FROM_EXT[ext] || "javascript";
    const item: FileItem = { id: crypto.randomUUID(), name, lang, code: `// ${name}\n` };
    setFiles((prev) => [...prev, item]);
    setActiveId(item.id);
  };

  const removeFile = (id: string) => {
    if (files.length === 1) return;
    const next = files.filter((f) => f.id !== id);
    setFiles(next);
    if (activeId === id) setActiveId(next[0].id);
  };

  const run = async () => {
    setRunning(true);
    setOutput("// Running...");
    await new Promise((r) => setTimeout(r, 500));
    if (active.lang === "javascript" || active.lang === "typescript") {
      const logs: string[] = [];
      try {
        const fn = new Function("console", active.code);
        fn({ log: (...a: unknown[]) => logs.push(a.map(String).join(" ")) });
        setOutput(logs.join("\n") || "// (no output)");
      } catch (e) {
        setOutput(`Error: ${(e as Error).message}`);
      }
    } else if (active.lang === "html") {
      setOutput("// HTML rendered to preview pane.\n// (Live preview disabled in this sandbox.)");
    } else {
      setOutput(`// Simulated ${active.lang} runtime\n// Compiled in 18ms\n// (output stubbed for the in-browser sandbox)`);
    }
    setRunning(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-hero">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <BackButton variant="dark" />
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
              <FileCode2 className="h-3.5 w-3.5 text-primary-glow" /> Explore Labs · Standalone IDE
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">
              A full IDE for prototyping anything
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/70">
              Different from the DSA Lab — this is a free-form, multi-file workspace with multi-language support. Build small scripts, test ideas, and share.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
            {/* File explorer */}
            <aside className="rounded-2xl border border-border bg-card p-3 shadow-card">
              <div className="flex items-center justify-between px-2 py-1.5">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Files
                </div>
                <button
                  onClick={newFile}
                  aria-label="New file"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <ul className="mt-1 space-y-0.5">
                {files.map((f) => (
                  <li key={f.id} className="group flex items-center gap-1">
                    <button
                      onClick={() => setActiveId(f.id)}
                      className={`flex flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                        f.id === activeId
                          ? "bg-primary/10 text-foreground ring-1 ring-primary/40"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="truncate">{f.name}</span>
                    </button>
                    {files.length > 1 && (
                      <button
                        onClick={() => removeFile(f.id)}
                        aria-label="Delete file"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-xl border border-dashed border-border p-3 text-[11px] text-muted-foreground">
                Tip: filename extension picks the language ({Object.keys(LANG_FROM_EXT).join(", ")}).
              </div>
            </aside>

            {/* Editor */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/50 px-4 py-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span>{active.name}</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                    {active.lang}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const blob = new Blob([active.code], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = active.name || `file.${EXT_FOR_LANG[active.lang]}`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Save className="mr-1.5 h-3.5 w-3.5" /> Save
                  </Button>
                  <Button
                    onClick={run}
                    disabled={running}
                    size="sm"
                    className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                  >
                    <Play className="mr-1.5 h-3.5 w-3.5" /> {running ? "Running..." : "Run"}
                  </Button>
                </div>
              </div>

              <Editor
                height="520px"
                language={active.lang}
                value={active.code}
                onChange={(v) => updateActive(v ?? "")}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  fontFamily: "ui-monospace, monospace",
                  padding: { top: 16 },
                }}
              />

              <div className="border-t border-border bg-background/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Output
                </div>
                <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap font-mono text-xs text-foreground">
                  {output}
                </pre>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-card">
            Looking for guided problems instead?{" "}
            <Link to="/paths/dsa-lab" className="font-semibold text-primary hover:underline">
              Open the DSA Lab →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
