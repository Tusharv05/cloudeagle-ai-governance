export type ApprovalStatus = "Approved" | "Unapproved" | "Under review";
export type AlertStatus = "Open" | "Acknowledged" | "Resolved";

export const departments = [
  { name: "Marketing", owner: "Elena Rostova", title: "CMO", limit: 10_000, spent: 8_900, projected: 13_100, color: "var(--chart-4)" },
  { name: "Engineering", owner: "David Zhang", title: "VP Engineering", limit: 20_000, spent: 10_500, projected: 18_000, color: "var(--chart-1)" },
  { name: "Sales", owner: "Rachel Morris", title: "CRO", limit: 9_000, spent: 4_100, projected: 7_300, color: "var(--chart-2)" },
  { name: "Support", owner: "Vikram Patel", title: "Head of Support", limit: 8_000, spent: 2_900, projected: 4_700, color: "var(--chart-3)" },
  { name: "Design", owner: "Sophie Chen", title: "Head of Design", limit: 5_000, spent: 2_000, projected: 3_400, color: "var(--chart-5)" },
  { name: "Operations", owner: "James Wilson", title: "COO", limit: 3_000, spent: 1_000, projected: 1_700, color: "var(--chart-6)" },
];

export const spendTrend = [
  { month: "Jun", actual: 31_200, forecast: null, cap: 55_000 },
  { month: "Jul", actual: 35_600, forecast: null, cap: 55_000 },
  { month: "Aug", actual: 40_900, forecast: null, cap: 55_000 },
  { month: "Sep", actual: 42_700, forecast: null, cap: 55_000 },
  { month: "Oct", actual: 44_100, forecast: null, cap: 55_000 },
  { month: "Nov", actual: 22_500, forecast: 48_200, cap: 55_000 },
];

export const seatData = [
  { name: "ChatGPT Team", active: 142, idle: 58, cost: 1740, renewal: "Dec 31, 2026", days: 45 },
  { name: "Microsoft Copilot", active: 118, idle: 52, cost: 1560, renewal: "Jan 15, 2027", days: 60 },
  { name: "Claude Enterprise", active: 74, idle: 30, cost: 900, renewal: "Nov 30, 2026", days: 35 },
  { name: "Other approved tools · estimated seats", active: 92, idle: 34, cost: 0, renewal: "Varies by plan", days: 32 },
];

export const shadowTrend = [
  { month: "Jun", tools: 3, users: 39 },
  { month: "Jul", tools: 4, users: 52 },
  { month: "Aug", tools: 5, users: 71 },
  { month: "Sep", tools: 7, users: 96 },
  { month: "Oct", tools: 8, users: 126 },
  { month: "Nov", tools: 8, users: 134 },
];

