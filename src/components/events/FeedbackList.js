'use client'

import React, { useState } from 'react'
import { MdStar, MdStarBorder, MdDeleteOutline, MdOutlineForum } from 'react-icons/md'
import { formatDate } from '@/lib/Format'
import ConfirmDeleteModal from '@/components/feedback/ConfirmDeleteModal'

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-[var(--primary)]">
      {Array.from({ length: 5 }).map((_, i) =>
        i < rating ? (
          <MdStar key={i} className="text-base" />
        ) : (
          <MdStarBorder key={i} className="text-base" />
        )
      )}
    </div>
  )
}

export default function FeedbackList({ feedback = [], total = 0, isAdmin = false, onDelete }) {
  const [deletingId, setDeletingId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null) // the feedback item awaiting confirmation

  const confirmDelete = async () => {
    if (!pendingDelete) return
    const id = pendingDelete._id
    try {
      setDeletingId(id)
      await onDelete(id)
    } finally {
      setDeletingId(null)
      setPendingDelete(null)
    }
  }

  const avgRating =
    feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : null

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Feedback</h3>
          <p className="text-sm text-muted-foreground">
            {total} response{total === 1 ? '' : 's'} from attendees
          </p>
        </div>
        {avgRating && (
          <div className="flex items-center gap-2 rounded-full bg-[var(--bg-hover)] px-3 py-1.5">
            <StarRow rating={Math.round(avgRating)} />
            <span className="text-sm font-semibold text-[var(--text-primary)]">{avgRating}</span>
          </div>
        )}
      </div>

      {feedback.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-muted-foreground">
          <MdOutlineForum className="text-3xl text-[var(--border)]" />
          <p className="font-medium text-[var(--text-primary)]">No feedback yet</p>
          <p>Feedback appears here once attendees submit it after the event ends.</p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-[var(--border)]">
          {feedback.map((item) => (
            <li key={item._id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <StarRow rating={item.rating} />
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {item.user?.fullName || 'Unknown user'}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.user?.email}</span>
                </div>
                {item.comment && (
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{item.comment}</p>
                )}
                <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setPendingDelete(item)}
                  disabled={deletingId === item._id}
                  className="shrink-0 rounded-full p-2 text-[var(--danger)] transition-opacity hover:bg-[var(--danger)]/10 disabled:opacity-50"
                  aria-label="Delete feedback"
                  title="Delete feedback"
                >
                  <MdDeleteOutline className="text-lg" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        deleting={deletingId === pendingDelete?._id}
        title="Delete Feedback"
        itemLabel={pendingDelete?.user?.fullName}
        description="This will permanently remove their feedback for this event. This action cannot be undone."
      />
    </div>
  )
}