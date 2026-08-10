import { createFileRoute, Link } from "@tanstack/react-router";
import { LocationPanel } from "@/components/LocationPanel";

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
  { to: "/red", label: "Red Alert", cls: "bg-alert-red text-alert-red-foreground" },
  {
    to: "/orange",
    label: "Orange Alert",
    cls: "bg-alert-orange text-alert-orange-foreground",
  },
  {
    to: "/yellow",
    label: "Yellow Alert",
    cls: "bg-alert-yellow text-alert-yellow-foreground",
  },
] as const;

function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-8 pt-6">
      <LocationPanel />

      <h1 className="mt-6 text-center text-2xl font-extrabold tracking-tight text-foreground">
        -SEND AN ALERT-
      </h1>

      <div className="mt-5 flex flex-col gap-4">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`rounded-md py-5 text-center text-base font-extrabold shadow-alert transition-transform active:scale-[0.98] ${l.cls}`}
          >
            {l.label}
          </Link>
        ))}
        <Link
          to="/alerts"
          className="rounded-md bg-neutral-panel py-5 text-center text-base font-extrabold text-neutral-panel-foreground transition-opacity active:opacity-80"
        >
          Current Alerts
        </Link>
      </div>
    </main>
  );
}
