import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity, AlertCircle, ArrowRight, ArrowUpRight, Bell, Check,
  CheckCircle2, ChevronDown, CircleDollarSign, Clock3, Database, Download, Filter,
  Gauge, LayoutDashboard, LockKeyhole, Menu, MoreHorizontal, Search, Settings2,
  ShieldCheck, Sparkles, Users, X,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, LineChart,
  ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/sonner";
import {
  alertRules, alerts, compactMoney, decisionItems, departments, kpis, money,
  seatData, shadowTrend, sources, spendTrend, toolUsage, tools,
  type AlertStatus, type ApprovalStatus,
} from "@/data/governance";
import { hasCompanyCapMismatch, validateDepartmentLimit } from "@/lib/dashboard-metrics";
import { toast } from "sonner";

type PageKey = "overview" | "tools" | "departments" | "sources" | "alerts" | "seats" | "shadow" | "trend";
type DashboardPath = "/" | "/tools" | "/departments" | "/sources" | "/alerts" | "/seat-savings" | "/shadow-ai" | "/shadow-ai-over-time";

const navigation: { label: string; to: DashboardPath; key: PageKey; icon: typeof LayoutDashboard; group?: string }[] = [
  { label: "Overview", to: "/", key: "overview", icon: LayoutDashboard },
  { label: "Tools", to: "/tools", key: "tools", icon: Sparkles },
  { label: "Departments & limits", to: "/departments", key: "departments", icon: Gauge },
  { label: "Data sources", to: "/sources", key: "sources", icon: Database },
  { label: "Alerts", to: "/alerts", key: "alerts", icon: Bell },
  { label: "Seat savings", to: "/seat-savings", key: "seats", icon: CircleDollarSign },
  { label: "Shadow AI · Now", to: "/shadow-ai", key: "shadow", icon: ShieldCheck, group: "SHADOW AI" },
  { label: "Shadow AI · Over time", to: "/shadow-ai-over-time", key: "trend", icon: Activity },
];

const toolStatusClass: Record<ApprovalStatus, string> = {
  Approved: "tag tag-approved", Unapproved: "tag tag-unapproved", "Under review": "tag tag-review",
};

const alertStatusClass: Record<AlertStatus, string> = {
  Open: "tag tag-unapproved", Acknowledged: "tag tag-review", Resolved: "tag tag-approved",
};

function ScreenFrame({
  active, title, eyebrow, children,
}: { active: PageKey; title: string; eyebrow: string; children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const currentNav = navigation.find((item) => item.key === active);
  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link to="/" className="brand-lockup" aria-label="AI Governance home">
          <span className="brand-mark"><ShieldCheck size={19} /></span>
          <span className="brand-text"><strong>AI Governance</strong><small>ENTERPRISE</small></span>
        </Link>
        <div className="tenant-row"><span className="tenant-icon"><Database size={14} /></span><span>Cloudeagle.ai</span><span className="live-dot" /></div>
        <div className="sidebar-caption">GOVERNANCE PLATFORM</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key}>
                {item.group && <div className="nav-group-label">{item.group}</div>}
                <Link to={item.to} className={`nav-link ${active === item.key ? "is-active" : ""}`}>
                  <Icon size={16} strokeWidth={1.8} /><span>{item.label}</span>
                  {item.key === "alerts" && <span className="nav-count">3</span>}
                </Link>
              </div>
            );
          })}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-assurance"><LockKeyhole size={15} /><span>Privacy-first governance</span></div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <Button variant="ghost" size="icon" className="mobile-menu" aria-label="Open navigation" title="Open navigation" onClick={() => setMobileNavOpen((open) => !open)}><Menu /></Button>
          <div className="topbar-context"><span className="context-dot" />{currentNav?.label ?? title}</div>
          <div className="topbar-controls">
            <label className="top-select"><Clock3 size={14} /><select aria-label="Date range" defaultValue="Nov 1–14, 2026"><option>Nov 1–14, 2026</option><option>Last 30 days</option><option>Last quarter</option></select><ChevronDown size={13} /></label>
            <label className="top-select department-select"><Filter size={14} /><select aria-label="Department filter" defaultValue="All departments"><option>All departments</option>{departments.map((department) => <option key={department.name}>{department.name}</option>)}</select><ChevronDown size={13} /></label>
          </div>
          <div className="live-status"><span className="live-dot" /> Live monitoring</div>
          <Button variant="ghost" size="icon" className="top-icon" aria-label="Search" title="Search"><Search /></Button>
          <button className="profile-button" type="button" aria-label="Sarah Lin, VP of Finance">
            <span className="profile-avatar">SL</span><span className="profile-copy"><strong>Sarah Lin</strong><small>VP of Finance / CFO</small></span><ChevronDown size={14} />
          </button>
        </header>
        {mobileNavOpen && <nav className="mobile-nav-drawer" aria-label="Mobile navigation">{navigation.map((item) => { const Icon = item.icon; return <Link key={item.key} to={item.to} className={`nav-link ${active === item.key ? "is-active" : ""}`} onClick={() => setMobileNavOpen(false)}><Icon size={16} /><span>{item.label}</span></Link>; })}</nav>}
        <main className="page-content">
          <div className="page-heading">
            <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1></div>
            <div className="heading-actions"><span className="updated-label"><span className="live-dot" /> Synced 18 minutes ago</span></div>
          </div>
          {children}
        </main>
        <footer className="sync-footer"><span><CheckCircle2 size={14} /> Data synced 18 minutes ago</span><span>5 connected sources <ArrowRight size={13} /></span></footer>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

function PanelHeading({ title, note, action }: { title: string; note?: string; action?: ReactNode }) {
  return <div className="panel-heading"><div><h2>{title}</h2>{note && <p>{note}</p>}</div>{action}</div>;
}

