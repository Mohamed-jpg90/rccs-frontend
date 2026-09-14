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
 * ClubFormModal — pass `club` to edit an existing one (PUT), omit it to
 * create a new one (POST). Both hit /clubs with multipart/form-data.
 */
export default function ClubFormModal({ isOpen, onClose, onSaved, club }) {
  const isEdit = Boolean(club?._id)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { clubName: '', description: '', maxMembers: '' },
  })

  const [submitError, setSubmitError] = useState(null)
  const coverImageFiles = watch('coverImage')

  useEffect(() => {
    if (!isOpen) return
    reset({
      clubName: club?.clubName ?? '',
      description: club?.description ?? '',
      maxMembers: club?.maxMembers ?? '',
    })
    setSubmitError(null)
  }, [isOpen, club, reset])

  const onSubmit = async (data) => {
    setSubmitError(null)
    try {
      const formData = new FormData()
      formData.append('clubName', data.clubName)
      formData.append('description', data.description)
      formData.append('maxMembers', data.maxMembers)
      if (data.coverImage?.[0]) formData.append('coverImage', data.coverImage[0])

      if (isEdit) {
        await apiClient.put(`/clubs/${club._id}`, formData)
      } else {
        await apiClient.post('/clubs', formData)
      }

      onSaved?.()
      onClose()
    } catch (err) {
      console.error(err)
      setSubmitError(err.response?.data?.message ?? 'Could not save the club. Please try again.')
    }
  }

  const handleClose = () => {
    setSubmitError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? 'Edit Club' : 'Create Club'} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Club Name" error={errors.clubName}>
          <input
            {...register('clubName', { required: 'Club name is required' })}
            className={inputClass}
            placeholder="e.g. Music Club"
          />
        </Field>

        <Field label="Description" error={errors.description}>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={3}
            className={inputClass}
            placeholder="Club description"
          />
        </Field>

        <Field label="Max Members" error={errors.maxMembers}>
          <input
            type="number"
            min={1}
            {...register('maxMembers', {
              required: 'Max members is required',
              min: { value: 1, message: 'Must be at least 1' },
            })}
            className={inputClass}
            placeholder="50"
          />
        </Field>

        <Field label="Cover Image" error={errors.coverImage}>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[var(--border)] px-4 py-6 text-center text-sm text-muted-foreground transition-colors hover:border-[var(--primary)] hover:bg-[var(--bg-hover)]">
            <MdCloudUpload className="text-2xl text-[var(--primary)]" />
            {coverImageFiles?.[0]?.name ?? (isEdit ? 'Click to replace image' : 'Click to upload an image')}
            <input type="file" accept="image/*" {...register('coverImage')} className="hidden" />
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
            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Club'}
          </button>
        </div>
      </form>
    </Modal>
  )
}