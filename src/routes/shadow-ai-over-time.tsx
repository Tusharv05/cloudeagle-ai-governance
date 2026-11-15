import { createFileRoute } from "@tanstack/react-router";
import { ShadowTrendPage } from "@/components/governance/DashboardApp";

export const Route = createFileRoute("/shadow-ai-over-time")({
  head: () => ({ meta: [
    { title: "Shadow AI Trends | AI Governance" },
    { name: "description", content: "Track unapproved AI tools and active users over time, from the date monitoring began." },
    { property: "og:title", content: "Shadow AI Trends | AI Governance" },
    { property: "og:description", content: "Explore monthly Shadow AI trends and the impact of governance changes." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ShadowTrendPage,
});