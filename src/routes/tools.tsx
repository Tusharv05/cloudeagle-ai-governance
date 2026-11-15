import { createFileRoute } from "@tanstack/react-router";
import { ToolsPage } from "@/components/governance/DashboardApp";

export const Route = createFileRoute("/tools")({
  head: () => ({ meta: [
    { title: "AI Tools Inventory | AI Governance" },
    { name: "description", content: "Review approved, unapproved, and under-review AI tools across your organization." },
    { property: "og:title", content: "AI Tools Inventory | AI Governance" },
    { property: "og:description", content: "A governed inventory of company AI tools, usage, spend, and review status." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ToolsPage,
});