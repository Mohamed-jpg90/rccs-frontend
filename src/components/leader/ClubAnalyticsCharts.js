'use client'

import React from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/UI/chart'

const growthConfig = { count: { label: 'Members', color: 'var(--primary)' } }
const attendanceConfig = {
  present: { label: 'Present', color: 'var(--success, #22c55e)' },
  absent: { label: 'Absent', color: 'var(--danger, #ef4444)' },
}
const pointsConfig = { count: { label: 'Members', color: 'var(--primary)' } }

export default function ClubAnalyticsCharts({ analytics }) {
  if (!analytics) return null

  const { monthlyMemberGrowth = [], eventAttendance = [], pointsDistribution = [] } = analytics

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
        <h3 className="mb-4 border-b border-[var(--border)] pb-4 text-lg font-semibold text-[var(--text-primary)]">
          Member Growth
        </h3>
        {monthlyMemberGrowth.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No growth data yet.</p>
        ) : (
          <ChartContainer className="h-56 w-full" config={growthConfig}>
            <LineChart data={monthlyMemberGrowth}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
        <h3 className="mb-4 border-b border-[var(--border)] pb-4 text-lg font-semibold text-[var(--text-primary)]">
          Event Attendance
        </h3>
        {eventAttendance.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No event attendance data yet.</p>
        ) : (
          <ChartContainer className="h-56 w-full" config={attendanceConfig}>
            <BarChart data={eventAttendance}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="eventTitle" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="present" fill={attendanceConfig.present.color} radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill={attendanceConfig.absent.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm lg:col-span-2">
        <h3 className="mb-4 border-b border-[var(--border)] pb-4 text-lg font-semibold text-[var(--text-primary)]">
          Points Distribution
        </h3>
        {pointsDistribution.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No points data yet.</p>
        ) : (
          <ChartContainer className="h-56 w-full" config={pointsConfig}>
            <BarChart data={pointsDistribution}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="range" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </div>
    </div>
  )
}