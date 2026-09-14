'use client'

import { useEffect, useState } from 'react'
import BarSimple from "@/components/charts/bar-simple";
import DashboardStats from "@/components/analysis/DashboardStats";
import ClubFillRateChart from "@/components/charts/ClubFllRatechart";
import { apiClient } from '@/lib/api'
import AttendanceRateLine from '@/components/charts/attendance-rate-line';
import TopMembersChart from '@/components/analysis/TopMembersChart';
import TopMembersList from '@/components/analysis/TopMembersList';

export default function Page() {
  const [data, setData] = useState(null)
  const [topMembers, setTopMembers] = useState([])
  const [insights, setInsights] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      apiClient.get('/dashboard'),
      apiClient.get('/dashboard/top-members', { params: { limit: 20} }),
    ])
      .then(([dashboardRes, topMembersRes]) => {
        setData(dashboardRes.data)
        setTopMembers(topMembersRes.data?.topMembers ?? [])
        setInsights(topMembersRes.data?.insights ?? null)
      })
      .catch((err) => {
        console.error(err)
        setError('Could not load dashboard data.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return <div className="flex h-64 items-center justify-center text-sm text-[var(--danger)]">{error}</div>
  }

  return (
    <div className="flex gap-4 flex-col">
      <DashboardStats data={data} />
      <BarSimple data={data ?? []} />
      <AttendanceRateLine data={data ?? [] } />
      <ClubFillRateChart data={data ?? []} />

      <TopMembersChart members={topMembers} insights={insights} />
      <TopMembersList members={topMembers} />
    </div>
  )
}