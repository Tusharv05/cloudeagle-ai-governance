import { createFileRoute } from "@tanstack/react-router";
import { AlertsPage } from "@/components/governance/DashboardApp";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [
    { title: "Alerts & Notification Rules | AI Governance" },
    { name: "description", content: "Review governance alerts, manage notification rules, and inspect delivery history." },
    { property: "og:title", content: "Alerts & Notification Rules | AI Governance" },
    { property: "og:description", content: "Manage AI budget, shadow tool, and data-source alerts." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AlertsPage,
});