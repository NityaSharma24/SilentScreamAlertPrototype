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
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "X-Connection-Api-Key": connectionKey,
      },
    });

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
      throw new Error(`Geocoding failed [${response.status}]: ${body}`);
    }

    const json = (await response.json()) as {
      results?: Array<{ formatted_address?: string }>;
    };
    return { address: json.results?.[0]?.formatted_address ?? null };
  });
