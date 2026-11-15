import { createFileRoute } from "@tanstack/react-router";
import { OverviewPage } from "@/components/governance/DashboardApp";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "AI Governance Overview | Enterprise Dashboard" },
    { name: "description", content: "Monitor AI spend against limits, forecast month-end costs, and review governance issues." },
    { property: "og:title", content: "AI Governance Overview | Enterprise Dashboard" },
    { property: "og:description", content: "Enterprise AI spend, approved tools, and governance decisions in one view." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: OverviewPage,
});