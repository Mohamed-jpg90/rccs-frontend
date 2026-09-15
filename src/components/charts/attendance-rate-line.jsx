"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/UI/chart"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const chartConfig = {
  rate: {
    label: "Attendance Rate",
    color: "var(--primary)",
  },
}

export function AttendanceRateLine({ data }) {
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

  const monthly = data.monthlyAttendanceRate ?? []

  const chartData = monthly.map((item) => ({
    month: MONTHS[item._id.month - 1],
    year: item._id.year,
    rate: Number(item.rate?.toFixed(1) ?? 0),
    present: item.present,
    total: item.total,
  }))

  const hasEnoughData = chartData.length >= 2
  const last = chartData[chartData.length - 1]
  const prev = chartData[chartData.length - 2]

  let trendPercent = 0
  let trendDirection = "flat"
  if (hasEnoughData) {
    trendPercent = last.rate - prev.rate // فرق نقاط مئوية مباشر، أوضح من نسبة تغيّر النسبة نفسها
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
          Attendance Rate
        </h3>
        <p className="text-sm text-muted-foreground">{rangeLabel}</p>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center">
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-10 text-center text-sm text-muted-foreground">
            <p className="font-medium text-[var(--text-primary)]">
              Nothing to show yet
            </p>
            <p>Attendance rate will appear here once events have check-ins.</p>
          </div>
        ) : (
          <ChartContainer className="h-[250px] w-full" config={chartConfig}>
            <LineChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                axisLine={false}
                dataKey="month"
                tickFormatter={(value) => value.slice(0, 3)}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                width={40}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, item) => [
                      `${value}% (${item.payload.present}/${item.payload.total})`,
                      "Attendance Rate",
                    ]}
                  />
                }
                cursor={{ stroke: "var(--border)" }}
              />
              <Line
                dataKey="rate"
                type="monotone"
                stroke="var(--primary)"
                strokeWidth={2.5}
                dot={{ fill: "var(--primary)", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </div>

      {hasEnoughData && (
        <div className="flex flex-col items-start gap-1 border-t border-[var(--border)] pt-4 text-sm">
          <div className={`flex items-center gap-2 font-medium ${trendColor}`}>
            {trendDirection === "flat"
              ? "No change from last month"
              : `Trending ${trendDirection} by ${Math.abs(trendPercent).toFixed(1)} pts this month`}
            <TrendIcon className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing attendance rate for {rangeLabel}
          </div>
        </div>
      )}
    </div>
  )
}

export default AttendanceRateLine