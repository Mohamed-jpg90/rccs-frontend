'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdCloudUpload } from 'react-icons/md'
import Modal from '@/components/shared/Modal'
import { apiClient } from '@/lib/api'

const inputClass =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]'

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
      {children}
      {error && <span className="text-xs text-[var(--danger)]">{error.message}</span>}
    </div>
  )
}

/**
 * BadgeFormModal — pass `badge` to edit (PUT), omit to create (POST).
 * Both hit /badges with multipart/form-data.
 */
export default function BadgeFormModal({ isOpen, onClose, onSaved, badge }) {
  const isEdit = Boolean(badge?._id)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { badgeName: '', description: '', points: '', pointsRequired: '' },
  })

  const [submitError, setSubmitError] = useState(null)
  const badgeImageFiles = watch('badgeImage')

  useEffect(() => {
    if (!isOpen) return
    reset({
      badgeName: badge?.badgeName ?? '',
      description: badge?.description ?? '',
      points: badge?.points ?? '',
      pointsRequired: badge?.pointsRequired ?? '',
    })
    setSubmitError(null)
  }, [isOpen, badge, reset])

  const onSubmit = async (data) => {
    setSubmitError(null)
    try {
      const formData = new FormData()
      formData.append('badgeName', data.badgeName)
      formData.append('description', data.description)
      formData.append('points', data.points)
      formData.append('pointsRequired', data.pointsRequired)
      if (data.badgeImage?.[0]) formData.append('badgeImage', data.badgeImage[0])

      if (isEdit) {
        await apiClient.put(`/badges/${badge._id}`, formData)
      } else {
        await apiClient.post('/badges', formData)
      }

      onSaved?.()
      onClose()
    } catch (err) {
      console.error(err)
      setSubmitError(err.response?.data?.message ?? 'Could not save the badge. Please try again.')
    }
  }

  const handleClose = () => {
    setSubmitError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? 'Edit Badge' : 'Create Badge'} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Badge Name" error={errors.badgeName}>
          <input
            {...register('badgeName', { required: 'Badge name is required' })}
            className={inputClass}
            placeholder="e.g. Best Attendance"
          />
        </Field>

        <Field label="Description" error={errors.description}>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={3}
            className={inputClass}
            placeholder="Awarded for perfect attendance"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Points" error={errors.points}>
            <input
              type="number"
              min={0}
              {...register('points', { required: 'Points is required' })}
              className={inputClass}
              placeholder="100"
            />
          </Field>
          <Field label="Points Required" error={errors.pointsRequired}>
            <input
              type="number"
              min={0}
              {...register('pointsRequired', { required: 'Points required is required' })}
              className={inputClass}
              placeholder="500"
            />
          </Field>
        </div>

        <Field label="Badge Image" error={errors.badgeImage}>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[var(--border)] px-4 py-6 text-center text-sm text-muted-foreground transition-colors hover:border-[var(--primary)] hover:bg-[var(--bg-hover)]">
            <MdCloudUpload className="text-2xl text-[var(--primary)]" />
            {badgeImageFiles?.[0]?.name ?? (isEdit ? 'Click to replace image' : 'Click to upload an image')}
            <input type="file" accept="image/*" {...register('badgeImage')} className="hidden" />
          </label>
        </Field>

        {submitError && <p className="text-sm text-[var(--danger)]">{submitError}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Badge'}
          </button>
        </div>
      </form>
    </Modal>
  )
}