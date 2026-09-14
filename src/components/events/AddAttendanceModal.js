'use client'

import React, { useMemo, useState } from 'react'
import { FaSearch, FaCheckCircle } from 'react-icons/fa'
import Modal from '@/components/shared/Modal'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'

/**
 * AddAttendanceModal — search confirmed registrants for this event and
 * mark one present. Only shows registrations with status Approved or
 * Registered (Pending/Rejected people haven't been cleared to attend).
 *
 * Props:
 * - isOpen, onClose
 * - eventId
 * - registrations: the event's registrations array (already loaded by the parent)
 * - attendance: the event's attendance array (already loaded by the parent) —
 *   used to grey out people already checked in
 * - onMarked(attendanceRecord): called after a successful mark, so the
 *   parent can append it to its attendance state without refetching
 */
export default function AddAttendanceModal({ isOpen, onClose, eventId, registrations = [], attendance = [], onMarked }) {
  const [search, setSearch] = useState('')
  const [markingId, setMarkingId] = useState(null)

  const attendedUserIds = useMemo(
    () => new Set(attendance.map((a) => (typeof a.user === 'string' ? a.user : a.user?._id))),
    [attendance]
  )

  const eligible = useMemo(() => {
    return registrations
      .filter((r) => r.status === 'Approved' || r.status === 'Registered')
      .filter((r) => {
        const q = search.trim().toLowerCase()
        if (!q) return true
        return r.user?.fullName?.toLowerCase().includes(q) || r.user?.email?.toLowerCase().includes(q)
      })
  }, [registrations, search])

const markPresent = async (reg) => {
  setMarkingId(reg.user._id)
  try {
    const res = await apiClient.post(`/events/${eventId}/attendance`, {
      userId: reg.user._id,
      attendanceStatus: 'Present',
    })
    const record = res.data?.attendance ?? res.data
    // POST بيرجع user كـ id string مش populated — بنستخدم reg.user
    // اللي عندنا فعلاً عشان الجدول يعرض الاسم والايميل فورًا من غير refetch.
    const enriched = { ...record, user: reg.user }
    toast.success(`${reg.user.fullName} marked present`)
    onMarked?.(enriched)
  } catch (err) {
    toast.error(err.response?.data?.message || 'Could not mark attendance')
  } finally {
    setMarkingId(null)
  }
}

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Attendance">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-main)] text-sm focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
          {eligible.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No matching registrants.</p>
          ) : (
            eligible.map((reg) => {
              const alreadyPresent = attendedUserIds.has(reg.user._id)
              return (
                <div
                  key={reg._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">{reg.user.fullName}</p>
                    <p className="truncate text-xs text-muted-foreground">{reg.user.email}</p>
                  </div>
                  {alreadyPresent ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-[var(--success)]">
                      <FaCheckCircle /> Present
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markPresent(reg)}
                      disabled={markingId === reg.user._id}
                      className="rounded-full bg-[var(--primary)] px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {markingId === reg.user._id ? 'Marking...' : 'Mark Present'}
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </Modal>
  )
}