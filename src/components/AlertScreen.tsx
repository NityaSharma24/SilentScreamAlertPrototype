import { Link } from "@tanstack/react-router";

type Level = "red" | "orange" | "yellow";

const levelClasses: Record<Level, { title: string; button: string }> = {
  red: { title: "text-alert-red", button: "bg-alert-red text-alert-red-foreground" },
  orange: {
    title: "text-alert-orange",
    button: "bg-alert-orange text-alert-orange-foreground",
  },
  yellow: {
    title: "text-alert-yellow",
    button: "bg-alert-yellow text-alert-yellow-foreground",
  },
};

export function AlertScreen({
  level,
  heading,
  subtitle,
  options,
  note,
}: {
  level: Level;
  heading: string;
  subtitle: string;
  options: string[];
  note?: string;
}) {
  const c = levelClasses[level];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-8 pt-10">
      <h1 className={`text-center text-3xl font-extrabold tracking-tight ${c.title}`}>
        {heading}
      </h1>
      <p className="mt-3 text-center text-sm font-semibold italic leading-snug text-muted-foreground">
        {subtitle}
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`rounded-md py-5 text-base font-extrabold shadow-alert transition-transform active:scale-[0.98] ${c.button}`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <Link
          to="/"
          className="block rounded-md bg-neutral-panel py-4 text-center text-base font-extrabold text-neutral-panel-foreground transition-opacity active:opacity-80"
        >
          Home
        </Link>
        {note ? (
          <p className="mt-4 rounded-sm bg-neutral-panel px-3 py-2 text-center text-[11px] font-semibold text-neutral-panel-foreground">
            {note}
          </p>
        ) : null}
      </div>
    </main>
  );
}
