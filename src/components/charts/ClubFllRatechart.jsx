"use client"

import { Users } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  fillRate: {
    label: "Fill rate",
    color: "var(--primary)",
  },
}

// Color the bar by how full the club is, using your design tokens
// with sensible fallbacks if a token isn't defined.
function fillColor(rate) {
  if (rate >= 80) return "var(--success, #22c55e)"
  if (rate >= 40) return "var(--warning, #f59e0b)"
  return "var(--danger, #ef4444)"
}

export function ClubFillRateChart({ data }) {
  if (!data) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  const clubs = data.clubStatistics ?? []

  const chartData = clubs.map((club) => ({
    id: club._id,
    name: club.clubName,
    fillRate: Math.round(club.fillRate),
    current: club.currentMembersCount,
    max: club.maxMembers,
  }))

  // Taller chart as more clubs are added, so bars don't get squished.
  const chartHeight = Math.max(200, chartData.length * 56)

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2 border-b border-[var(--border)] pb-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Club Capacity
          </h3>
          <p className="text-sm text-muted-foreground">
            Fill rate by club
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-medium text-[var(--primary)]">
          <Users className="h-3.5 w-3.5" />
          {clubs.length} {clubs.length === 1 ? "club" : "clubs"}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1 py-10 text-center text-sm text-muted-foreground">
          <p className="font-medium text-[var(--text-primary)]">No clubs yet</p>
          <p>Club capacity will show up here once clubs are created.</p>
        </div>
      ) : (
        <ChartContainer
          className="w-full"
          style={{ height: chartHeight }}
          config={chartConfig}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 8, right: 24 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              width={110}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--bg-hover)" }}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) => (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-[var(--text-primary)]">
                        {item.payload.name}
                      </span>
                      <span className="text-muted-foreground">
                        {item.payload.current} / {item.payload.max} members ·{" "}
                        {value}%
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey="fillRate" radius={[0, 8, 8, 0]} maxBarSize={28}>
              {chartData.map((entry) => (
                <Cell key={entry.id} fill={fillColor(entry.fillRate)} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </div>
  )
}

export default ClubFillRateChart