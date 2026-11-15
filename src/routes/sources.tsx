import { createFileRoute } from "@tanstack/react-router";
import { SourcesPage } from "@/components/governance/DashboardApp";

export const Route = createFileRoute("/sources")({
  head: () => ({ meta: [
    { title: "Data Sources | AI Governance" },
    { name: "description", content: "Connect identity, AI vendor, and finance data sources and monitor freshness." },
    { property: "og:title", content: "Data Sources | AI Governance" },
    { property: "og:description", content: "See source connectivity, data completeness, and sync status." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SourcesPage,
});