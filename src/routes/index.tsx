import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Paths } from "@/components/Paths";
import { ExploreLabsCallout } from "@/components/ExploreLabsCallout";
import { BuildWithGlobal } from "@/components/BuildWithGlobal";
import { Community } from "@/components/Community";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vidyashala Hub — Learn Together, Build Your Future" },
      { name: "description", content: "Join study hubs, chat with peers, and simulate careers. Vidyashala is the collaborative learning platform for ambitious students." },
      { property: "og:title", content: "Vidyashala Hub" },
      { property: "og:description", content: "Collaborative learning hubs and career simulations for students." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        <Hero />
        <Features />
        <Paths />
        <ExploreLabsCallout />
        <BuildWithGlobal />
        <Community />
      </main>
      <Footer />
    </div>
  );
}
