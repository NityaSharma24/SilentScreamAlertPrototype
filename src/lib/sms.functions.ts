import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ALERT_PHONE = "+12405005863";

export const sendAlertSms = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        level: z.enum(["red", "orange", "yellow"]),
        type: z.string().min(1).max(80),
        time: z.string().min(1).max(60),
        details: z.string().max(500).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const levelLabel = `${data.level.charAt(0).toUpperCase()}${data.level.slice(1)} Alert`;
    const body =
      `${levelLabel} for ${data.type} has been reported at ${data.time}.` +
      (data.details ? ` Details: ${data.details}` : "");

    const lovableApiKey = process.env["LOVABLE_API_KEY"];
    const twilioKey = process.env["TWILIO_API_KEY"];
    const from = process.env["TWILIO_FROM_NUMBER"];

    if (!lovableApiKey || !twilioKey || !from) {
      return { sent: false, reason: "SMS is not configured yet.", body };
    }

    const response = await fetch("https://connector-gateway.lovable.dev/twilio/Messages.json", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "X-Connection-Api-Key": twilioKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: ALERT_PHONE, From: from, Body: body }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Twilio send failed [${response.status}]: ${errorBody}`);
      return { sent: false, reason: `Text failed [${response.status}]`, body };
    }

    return { sent: true, body };
  });
