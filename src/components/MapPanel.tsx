import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { reverseGeocode } from "@/lib/geocode.functions";

declare global {
  interface Window {
    google?: any;
    __initSafetyMap?: () => void;
  }
}

function loadMapsApi(): Promise<void> {
  if (window.google?.maps) return Promise.resolve();
  const existing = document.getElementById("gmaps-js") as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve) => {
      const check = () => (window.google?.maps ? resolve() : setTimeout(check, 100));
      check();
    });
  }
  return new Promise((resolve, reject) => {
    window.__initSafetyMap = () => resolve();
    const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
    const channel = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"];
    const script = document.createElement("script");
    script.id = "gmaps-js";
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__initSafetyMap&channel=${channel}`;
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
}

type Status = "idle" | "locating" | "ready" | "denied" | "error";

export function MapPanel({
  onAddressChange,
}: {
  onAddressChange?: (address: string | null) => void;
}) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [address, setAddress] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const geocode = useServerFn(reverseGeocode);

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setMessage("Location is not supported on this device.");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          await loadMapsApi();
          if (mapEl.current && window.google?.maps) {
            const map = new window.google.maps.Map(mapEl.current, {
              center: { lat, lng },
              zoom: 16,
              disableDefaultUI: true,
              zoomControl: true,
            });
            new window.google.maps.Marker({
              position: { lat, lng },
              map,
              title: "Your location",
            });
          }
          setStatus("ready");
        } catch {
          setStatus("error");
          setMessage("The map could not be loaded.");
        }
        try {
          const res = await geocode({ data: { lat, lng } });
          setAddress(res.address);
          if (res.address) window.localStorage.setItem("last-address", res.address);
          onAddressChange?.(res.address);
        } catch {
          const coords = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          setAddress(coords);
          window.localStorage.setItem("last-address", coords);
        }
      },
      () => {
        setStatus("denied");
        setMessage("Location access was blocked. Allow it to show your address.");
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  useEffect(() => {
    if (typeof navigator !== "undefined" && "permissions" in navigator) {
      navigator.permissions
        ?.query({ name: "geolocation" as PermissionName })
        .then((p) => {
          if (p.state === "granted") requestLocation();
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      aria-label="Your current location"
      className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
    >
      <div className="relative h-64 w-full bg-map lg:h-[420px]">
        <div ref={mapEl} className="absolute inset-0" />
        {status !== "ready" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-map/90 px-6 text-center">
            <div className="bg-map-grid absolute inset-0 opacity-60" aria-hidden />
            <p className="relative z-10 text-sm font-semibold text-neutral-panel">
              {status === "locating"
                ? "Finding your location…"
                : status === "idle"
                  ? "Show your live location on the map"
                  : message}
            </p>
            {status !== "locating" ? (
              <button
                type="button"
                onClick={requestLocation}
                className="relative z-10 rounded-md bg-neutral-panel px-4 py-2 text-sm font-extrabold text-neutral-panel-foreground transition-opacity hover:opacity-90"
              >
                Allow location access
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      <p className="bg-neutral-panel px-4 py-3 text-center text-sm font-bold text-neutral-panel-foreground">
        {address ?? (status === "ready" ? "Locating address…" : "No address available")}
      </p>
    </section>
  );
}
