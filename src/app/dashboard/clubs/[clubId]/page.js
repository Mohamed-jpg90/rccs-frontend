'use client'
import { useCallback } from 'react'
import React, { use, useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import ClubHero from '@/components/clups/ClubHero'
import ClubMembersTable from '@/components/clups/ClubMembersTable'
import ClubItemsTable from '@/components/clups/ClubItemsTable'
import DataCard from '@/components/analysis/DataCard'
import { MdOutlinePeople, MdCheckCircle, MdArticle } from 'react-icons/md'
import ClubTeamLeadersTable from '@/components/clups/ClubTeamLeadersTable'
import ClubJoinRequestsTable from '@/components/clups/ClubJoinRequestsTable'

const FILE_BASE_URL = 'http://localhost:5000'

export default function ClubDetailPage({ params }) {
  const { clubId } = use(params)

  const [club, setClub] = useState(null)
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [teamLeaders, setTeamLeaders] = useState([])
  const [content, setContent] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    if (!clubId) return
    try {
      setIsLoading(true)
      setError(null)
      const res = await apiClient.get(`/clubs/${clubId}/overview`)
      setClub(res.data?.club ?? null)
      setMembers(res.data?.members ?? [])
      setEvents(res.data?.events ?? [])
      setTeamLeaders(res.data?.teamLeaders ?? [])
      setContent(res.data?.content ?? [])
    } catch (err) {
      console.error(err)
      setError('Could not load club details.')
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

  if (error) {
    return <div className="flex h-64 items-center justify-center text-sm text-[var(--danger)]">{error}</div>
  }

  if (!club) return null

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <ClubHero club={club} baseUrl={FILE_BASE_URL} eventsCount={events.length} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DataCard icon={MdOutlinePeople} label="Members" value={members.length} />
        <DataCard icon={MdCheckCircle} label="Team Leaders" value={teamLeaders.length} />
        <DataCard icon={MdArticle} label="Content" value={content.length} />
      </div>

      <ClubJoinRequestsTable clubId={clubId} onChanged={fetchAll} />
      <ClubMembersTable clubId={clubId} title="Members" members={members} onChanged={fetchAll} />
      <ClubTeamLeadersTable clubId={clubId} teamLeaders={teamLeaders} onChanged={fetchAll} />
      <ClubItemsTable type="events" items={events} />
      <ClubItemsTable type="content" items={content} />
    </div>
  )
}