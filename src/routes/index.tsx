import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPanel } from "@/components/MapPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Silent Scream — A School Safety App" },
      {
        name: "description",
        content:
          "Send a red, orange, or yellow safety alert from your current location to school staff and police.",
      },
      { property: "og:title", content: "Silent Scream — A School Safety App" },
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
    <main className="w-full px-3 py-4 sm:px-6 sm:py-8 lg:py-12">
      <header className="mb-4 text-center sm:mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Silent Scream
        </h1>
        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground sm:text-sm">
          A School Safety App
        </p>

        <p className="mx-auto mt-2 max-w-2xl text-xs font-medium text-muted-foreground sm:mt-3 sm:text-sm">
          Your live location is shared with the alert so staff and police know exactly where
          to go.
        </p>
      </header>

      <MapPanel />

      <section className="mt-5 sm:mt-10">
        <h2 className="text-center text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
          -SEND AN ALERT-
        </h2>
        <div className="mt-3 grid gap-3 sm:mt-5 sm:gap-4 md:grid-cols-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-xl px-4 py-4 text-center shadow-alert transition-transform hover:-translate-y-0.5 active:scale-[0.99] sm:px-6 sm:py-6 lg:py-8 ${l.cls}`}
            >
              <span className="block text-base font-extrabold sm:text-lg">{l.label}</span>
              <span className="mt-1 block text-[11px] font-semibold opacity-90 sm:text-xs">
                {l.desc}
              </span>
            </Link>
          ))}
        </div>
        <Link
          to="/alerts"
          className="mt-3 block rounded-xl bg-neutral-panel px-4 py-4 text-center text-base font-extrabold text-neutral-panel-foreground transition-opacity hover:opacity-90 sm:mt-4 sm:py-6 sm:text-lg"
        >
          Current Alerts
        </Link>
      </section>
    </main>
  );
}

