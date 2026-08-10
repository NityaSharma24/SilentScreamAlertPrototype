import { createFileRoute } from "@tanstack/react-router";
import { AlertScreen } from "@/components/AlertScreen";

export const Route = createFileRoute("/yellow")({
  head: () => ({
    meta: [
      { title: "Yellow Alert — Notify the School Counselor" },
      {
        name: "description",
        content:
          "Notify the school counselor about contagion risk, mental health, bullying, or accidents.",
      },
      { property: "og:title", content: "Yellow Alert — Notify the Counselor" },
      {
        property: "og:description",
        content: "Alerts the school counselor about non-emergency concerns.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AlertScreen
      level="yellow"
      heading="YELLOW ALERT"
      subtitle="Pressing an alert will notify school counselor"
      options={["Contagion Risk", "Mental Health", "Bullying", "Accident"]}
    />
  ),
});
