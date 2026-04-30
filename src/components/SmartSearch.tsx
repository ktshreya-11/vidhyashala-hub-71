import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchEntries, type SearchEntry } from "@/data/search-index";

const catColor: Record<SearchEntry["category"], string> = {
  Page: "bg-blue-500/10 text-blue-500",
  Path: "bg-purple-500/10 text-purple-500",
  Tool: "bg-emerald-500/10 text-emerald-500",
  Account: "bg-amber-500/10 text-amber-500",
};

export function SmartSearch({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const results = searchEntries(q);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (entry: SearchEntry) => {
    setOpen(false);
    setQ("");
    navigate({ to: entry.path });
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) go(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        placeholder={compact ? "Search..." : "Search hubs, courses, mentors, DSA topics..."}
        className="h-10 rounded-full border-border/60 bg-secondary/50 pl-10 pr-4 focus-visible:ring-primary"
      />
      {open && (q.trim().length > 0) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-elegant">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground">
              No matches. Press Enter to view all results.
            </div>
          ) : (
            <ul className="max-h-80 overflow-auto py-1">
              {results.map((r, i) => (
                <li key={r.path}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r)}
                    className={"flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors " + (i === active ? "bg-accent" : "hover:bg-accent/50")}
                  >
                    <span className={"rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase " + catColor[r.category]}>{r.category}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{r.title}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{r.description}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-border bg-muted/30 px-3 py-2 text-[10px] text-muted-foreground">
            ↑↓ to navigate · Enter to open · Esc to close
          </div>
        </div>
      )}
    </div>
  );
}
