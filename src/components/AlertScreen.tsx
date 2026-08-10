import { Link, useNavigate } from "@tanstack/react-router";
import { addAlert, type AlertLevel } from "@/lib/alerts-store";

const levelClasses: Record<AlertLevel, { title: string; button: string; ring: string }> = {
  red: {
    title: "text-alert-red",
    button: "bg-alert-red text-alert-red-foreground",
    ring: "border-alert-red/30",
  },
  orange: {
    title: "text-alert-orange",
    button: "bg-alert-orange text-alert-orange-foreground",
    ring: "border-alert-orange/30",
  },
  yellow: {
    title: "text-alert-yellow",
    button: "bg-alert-yellow text-alert-yellow-foreground",
    ring: "border-alert-yellow/40",
  },
};

export function AlertScreen({
  level,
  heading,
  subtitle,
  options,
  note,
}: {
  level: AlertLevel;
  heading: string;
  subtitle: string;
  options: string[];
  note?: string;
}) {
  const c = levelClasses[level];
  const navigate = useNavigate();

  const send = (type: string) => {
    addAlert({
      level,
      type,
      address:
        typeof window !== "undefined" ? window.localStorage.getItem("last-address") : null,
    });
    void navigate({ to: "/sent" });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-12">
      <div className={`rounded-2xl border bg-card p-8 shadow-sm sm:p-12 ${c.ring}`}>
        <h1
          className={`text-center text-4xl font-extrabold tracking-tight sm:text-5xl ${c.title}`}
        >
          {heading}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-base font-semibold italic leading-snug text-muted-foreground">
          {subtitle}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => send(option)}
              className={`rounded-lg py-6 text-lg font-extrabold shadow-alert transition-transform hover:-translate-y-0.5 active:scale-[0.98] ${c.button}`}
            >
              {option}
            </button>
          ))}
        </div>

        {note ? (
          <p className="mt-6 rounded-md bg-neutral-panel px-4 py-3 text-center text-xs font-semibold text-neutral-panel-foreground">
            {note}
          </p>
        ) : null}

        <div className="mt-8 flex justify-center">
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
