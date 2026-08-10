import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Current Alerts — School Safety Alert App" },
      {
        name: "description",
        content: "Review alerts that have recently been sent from your school campus.",
      },
      { property: "og:title", content: "Current Alerts" },
      {
        property: "og:description",
        content: "Review alerts recently sent from your school campus.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CurrentAlerts,
});

function CurrentAlerts() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-8 pt-10">
      <h1 className="text-center text-2xl font-extrabold tracking-tight text-foreground">
        -CURRENT ALERTS-
      </h1>
      <p className="mt-8 text-center text-sm font-semibold text-muted-foreground">
        No alerts have been sent yet.
      </p>
      <div className="mt-auto pt-8">
        <Link
          to="/"
          className="block rounded-md bg-neutral-panel py-4 text-center text-base font-extrabold text-neutral-panel-foreground transition-opacity active:opacity-80"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
