import { createFileRoute } from "@tanstack/react-router";
import { AlertScreen } from "@/components/AlertScreen";

export const Route = createFileRoute("/red")({
  head: () => ({
    meta: [
      { title: "Red Alert — Emergency Alert to Principal & Police" },
      {
        name: "description",
        content:
          "Send an emergency red alert for gun violence, fire hazards, or life-threatening situations.",
      },
      { property: "og:title", content: "Red Alert — Emergency Alert" },
      {
        property: "og:description",
        content: "Emergency alert sent to the Principal and School Police.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AlertScreen
      level="red"
      heading="RED ALERT"
      subtitle="Pressing the alert will send an emergency text to the Principal and School Police"
      options={["Gun Violence", "Fire Hazard", "Life-Threatening Situation"]}
      note="Sorry, your phone's system does not support this option."
    />
  ),
});
