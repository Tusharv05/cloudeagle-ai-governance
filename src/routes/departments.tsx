import { createFileRoute } from "@tanstack/react-router";
import { DepartmentsPage } from "@/components/governance/DashboardApp";

export const Route = createFileRoute("/departments")({
  head: () => ({ meta: [
    { title: "Departments & Limits | AI Governance" },
    { name: "description", content: "Manage monthly AI budgets, forecasts, owners, and alert thresholds by department." },
    { property: "og:title", content: "Departments & Limits | AI Governance" },
    { property: "og:description", content: "Track department spend against monthly AI limits and company cap." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: DepartmentsPage,
});