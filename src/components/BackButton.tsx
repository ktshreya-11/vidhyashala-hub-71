import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function BackButton({ fallback = "/", label = "Back" }: { fallback?: string; label?: string }) {
  const router = useRouter();
  const canGoBack = typeof window !== "undefined" && window.history.length > 1;

  if (canGoBack) {
    return (
      <button
        onClick={() => router.history.back()}
        className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur transition-all hover:-translate-x-0.5 hover:border-primary/60 hover:bg-primary/10 hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        {label}
      </button>
    );
  }

  return (
    <Link
      to={fallback}
      className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur transition-all hover:-translate-x-0.5 hover:border-primary/60 hover:bg-primary/10 hover:text-white"
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
      Home
    </Link>
  );
}