export const tools = [
  { name: "ChatGPT Team", vendor: "OpenAI", category: "Assistant", department: "Marketing", status: "Approved" as ApprovalStatus, users: 142, seats: "142 / 200", spend: 4260, source: "OpenAI admin · Okta SSO", alternative: "—", firstSeen: "Jan 12, 2025" },
  { name: "ChatGPT Personal", vendor: "OpenAI", category: "Assistant", department: "Marketing", status: "Unapproved" as ApprovalStatus, users: 61, seats: "No contract seats", spend: 1220, source: "Ramp · Expense · SSO", alternative: "ChatGPT Team", firstSeen: "Sep 14, 2026" },
  { name: "Microsoft Copilot", vendor: "Microsoft", category: "Assistant", department: "Engineering", status: "Approved" as ApprovalStatus, users: 118, seats: "118 / 170", spend: 2240, source: "Entra ID · Vendor API", alternative: "—", firstSeen: "Mar 03, 2025" },
  { name: "Claude Enterprise", vendor: "Anthropic", category: "Assistant", department: "Engineering", status: "Approved" as ApprovalStatus, users: 74, seats: "74 / 104", spend: 1480, source: "Vendor API · Okta SSO", alternative: "—", firstSeen: "Apr 18, 2025" },
  { name: "Midjourney Pro", vendor: "Midjourney", category: "Image", department: "Marketing", status: "Unapproved" as ApprovalStatus, users: 23, seats: "Personal accounts", spend: 690, source: "Ramp · Card match", alternative: "Adobe Firefly", firstSeen: "Aug 06, 2026" },
  { name: "Perplexity Pro", vendor: "Perplexity", category: "Search", department: "Sales", status: "Unapproved" as ApprovalStatus, users: 24, seats: "Personal accounts", spend: 620, source: "Expense · SSO", alternative: "ChatGPT Team", firstSeen: "Jul 22, 2026" },
  { name: "Cursor Business", vendor: "Anysphere", category: "Code", department: "Engineering", status: "Under review" as ApprovalStatus, users: 17, seats: "Pilot evaluation", spend: 380, source: "Finance CSV · SSO", alternative: "GitHub Copilot", firstSeen: "Oct 02, 2026" },
  { name: "Otter.ai", vendor: "Otter.ai", category: "Meeting", department: "Support", status: "Unapproved" as ApprovalStatus, users: 12, seats: "Personal accounts", spend: 240, source: "Ramp · Card match", alternative: "Teams Premium", firstSeen: "Nov 02, 2026" },
  { name: "Adobe Firefly", vendor: "Adobe", category: "Image", department: "Design", status: "Approved" as ApprovalStatus, users: 46, seats: "46 / 60", spend: 1380, source: "Adobe admin · Entra ID", alternative: "—", firstSeen: "Feb 21, 2025" },
  { name: "GitHub Copilot", vendor: "GitHub", category: "Code", department: "Engineering", status: "Approved" as ApprovalStatus, users: 69, seats: "69 / 90", spend: 1380, source: "GitHub admin · Okta SSO", alternative: "—", firstSeen: "May 09, 2025" },
  { name: "Teams Premium", vendor: "Microsoft", category: "Meeting", department: "Support", status: "Approved" as ApprovalStatus, users: 53, seats: "53 / 75", spend: 795, source: "Entra ID · Vendor API", alternative: "—", firstSeen: "Jun 18, 2025" },
  { name: "Notion AI", vendor: "Notion", category: "Assistant", department: "Operations", status: "Approved" as ApprovalStatus, users: 41, seats: "41 / 55", spend: 820, source: "Finance CSV · SSO", alternative: "—", firstSeen: "Jul 02, 2025" },
  { name: "Grammarly Business", vendor: "Grammarly", category: "Assistant", department: "Marketing", status: "Approved" as ApprovalStatus, users: 38, seats: "38 / 50", spend: 570, source: "Finance CSV · SSO", alternative: "—", firstSeen: "Sep 27, 2025" },
  { name: "Figma AI", vendor: "Figma", category: "Image", department: "Design", status: "Approved" as ApprovalStatus, users: 29, seats: "29 / 40", spend: 435, source: "Figma admin · Okta SSO", alternative: "—", firstSeen: "Jan 16, 2026" },
  { name: "Jasper AI", vendor: "Jasper", category: "Assistant", department: "Marketing", status: "Unapproved" as ApprovalStatus, users: 11, seats: "Personal accounts", spend: 220, source: "Ramp · Card match", alternative: "ChatGPT Team", firstSeen: "Oct 11, 2026" },
  { name: "Poe", vendor: "Quora", category: "Assistant", department: "Sales", status: "Unapproved" as ApprovalStatus, users: 8, seats: "Personal accounts", spend: 160, source: "Expense · SSO", alternative: "ChatGPT Team", firstSeen: "Oct 19, 2026" },
  { name: "Replit AI", vendor: "Replit", category: "Code", department: "Engineering", status: "Unapproved" as ApprovalStatus, users: 7, seats: "Personal accounts", spend: 140, source: "Card match · SSO", alternative: "GitHub Copilot", firstSeen: "Oct 25, 2026" },
  { name: "Character.AI", vendor: "Character Technologies", category: "Assistant", department: "Support", status: "Unapproved" as ApprovalStatus, users: 5, seats: "Personal accounts", spend: 100, source: "Card match", alternative: "ChatGPT Team", firstSeen: "Nov 04, 2026" },
  { name: "Amazon Q", vendor: "Amazon", category: "Code", status: "Under review" as ApprovalStatus, users: 12, seats: "Pilot evaluation", spend: 180, source: "AWS admin · SSO", alternative: "GitHub Copilot", firstSeen: "Nov 06, 2026" },
];

export const toolUsage = tools.map(({ name, users, status }) => ({
  name,
  users: name === "ChatGPT Personal" ? 61 : name === "Perplexity Pro" ? 31 : name === "Midjourney Pro" ? 23 : name === "Otter.ai" ? 19 : users,
  status,
}));

