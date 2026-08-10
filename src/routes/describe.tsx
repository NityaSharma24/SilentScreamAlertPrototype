import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { addAlert, type AlertLevel } from "@/lib/alerts-store";
import { sendAlertSms } from "@/lib/sms.functions";

const searchSchema = z.object({
  level: z.enum(["red", "orange", "yellow"]).catch("yellow"),
  type: z.string().catch("Alert"),
});

export const Route = createFileRoute("/describe")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Describe Your Situation — School Safety Alert App" },
      {
        name: "description",
        content:
          "Add details about the situation before submitting your yellow alert to the school counselor.",
      },
      { property: "og:title", content: "Describe Your Situation" },
      {
        property: "og:description",
        content: "Add details before submitting your alert to the school counselor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DescribeAlert,
});

const banner: Record<AlertLevel, string> = {
  red: "bg-alert-red text-alert-red-foreground",
  orange: "bg-alert-orange text-alert-orange-foreground",
  yellow: "bg-alert-yellow text-alert-yellow-foreground",
};

function DescribeAlert() {
  const { level, type } = Route.useSearch() as { level: AlertLevel; type: string };
  const navigate = useNavigate();
  const sendSms = useServerFn(sendAlertSms);
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = () => {
    setBusy(true);
    addAlert({
      level,
      type,
      address:
        typeof window !== "undefined" ? window.localStorage.getItem("last-address") : null,
    });
    void sendSms({
      data: {
        level,
        type,
        time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        details: details.trim() || undefined,
      },
    }).catch(() => {});
    void navigate({ to: "/sent" });
  };

  return (
    <main className="w-full px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className={`px-6 py-8 text-center ${banner[level]}`}>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
            You selected {type.toUpperCase()}
            <br />
            under {level.toUpperCase()} ALERT
          </h1>
        </div>

        <div className="p-6 sm:p-10">
          <p className="text-center text-base font-extrabold text-foreground sm:text-lg">
            Please describe your situation and the alert to the best of your abilities below.
          </p>

          <label className="sr-only" htmlFor="details">
            Describe your situation
          </label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Type Here…."
            rows={6}
            maxLength={500}
            className="mt-6 w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
          />

          <div className="mt-8 flex flex-col gap-4">
            <button
              type="button"
              onClick={submit}
              disabled={busy}
              className="rounded-lg bg-[--color-submit] py-5 text-center text-lg font-extrabold text-alert-red-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              Submit Alert
            </button>
            <Link
              to="/"
              className="rounded-lg bg-neutral-panel py-5 text-center text-lg font-extrabold text-neutral-panel-foreground transition-opacity hover:opacity-90"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
