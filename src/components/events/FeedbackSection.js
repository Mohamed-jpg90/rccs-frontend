'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaTrashAlt, FaRegCommentDots } from 'react-icons/fa'
import StarRating from '@/components/events/StarRating'
import ConfirmDeleteModal from '@/components/feedback/ConfirmDeleteModal'
import { apiClient } from '@/lib/api'

/**
 * Props:
 * - eventId
 * - feedback: array of { _id, rating, comment, createdAt, user: { _id, fullName, email } }
 * - currentUserId
 * - canLeaveFeedback: boolean — user attended (Present) and hasn't left feedback yet
 * - onFeedbackAdded: (feedback) => void
 * - onFeedbackDeleted: (feedbackId) => void
 */
export default function FeedbackSection({
  eventId,
  feedback = [],
  currentUserId,
  canLeaveFeedback,
  onFeedbackAdded,
  onFeedbackDeleted,
}) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null) // the feedback item awaiting confirmation

  const myFeedback = feedback.find(
    (f) => String(f.user?._id || f.user) === String(currentUserId)
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) {
      toast.error('Please select a rating')
      return
    }
    setSubmitting(true)
    try {
      const res = await apiClient.post(`/events/${eventId}/feedback`, { rating, comment })
      onFeedbackAdded(res.data.feedback)
      setRating(0)
      setComment('')
      toast.success('Thanks for your feedback!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    const feedbackId = pendingDelete._id
    setDeletingId(feedbackId)
    try {
      await apiClient.delete(`/events/${eventId}/feedback/${feedbackId}`)
      onFeedbackDeleted(feedbackId)
      toast.success('Feedback removed')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete feedback')
    } finally {
      setDeletingId(null)
      setPendingDelete(null)
    }
  }

  return (
    <section className="mt-10 rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] p-6 md:p-8">
      <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-1">
        Attendee Feedback
      </h2>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        {feedback.length} response{feedback.length === 1 ? '' : 's'}
      </p>

      {/* Leave feedback — only if attended and hasn't submitted yet */}
      {canLeaveFeedback && !myFeedback && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-main)] p-5"
        >
          <p className="text-sm font-medium text-[var(--text-primary)] mb-3">
            You attended this event — share your feedback
          </p>
          <StarRating value={rating} onChange={setRating} size="text-2xl" />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think? (optional)"
            rows={3}
            className="mt-4 w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-white)] px-6 py-2.5 text-sm font-medium transition-all disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      )}

      {/* List */}
      {feedback.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <FaRegCommentDots className="text-3xl text-[var(--border)]" />
          <p className="text-sm font-medium text-[var(--text-primary)]">No feedback yet</p>
          <p className="text-xs text-[var(--text-muted)]">
            Feedback from attendees will show up here once the event ends.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-[var(--border-light)]">
          {feedback.map((item) => {
            const isMine = String(item.user?._id) === String(currentUserId)
            return (
              <li key={item._id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <StarRating value={item.rating} readOnly />
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {item.user?.fullName || 'Unknown user'}
                      {isMine && (
                        <span className="ml-1.5 text-xs font-normal text-[var(--primary)]">(you)</span>
                      )}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">{item.user?.email}</span>
                  </div>
                  {item.comment && (
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{item.comment}</p>
                  )}
                  <span className="text-xs text-[var(--text-muted)]">
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {isMine && (
                  <button
                    type="button"
                    onClick={() => setPendingDelete(item)}
                    disabled={deletingId === item._id}
                    className="shrink-0 rounded-full p-2 text-[var(--danger)] transition-opacity hover:bg-[var(--danger-bg)] disabled:opacity-50"
                    aria-label="Delete your feedback"
                    title="Delete your feedback"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        deleting={deletingId === pendingDelete?._id}
        title="Delete Your Feedback"
        description="You can submit new feedback for this event afterward if you'd like. This action cannot be undone."
      />
    </section>
  )
}