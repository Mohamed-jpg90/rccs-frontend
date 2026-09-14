"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TopMembersChart({ members = [], insights }) {
  if (!members.length) return null;

  const chartData = members.slice(0, 10).map((m) => ({
    name: m.fullName,
    points: m.totalPoints,
  }));

  return (
    <div className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] p-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
          Top 10 Members by Points
        </h3>
        {insights && (
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Avg among top 20: {insights.averagePoints} pts
            {insights.topClub && (
              <> · Most represented club: {insights.topClub} ({insights.topClubCount})</>
            )}
          </p>
        )}
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 24, right: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
            <YAxis type="category" dataKey="name" stroke="var(--text-muted)" fontSize={12} width={120} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="points" fill="var(--primary)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}