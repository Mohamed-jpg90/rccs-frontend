'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '@/components/shared/Modal'
import { apiClient } from '@/lib/api'

const inputClass =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]'

export default function AddPointsModal({ isOpen, onClose, userId, onSaved }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { type: 'Earn', amount: '', reason: '' } })

  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    if (!isOpen) return
    reset({ type: 'Earn', amount: '', reason: '' })
    setSubmitError(null)
  }, [isOpen, reset])

  const onSubmit = async (data) => {
    setSubmitError(null)
    try {
      await apiClient.post(`/users/${userId}/points`, {
        type: data.type,
        amount: Number(data.amount),
        reason: data.reason,
      })
      onSaved?.()
      onClose()
    } catch (err) {
      console.error(err)
      setSubmitError(err.response?.data?.message ?? 'Could not save points. Please try again.')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Points" maxWidth="max-w-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-primary)]">Type</label>
          <select {...register('type', { required: true })} className={inputClass}>
            <option value="Earn">Earn</option>
            <option value="Redeem">Redeem</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-primary)]">Amount</label>
          <input
            type="number"
            min={1}
            {...register('amount', { required: 'Amount is required', min: { value: 1, message: 'Must be at least 1' } })}
            className={inputClass}
            placeholder="50"
          />
          {errors.amount && <span className="text-xs text-[var(--danger)]">{errors.amount.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-primary)]">Reason</label>
          <textarea
            {...register('reason', { required: 'Reason is required' })}
            rows={2}
            className={inputClass}
            placeholder="Outstanding participation this month"
          />
          {errors.reason && <span className="text-xs text-[var(--danger)]">{errors.reason.message}</span>}
        </div>

        {submitError && <p className="text-sm text-[var(--danger)]">{submitError}</p>}

        <div className="mt-1 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Add Points'}
          </button>
        </div>
      </form>
    </Modal>
  )
}