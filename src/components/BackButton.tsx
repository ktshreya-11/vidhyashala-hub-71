import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

type Variant = "dark" | "light";

const styles: Record<Variant, string> = {
  dark:
    "border-white/15 bg-white/5 text-white/80 backdrop-blur hover:border-primary/60 hover:bg-primary/10 hover:text-white",
  light:
    "border-border bg-background text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-primary",
};

export function BackButton({
  fallback = "/",
  label = "Back",
  variant = "dark",
}: {
  fallback?: string;
  label?: string;
  variant?: Variant;
}) {
  const router = useRouter();
  const cls = `group inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition-all hover:-translate-x-0.5 ${styles[variant]}`;

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: fallback });
    }
  };

  return (
    <button onClick={goBack} className={cls} type="button">
      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
      {label}
    </button>
  );

  // unused but keeps Link in dep tree for tree-shaking-safe usage
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  Link;
}
