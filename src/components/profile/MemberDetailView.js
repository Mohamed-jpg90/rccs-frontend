'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { isAdmin, isTeamLeader, getUser } from '@/lib/auth'
import ProfileHero from '@/components/profile/ProfileHero'
import PointsHistory from '@/components/profile/PointsHistory'
import CertificatesGrid from '@/components/profile/CertificatesGrid'
import AddPointsModal from '@/components/profile/AddPointsModal'
import ProfileKpiChart from '@/components/profile/ProfileKpiChart'
import ProfileClubCard from '@/components/profile/ProfileClubCard'
import EventRegistrationsList from '@/components/profile/EventRegistrationsList'
import EarnedBadgesGrid from '@/components/profile/EarnedBadgesGrid'
import AssignBadgeToUserModal from '@/components/profile/AssignBadgeToUserModal'
import CertificateUploadModal from '@/components/profile/CertificateUploadModal'
import MyClubRequests from '@/components/profile/MyClubRequests'
import { MdAdd, MdCardMembership } from 'react-icons/md'
import ProfileHeader from '../userProfile/ProfileHeader'
import KpiSection from '@/components/userProfile/KpiSection'

const FILE_BASE_URL = 'http://localhost:5000'

export default function MemberDetailView({ userId }) {
  const [user, setUser] = useState(null)
  const [club, setClub] = useState(null)
  const [eventRegistrations, setEventRegistrations] = useState([])
  const [kpi, setKpi] = useState(null)
  const [points, setPoints] = useState([])
  const [earnedBadges, setEarnedBadges] = useState([])
  const [certificates, setCertificates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [addPointsOpen, setAddPointsOpen] = useState(false)
  const [assignBadgeOpen, setAssignBadgeOpen] = useState(false)
  const [addCertificateOpen, setAddCertificateOpen] = useState(false)

  const [viewerIsAdmin, setViewerIsAdmin] = useState(false)
  // Confirmed via user_routes.js: POST /users/:id/points allows Team Leader too.
  const [viewerCanAddPoints, setViewerCanAddPoints] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    const admin = isAdmin()
    setViewerIsAdmin(admin || isTeamLeader())
    setViewerCanAddPoints(admin || isTeamLeader())
    const currentUser = getUser()
    setIsOwnProfile(currentUser?._id === userId)
  }, [userId])

  const fetchAll = useCallback(async () => {
    if (!userId) return
    try {
      setIsLoading(true)
      setError(null)

      const [overviewRes, certsRes] = await Promise.all([
        apiClient.get(`/users/${userId}/overview`),
        apiClient.get(`/users/${userId}/certificates`).catch(() => ({ data: { certificates: [] } })),
      ])

      const d = overviewRes.data
      setUser(d?.user ?? null)
      setClub(d?.club ?? null)
      setEventRegistrations(d?.eventRegistrations ?? [])
      setKpi(d?.kpi ?? null)
      setPoints(d?.points?.history ?? [])
      setEarnedBadges(d?.badges?.earnedBadges ?? [])
      setCertificates(certsRes.data?.certificates ?? [])
    } catch (err) {
      console.error(err)
      setError('Could not load this profile.')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

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

  if (error || !user) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--danger)]">
        {error ?? 'Profile not found.'}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <ProfileHeader user={user} baseUrl={FILE_BASE_URL} />
      
    {/* <ProfileKpiChart kpi={kpi} /> */}

      {(viewerCanAddPoints || viewerIsAdmin) && (
        <div className="flex flex-wrap justify-end gap-3">
          {viewerCanAddPoints && (
            <button
              type="button"
              onClick={() => setAddPointsOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              <MdAdd className="text-sm" />
              Add Points
            </button>
          )}
          {viewerIsAdmin && (
            <>
              <button
                type="button"
                onClick={() => setAssignBadgeOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                <MdAdd className="text-sm" />
                Assign Badge
              </button>
              <button
                type="button"
                onClick={() => setAddCertificateOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                <MdCardMembership className="text-sm" />
                Add Certificate
              </button>
            </>
          )}
        </div>
      )}
      <KpiSection kpi={kpi} />
      <ProfileKpiChart kpi={kpi} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProfileClubCard club={club} />
        <EventRegistrationsList registrations={eventRegistrations} />
      </div>

      <EarnedBadgesGrid earnedBadges={earnedBadges} baseUrl={FILE_BASE_URL} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PointsHistory points={points} />
        <CertificatesGrid certificates={certificates} baseUrl={FILE_BASE_URL} />
      </div>

      {isOwnProfile && <MyClubRequests />}

      {viewerCanAddPoints && (
        <AddPointsModal
          isOpen={addPointsOpen}
          onClose={() => setAddPointsOpen(false)}
          userId={userId}
          onSaved={fetchAll}
        />
      )}

      {viewerIsAdmin && (
        <>
          <AssignBadgeToUserModal
            isOpen={assignBadgeOpen}
            onClose={() => setAssignBadgeOpen(false)}
            userId={userId}
            earnedBadges={earnedBadges}
            onAssigned={fetchAll}
          />
          <CertificateUploadModal
            isOpen={addCertificateOpen}
            onClose={() => setAddCertificateOpen(false)}
            userId={userId}
            onSaved={fetchAll}
          />
        </>
      )}
    </div>
  )
}