function Kpi({ label, value, sub, icon: Icon, tone = "blue", meter }: {
  label: string; value: string; sub: string; icon: typeof Users; tone?: string; meter?: number;
}) {
  return <div className="kpi-tile"><div className="kpi-top"><span>{label}</span><span className={`kpi-icon tone-${tone}`}><Icon size={16} /></span></div><strong className="kpi-value">{value}</strong><span className="kpi-sub">{sub}</span>{meter !== undefined && <div className="meter"><span style={{ width: `${Math.min(meter, 100)}%` }} /></div>}</div>;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name?: string; value?: number; color?: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tooltip"><strong>{label}</strong>{payload.map((entry) => <span key={entry.name} style={{ color: entry.color }}>{entry.name}: {typeof entry.value === "number" && entry.value > 999 ? money(entry.value) : entry.value}</span>)}</div>;
}

function OverviewPage() {
  const [alertVisible, setAlertVisible] = useState(true);
  return (
    <ScreenFrame active="overview" title="Overview" eyebrow="GOVERNANCE SUMMARY">
      {alertVisible && <div className="priority-alert"><span className="priority-icon"><AlertCircle size={19} /></span><div className="priority-copy"><strong>Marketing is projected to exceed its limit by {money(3_100)} this month</strong><span>Most of the extra spend is unapproved Midjourney and personal ChatGPT seats.</span></div><Link to="/departments"><Button variant="outline" size="sm">Review Marketing <ArrowRight size={14} /></Button></Link><Button onClick={() => setAlertVisible(false)} variant="ghost" size="icon" aria-label="Dismiss alert" title="Dismiss alert"><X /></Button></div>}
      <div className="kpi-grid">
        <Kpi label="SPENT SO FAR" value={compactMoney(kpis.spent)} sub={`${compactMoney(kpis.companyCap)} monthly limit · 40.9%`} icon={CircleDollarSign} meter={40.9} />
        <Kpi label="PROJECTED MONTH-END" value={compactMoney(kpis.forecast)} sub={`${Math.round(kpis.forecast / kpis.companyCap * 100)}% of company cap`} icon={ArrowUpRight} tone="green" meter={87.6} />
        <Kpi label="UNAPPROVED TOOLS" value={`${kpis.unapprovedTools} of ${kpis.toolsInUse}`} sub="tools in use need review" icon={ShieldCheck} tone="amber" />
        <Kpi label="SEAT UTILIZATION" value={`${Math.round(kpis.activeSeats / kpis.purchasedSeats * 100)}%`} sub={`${kpis.activeSeats} active / ${kpis.purchasedSeats} seats`} icon={Users} tone="slate" meter={71} />
      </div>
      <div className="overview-chart-grid">
        <Panel>
          <PanelHeading title="Spend against limit, by department" note="Spent to date and month-end projection compared with each allocation" />
          <div className="chart-wrap chart-medium"><ResponsiveContainer width="100%" height="100%"><BarChart data={departments} layout="vertical" margin={{ top: 4, right: 15, left: 10, bottom: 4 }} barGap={3}><CartesianGrid stroke="var(--border)" horizontal={false} /><XAxis type="number" tickFormatter={(v) => `$${v / 1000}k`} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis dataKey="name" type="category" tick={{ fill: "var(--foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={78} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="spent" name="Spent" fill="var(--chart-1)" radius={[0, 3, 3, 0]} barSize={10} /><Bar dataKey="projected" name="Projected" fill="var(--chart-4)" radius={[0, 3, 3, 0]} barSize={10} /></BarChart></ResponsiveContainer></div>
          <div className="chart-legend"><span><i className="legend-blue" /> Spent so far</span><span><i className="legend-amber" /> Projected</span><span><i className="legend-line" /> Monthly limit</span></div>
        </Panel>
        <Panel>
          <PanelHeading title="Total spend trend and forecast" note="Monthly spend across connected sources" action={<span className="mini-status status-good">Within company cap</span>} />
          <div className="chart-wrap chart-medium"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={spendTrend} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tickFormatter={(v) => `$${v / 1000}k`} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} width={42} /><Tooltip content={<ChartTooltip />} /><ReferenceLine y={kpis.companyCap} stroke="var(--chart-5)" strokeDasharray="4 4" /><Area type="monotone" dataKey="actual" name="Spend" fill="var(--chart-1)" fillOpacity={0.1} stroke="var(--chart-1)" strokeWidth={2} /><Line type="monotone" dataKey="forecast" name="Forecast" stroke="var(--chart-4)" strokeWidth={2} strokeDasharray="5 4" connectNulls dot={{ r: 3 }} /></ComposedChart></ResponsiveContainer></div>
          <div className="chart-note"><span>Average monthly growth <strong>+8.4%</strong></span><span>Forecast confidence <strong>96.2%</strong></span></div>
        </Panel>
        <Panel>
          <PanelHeading title="Seat utilization by tool" note="Active seats compared with paid licenses" action={<Link to="/seat-savings" className="panel-link">View savings <ArrowRight size={13} /></Link>} />
          <div className="chart-wrap chart-short"><ResponsiveContainer width="100%" height="100%"><BarChart data={seatData} layout="vertical" margin={{ top: 4, right: 4, left: 4, bottom: 0 }} barSize={14}><CartesianGrid stroke="var(--border)" horizontal={false} /><XAxis type="number" domain={[0, 220]} hide /><YAxis dataKey="name" type="category" width={130} tick={{ fill: "var(--foreground)", fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="active" name="Active seats" stackId="seats" fill="var(--chart-1)" radius={[3, 0, 0, 3]} /><Bar dataKey="idle" name="Idle seats" stackId="seats" fill="var(--chart-6)" radius={[0, 3, 3, 0]} /></BarChart></ResponsiveContainer></div>
          <div className="chart-note"><span>{kpis.purchasedSeats - kpis.activeSeats} idle seats</span><span className="text-warning">~{compactMoney(kpis.idleSeatCost)} / mo estimated</span></div>
        </Panel>
        <Panel>
          <PanelHeading title="Unapproved tools over time" note="Monthly trend since the first connected source" action={<Link to="/shadow-ai-over-time" className="panel-link">View trend <ArrowRight size={13} /></Link>} />
          <div className="chart-wrap chart-short"><ResponsiveContainer width="100%" height="100%"><LineChart data={shadowTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis yAxisId="left" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} width={24} /><YAxis yAxisId="right" orientation="right" hide /><Tooltip content={<ChartTooltip />} /><Line yAxisId="left" dataKey="tools" name="Unapproved tools" stroke="var(--chart-4)" strokeWidth={2} dot={{ r: 3 }} /><Line yAxisId="right" dataKey="users" name="Active users" stroke="var(--chart-3)" strokeWidth={2} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div>
          <div className="chart-note"><span>Current: <strong>8 tools</strong></span><span><strong>134</strong> active users</span></div>
        </Panel>
      </div>
      <Panel>
        <PanelHeading title="Approved vs unapproved usage" note="Active users across monitored AI tools · last 30 days" action={<Link to="/shadow-ai" className="panel-link">Review Shadow AI <ArrowRight size={13} /></Link>} />
        <div className="ranked-list">{toolUsage.slice(0, 7).map((tool) => <div className="rank-row" key={tool.name}><div className="rank-name"><strong>{tool.name}</strong><span className={toolStatusClass[tool.status]}>{tool.status}</span></div><div className="rank-track"><span className={`rank-fill ${tool.status === "Approved" ? "fill-approved" : tool.status === "Under review" ? "fill-review" : "fill-unapproved"}`} style={{ width: `${tool.users / 142 * 100}%` }} /></div><span className="rank-count">{tool.users} <small>users</small></span></div>)}</div>
      </Panel>
      <Panel className="decision-panel">
        <PanelHeading title="Needs a decision" note="Highest-priority issues that need a human review" action={<span className="mini-status status-warn">3 pending</span>} />
        <div className="table-scroll"><table className="data-table"><thead><tr><th>ISSUE</th><th>OWNER</th><th>IMPACT</th><th>SUGGESTED ACTION</th></tr></thead><tbody>{decisionItems.map((item) => <tr key={item.issue}><td><span className={`severity-dot severity-${item.kind.toLowerCase()}`} /><strong>{item.issue}</strong></td><td>{item.owner}</td><td>{item.impact}</td><td><Button size="sm" variant="outline" onClick={() => toast.info(`${item.action} is ready for review.`)}>{item.action}</Button></td></tr>)}</tbody></table></div>
      </Panel>
    </ScreenFrame>
  );
}

function ToolsPage() {
  const [status, setStatus] = useState("All tools");
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState("ChatGPT Personal");
  const [toolRows, setToolRows] = useState(tools);
  const selected = toolRows.find((tool) => tool.name === selectedName) ?? toolRows[0];
  const filtered = useMemo(() => toolRows.filter((tool) => (status === "All tools" || tool.status === status) && `${tool.name} ${tool.vendor} ${tool.category}`.toLowerCase().includes(query.toLowerCase())), [query, status, toolRows]);
  const changeSelectedStatus = (next: ApprovalStatus) => {
    if (!selected) return;
    setToolRows((rows) => rows.map((row) => row.name === selected.name ? { ...row, status: next } : row));
    toast.success(`${selected.name} marked ${next.toLowerCase()}.`);
  };
  return <ScreenFrame active="tools" title="Tools & applications" eyebrow="TOOL INVENTORY & SHADOW AI">
    <div className="page-toolbar"><div className="segmented-tabs">{["All tools", "Approved", "Unapproved", "Under review"].map((item) => <Button key={item} size="sm" variant={status === item ? "default" : "ghost"} onClick={() => setStatus(item)}>{item}<span className="tab-count">{item === "All tools" ? toolRows.length : toolRows.filter((tool) => tool.status === item).length}</span></Button>)}</div><Button variant="outline" onClick={() => downloadCsv("ai-tools.csv", filtered)}><Download size={15} /> Export CSV</Button></div>
    <div className="search-row"><div className="search-field"><Search size={16} /><Input aria-label="Search tools" placeholder="Search by tool name, vendor, or category…" value={query} onChange={(event) => setQuery(event.target.value)} /></div><Button variant="outline" onClick={() => setStatus("All tools")}><Filter size={15} /> Filters</Button><Button onClick={() => toast.info("Add tool to the approved-tools list.")}><Sparkles size={15} /> Sanction a tool</Button></div>
    <div className="split-layout"><Panel className="table-panel"><div className="table-scroll"><table className="data-table tool-table"><thead><tr><th>TOOL & PLATFORM</th><th>STATUS</th><th>30D USERS</th><th>SEAT UTILIZATION</th><th>MONTHLY SPEND</th></tr></thead><tbody>{filtered.map((tool) => <tr key={tool.name} className={tool.name === selectedName ? "selected-row" : "clickable-row"} onClick={() => setSelectedName(tool.name)}><td><strong>{tool.name}</strong><small>{tool.vendor} · {tool.category}</small></td><td><span className={toolStatusClass[tool.status]}>{tool.status}</span></td><td>{tool.users}</td><td>{tool.seats}</td><td>{money(tool.spend)}</td></tr>)}</tbody></table></div><div className="table-foot">Showing {filtered.length} of {toolRows.length} monitored tools <span>Page 1 of 1 <Button variant="ghost" size="sm" disabled>Next</Button></span></div></Panel>
      {selected && <Panel className="detail-panel"><div className="detail-head"><div><span className={toolStatusClass[selected.status]}>{selected.status}</span><h2>{selected.name}</h2><p>{selected.vendor} · {selected.category}</p></div><Button variant="ghost" size="icon" aria-label="More tool options" title="More tool options"><MoreHorizontal /></Button></div>{selected.status === "Unapproved" && <div className="warning-box"><AlertCircle size={17} /><div><strong>Governance review needed</strong><span>Review contract terms and data handling with the tool owner.</span></div></div>}<div className="detail-metrics"><div><span>ACTIVE USERS</span><strong>{selected.users}</strong><small>Last 30 days</small></div><div><span>MONTHLY SPEND</span><strong>{money(selected.spend)}</strong><small>Connected sources</small></div></div><dl className="detail-list"><div><dt>First detected</dt><dd>{selected.firstSeen}</dd></div><div><dt>Signal sources</dt><dd>{selected.source}</dd></div><div><dt>Approved alternative</dt><dd>{selected.alternative}</dd></div></dl><div className="detail-breakdown"><strong>USERS BY DEPARTMENT</strong>{departments.slice(0, 4).map((department, index) => <div key={department.name}><span>{department.name}</span><span>{Math.max(2, Math.round(selected.users * ([0.46, 0.22, 0.15, 0.1][index] ?? 0.1)))} users</span></div>)}</div><div className="detail-actions"><Button className="full-button" onClick={() => toast.success(`Migration request for ${selected.name} added for IT review.`)}>Request migration <ArrowRight size={15} /></Button><div><Button variant="outline" onClick={() => changeSelectedStatus("Approved")}><Check size={14} /> Mark approved</Button><Button variant="outline" onClick={() => changeSelectedStatus("Under review")}>Send to review</Button></div></div></Panel>}
    </div>
  </ScreenFrame>;
}

function DepartmentsPage() {
  const [activeDepartment, setActiveDepartment] = useState("Marketing");
  const [search, setSearch] = useState("");
  const [limits, setLimits] = useState(departments.map((item) => ({ ...item })));
  const [limitInput, setLimitInput] = useState(String(departments[0]?.limit ?? 1000));
  const [ownerName, setOwnerName] = useState(departments[0]?.owner ?? "");
  const [approverName, setApproverName] = useState("Sarah Lin");
  const limitTotal = limits.reduce((total, item) => total + item.limit, 0);
  const capMismatch = hasCompanyCapMismatch(kpis.companyCap, limitTotal);
  const visible = limits.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  const chooseDepartment = (name: string) => {
    const department = limits.find((item) => item.name === name);
    if (!department) return;
    setActiveDepartment(name);
    setLimitInput(String(department.limit));
    setOwnerName(department.owner);
  };
  const saveLimit = () => {
    const parsed = Number(limitInput);
    const error = validateDepartmentLimit(parsed, Boolean(ownerName), [80, 100]);
    if (error) { toast.error(error); return; }
    setLimits((items) => items.map((item) => item.name === activeDepartment ? { ...item, limit: parsed, owner: ownerName } : item));
    toast.success(`${activeDepartment} limit updated.`);
  };
  return <ScreenFrame active="departments" title="Departments & limits" eyebrow="FISCAL THRESHOLDS">
    <div className="search-row departments-toolbar"><div className="search-field"><Search size={16} /><Input aria-label="Search departments" placeholder="Search departments…" value={search} onChange={(event) => setSearch(event.target.value)} /></div><Button variant="outline" onClick={() => setSearch("")}><Filter size={15} /> All departments</Button><Button onClick={() => toast.info("New department setup is ready for Finance review.")}><Users size={15} /> Add department</Button></div>
    {capMismatch && <div className="notice-strip"><AlertCircle size={16} /><span>Department limits total <strong>{money(limitTotal)}</strong>, while the separate company cap is <strong>{money(kpis.companyCap)}</strong>.</span><span className="tag tag-review">Mismatch</span></div>}
    <div className="kpi-grid four-kpis"><Kpi label="COMPANY MONTHLY CAP" value={money(kpis.companyCap)} sub="Set independently from department limits" icon={CircleDollarSign} /><Kpi label="TOTAL SPENT" value={money(kpis.spent)} sub="40.9% of company cap" icon={Activity} tone="green" meter={40.9} /><Kpi label="PROJECTED MONTH-END" value={money(kpis.forecast)} sub="87.6% of company cap" icon={ArrowUpRight} tone="slate" meter={87.6} /><Kpi label="OVER BUDGET" value="1 department" sub="Marketing projected +$3.1k" icon={AlertCircle} tone="amber" /></div>
    <div className="department-layout"><Panel className="table-panel"><PanelHeading title="Department allocations" note={`${limits.length} cost centers`} /><div className="table-scroll"><table className="data-table"><thead><tr><th>DEPARTMENT</th><th>OWNER</th><th>MONTHLY LIMIT</th><th>SPENT</th><th>PROJECTED</th><th>STATUS</th></tr></thead><tbody>{visible.map((department) => { const over = department.projected > department.limit; const near = department.projected / department.limit >= 0.8; return <tr key={department.name} className={`${activeDepartment === department.name ? "selected-row" : "clickable-row"} ${over ? "row-danger" : ""}`} onClick={() => chooseDepartment(department.name)}><td><strong>{department.name}</strong></td><td>{department.owner}</td><td>{money(department.limit)}</td><td>{money(department.spent)}</td><td>{money(department.projected)}</td><td><span className={`tag ${over ? "tag-unapproved" : near ? "tag-review" : "tag-approved"}`}>{over ? "Will exceed" : near ? "Near limit" : "On track"}</span></td></tr>; })}</tbody><tfoot><tr><td colSpan={2}><strong>Total department limits</strong></td><td><strong>{money(limitTotal)}</strong></td><td><strong>{money(kpis.spent)}</strong></td><td><strong>{money(kpis.forecast)}</strong></td><td>{capMismatch ? <span className="text-warning">Cap differs</span> : "Aligned"}</td></tr></tfoot></table></div></Panel>
      <Panel className="limit-editor"><div className="editor-head"><span className="eyebrow">EDITING DEPARTMENT</span><Button variant="ghost" size="icon" aria-label="Close editor" title="Close editor"><X /></Button></div><h2>{activeDepartment}</h2><p>Adjust the limit and alert thresholds for this cost center.</p><div className="form-field"><label htmlFor="dept-owner">Department owner</label><select id="dept-owner" value={ownerName} onChange={(event) => setOwnerName(event.target.value)}>{limits.map((item) => <option key={item.owner}>{item.owner}</option>)}</select></div><div className="form-field"><label htmlFor="dept-approver">Financial approver</label><select id="dept-approver" value={approverName} onChange={(event) => setApproverName(event.target.value)}><option>Sarah Lin</option><option>Priya Shah</option><option>Alex Morgan</option></select></div><div className="form-field"><label htmlFor="dept-limit">Monthly spend limit</label><div className="currency-input"><span>$</span><Input id="dept-limit" type="number" min="1" value={limitInput} onChange={(event) => setLimitInput(event.target.value)} /></div><small>Company cap is managed separately.</small></div><div className="form-field"><label>Alert thresholds</label><div className="threshold-row"><span>80% · Email</span><span>100% · Email + Slack</span></div><small>Thresholds are kept in ascending order.</small></div><div className="form-field"><label>Enforcement</label><div className="policy-note"><CheckCircle2 size={15} /> Notify only · human review required</div></div><div className="editor-actions"><Button variant="outline" onClick={() => chooseDepartment(activeDepartment)}>Cancel</Button><Button onClick={saveLimit}>Save changes</Button></div></Panel>
    </div>
  </ScreenFrame>;
}

function SourcesPage() {
  const [sourceRows, setSourceRows] = useState(sources);
  const connectedCount = sourceRows.filter((source) => source.recommended && source.status === "Connected").length;
  const totalRecommended = sourceRows.filter((source) => source.recommended).length;
  const groups = Array.from(new Set(sourceRows.map((source) => source.group)));
  const updateSource = (name: string, status: string) => { setSourceRows((rows) => rows.map((source) => source.name === name ? { ...source, status, synced: status === "Connected" ? "Just now" : source.synced } : source)); toast.success(`${name}: ${status.toLowerCase()}.`); };
  return <ScreenFrame active="sources" title="Data sources" eyebrow="INTEGRATIONS & INGESTION">
    <div className="source-summary"><div className="source-completeness"><div><strong>Data completeness: {connectedCount} of {totalRecommended} recommended sources</strong><span>{Math.round(connectedCount / totalRecommended * 100)}%</span></div><div className="meter wide-meter"><span style={{ width: `${connectedCount / totalRecommended * 100}%` }} /></div></div><div className="source-summary-item"><span className="live-dot" /><div><small>PIPELINES</small><strong>5 active running</strong></div></div><div className="source-summary-item"><Clock3 size={16} /><div><small>LAST GLOBAL SYNC</small><strong>18 minutes ago</strong></div></div><div className="source-note">Some spend and seat figures may be incomplete until all recommended sources are connected.</div></div>
    <div className="source-actions"><Button variant="outline" onClick={() => toast.success("Sync requested for all connected sources.")}><Activity size={15} /> Sync all sources</Button><Button onClick={() => toast.info("Custom API and webhook connections are planned for a later release.")}><Settings2 size={15} /> Add custom API / webhook</Button></div>
    {groups.map((group) => <div className="source-group" key={group}><div className="group-heading"><div className="group-icon"><Database size={17} /></div><div><h2>{group}</h2><p>{group === "Identity & access" ? "Directory, departments and app assignments." : group === "AI vendors" ? "Vendor seats, active usage and monthly spend." : group === "Finance & expense" ? "Card transactions, expenses and invoice lines." : "Unapproved tool discovery signals."}</p></div></div><div className="source-grid">{sourceRows.filter((source) => source.group === group).map((source) => <Panel className="source-card" key={source.name}><div className="source-card-top"><span className="source-card-icon"><Database size={16} /></span><span className={`tag ${source.status === "Connected" ? "tag-approved" : source.status === "Sync error" ? "tag-unapproved" : source.status === "Coming later" ? "tag-neutral" : "tag-review"}`}>{source.status}</span></div><h3>{source.name}</h3><p>{source.provides}</p><div className="source-sync"><Clock3 size={13} /> {source.synced}</div><div className="source-card-actions">{source.status === "Connected" ? <Button variant="outline" size="sm" onClick={() => updateSource(source.name, "Sync error")}>Manage</Button> : source.status === "Sync error" ? <Button size="sm" onClick={() => updateSource(source.name, "Connected")}>Reconnect</Button> : source.status === "Coming later" ? <Button variant="outline" size="sm" disabled>Coming later</Button> : <Button size="sm" onClick={() => updateSource(source.name, "Connected")}>Connect</Button>}</div></Panel>)}</div></div>)}
  </ScreenFrame>;
}

function AlertsPage() {
  const [rows, setRows] = useState(alerts);
  const [filter, setFilter] = useState("All alerts");
  const [rules, setRules] = useState(alertRules);
  const [tab, setTab] = useState("Recent alerts");
  const filtered = rows.filter((alert) => filter === "All alerts" || alert.status === filter);
  const updateAlert = (id: string, status: AlertStatus) => { setRows((items) => items.map((item) => item.id === id ? { ...item, status } : item)); toast.success(`Alert ${status.toLowerCase()}.`); };
  return <ScreenFrame active="alerts" title="Alerts" eyebrow="GOVERNANCE & NOTIFICATIONS">
    <div className="segmented-tabs alert-tabs">{["Recent alerts", "Rules", "Delivery log"].map((item) => <Button key={item} size="sm" variant={tab === item ? "default" : "ghost"} onClick={() => setTab(item)}>{item}</Button>)}</div>
    {tab === "Recent alerts" && <><div className="search-row alert-toolbar"><label className="top-select"><Filter size={14} /><select aria-label="Alert status filter" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All alerts</option><option>Open</option><option>Acknowledged</option><option>Resolved</option></select><ChevronDown size={13} /></label><Button variant="outline" onClick={() => setFilter("All alerts")}>All types</Button></div><Panel><PanelHeading title="Recent alerts" note="Warnings raised from budget, tool governance and source health" /><div className="table-scroll"><table className="data-table"><thead><tr><th>TIME</th><th>TYPE</th><th>SUBJECT</th><th>OWNER</th><th>IMPACT</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{filtered.map((alert) => <tr key={alert.id}><td>{alert.time}</td><td><span className={`tag ${alert.severity === "Critical" || alert.severity === "High" ? "tag-unapproved" : "tag-review"}`}>{alert.severity}</span><small>{alert.type}</small></td><td><strong>{alert.subject}</strong></td><td>{alert.owner}</td><td>{alert.impact}</td><td><span className={alertStatusClass[alert.status]}>{alert.status}</span></td><td>{alert.status === "Open" ? <Button size="sm" variant="outline" onClick={() => updateAlert(alert.id, "Acknowledged")}>Acknowledge</Button> : alert.status === "Acknowledged" ? <Button size="sm" variant="outline" onClick={() => updateAlert(alert.id, "Resolved")}>Resolve</Button> : <Button size="sm" variant="ghost" onClick={() => toast.info(alert.action)}>{alert.action}</Button>}</td></tr>)}</tbody></table></div></Panel><Panel><PanelHeading title="Delivery log" note="Most recent notifications sent to owners" /><div className="delivery-list">{[{ time: "Today, 09:42", rule: "Marketing 80% limit warning", recipient: "Elena Rostova · Email", status: "Delivered" }, { time: "Today, 08:15", rule: "New unapproved tool detected", recipient: "IT & Security · Slack", status: "Delivered" }, { time: "Yesterday, 16:30", rule: "Source sync failure", recipient: "IT Operations · Email", status: "Delivered" }].map((row) => <div className="delivery-row" key={row.rule}><CheckCircle2 size={16} /><span>{row.time}</span><strong>{row.rule}</strong><span>{row.recipient}</span><span className="tag tag-approved">{row.status}</span></div>)}</div></Panel></>}
    {tab === "Rules" && <Panel><PanelHeading title="Alert rules" note="Set triggers, recipients and delivery channels" action={<Button onClick={() => toast.info("New alert rule is ready to configure.")}>Add rule</Button>} /><div className="rule-list">{rules.map((rule) => <div className="rule-row" key={rule.name}><div className="rule-icon"><Bell size={16} /></div><div className="rule-main"><strong>{rule.name}</strong><span>{rule.trigger}</span><small>{rule.recipients} · {rule.channel}</small></div><Switch checked={rule.enabled} aria-label={`Enable ${rule.name}`} onCheckedChange={(checked) => setRules((items) => items.map((item) => item.name === rule.name ? { ...item, enabled: checked } : item))} /></div>)}</div><div className="policy-note"><CheckCircle2 size={15} /> Notify only · automatic tool blocking is not enabled.</div></Panel>}
    {tab === "Delivery log" && <Panel><PanelHeading title="Delivery log" note="Notification attempts by recipient and channel" /><div className="delivery-list">{[{ time: "Today, 09:42", rule: "Marketing 80% limit warning", recipient: "Elena Rostova · Email", status: "Delivered" }, { time: "Today, 08:15", rule: "New unapproved tool detected", recipient: "IT & Security · Slack", status: "Delivered" }, { time: "Yesterday, 16:30", rule: "Source sync failure", recipient: "IT Operations · Email", status: "Delivered" }].map((row) => <div className="delivery-row" key={row.rule}><CheckCircle2 size={16} /><span>{row.time}</span><strong>{row.rule}</strong><span>{row.recipient}</span><span className="tag tag-approved">{row.status}</span></div>)}</div></Panel>}
  </ScreenFrame>;
}

function SeatSavingsPage() {
  const [threshold, setThreshold] = useState(30);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [reclaimed, setReclaimed] = useState<string[]>([]);
  const idleCost = seatData.filter((seat) => seat.days >= threshold && !reclaimed.includes(seat.name)).reduce((sum, seat) => sum + seat.cost, 0);
  const reclaim = () => { if (!confirming) return; setReclaimed((items) => [...items, confirming]); toast.success(`${confirming} seats added to the IT reclaim request.`); setConfirming(null); };
  return <ScreenFrame active="seats" title="Seat savings" eyebrow="LICENSE OPTIMIZATION">
    <div className="savings-intro"><div><h2>Which paid licenses go unused?</h2><p>140 paid seats are idle, representing approximately <strong>{compactMoney(idleCost)} per month</strong> in reclaimable spend.</p><span className="estimate-note">ESTIMATE · Seat price is estimated where invoice data is missing.</span></div><Panel className="reclaim-callout"><div><small>IMMEDIATE ACTION</small><strong>Review idle seats</strong></div><div className="recovery-number">~{compactMoney(idleCost)} <small>/ month</small></div><Button onClick={() => setConfirming("all idle seats")}>Review and reclaim <ArrowRight size={15} /></Button></Panel></div>
    <div className="kpi-grid three-kpis"><Kpi label="SEAT UTILIZATION" value="71%" sub="426 active of 600 purchased" icon={Gauge} tone="green" meter={71} /><Kpi label="IDLE SEATS" value="140" sub="No activity recorded for 30+ days" icon={Users} tone="amber" /><Kpi label="IDLE COST / MONTH" value={compactMoney(idleCost)} sub="Potential annual savings ~ $50,400" icon={CircleDollarSign} tone="slate" /></div>
    <Panel><PanelHeading title="Seat utilization by tool" note="Comparing active users against paid seats" /><div className="chart-wrap chart-large"><ResponsiveContainer width="100%" height="100%"><BarChart data={seatData} layout="vertical" margin={{ top: 10, right: 30, left: 25, bottom: 10 }} barSize={24}><CartesianGrid stroke="var(--border)" horizontal={false} /><XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis dataKey="name" type="category" width={145} tick={{ fill: "var(--foreground)", fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="active" name="Active seats" stackId="seat" fill="var(--chart-1)" radius={[3, 0, 0, 3]} /><Bar dataKey="idle" name="Idle seats" stackId="seat" fill="var(--chart-6)" radius={[0, 3, 3, 0]} /></BarChart></ResponsiveContainer></div><div className="chart-legend"><span><i className="legend-blue" /> Active in last 30 days</span><span><i className="legend-neutral" /> Idle</span></div></Panel>
    <Panel><PanelHeading title="Idle seats you can review" note="Licenses filtered by inactivity duration" action={<div className="panel-actions"><label className="top-select"><Clock3 size={14} /><select aria-label="Inactivity threshold" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))}><option value={30}>30+ days inactive</option><option value={45}>45+ days inactive</option><option value={60}>60+ days inactive</option></select><ChevronDown size={13} /></label><Button variant="outline" onClick={() => downloadCsv("idle-seats.csv", seatData.filter((seat) => seat.days >= threshold))}><Download size={14} /> Export CSV</Button></div>} /><div className="table-scroll"><table className="data-table"><thead><tr><th>TOOL</th><th>IDLE SEATS</th><th>INACTIVITY</th><th>MONTHLY COST</th><th>RENEWAL</th><th>ACTION</th></tr></thead><tbody>{seatData.filter((seat) => seat.days >= threshold && !reclaimed.includes(seat.name)).map((seat) => <tr key={seat.name}><td><strong>{seat.name}</strong></td><td>{seat.idle}</td><td>{seat.days} days</td><td>{money(seat.cost)}</td><td>{seat.renewal}</td><td><Button size="sm" onClick={() => setConfirming(seat.name)}>Request reclaim</Button></td></tr>)}</tbody></table></div></Panel>
    {confirming && <div className="confirm-backdrop" role="presentation"><div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><div className="confirm-icon"><Users size={19} /></div><h2 id="confirm-title">Review seat reclaim</h2><p>Prepare a reclaim request for <strong>{confirming}</strong>? IT will review before any licenses are changed.</p><div className="editor-actions"><Button variant="outline" onClick={() => setConfirming(null)}>Cancel</Button><Button onClick={reclaim}>Prepare request</Button></div></div></div>}
  </ScreenFrame>;
}

function ShadowNowPage() {
  const [rows, setRows] = useState(tools.filter((tool) => tool.status === "Unapproved"));
  const updateStatus = (name: string, status: ApprovalStatus) => { setRows((items) => items.filter((item) => item.name !== name)); toast.success(`${name} sent for ${status.toLowerCase()} review.`); };
  return <ScreenFrame active="shadow" title="Shadow AI: Now" eyebrow="LIVE DETECTION & REVIEW">
    <div className="page-toolbar">
      <div className="segmented-tabs">
        <Link to="/shadow-ai">
          <Button size="sm" variant="default">
            <ShieldCheck size={14} /> Live detection (Now)
          </Button>
        </Link>
        <Link to="/shadow-ai-over-time">
          <Button size="sm" variant="ghost">
            <Activity size={14} /> Trend (Over time)
          </Button>
        </Link>
      </div>
      <Button variant="outline" onClick={() => downloadCsv("unapproved-tools.csv", rows)}>
        <Download size={14} /> Export CSV
      </Button>
    </div>
    <div className="shadow-intro"><div><h2>Which AI tools are used without approval?</h2><p>Review unapproved tools and the teams using them. Data is summarized by department.</p></div></div>
    <div className="kpi-grid three-kpis"><Kpi label="UNAPPROVED TOOLS" value="8" sub="currently detected" icon={ShieldCheck} tone="amber" /><Kpi label="PEOPLE USING THEM" value="134" sub="active in the last 30 days" icon={Users} /><Kpi label="PERSONAL ACCOUNTS" value="61" sub="identified from expense and SSO signals" icon={AlertCircle} tone="slate" /></div>
    <Panel><PanelHeading title="Approved vs unapproved usage, by tool" note="Active users in the last 30 days · top tools" /><div className="chart-wrap chart-large"><ResponsiveContainer width="100%" height="100%"><BarChart data={toolUsage.slice(0, 7)} layout="vertical" margin={{ top: 8, right: 28, left: 10, bottom: 4 }} barSize={16}><CartesianGrid stroke="var(--border)" horizontal={false} /><XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis dataKey="name" type="category" width={150} tick={{ fill: "var(--foreground)", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="users" name="Active users" radius={[0, 4, 4, 0]}>{toolUsage.slice(0, 7).map((tool) => <Cell key={tool.name} fill={tool.status === "Approved" ? "var(--chart-2)" : tool.status === "Unapproved" ? "var(--chart-4)" : "var(--chart-6)"} />)}</Bar></BarChart></ResponsiveContainer></div><div className="chart-legend"><span><i className="legend-green" /> Approved</span><span><i className="legend-amber" /> Unapproved</span><span><i className="legend-neutral" /> Under review</span></div></Panel>
    <Panel><PanelHeading title="Unapproved tools to review" note="Human review only · no tools are blocked automatically" /><div className="table-scroll"><table className="data-table"><thead><tr><th>TOOL</th><th>PEOPLE</th><th>TOP DEPARTMENTS</th><th>FIRST SEEN</th><th>MONTHLY SPEND</th><th>ACTION</th></tr></thead><tbody>{rows.map((tool) => <tr key={tool.name}><td><strong>{tool.name}</strong><small>{tool.vendor} · {tool.category}</small></td><td>{tool.users}</td><td>Marketing · Sales</td><td>{tool.firstSeen}</td><td>{money(tool.spend)}</td><td><div className="row-actions"><Button size="sm" variant="outline" onClick={() => toast.success(`Migration request for ${tool.name} added.`)}>Request migration</Button><Button size="sm" variant="ghost" onClick={() => updateStatus(tool.name, "Under review")}>Review</Button></div></td></tr>)}</tbody></table></div></Panel>
  </ScreenFrame>;
}

function ShadowTrendPage() {
  const [reviewingItem, setReviewingItem] = useState<{ type: string; name: string; note: string; action: string } | null>(null);

  const handleAction = (item: { type: string; name: string; note: string; action: string }) => {
    if (item.action === "—") return;
    setReviewingItem(item);
  };

  const confirmAction = () => {
    if (!reviewingItem) return;
    toast.success(`${reviewingItem.action} executed for ${reviewingItem.name}.`);
    setReviewingItem(null);
  };

  return <ScreenFrame active="trend" title="Shadow AI: Over time" eyebrow="GOVERNANCE TREND">
    <div className="page-toolbar">
      <div className="segmented-tabs">
        <Link to="/shadow-ai">
          <Button size="sm" variant="ghost">
            <ShieldCheck size={14} /> Live detection (Now)
          </Button>
        </Link>
        <Link to="/shadow-ai-over-time">
          <Button size="sm" variant="default">
            <Activity size={14} /> Trend (Over time)
          </Button>
        </Link>
      </div>
      <Button variant="outline" onClick={() => downloadCsv("shadow-ai-audit.csv", shadowTrend)}>
        <Download size={14} /> Export audit CSV
      </Button>
    </div>

    <div className="shadow-intro">
      <div>
        <h2>Is unapproved AI use shrinking or growing?</h2>
        <p>Unapproved tools grew from 3 to 8 since June and have been flat for two months.</p>
      </div>
      <span className="history-note"><Clock3 size={14} /> History starts when a source connects</span>
    </div>

    <div className="kpi-grid three-kpis">
      <Kpi label="CURRENT INVENTORY" value="8" sub="unapproved tools now" icon={ShieldCheck} tone="amber" />
      <Kpi label="CHANGE SINCE BASELINE" value="+5" sub="since June connection baseline" icon={ArrowUpRight} tone="slate" />
      <Kpi label="PEOPLE EXPOSED" value="134" sub="active on unapproved tools" icon={Users} />
    </div>

    <Panel>
      <PanelHeading
        title="Unapproved tools and active users over time"
        note="Monthly history from first source connection"
        action={
          <div className="chart-legend">
            <span><i className="legend-amber" /> Unapproved tools</span>
            <span><i className="legend-neutral" /> Active users</span>
            <span><i style={{ display: "inline-block", width: 12, height: 2, background: "var(--chart-1)", verticalAlign: "middle", marginRight: 4 }} /> Governance started (Sep)</span>
          </div>
        }
      />
      <div className="chart-wrap chart-trend">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={shadowTrend} margin={{ top: 18, right: 35, left: 10, bottom: 12 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" domain={[0, 10]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 160]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <ReferenceLine yAxisId="left" x="Sep" stroke="var(--chart-1)" strokeDasharray="4 4" label={{ value: "Governance started", fill: "var(--primary)", fontSize: 11 }} />
            <Line yAxisId="left" type="monotone" dataKey="tools" name="Unapproved tools" stroke="var(--chart-4)" strokeWidth={3} dot={{ r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="users" name="Active users" stroke="var(--chart-3)" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>

    <div className="impact-strip">
      <div className="impact-icon"><CheckCircle2 size={18} /></div>
      <div>
        <strong>September governance impact</strong>
        <span>New tool introductions have stabilized since the approved-tools review began.</span>
      </div>
      <span className="mini-status status-good">No new tools this month</span>
    </div>

    <Panel>
      <PanelHeading
        title="What changed this month"
        note="Recent movement in unapproved tools from connected sources"
        action={
          <Button variant="outline" size="sm" onClick={() => downloadCsv("shadow-ai-audit.csv", shadowTrend)}>
            <Download size={14} /> Export audit CSV
          </Button>
        }
      />
      <div className="change-list">
        {[
          { type: "New", name: "Otter.ai", note: "Meeting transcription · 19 people", action: "Review" },
          { type: "Grew", name: "ChatGPT personal accounts", note: "+9 people · 61 total users", action: "Request migration" },
          { type: "Resolved", name: "No tools resolved", note: "No tools decommissioned this cycle", action: "—" },
        ].map((item) => (
          <div className="change-row" key={item.type}>
            <span className={`tag ${item.type === "New" ? "tag-unapproved" : item.type === "Resolved" ? "tag-approved" : "tag-review"}`}>
              {item.type}
            </span>
            <strong>{item.name}</strong>
            <span>{item.note}</span>
            <Button
              size="sm"
              variant={item.action === "Request migration" ? "default" : "outline"}
              disabled={item.action === "—"}
              onClick={() => handleAction(item)}
            >
              {item.action}
            </Button>
          </div>
        ))}
      </div>
    </Panel>

    {reviewingItem && (
      <div className="confirm-backdrop" role="presentation">
        <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="trend-action-title">
          <div className="confirm-icon"><ShieldCheck size={19} /></div>
          <h2 id="trend-action-title">{reviewingItem.action} · {reviewingItem.name}</h2>
          <p>
            {reviewingItem.action === "Request migration"
              ? `Prepare migration request for ${reviewingItem.name}? All 61 detected personal account users will be notified to migrate to the sanctioned ChatGPT Team workspace.`
              : `Review governance and compliance terms for ${reviewingItem.name}. Current signal: 19 active users across Marketing and Sales.`}
          </p>
          <div className="editor-actions">
            <Button variant="outline" onClick={() => setReviewingItem(null)}>Cancel</Button>
            <Button onClick={confirmAction}>Confirm {reviewingItem.action}</Button>
          </div>
        </div>
      </div>
    )}
  </ScreenFrame>;
}

function downloadCsv(filename: string, rows: object[]) {
  const firstRow = rows[0];
  if (!firstRow) { toast.info("There is no data to export."); return; }
  const keys = Object.keys(firstRow);
  const csv = [keys.join(","), ...rows.map((row) => keys.map((key) => JSON.stringify((row as Record<string, unknown>)[key] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
  toast.success(`${filename} downloaded.`);
}

export {
  AlertsPage, DepartmentsPage, OverviewPage, ScreenFrame, SeatSavingsPage,
  ShadowNowPage, ShadowTrendPage, SourcesPage, ToolsPage,
};