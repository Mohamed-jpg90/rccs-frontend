'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { MdGroups, MdWorkspacePremium, MdSearch } from 'react-icons/md'
import { apiClient } from '@/lib/api'
import SummaryCard from '@/components/shared/SummaryCard'
import ClubCard from '@/components/clups/ClubCard'
import BadgeCard from '@/components/badges/BadgeCard'
import ClubFormModal from '@/components/clups/ClubFormModal'
import BadgeFormModal from '@/components/badges/BadgeFormModal'
import AssignBadgeModal from '@/components/badges/AssignBadgeModal'
import ConfirmDeleteDialog from '@/components/shared/ConfirmDeleteDialog'
import { useRouter } from 'next/navigation'

const BASE_URL = 'http://localhost:5000'

export default function ClubsAndBadgesPage() {
  const router = useRouter()

  const [clubs, setClubs] = useState([])
  const [badges, setBadges] = useState([])
  const [loadingClubs, setLoadingClubs] = useState(true)
  const [loadingBadges, setLoadingBadges] = useState(true)

  const [clubSearch, setClubSearch] = useState('')
  const [badgeSearch, setBadgeSearch] = useState('')

  const [clubModalOpen, setClubModalOpen] = useState(false)
  const [editingClub, setEditingClub] = useState(null)
  const [deletingClub, setDeletingClub] = useState(null)

  const [badgeModalOpen, setBadgeModalOpen] = useState(false)
  const [editingBadge, setEditingBadge] = useState(null)
  const [deletingBadge, setDeletingBadge] = useState(null)
  const [assigningBadge, setAssigningBadge] = useState(null)

  const fetchClubs = () => {
    setLoadingClubs(true)
    apiClient
      .get('/clubs')
      .then((res) => setClubs(res.data?.clubs ?? []))
      .catch((err) => console.error('Failed to load clubs', err))
      .finally(() => setLoadingClubs(false))
  }

  const fetchBadges = () => {
    setLoadingBadges(true)
    apiClient
      .get('/badges')
      .then((res) => setBadges(res.data?.badges ?? []))
      .catch((err) => console.error('Failed to load badges', err))
      .finally(() => setLoadingBadges(false))
  }

  useEffect(() => {
    fetchClubs()
    fetchBadges()
  }, [])

  const filteredClubs = useMemo(
    () => clubs.filter((c) => c.clubName?.toLowerCase().includes(clubSearch.trim().toLowerCase())),
    [clubs, clubSearch]
  )

  const filteredBadges = useMemo(
    () => badges.filter((b) => b.badgeName?.toLowerCase().includes(badgeSearch.trim().toLowerCase())),
    [badges, badgeSearch]
  )

  const handleDeleteClub = async () => {
    if (!deletingClub) return
    try {
      await apiClient.delete(`/clubs/${deletingClub._id}`)
      setClubs((prev) => prev.filter((c) => c._id !== deletingClub._id))
    } catch (err) {
      console.error('Failed to delete club', err)
    } finally {
      setDeletingClub(null)
    }
  }

  const handleDeleteBadge = async () => {
    if (!deletingBadge) return
    try {
      await apiClient.delete(`/badges/${deletingBadge._id}`)
      setBadges((prev) => prev.filter((b) => b._id !== deletingBadge._id))
    } catch (err) {
      console.error('Failed to delete badge', err)
    } finally {
      setDeletingBadge(null)
    }
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Summary row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-1">
          {/* Clubs */}
          <SummaryCard
            icon={MdGroups}
            title="Total Clubs"
            total={clubs.length}
            onAddClick={() => {
              setEditingClub(null)
              setClubModalOpen(true)
            }}
            buttonTitle="Add Club"
          />
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Clubs</h2>

            <div className="relative">
              <MdSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[var(--text-muted)]" />
              <input
                type="text"
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
                placeholder="Search clubs..."
                className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-main)] py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 ">
              {loadingClubs && <p className="text-sm text-[var(--text-muted)]">Loading clubs...</p>}
              {!loadingClubs && filteredClubs.length === 0 && (
                <p className="text-sm text-[var(--text-muted)]">No clubs found.</p>
              )}
              {filteredClubs.map((club) => (
                <ClubCard
                  key={club._id}
                  club={club}
                  baseUrl={BASE_URL}
                  onClick={() => router.push(`clubs/${club._id}`)}
                  onEdit={(c) => { setEditingClub(c); setClubModalOpen(true) }}
                  onDelete={(c) => setDeletingClub(c)}
                />
              ))}
            </div>
          </section>

          <SummaryCard
            icon={MdWorkspacePremium}
            title="Total Badges"
            total={badges.length}
            onAddClick={() => {
              setEditingBadge(null)
              setBadgeModalOpen(true)
            }}
            buttonTitle="Add Badge"
          />
          {/* Badges */}
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Badges</h2>

            <div className="relative">
              <MdSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[var(--text-muted)]" />
              <input
                type="text"
                value={badgeSearch}
                onChange={(e) => setBadgeSearch(e.target.value)}
                placeholder="Search badges..."
                className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-main)] py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 ">
              {loadingBadges && <p className="text-sm text-[var(--text-muted)]">Loading badges...</p>}
              {!loadingBadges && filteredBadges.length === 0 && (
                <p className="text-sm text-[var(--text-muted)]">No badges found.</p>
              )}
              {filteredBadges.map((badge) => (
                <BadgeCard
                  key={badge._id}
                  badge={badge}
                  baseUrl={BASE_URL}
                  onEdit={(b) => {
                    setEditingBadge(b)
                    setBadgeModalOpen(true)
                  }}
                  onDelete={(b) => setDeletingBadge(b)}
                  onAssign={(b) => setAssigningBadge(b)}
                />
              ))}
            </div>
          </section>
        </div>

      </div>

      {/* Split panels: clubs left half, badges right half */}


      {/* Modals */}
      <ClubFormModal
        isOpen={clubModalOpen}
        club={editingClub}
        onClose={() => setClubModalOpen(false)}
        onSaved={fetchClubs}
      />
      <BadgeFormModal
        isOpen={badgeModalOpen}
        badge={editingBadge}
        onClose={() => setBadgeModalOpen(false)}
        onSaved={fetchBadges}
      />
      <AssignBadgeModal
        isOpen={!!assigningBadge}
        badge={assigningBadge}
        onClose={() => setAssigningBadge(null)}
      />
      <ConfirmDeleteDialog
        isOpen={!!deletingClub}
        itemName={deletingClub?.clubName}
        onClose={() => setDeletingClub(null)}
        onConfirm={handleDeleteClub}
      />
      <ConfirmDeleteDialog
        isOpen={!!deletingBadge}
        itemName={deletingBadge?.badgeName}
        onClose={() => setDeletingBadge(null)}
        onConfirm={handleDeleteBadge}
      />
    </div>
  )
}