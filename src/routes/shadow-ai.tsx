import { createFileRoute } from "@tanstack/react-router";
import { ShadowNowPage } from "@/components/governance/DashboardApp";

export const Route = createFileRoute("/shadow-ai")({
  head: () => ({ meta: [
    { title: "Shadow AI: Now | AI Governance" },
    { name: "description", content: "Review unapproved AI tools and aggregated employee exposure by department." },
    { property: "og:title", content: "Shadow AI: Now | AI Governance" },
    { property: "og:description", content: "Live view of unapproved AI tool usage and human-reviewed next steps." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ShadowNowPage,
});