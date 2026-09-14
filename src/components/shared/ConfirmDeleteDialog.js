'use client'

import React, { useState } from 'react'
import { HiOutlineExclamationTriangle } from 'react-icons/hi2'
import Modal from '@/components/shared/Modal'

/**
 * ConfirmDeleteDialog — generic confirm-delete popup, reusable for any
 * entity (club, badge, event, post, etc).
 *
 * Props:
 * - isOpen:      controls visibility
 * - onClose:     called on cancel / backdrop close
 * - onConfirm:   async fn called on confirm; dialog shows a loading
 *                state while it resolves and surfaces any thrown error
 * - title:       optional, defaults to "Delete item?"
 * - itemName:    optional, shown in the message for context
 * - description: optional, overrides the default message entirely
 */
export default function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete item?',
  itemName,
  description,
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)

  const handleConfirm = async () => {
    setError(null)
    setIsDeleting(true)
    try {
      await onConfirm()
      onClose()
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message ?? 'Could not delete. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (isDeleting) return
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} maxWidth="max-w-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--danger)]/15 text-[var(--danger)]">
            <HiOutlineExclamationTriangle className="text-xl" />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            {description ?? (
              <>
                Are you sure you want to delete{' '}
                {itemName ? <span className="font-semibold text-[var(--text-primary)]">"{itemName}"</span> : 'this item'}?
                This action cannot be undone.
              </>
            )}
          </p>
        </div>

        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

        <div className="mt-1 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="rounded-full bg-[var(--danger)] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  )
}