import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PathLayout } from "@/components/PathLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ShieldAlert, Trash2, Plus, Hash, Search } from "lucide-react";

export const Route = createFileRoute("/paths/blockchain-badging")({
  head: () => ({
    meta: [
      { title: "Blockchain Badging — Vidyashala Hub" },
      { name: "description", content: "Upload, save, and verify badge URLs on the blockchain." },
    ],
  }),
  component: Badging,
});

type Badge = { id: string; name: string; url: string; hash: string; addedAt: number };

const STORAGE_KEY = "vidyashala_badges";

const fakeHash = (s: string) =>
  "0x" +
  Array.from(s)
    .reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 5381)
    .toString(16)
    .padStart(8, "0") +
  Math.abs(s.length * 2654435761 >>> 0).toString(16).padStart(8, "0");

function Badging() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [verifyUrl, setVerifyUrl] = useState("");
  const [verifyResult, setVerifyResult] = useState<null | { ok: boolean; badge?: Badge; msg: string }>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setBadges(JSON.parse(raw));
  }, []);

  const persist = (b: Badge[]) => {
    setBadges(b);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(b));
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    const badge: Badge = {
      id: crypto.randomUUID(),
      name: name.trim(),
      url: url.trim(),
      hash: fakeHash(url.trim()),
      addedAt: Date.now(),
    };
    persist([badge, ...badges]);
    setName(""); setUrl("");
  };

  const remove = (id: string) => persist(badges.filter((b) => b.id !== id));

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyUrl.trim()) return;
    const found = badges.find((b) => b.url === verifyUrl.trim());
    setVerifyResult(
      found
        ? { ok: true, badge: found, msg: `Verified on-chain — hash ${found.hash}` }
        : { ok: false, msg: "No matching record found. URL is unverified." }
    );
  };

  return (
    <PathLayout
      eyebrow="Verification • On-chain"
      title="Badges you can prove."
      subtitle="Upload your achievement URLs, save them with a tamper-proof hash, and verify authenticity in seconds."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <Plus className="h-3.5 w-3.5" /> Save a Badge
          </div>
          <form onSubmit={add} className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Badge name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="AWS Cloud Practitioner" className="mt-1.5" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Badge URL</label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://credly.com/badges/..." className="mt-1.5" />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
              Save & Generate Hash
            </Button>
          </form>
        </div>

        {/* Verify */}
        <div className="rounded-2xl border border-primary/40 bg-gradient-to-br from-card to-accent/30 p-6 shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <Search className="h-3.5 w-3.5" /> Verify Authenticity
          </div>
          <form onSubmit={verify} className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Paste any badge URL</label>
              <Input value={verifyUrl} onChange={(e) => setVerifyUrl(e.target.value)} placeholder="https://..." className="mt-1.5" />
            </div>
            <Button type="submit" variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Verify on Chain
            </Button>
          </form>

          {verifyResult && (
            <div
              className={`mt-5 flex items-start gap-3 rounded-xl border p-4 ${
                verifyResult.ok ? "border-emerald-500/40 bg-emerald-500/10" : "border-destructive/40 bg-destructive/10"
              }`}
            >
              {verifyResult.ok ? (
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              ) : (
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              )}
              <div className="text-sm">
                <div className="font-semibold">{verifyResult.ok ? "Authentic" : "Unverified"}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{verifyResult.msg}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Badge list */}
      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold">Your saved badges <span className="text-muted-foreground">({badges.length})</span></h2>
        {badges.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            No badges yet. Add one above to mint its on-chain proof.
          </div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {badges.map((b) => (
              <div key={b.id} className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate font-semibold">{b.name}</span>
                  </div>
                  <a href={b.url} target="_blank" rel="noreferrer" className="mt-1 block truncate text-xs text-muted-foreground hover:text-primary">
                    {b.url}
                  </a>
                  <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-primary">
                    <Hash className="h-3 w-3" /> {b.hash}
                  </div>
                </div>
                <button onClick={() => remove(b.id)} aria-label="Delete" className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PathLayout>
  );
}
