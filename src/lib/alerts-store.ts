export type AlertLevel = "red" | "orange" | "yellow";

export type StoredAlert = {
  id: string;
  level: AlertLevel;
  type: string;
  address: string | null;
  details?: string;
  at: number;
};

const KEY = "school-safety-alerts";

function read(): StoredAlert[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredAlert[]) : [];
  } catch {
    return [];
  }
}

export function getAlerts(): StoredAlert[] {
  return read().sort((a, b) => b.at - a.at);
}

export function addAlert(alert: Omit<StoredAlert, "id" | "at">): StoredAlert {
  const entry: StoredAlert = {
    ...alert,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: Date.now(),
  };
  const next = [entry, ...read()].slice(0, 50);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return entry;
}

export function clearAlerts() {
  window.localStorage.removeItem(KEY);
}

export function timeAgo(at: number): string {
  const mins = Math.floor((Date.now() - at) / 60000);
  if (mins < 1) return "received now";
  if (mins === 1) return "received 1 min ago";
  if (mins < 60) return `received ${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  return hrs === 1 ? "received 1 hour ago" : `received ${hrs} hours ago`;
}
