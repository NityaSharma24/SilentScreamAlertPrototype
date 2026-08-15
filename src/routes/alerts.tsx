import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAlerts, clearAlerts, timeAgo, type StoredAlert } from "@/lib/alerts-store";
import campusPhoto from "@/assets/echhs.png.asset.json";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Current Alerts — Silent Scream" },
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

const levelText: Record<StoredAlert["level"], string> = {
  red: "text-alert-red",
  orange: "text-alert-orange",
  yellow: "text-alert-yellow",
};

const levelBorder: Record<StoredAlert["level"], string> = {
  red: "border-l-alert-red",
  orange: "border-l-alert-orange",
  yellow: "border-l-alert-yellow",
};

const levelBg: Record<StoredAlert["level"], string> = {
  red: "bg-alert-red/10",
  orange: "bg-alert-orange/10",
  yellow: "bg-alert-yellow/10",
};

function CurrentAlerts() {
  const [alerts, setAlerts] = useState<StoredAlert[]>([]);
  const [selected, setSelected] = useState<StoredAlert | null>(null);

  useEffect(() => {
    setAlerts(getAlerts());
    const id = window.setInterval(() => setAlerts(getAlerts()), 30000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main className="w-full px-4 py-8 sm:px-6 lg:py-12">
      <h1 className="text-center text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        CURRENT ALERTS
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div className="overflow-hidden rounded-xl border border-border bg-neutral-panel shadow-sm">
          <img
            src={campusPhoto.url}
            alt="Welcome to East Chapel Hill High School, Home of the Wildcats"
            className="h-56 w-full object-cover sm:h-72"
            loading="lazy"
          />
          <div className="p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-panel-foreground/70">
              Campus
            </p>
            <p className="mt-2 text-2xl font-extrabold text-neutral-panel-foreground">
              East Chapel Hill High School
            </p>
            <p className="mt-4 text-sm font-semibold text-neutral-panel-foreground/80">
              {alerts.length === 0
                ? "No active alerts on campus."
                : `${alerts.length} active alert${alerts.length === 1 ? "" : "s"}.`}
            </p>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-extrabold italic tracking-tight text-foreground">
              ACTIVE ALERTS:
            </h2>
            {alerts.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  clearAlerts();
                  setAlerts([]);
                }}
                className="text-xs font-bold text-muted-foreground underline underline-offset-4"
              >
                Clear all
              </button>
            ) : null}
          </div>

          <ul className="mt-4 flex flex-col gap-3">
            {alerts.length === 0 ? (
              <li className="rounded-lg border border-border bg-card px-4 py-6 text-center text-sm font-semibold text-muted-foreground">
                No alerts have been sent yet.
              </li>
            ) : (
              alerts.map((a) => (
                <li
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className={`cursor-pointer rounded-lg border border-l-4 border-border bg-card px-4 py-3 shadow-sm transition-colors hover:bg-muted ${levelBorder[a.level]}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelected(a);
                  }}
                >
                  <p className={`text-sm font-extrabold uppercase ${levelText[a.level]}`}>
                    {a.level} alert: {a.type}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    [{timeAgo(a.at)}]
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          to="/"
          className="rounded-lg bg-neutral-panel px-12 py-4 text-base font-extrabold text-neutral-panel-foreground transition-opacity hover:opacity-90"
        >
          Home
        </Link>
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg ${levelBorder[selected.level]}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`rounded-xl px-4 py-3 text-center ${levelBg[selected.level]}`}>
              <p className={`text-lg font-extrabold uppercase ${levelText[selected.level]}`}>
                {selected.level} alert: {selected.type}
              </p>
            </div>

            <div className="mt-5 space-y-3 text-sm font-semibold text-foreground">
              <p>
                <span className="text-muted-foreground">Reported:</span>{" "}
                {timeAgo(selected.at).replace("received ", "")}
              </p>
              {selected.address ? (
                <p>
                  <span className="text-muted-foreground">From address:</span>{" "}
                  {selected.address}
                </p>
              ) : null}
              {selected.details ? (
                <div>
                  <p className="text-muted-foreground">Description:</p>
                  <p className="mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-muted p-3 text-foreground">
                    {selected.details}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">No description provided.</p>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg bg-neutral-panel px-8 py-3 text-base font-extrabold text-neutral-panel-foreground transition-opacity hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
