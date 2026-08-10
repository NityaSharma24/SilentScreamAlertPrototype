import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/sent")({
  head: () => ({
    meta: [
      { title: "Alert Sent — School Safety Alert App" },
      {
        name: "description",
        content:
          "Your safety alert has been sent. Call 911 or the mental health helpline if you need immediate help.",
      },
      { property: "og:title", content: "Alert Sent — School Safety Alert App" },
      {
        property: "og:description",
        content: "Your safety alert has been sent to the school.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AlertSent,
});

function AlertSent() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-12">
        <h1 className="text-center text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
          Thank you.
          <br />
          Your alert has been sent.
        </h1>

        <div className="mt-10 flex flex-col gap-4">
          <a
            href="tel:911"
            className="rounded-lg bg-neutral-panel py-5 text-center text-lg font-extrabold italic text-neutral-panel-foreground transition-opacity hover:opacity-90"
          >
            Call 911
          </a>
          <a
            href="tel:988"
            className="rounded-lg bg-neutral-panel py-5 text-center text-lg font-extrabold italic text-neutral-panel-foreground transition-opacity hover:opacity-90"
          >
            Call Mental Health helpline
          </a>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/alerts"
            className="rounded-lg border border-border px-8 py-4 text-base font-extrabold text-foreground transition-colors hover:bg-accent"
          >
            View current alerts
          </Link>
          <Link
            to="/"
            className="rounded-lg bg-neutral-panel px-10 py-4 text-base font-extrabold text-neutral-panel-foreground transition-opacity hover:opacity-90"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
