# AI Governance Dashboard

## Scope
Build the agreed eight-screen dashboard using the uploaded product spec, seven screen references, and aligned JSON data model. Use the images as visual guidance; Alerts and Shadow AI: Now follow their written screen specifications. Keep the five-chart Overview as shown in the reference. Do not include a tool-blocking action; v1 actions remain human-reviewed recommendations.

## Screens and behavior
- Overview: priority alert, four KPIs, five dashboard charts, decision list, and first-run/partial-data/all-clear states.
- Tools: status tabs, search and filters, inventory, detail panel, CSV export, and approve/migration actions without blocking.
- Departments & limits: summary, spend-vs-limit chart, department table, and editable limit/settings panel.
- Data sources: recommended-source completeness, grouped connector cards, sync status, and CSV fallback.
- Alerts: recent alerts, configurable rules, status filters, and delivery log.
- Seat savings: utilization, estimated idle costs, inactivity threshold, reclaim confirmation, and CSV export.
- Shadow AI: Now: live detection summary, ranked tool usage, and human-review actions.
- Shadow AI: Over time: history chart, governance marker, impact summary, and monthly changes.

## Data alignment
Create a revised copy of the uploaded JSON model in the project. Preserve its core entities while adding the separate company cap, financial approver, alert severity/owner/suggested action, editable alert rules and delivery attempts. Keep tool blocking out of the model and ensure screen metrics use consistent sample data. Preserve privacy constraints: aggregate by department by default and never store prompt content.

## Implementation
Use the existing TanStack Start routes, shared UI components, Recharts, and semantic design tokens. Add route metadata for each content page. Keep this release frontend-focused with representative sample records and usable local interactions; do not add an unrequested authentication or external-connector integration.

## Validation
Check all eight paths, verify key filters/actions and responsive layout in the preview, run existing tests, and review the build and runtime logs.