export const alerts = [
  { id: "AL-2408", time: "Today, 09:42", type: "Department threshold", severity: "Critical", subject: "Marketing", owner: "Elena Rostova", status: "Open" as AlertStatus, impact: "$3,100 projected over limit", action: "Review department limit" },
  { id: "AL-2407", time: "Today, 08:15", type: "New unapproved tool", severity: "High", subject: "Otter.ai", owner: "Marcus Vance", status: "Open" as AlertStatus, impact: "19 people · $240 / month", action: "Review tool" },
  { id: "AL-2406", time: "Yesterday, 16:30", type: "Sync failure", severity: "Medium", subject: "GitHub Copilot", owner: "IT Operations", status: "Acknowledged" as AlertStatus, impact: "Seat data is 2 days old", action: "Reconnect source" },
  { id: "AL-2405", time: "Nov 12, 11:05", type: "Company cap", severity: "Low", subject: "Company", owner: "Sarah Lin", status: "Resolved" as AlertStatus, impact: "Forecast is within monthly cap", action: "View forecast" },
];

export const sources = [
  { name: "Okta Workforce", group: "Identity & access", provides: "Directory, app assignments, sign-in activity", status: "Connected", synced: "18 min ago", recommended: true },
  { name: "Microsoft Entra ID", group: "Identity & access", provides: "Directory sync and app assignments", status: "Not connected", synced: "Never synced", recommended: true },
  { name: "Google Workspace", group: "Identity & access", provides: "User directory and OAuth app grants", status: "Not connected", synced: "Never synced", recommended: true },
  { name: "OpenAI Enterprise", group: "AI vendors", provides: "Seats, active users and organization usage", status: "Connected", synced: "2 hours ago", recommended: true },
  { name: "Microsoft Copilot", group: "AI vendors", provides: "Copilot seats and daily usage", status: "Connected", synced: "4 hours ago", recommended: true },
  { name: "Anthropic Claude", group: "AI vendors", provides: "Enterprise seats, usage and API spend", status: "Not connected", synced: "Never synced", recommended: true },
  { name: "GitHub Copilot", group: "AI vendors", provides: "Seat allocation and active users", status: "Sync error", synced: "2 days ago", recommended: true },
  { name: "Ramp Corporate", group: "Finance & expense", provides: "Card transactions and expense claims", status: "Connected", synced: "1 hour ago", recommended: true },
  { name: "Oracle NetSuite", group: "Finance & expense", provides: "Ledger, vendor purchases and cost centers", status: "Not connected", synced: "Never synced", recommended: true },
  { name: "Manual CSV import", group: "Finance & expense", provides: "Statements and invoice lines", status: "Connected", synced: "Nov 08 · Q3_spend.csv", recommended: false },
  { name: "Browser discovery", group: "Discovery", provides: "Browser-based AI tool discovery", status: "Coming later", synced: "Planned for v1.1", recommended: false },
];

export const decisionItems = [
  { issue: "Marketing budget overrun projected", owner: "Elena Rostova", impact: "$3,100 over limit", action: "Review limits", kind: "Critical" },
  { issue: "61 employees using personal ChatGPT accounts", owner: "Marcus Vance", impact: "Data compliance risk", action: "Move to team plan", kind: "Warning" },
  { issue: "18 unused Copilot seats across Support & Sales", owner: "Devon Reed", impact: "$342 / month", action: "Review seats", kind: "Neutral" },
];

export const alertRules = [
  { name: "Department limit reached", trigger: "Projected spend reaches 80% or 100%", recipients: "Department owner, Finance", channel: "Email · Slack", enabled: true },
  { name: "Company cap approaching", trigger: "Projected spend reaches 90% or 100%", recipients: "CFO, Finance lead", channel: "Email · Slack", enabled: true },
  { name: "New unapproved tool", trigger: "First detected from a connected source", recipients: "IT & Security", channel: "Email · Slack", enabled: true },
  { name: "Source sync failure", trigger: "Two consecutive sync failures", recipients: "IT admin", channel: "Email", enabled: true },
];

export const kpis = {
  spent: 22_500,
  forecast: 48_200,
  companyCap: 55_000,
  toolsInUse: 19,
  unapprovedTools: 8,
  activeSeats: 426,
  purchasedSeats: 600,
  idleSeatCost: 4_200,
};

export const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export const compactMoney = (value: number) =>
  value >= 1000 ? `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k` : money(value);