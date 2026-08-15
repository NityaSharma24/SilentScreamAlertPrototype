import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const reverseGeocode = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }).parse(data),
  )
  .handler(async ({ data }) => {
    const lovableApiKey = process.env["LOVABLE_API_KEY"];
    const connectionKey = process.env["GOOGLE_MAPS_API_KEY"];
    if (!lovableApiKey || !connectionKey) {
      throw new Error("Google Maps connection is not configured");
    }

    const url = `https://connector-gateway.lovable.dev/google_maps/maps/api/geocode/json?latlng=${data.lat},${data.lng}`;

    let response: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "X-Connection-Api-Key": connectionKey,
          },
        });
      } catch {
        response = null;
      }
      // Retry only on transient upstream failures
      if (response && !(response.status >= 500)) break;
      if (attempt < 2) await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }

    if (!response) return { address: null };

    if (response.status === 403) {
      const details: Array<{ reason?: string }> =
        (await response.json())?.error?.details ?? [];
      const reason = details.find((d) => d.reason)?.reason;
      if (reason === "API_KEY_HTTP_REFERRER_BLOCKED") {
        throw new Error(
          'Google Maps server key is referrer-restricted. In Google Cloud Console, set the server key\'s application restrictions to "None" or "IP addresses".',
        );
      }
      if (reason === "API_KEY_SERVICE_BLOCKED") {
        throw new Error(
          "Google Maps server key does not allow the Geocoding API. Add it to the key's allowed-APIs list.",
        );
      }
      throw new Error("Google Maps request was denied (403).");
    }

    if (!response.ok) {
      const body = await response.text();
      console.error(`Geocoding failed [${response.status}]: ${body}`);
      // Transient/unavailable upstream: degrade gracefully instead of crashing the UI
      return { address: null };
    }


    const json = (await response.json()) as {
      results?: Array<{ formatted_address?: string }>;
    };
    return { address: json.results?.[0]?.formatted_address ?? null };
  });
