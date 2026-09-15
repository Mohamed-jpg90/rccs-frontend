
'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { MdSearch, MdCheck,MdClose } from 'react-icons/md'
import toast from 'react-hot-toast'
import Modal from '@/components/shared/Modal'
import { apiClient } from '@/lib/api'

const FILE_BASE_URL = 'https://rccs-backend-production.up.railway.app'

export default function AssignBadgeToUserModal({
  isOpen,
  onClose,
  userId,
  earnedBadges = [],
  onAssigned,
}) {
  const [badges, setBadges] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [assigningId, setAssigningId] = useState(null)
  const [unassigningId, setUnassigningId] = useState(null)
  const [assignedBadges, setAssignedBadges] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isOpen) return

    setSearch('')
    setError(null)
    setIsLoading(true)

    // الداتا الحقيقية لبادچات اليوزر جاية من الـ overview مش من /badges
    setAssignedBadges(
      earnedBadges.map((entry) => entry.badge?._id).filter(Boolean)
    )

    apiClient
      .get('/badges')
      .then((res) => {
        setBadges(res.data?.badges ?? [])
      })
      .catch((err) => {
        console.error(err)
        const message = err.response?.data?.message ?? 'Could not load badges.'
        setError(message)
        toast.error(message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isOpen, userId, earnedBadges])


  const handleUnassign = async (badge) => {
    if (!window.confirm(`Remove "${badge.badgeName}" from this user?`)) return

    setUnassigningId(badge._id)
    setError(null)
    const toastId = toast.loading(`Removing ${badge.badgeName}...`)

    try {
      await apiClient.delete(`/badges/${badge._id}/assign`, { data: { userId } })

      setAssignedBadges((prev) => prev.filter((id) => id !== badge._id))

      toast.success(`${badge.badgeName} removed.`, { id: toastId })
      onAssigned?.() // يعيد تحميل بيانات البروفايل عند الأب
    } catch (err) {
      console.error(err)
      const message =
        err.response?.data?.message ?? 'Could not remove this badge. Please try again.'
      setError(message)
      toast.error(message, { id: toastId })
    } finally {
      setUnassigningId(null)
    }
  }

  const filteredBadges = useMemo(() => {
    const q = search.trim().toLowerCase()

    if (!q) return badges

    return badges.filter((badge) =>
      badge.badgeName?.toLowerCase().includes(q)
    )
  }, [badges, search])

  const handleAssign = async (badge) => {
    if (assignedBadges.includes(badge._id)) {
      toast('This user already has this badge.')
      return
    }

    setAssigningId(badge._id)
    setError(null)

    // Show loading toast
    const toastId = toast.loading(`Assigning ${badge.badgeName}...`)

    try {
      await apiClient.post(`/badges/${badge._id}/assign`, {
        userId,
      })

      // Mark badge as assigned
      setAssignedBadges((prev) => [...prev, badge._id])

      // Update loading toast to success
      toast.success(`${badge.badgeName} assigned successfully!`, {
        id: toastId,
      })

      // Notify parent
      onAssigned?.()
    } catch (err) {
      console.error(err)

      const message =
        err.response?.data?.message ??
        'Could not assign this badge. Please try again.'

      setError(message)

      // Update loading toast to error
      toast.error(message, {
        id: toastId,
      })
    } finally {
      setAssigningId(null)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign a Badge"
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-4">

        {/* Search */}
        <div className="relative">
          <MdSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[var(--text-muted)]" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search badges..."
            className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-main)] py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-[var(--danger)]">
            {error}
          </p>
        )}

        {/* Badges */}
        <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">

          {isLoading && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Loading badges...
            </p>
          )}

          {!isLoading && filteredBadges.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No badges found.
            </p>
          )}

          {!isLoading &&
            filteredBadges.map((badge) => {
              const isAssigning = assigningId === badge._id

              const isAssigned = assignedBadges.includes(badge._id)

              return (
                <div
                  key={badge._id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[var(--bg-hover)]"
                >

                  {/* Badge image */}
                  <img
                    src={`${FILE_BASE_URL}${badge.badgeImage}`}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />

                  {/* Badge information */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium text-[var(--text-primary)]">
                      {badge.badgeName}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {badge.points} pts
                    </span>
                  </div>

                  {/* Assigned */}
                  {isAssigned ? (
                    <button
                      type="button"
                      onClick={() => handleUnassign(badge)}
                      disabled={unassigningId === badge._id}
                      className="group flex shrink-0 items-center gap-1 rounded-full bg-[var(--success)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--success)] transition-colors hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {unassigningId === badge._id ? (
                        'Removing...'
                      ) : (
                        <>
                          <MdCheck className="text-sm group-hover:hidden" />
                          <MdClose className="hidden text-sm group-hover:inline" />
                          <span className="group-hover:hidden">Assigned</span>
                          <span className="hidden group-hover:inline">Unassign</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAssign(badge)}
                      disabled={assigningId === badge._id}
                      className="shrink-0 rounded-full bg-[var(--primary)] px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {assigningId === badge._id ? 'Assigning...' : 'Assign'}
                    </button>
                  )}
                </div>
              )
            })}
        </div>

        {/* Done */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)]"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  )
}

