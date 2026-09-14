'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdCloudUpload } from 'react-icons/md'
import Modal from '@/components/shared/Modal'
import { apiClient } from '@/lib/api'

const inputClass =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]'

export default function CertificateUploadModal({ isOpen, onClose, userId, onSaved }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { title: '', description: '', type: 'Certificate' } })

  const [submitError, setSubmitError] = useState(null)
  const fileFiles = watch('file')

  useEffect(() => {
    if (!isOpen) return
    reset({ title: '', description: '', type: 'PDF' })
    setSubmitError(null)
  }, [isOpen, reset])

  const onSubmit = async (data) => {
    setSubmitError(null)
    if (!data.file?.[0]) {
      setSubmitError('Please attach a PDF or image file.')
      return
    }
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('type', data.type)
      formData.append('userId', userId)
      formData.append('file', data.file[0])

      await apiClient.post('/certificates', formData)
      onSaved?.()
      onClose()
    } catch (err) {
      console.error(err)
      setSubmitError(err.response?.data?.message ?? 'Could not upload the certificate. Please try again.')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Certificate" maxWidth="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-primary)]">Title</label>
          <input
            {...register('title', { required: 'Title is required' })}
            className={inputClass}
            placeholder="e.g. Best Attendance 2026"
          />
          {errors.title && <span className="text-xs text-[var(--danger)]">{errors.title.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-primary)]">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={2}
            className={inputClass}
          />
          {errors.description && <span className="text-xs text-[var(--danger)]">{errors.description.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-primary)]">Type</label>
          <select {...register('type', { required: true })} className={inputClass}>
            <option value="Certificate">Certificate</option>
            <option value="Recommendation Letter">Recommendation Letter</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-primary)]">File</label>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[var(--border)] px-4 py-6 text-center text-sm text-muted-foreground transition-colors hover:border-[var(--primary)] hover:bg-[var(--bg-hover)]">
            <MdCloudUpload className="text-2xl text-[var(--primary)]" />
            {fileFiles?.[0]?.name ?? 'Click to upload a PDF or image'}
            <input type="file" accept="application/pdf,image/*" {...register('file')} className="hidden" />
          </label>
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
            {isSubmitting ? 'Uploading...' : 'Add Certificate'}
          </button>
        </div>
      </form>
    </Modal>
  )
}