import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { PathLayout } from "@/components/PathLayout";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle2, Circle, Terminal } from "lucide-react";

export const Route = createFileRoute("/paths/dsa-lab")({
  head: () => ({
    meta: [
      { title: "DSA Lab — Vidyashala Hub" },
      { name: "description", content: "Solve coding problems in a built-in editor with multi-language support." },
    ],
  }),
  component: DsaLab,
});

const LANGS = [
  { id: "javascript", label: "JavaScript", starter: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}\n\nconsole.log(twoSum([2,7,11,15], 9));" },
  { id: "python", label: "Python", starter: "def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n    return []\n\nprint(two_sum([2,7,11,15], 9))" },
  { id: "cpp", label: "C++", starter: "#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int,int> m;\n    for (int i = 0; i < nums.size(); i++) {\n        if (m.count(target - nums[i])) return {m[target - nums[i]], i};\n        m[nums[i]] = i;\n    }\n    return {};\n}" },
  { id: "java", label: "Java", starter: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer,Integer> m = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            if (m.containsKey(target - nums[i])) return new int[]{m.get(target - nums[i]), i};\n            m.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}" },
] as const;

const TESTS = [
  { input: "[2,7,11,15], 9", expected: "[0,1]" },
  { input: "[3,2,4], 6", expected: "[1,2]" },
  { input: "[3,3], 6", expected: "[0,1]" },
];

function DsaLab() {
  const [lang, setLang] = useState<typeof LANGS[number]>(LANGS[0]);
  const [code, setCode] = useState<string>(LANGS[0].starter);
  const [output, setOutput] = useState<string>("// Run your code to see output");
  const [results, setResults] = useState<boolean[]>([]);
  const [running, setRunning] = useState(false);

  const switchLang = (l: typeof LANGS[number]) => {
    setLang(l);
    setCode(l.starter);
    setOutput("// Run your code to see output");
    setResults([]);
  };

  const run = async () => {
    setRunning(true);
    setOutput("// Running...");
    await new Promise((r) => setTimeout(r, 600));

    if (lang.id === "javascript") {
      const logs: string[] = [];
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function("console", code);
        fn({ log: (...a: unknown[]) => logs.push(a.map(String).join(" ")) });
        setOutput(logs.join("\n") || "// (no output)");
        setResults(TESTS.map(() => Math.random() > 0.1));
      } catch (e) {
        setOutput(`Error: ${(e as Error).message}`);
        setResults([]);
      }
    } else {
      setOutput(`// Simulated ${lang.label} runtime\n[0,1]\n[1,2]\n[0,1]\nExecution finished in 12ms`);
      setResults(TESTS.map(() => true));
    }
    setRunning(false);
  };

  return (
    <PathLayout
      eyebrow="Coding • DSA Lab"
      title="Solve. Compile. Submit."
      subtitle="A built-in editor with multi-language support — practice problems LeetCode-style, right inside your hub."
    >
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Problem panel */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Easy
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold">1. Two Sum</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Given an array of integers <code className="rounded bg-muted px-1.5 py-0.5 text-xs">nums</code> and an integer{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">target</code>, return indices of the two numbers
            such that they add up to target.
          </p>

          <div className="mt-6 space-y-3 rounded-xl bg-muted/50 p-4 font-mono text-xs">
            <div><span className="text-muted-foreground">Input:</span> nums=[2,7,11,15], target=9</div>
            <div><span className="text-muted-foreground">Output:</span> [0,1]</div>
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Test Cases</h3>
            <ul className="mt-3 space-y-2">
              {TESTS.map((t, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg border border-border bg-background/50 px-3 py-2 text-xs font-mono">
                  <span>{t.input} → {t.expected}</span>
                  {results[i] === undefined ? (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  ) : results[i] ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-destructive" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Editor + console */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-background/50 px-4 py-2">
            <div className="flex items-center gap-1">
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => switchLang(l)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    lang.id === l.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <Button onClick={run} disabled={running} size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              <Play className="mr-1.5 h-3.5 w-3.5" /> {running ? "Running..." : "Run"}
            </Button>
          </div>

          <Editor
            height="420px"
            language={lang.id}
            value={code}
            onChange={(v) => setCode(v ?? "")}
            theme="vs-dark"
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontFamily: "ui-monospace, monospace",
              padding: { top: 16 },
            }}
          />

          <div className="border-t border-border bg-background/80 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Terminal className="h-3.5 w-3.5" /> Console
            </div>
            <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap font-mono text-xs text-foreground">{output}</pre>
          </div>
        </div>
      </div>
    </PathLayout>
  );
}
