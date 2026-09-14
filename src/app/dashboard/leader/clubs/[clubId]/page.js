'use client'

import React, { use, useCallback, useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import ClubHero from '@/components/clups/ClubHero'
import ClubStatsCards from '@/components/leader/ClubStatsCards'
import ClubAnalyticsCharts from '@/components/leader/ClubAnalyticsCharts'
import Top3Leaderboard from '@/components/leader/Top3Leaderboard'
import ClubMembersManageTable from '@/components/leader/ClubMembersManageTable'

const FILE_BASE_URL = 'http://localhost:5000'

export default function LeaderClubPage({ params }) {
  const { clubId } = use(params)

  const [club, setClub] = useState(null)
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [top3, setTop3] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    if (!clubId) return
    try {
      setIsLoading(true)
      setError(null)
      const [overviewRes, statsRes, analyticsRes, top3Res] = await Promise.all([
        apiClient.get(`/clubs/${clubId}/overview`),
        apiClient.get(`/clubs/${clubId}/stats`),
        apiClient.get(`/clubs/${clubId}/analytics`),
        apiClient.get(`/clubs/${clubId}/top3`),
      ])
      setClub(overviewRes.data?.club ?? null)
      setStats(statsRes.data ?? null)
      setAnalytics(analyticsRes.data ?? null)
      setTop3(top3Res.data?.top3 ?? [])
    } catch (err) {
      console.error(err)
      setError('Could not load club leadership data.')
    } finally {
      setIsLoading(false)
    }
  }, [clubId])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  if (error || !club) {
    return <div className="flex h-64 items-center justify-center text-sm text-[var(--danger)]">{error}</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <ClubHero club={club} baseUrl={FILE_BASE_URL} eventsCount={0} />
      <ClubStatsCards stats={stats} />
      <ClubAnalyticsCharts analytics={analytics} />
      <Top3Leaderboard top3={top3} baseUrl={FILE_BASE_URL} />
      <ClubMembersManageTable clubId={clubId} baseUrl={FILE_BASE_URL} />
    </div>
  )
}