import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPanel } from "@/components/MapPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Send an Alert — School Safety Alert App" },
      {
        name: "description",
        content:
          "Send a red, orange, or yellow safety alert from your current location to school staff and police.",
      },
      { property: "og:title", content: "Send an Alert — School Safety Alert App" },
      {
        property: "og:description",
        content:
          "Send a red, orange, or yellow safety alert from your current location to school staff and police.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const links = [
  {
    to: "/red",
    label: "Red Alert",
    desc: "Gun violence, fire hazard, life-threatening situation",
    cls: "bg-alert-red text-alert-red-foreground",
  },
  {
    to: "/orange",
    label: "Orange Alert",
    desc: "Drug abuse, physical fight, injury",
    cls: "bg-alert-orange text-alert-orange-foreground",
  },
  {
    to: "/yellow",
    label: "Yellow Alert",
    desc: "Contagion risk, mental health, bullying, accident",
    cls: "bg-alert-yellow text-alert-yellow-foreground",
  },
] as const;

function Home() {
  return (
    <main className="w-full px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          School Safety Alert
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-muted-foreground">
          Your live location is shared with the alert so staff and police know exactly where
          to go.
        </p>
      </header>

      <MapPanel />

      <section className="mt-10">
        <h2 className="text-center text-xl font-extrabold tracking-tight text-foreground">
          -SEND AN ALERT-
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-xl px-6 py-8 text-center shadow-alert transition-transform hover:-translate-y-0.5 active:scale-[0.99] ${l.cls}`}
            >
              <span className="block text-lg font-extrabold">{l.label}</span>
              <span className="mt-1 block text-xs font-semibold opacity-90">{l.desc}</span>
            </Link>
          ))}
        </div>
        <Link
          to="/alerts"
          className="mt-4 block rounded-xl bg-neutral-panel px-6 py-6 text-center text-lg font-extrabold text-neutral-panel-foreground transition-opacity hover:opacity-90"
        >
          Current Alerts
        </Link>
      </section>
    </main>
  );
}

