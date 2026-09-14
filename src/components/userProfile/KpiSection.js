"use client";

import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { FaCalendarCheck, FaCheckCircle, FaTimesCircle, FaAward } from "react-icons/fa";

export default function KpiSection({ kpi }) {
  if (!kpi) return null;

  const chartData = [
    { value: kpi.participationRate, fill: "var(--primary)" },
  ];

  const stats = [
    { icon: FaCalendarCheck, label: "Registered", value: kpi.totalEventsRegistered },
    { icon: FaCheckCircle, label: "Present", value: kpi.totalPresent },
    { icon: FaTimesCircle, label: "Absent", value: kpi.totalAbsent },
    { icon: FaAward, label: "Badges Earned", value: kpi.totalBadgesEarned },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
        Performance
      </span>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-10">
        Your KPIs
      </h2>

      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        {/* Radial gauge */}
        <div className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] p-6 flex flex-col items-center justify-center">
          <div className="relative w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="72%"
                outerRadius="100%"
                data={chartData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: "var(--bg-hover)" }}
                  dataKey="value"
                  cornerRadius={20}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-semibold text-[var(--text-primary)]">
                {kpi.participationRate}%
              </span>
              <span className="text-xs text-[var(--text-muted)] mt-1">
                Participation
              </span>
            </div>
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] p-6 flex flex-col justify-between"
            >
              <div className="h-10 w-10 rounded-full bg-[var(--primary-light)] flex items-center justify-center mb-4">
                <stat.icon className="text-[var(--primary)]" />
              </div>
              <div>
                <div className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                  {stat.value ?? 0}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}