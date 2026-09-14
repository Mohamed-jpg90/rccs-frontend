"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

// ⚠️ unconfirmed shape — verify /clubs/:id/analytics against real API response
export default function AnalyticsCharts({ analytics }) {
  const growth = analytics?.monthlyMemberGrowth ?? [];
  const attendance = analytics?.eventAttendance ?? [];
  const points = analytics?.pointsDistribution ?? [];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <ChartCard title="Member Growth">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={growth}>
            <CartesianGrid stroke="var(--border-light)" vertical={false} />
            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
            <YAxis stroke="var(--text-muted)" fontSize={12} />
            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Line type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Event Attendance">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={attendance}>
            <CartesianGrid stroke="var(--border-light)" vertical={false} />
            <XAxis dataKey="eventTitle" stroke="var(--text-muted)" fontSize={11} />
            <YAxis stroke="var(--text-muted)" fontSize={12} />
            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Bar dataKey="present" fill="var(--success)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" fill="var(--danger)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Points Distribution" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={points}>
            <CartesianGrid stroke="var(--border-light)" vertical={false} />
            <XAxis dataKey="range" stroke="var(--text-muted)" fontSize={12} />
            <YAxis stroke="var(--text-muted)" fontSize={12} />
            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] p-6 ${className}`}>
      <h3 className="font-display text-base font-semibold text-[var(--text-primary)] mb-4">{title}</h3>
      {children}
    </div>
  );
}