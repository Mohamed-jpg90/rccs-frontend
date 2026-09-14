'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
  value: { label: 'Count', color: 'var(--primary)' },
}

/**
 * ProfileKpiChart — bar chart of the count-based KPIs from
 * /users/:id/overview's `kpi` object. participationRate (a %) and
 * totalPoints are shown separately as stat numbers, not bars, since
 * mixing a percentage into a count-based bar chart would misrepresent scale.
 */
export default function ProfileKpiChart({ kpi }) {
  if (!kpi) return null

  const data = [
    { label: 'Registered', value: kpi.totalEventsRegistered ?? 0 },
    { label: 'Present', value: kpi.totalPresent ?? 0 },
    { label: 'Absent', value: kpi.totalAbsent ?? 0 },
    { label: 'Badges', value: kpi.totalBadgesEarned ?? 0 },
  ]

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Activity Overview</h3>
        <div className="flex gap-4 text-sm">
          <span className="text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--primary)]">{kpi.participationRate ?? 0}%</span> participation
          </span>
          <span className="text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--primary)]">{kpi.totalPoints ?? 0}</span> points
          </span>
        </div>
      </div>

      <ChartContainer className="h-56 w-full" config={chartConfig}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}