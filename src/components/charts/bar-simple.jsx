"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/UI/chart"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const chartConfig = {
  users: {
    label: "New Users",
    color: "var(--primary)",
  },
}

export function BarSimple({ data }) {
  // Guard FIRST — reading data.monthlyUserGrowth before this check
  // would throw if `data` hasn't loaded yet.
  if (!data) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
          Loading chart...
        </div>
      </div>
    )
  }

  const growth = data.monthlyUserGrowth ?? []

  const chartData = growth.map((item) => ({
    month: MONTHS[item._id.month - 1],
    year: item._id.year,
    users: item.count,
  }))

  const hasEnoughData = chartData.length >= 2
  const last = chartData[chartData.length - 1]
  const prev = chartData[chartData.length - 2]

  let trendPercent = 0
  let trendDirection = "flat"
  if (hasEnoughData) {
    if (prev.users === 0) {
      trendPercent = last.users > 0 ? 100 : 0
    } else {
      trendPercent = ((last.users - prev.users) / prev.users) * 100
    }
    trendDirection = trendPercent > 0 ? "up" : trendPercent < 0 ? "down" : "flat"
  }

  const rangeLabel = chartData.length
    ? chartData.length === 1
      ? `${chartData[0].month} ${chartData[0].year}`
      : `${chartData[0].month} ${chartData[0].year} - ${last.month} ${last.year}`
    : "No data yet"

  const TrendIcon =
    trendDirection === "up" ? TrendingUp : trendDirection === "down" ? TrendingDown : Minus

  const trendColor =
    trendDirection === "up"
      ? "text-[var(--success)]"
      : trendDirection === "down"
      ? "text-[var(--danger)]"
      : "text-muted-foreground"

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1 border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          User Growth
        </h3>
        <p className="text-sm text-muted-foreground">{rangeLabel}</p>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center">
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-10 text-center text-sm text-muted-foreground">
            <p className="font-medium text-[var(--text-primary)]">
              Nothing to show yet
            </p>
            <p>User growth will appear here once signups start coming in.</p>
          </div>
        ) : (
          <ChartContainer className="h-[250px] w-full" config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <defs>
                <linearGradient id="userGrowthFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity={0.55}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                axisLine={false}
                dataKey="month"
                tickFormatter={(value) => value.slice(0, 3)}
                tickLine={false}
                tickMargin={10}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={{ fill: "var(--bg-hover)" }} />
              <Bar
                dataKey="users"
                fill="url(#userGrowthFill)"
                radius={[8, 8, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ChartContainer>
        )}
      </div>

      {hasEnoughData && (
        <div className="flex flex-col items-start gap-1 border-t border-[var(--border)] pt-4 text-sm">
          <div className={`flex items-center gap-2 font-medium ${trendColor}`}>
            {trendDirection === "flat"
              ? "No change from last month"
              : `Trending ${trendDirection} by ${Math.abs(trendPercent).toFixed(1)}% this month`}
            <TrendIcon className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing new users for {rangeLabel}
          </div>
        </div>
      )}
    </div>
  )
}

export default BarSimple