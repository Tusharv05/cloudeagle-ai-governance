import { createFileRoute } from "@tanstack/react-router";
import { SeatSavingsPage } from "@/components/governance/DashboardApp";

export const Route = createFileRoute("/seat-savings")({
  head: () => ({ meta: [
    { title: "Seat Savings | AI Governance" },
    { name: "description", content: "Find idle AI licenses, estimate monthly savings, and prepare seat reclaim requests." },
    { property: "og:title", content: "Seat Savings | AI Governance" },
    { property: "og:description", content: "Review inactive AI seats and their estimated cost by tool." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SeatSavingsPage,
});