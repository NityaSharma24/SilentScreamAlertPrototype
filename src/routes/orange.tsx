import { createFileRoute } from "@tanstack/react-router";
import { AlertScreen } from "@/components/AlertScreen";

export const Route = createFileRoute("/orange")({
  head: () => ({
    meta: [
      { title: "Orange Alert — Urgent Alert to the Principal" },
      {
        name: "description",
        content:
          "Send an urgent orange alert for drug abuse, physical fights, or injuries to the school Principal.",
      },
      { property: "og:title", content: "Orange Alert — Urgent Alert" },
      {
        property: "og:description",
        content: "Urgent alert sent directly to the school Principal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AlertScreen
      level="orange"
      heading="ORANGE ALERT"
      subtitle="Pressing the alert will send an emergency text to the school Principal"
      options={["Drug Abuse", "Physical Fight", "Injury"]}
    />
  ),
});
