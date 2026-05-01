import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/paths/industry-link")({
  beforeLoad: () => {
    throw redirect({ to: "/languages" });
  },
});
