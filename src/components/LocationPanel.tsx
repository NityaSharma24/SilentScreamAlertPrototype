import { useEffect, useState } from "react";

type State =
  | { status: "loading" }
  | { status: "ready"; lat: number; lng: number }
  | { status: "error"; message: string };

export function LocationPanel() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState({ status: "error", message: "Location not supported" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setState({
          status: "ready",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setState({ status: "error", message: "No Address Available" }),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  const label =
    state.status === "ready"
      ? `${state.lat.toFixed(5)}, ${state.lng.toFixed(5)}`
      : state.status === "loading"
        ? "Locating…"
        : state.message;

  return (
    <section aria-label="Current location" className="overflow-hidden rounded-md">
      <div className="relative h-44 bg-map">
        <div className="absolute inset-0 bg-map-grid opacity-70" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="block size-4 rounded-full bg-alert-red ring-4 ring-alert-red/25" />
        </div>
        <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-muted-foreground">
          Maps
        </span>
      </div>
      <p className="bg-neutral-panel px-3 py-2 text-center text-xs font-bold text-neutral-panel-foreground">
        {label}
      </p>
    </section>
  );
}
