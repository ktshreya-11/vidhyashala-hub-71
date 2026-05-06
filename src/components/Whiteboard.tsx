import { useEffect, useRef, useState } from "react";
import dynamic from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Trash2, StickyNote as StickyIcon, Eraser } from "lucide-react";

// react-canvas-draw is CJS; load it client-only.
type CanvasDrawComp = any;
let CanvasDraw: CanvasDrawComp | null = null;

type Note = { id: string; x: number; y: number; text: string; color: string };

const COLORS = ["#fde68a", "#fecaca", "#bbf7d0", "#bfdbfe", "#e9d5ff"];

export function Whiteboard() {
  const { user, isAuthed } = useAuth();
  const canvasRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [savedDrawing, setSavedDrawing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    import("react-canvas-draw").then((m) => {
      if (!alive) return;
      CanvasDraw = m.default;
      setReady(true);
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("whiteboard_items")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      setLoading(false);
      if (error) { toast.error("Could not load whiteboard"); return; }
      const drawingRow = data?.find((r) => r.kind === "drawing");
      const noteRows = data?.filter((r) => r.kind === "note") ?? [];
      if (drawingRow) setSavedDrawing((drawingRow.data as any)?.paths ?? null);
      setNotes(
        noteRows.map((n) => ({
          id: n.id,
          x: Number(n.x),
          y: Number(n.y),
          text: (n.data as any)?.text ?? "",
          color: (n.data as any)?.color ?? COLORS[0],
        }))
      );
    })();
  }, [user]);

  useEffect(() => {
    if (ready && savedDrawing && canvasRef.current) {
      try { canvasRef.current.loadSaveData(savedDrawing, true); } catch {}
    }
  }, [ready, savedDrawing]);

  if (!isAuthed) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
        Sign in to use the whiteboard — your drawings sync to your account.
      </div>
    );
  }

  const saveDrawing = async () => {
    if (!user || !canvasRef.current) return;
    const paths = canvasRef.current.getSaveData();
    const { error } = await supabase
      .from("whiteboard_items")
      .upsert(
        { user_id: user.id, kind: "drawing", data: { paths } as any },
        { onConflict: "user_id,kind" as any } as any
      );
    // Upsert may not have unique constraint — fallback to delete+insert
    if (error) {
      await supabase.from("whiteboard_items").delete().eq("user_id", user.id).eq("kind", "drawing");
      const { error: e2 } = await supabase
        .from("whiteboard_items")
        .insert({ user_id: user.id, kind: "drawing", data: { paths } as any });
      if (e2) { toast.error("Save failed"); return; }
    }
    toast.success("Drawing saved");
  };

  const clearDrawing = () => canvasRef.current?.clear();

  const addNote = async () => {
    if (!user) return;
    const x = 40 + Math.random() * 200;
    const y = 40 + Math.random() * 200;
    const color = COLORS[notes.length % COLORS.length];
    const { data, error } = await supabase
      .from("whiteboard_items")
      .insert({ user_id: user.id, kind: "note", x, y, data: { text: "New note", color } as any })
      .select()
      .single();
    if (error || !data) { toast.error("Could not add note"); return; }
    setNotes((n) => [...n, { id: data.id, x, y, text: "New note", color }]);
  };

  const updateNote = async (id: string, patch: Partial<Note>) => {
    setNotes((n) => n.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    const cur = notes.find((m) => m.id === id);
    if (!cur) return;
    const next = { ...cur, ...patch };
    await supabase
      .from("whiteboard_items")
      .update({ x: next.x, y: next.y, data: { text: next.text, color: next.color } as any })
      .eq("id", id);
  };

  const removeNote = async (id: string) => {
    setNotes((n) => n.filter((m) => m.id !== id));
    await supabase.from("whiteboard_items").delete().eq("id", id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={saveDrawing} className="bg-gradient-primary text-primary-foreground">
          <Save className="mr-1.5 h-4 w-4" /> Save Drawing
        </Button>
        <Button size="sm" variant="outline" onClick={clearDrawing}>
          <Eraser className="mr-1.5 h-4 w-4" /> Clear
        </Button>
        <Button size="sm" variant="outline" onClick={addNote}>
          <StickyIcon className="mr-1.5 h-4 w-4" /> Add Sticky Note
        </Button>
        {loading && <span className="text-xs text-muted-foreground">Loading…</span>}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-white">
        {ready && CanvasDraw ? (
          <CanvasDraw
            ref={canvasRef}
            canvasWidth={900}
            canvasHeight={520}
            brushColor="#0f172a"
            brushRadius={3}
            lazyRadius={2}
            hideGrid={false}
            backgroundColor="#ffffff"
            style={{ width: "100%", maxWidth: "100%" }}
          />
        ) : (
          <div className="flex h-[520px] items-center justify-center text-sm text-muted-foreground">
            Loading canvas…
          </div>
        )}

        {/* sticky notes overlay */}
        <div className="pointer-events-none absolute inset-0">
          {notes.map((n) => (
            <div
              key={n.id}
              className="pointer-events-auto absolute w-44 rounded-md p-3 text-xs shadow-lg"
              style={{ left: n.x, top: n.y, background: n.color }}
            >
              <div className="mb-1 flex items-center justify-between">
                <StickyIcon className="h-3 w-3 text-black/60" />
                <button onClick={() => removeNote(n.id)} aria-label="Delete">
                  <Trash2 className="h-3 w-3 text-black/60 hover:text-black" />
                </button>
              </div>
              <textarea
                value={n.text}
                onChange={(e) => updateNote(n.id, { text: e.target.value })}
                className="w-full resize-none border-0 bg-transparent text-black outline-none"
                rows={4}
              />
              <div className="mt-1 flex items-center justify-between text-[10px] text-black/60">
                <span>x:{Math.round(n.x)} y:{Math.round(n.y)}</span>
                <button
                  onClick={() => {
                    const nx = Math.random() * 600;
                    const ny = Math.random() * 380;
                    updateNote(n.id, { x: nx, y: ny });
                  }}
                  className="underline"
                >
                  Move
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Drawings + sticky notes save to <code>whiteboard_items</code> and reload next time you sign in.
      </p>
    </div>
  );
}
