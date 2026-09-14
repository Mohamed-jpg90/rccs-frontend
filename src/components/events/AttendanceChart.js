"use client"

import React from "react";
import { Pie, PieChart, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  present: { label: "Present", color: "var(--success, #22c55e)" },
  absent: { label: "Absent", color: "var(--danger, #ef4444)" },
  pending: { label: "Not checked in", color: "var(--border, #d4d4d8)" },
};

/**
 * AttendanceChart — donut chart breaking down registered participants
 * into Present / Absent / Not-yet-checked-in, with the overall
 * attendance rate shown in the center.
 *
 * Props:
 * - present:  count of participants marked Present
 * - absent:   count of participants marked Absent
 * - registered: total registered participants (from /participants)
 */
export default function AttendanceChart({ present = 0, absent = 0, registered = 0 }) {
  const checked = present + absent;
  const pending = Math.max(registered - checked, 0);
  const attendanceRate = registered > 0 ? Math.round((present / registered) * 100) : 0;

  const chartData = [
    { name: "present", label: "Present", value: present, fill: chartConfig.present.color },
    { name: "absent", label: "Absent", value: absent, fill: chartConfig.absent.color },
    { name: "pending", label: "Not checked in", value: pending, fill: chartConfig.pending.color },
  ].filter((d) => d.value > 0);

  const hasData = registered > 0;

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1 border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Attendance</h3>
        <p className="text-sm text-muted-foreground">
          {registered} registered participant{registered === 1 ? "" : "s"}
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1 py-10 text-center text-sm text-muted-foreground">
          <p className="font-medium text-[var(--text-primary)]">No registrations yet</p>
          <p>Attendance will show up here once people register.</p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="relative mx-auto h-[220px] w-[220px]">
            <ChartContainer className="h-full w-full" config={chartConfig}>
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name, item) => (
                        <span className="font-medium">
                          {item.payload.label}: {value}
                        </span>
                      )}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={60}
                  outerRadius={90}
                  strokeWidth={4}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* Center readout, absolutely centered over the donut hole */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[var(--text-primary)]">
                {attendanceRate}%
              </span>
              <span className="text-xs text-muted-foreground">attendance rate</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            {chartData.map((entry) => (
              <span key={entry.name} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                />
                {entry.label} ({entry.value})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}