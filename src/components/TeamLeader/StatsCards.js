import { FaUsers, FaChartPie } from "react-icons/fa";

// ⚠️ unconfirmed shape — verify /clubs/:id/stats against real API response
export default function StatsCards({ stats }) {
  const membersCount = stats?.totalMembers ?? 0;
  const maxMembers = stats?.maxMembers ?? 0;
  const fillRate = stats?.fillRate ?? (maxMembers ? Math.round((membersCount / maxMembers) * 100) : 0);

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {[
        { icon: FaUsers, label: "Members", value: `${membersCount} / ${maxMembers}` },
        { icon: FaChartPie, label: "Fill Rate", value: `${fillRate}%` },
      ].map((s) => (
        <div key={s.label} className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] p-6 flex items-center gap-4">
          <span className="h-11 w-11 rounded-full bg-[var(--primary-light)] flex items-center justify-center shrink-0">
            <s.icon className="text-[var(--primary)]" />
          </span>
          <div>
            <div className="font-display text-2xl font-semibold text-[var(--text-primary)]">{s.value}</div>
            <div className="text-xs text-[var(--text-muted)]">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}