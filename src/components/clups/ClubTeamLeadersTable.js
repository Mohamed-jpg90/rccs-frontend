'use client'

import React, { useState, useEffect } from 'react'
import { MdAdd, MdPersonRemove } from 'react-icons/md'
import { formatDateTime } from '@/lib/Format'
import { apiClient } from '@/lib/api'
import AssignTeamLeaderModal from '@/components/shared/AssignTeamLeaderModal'
import ConfirmDeleteDialog from '@/components/shared/ConfirmDeleteDialog'

/**
 * ClubTeamLeadersTable — reads the `teamLeader` field (not `user`) per
 * your actual API shape. Handles three cases per record:
 * - teamLeader is a populated object -> render directly
 * - teamLeader is a raw ID string     -> fetch via GET /users/:id
 * - teamLeader is null                -> backend populate didn't match
 *   (likely filtered by current role); show a placeholder instead of
 *   crashing, since there's no ID to look up in this case.
 */
export default function ClubTeamLeadersTable({ clubId, teamLeaders = [], onChanged }) {
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [removingLeader, setRemovingLeader] = useState(null)
  const [resolvedUsers, setResolvedUsers] = useState({}) // id -> user, for raw-ID entries

  // For any record where `teamLeader` came back as a plain ID string
  // (not an object), fetch that user's info so we can still show a name.
  useEffect(() => {
    const idsToFetch = teamLeaders
      .map((t) => t.teamLeader)
      .filter((t) => typeof t === 'string' && !resolvedUsers[t])

    if (idsToFetch.length === 0) return

    idsToFetch.forEach((id) => {
      apiClient
        .get(`/users/${id}`)
        .then((res) => {
          setResolvedUsers((prev) => ({ ...prev, [id]: res.data?.user ?? null }))
        })
        .catch((err) => {
          console.error(`Failed to fetch user ${id}`, err)
          setResolvedUsers((prev) => ({ ...prev, [id]: null }))
        })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamLeaders])

  const getUserInfo = (leader) => {
    if (leader.teamLeader && typeof leader.teamLeader === 'object') {
      return leader.teamLeader // already populated
    }
    if (typeof leader.teamLeader === 'string') {
      return resolvedUsers[leader.teamLeader] // resolved via /users/:id, or undefined while loading
    }
    return null // truly null from the backend — nothing to fetch
  }

  const existingIds = teamLeaders
    .map((t) => (typeof t.teamLeader === 'object' ? t.teamLeader?._id : t.teamLeader))
    .filter(Boolean)

  const handleAssigned = () => {
    onChanged?.()
  }

  const handleRemove = async () => {
    if (!removingLeader) return
    const userId =
      typeof removingLeader.teamLeader === 'object'
        ? removingLeader.teamLeader?._id
        : removingLeader.teamLeader
    if (!userId) {
      // Can't remove a reference the backend already returned as null —
      // nothing to send to the DELETE endpoint. Surface this instead of
      // silently failing.
      console.error('Cannot remove: this record has no resolvable user id.')
      return
    }
    await apiClient.delete(`/clubs/${clubId}/team-leaders/${userId}`)
    onChanged?.()
  }

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Team Leaders</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {teamLeaders.length} leader{teamLeaders.length === 1 ? '' : 's'}
          </span>
          <button
            type="button"
            onClick={() => setAssignModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            <MdAdd className="text-sm" />
            Add Team Leader
          </button>
        </div>
      </div>

      {teamLeaders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-sm text-muted-foreground">
          <p className="font-medium text-[var(--text-primary)]">No team leaders yet</p>
          <p>Assign a member to lead this club using the button above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">User</th>
                <th className="py-2 pr-4 font-medium">Assigned</th>
                <th className="py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {teamLeaders.map((leader) => {
                const userInfo = getUserInfo(leader)
                const isLoadingUser = typeof leader.teamLeader === 'string' && userInfo === undefined

                return (
                  <tr
                    key={leader._id}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]"
                  >
                    <td className="py-3 pr-4">
                      {isLoadingUser ? (
                        <span className="text-xs text-muted-foreground">Loading...</span>
                      ) : userInfo ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-[var(--text-primary)]">
                            {userInfo.fullName ?? 'Unknown'}
                          </span>
                          {userInfo.email && (
                            <span className="text-xs text-muted-foreground">{userInfo.email}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs italic text-muted-foreground">
                          User no longer available (role may have changed)
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-[var(--text-secondary)]">
                      {leader.assignedAt ? formatDateTime(leader.assignedAt) : '—'}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setRemovingLeader(leader)}
                        className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/10"
                      >
                        <MdPersonRemove className="text-sm" />
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <AssignTeamLeaderModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        clubId={clubId}
        existingIds={existingIds}
        onAssigned={handleAssigned}
      />

      <ConfirmDeleteDialog
        isOpen={!!removingLeader}
        title="Remove team leader?"
        itemName={getUserInfo(removingLeader ?? {})?.fullName}
        description={
          removingLeader
            ? `This removes this assignment from the Team Leader role for this club.`
            : undefined
        }
        onClose={() => setRemovingLeader(null)}
        onConfirm={handleRemove}
      />
    </div>
  )
}