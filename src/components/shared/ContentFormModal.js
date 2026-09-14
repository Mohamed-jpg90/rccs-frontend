'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaGoogleDrive, FaYoutube } from 'react-icons/fa'
import Modal from '@/components/shared/Modal'
import { apiClient } from '@/lib/api'

const inputClass =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]'

const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/i
const DRIVE_REGEX = /^(https?:\/\/)?(www\.)?drive\.google\.com\//i

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
 * ContentFormModal — create/edit a content item. Content is now always an
 * external link: either a Google Drive share link or a YouTube link.
 * Pass `content` to edit (PUT), omit it to create (POST). Pass
 * `lockedClubId` when the club is already known (e.g. Team Leader adding
 * content from their own club page) — hides the club select.
 */
export default function ContentFormModal({ isOpen, onClose, onSaved, content, lockedClubId }) {
  const isEdit = Boolean(content?._id)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { title: '', description: '', type: 'YouTube', externalUrl: '', club: '' },
  })

  const [clubs, setClubs] = useState([])
  const [clubsUnavailable, setClubsUnavailable] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const selectedType = watch('type')

  useEffect(() => {
    if (!isOpen) return
    reset({
      title: content?.title ?? '',
      description: content?.description ?? '',
      type: content?.type ?? 'YouTube',
      externalUrl: content?.externalUrl ?? '',
      club: content?.club?._id ?? content?.club ?? lockedClubId ?? '',
    })
    setSubmitError(null)

    if (lockedClubId) return // club is fixed — no need to fetch the list

    apiClient
      .get('/clubs')
      .then((res) => {
        const list = res.data?.clubs ?? res.data
        if (Array.isArray(list) && list.length > 0) {
          setClubs(list)
          setClubsUnavailable(false)
        } else {
          setClubsUnavailable(true)
        }
      })
      .catch(() => setClubsUnavailable(true))
  }, [isOpen, content, reset, lockedClubId])

  const validateUrl = (value) => {
    if (!value) return 'A link is required'
    if (selectedType === 'YouTube' && !YOUTUBE_REGEX.test(value)) {
      return 'This does not look like a YouTube link'
    }
    if (selectedType === 'Drive' && !DRIVE_REGEX.test(value)) {
      return 'This does not look like a Google Drive link'
    }
    return true
  }

  const onSubmit = async (data) => {
    setSubmitError(null)
    try {
      const payload = {
        title: data.title,
        description: data.description,
        type: data.type,
        externalUrl: data.externalUrl,
      }
      // lockedClubId always wins — the select isn't even rendered in that case
      const clubValue = lockedClubId ?? data.club
      if (clubValue) payload.club = clubValue

      let res
      if (isEdit) {
        res = await apiClient.put(`/content/${content._id}`, payload)
      } else {
        res = await apiClient.post('/content', payload)
      }

      // ⚠️ unconfirmed response shape — assuming { content } like other
      // endpoints in this app. Falls back to the raw body if not nested.
      const savedContent = res.data?.content ?? res.data
      onSaved?.(savedContent)
      onClose()
    } catch (err) {
      console.error(err)
      setSubmitError(err.response?.data?.message ?? 'Could not save the content. Please try again.')
    }
  }

  const handleClose = () => {
    setSubmitError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? 'Edit Content' : 'Add Content'} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Title" error={errors.title}>
          <input
            {...register('title', { required: 'Title is required' })}
            className={inputClass}
            placeholder="e.g. Intro to Folk Dance"
          />
        </Field>

        <Field label="Description" error={errors.description}>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={3}
            className={inputClass}
            placeholder="Beginner tutorial"
          />
        </Field>

        {/* Type — visual toggle between the two supported link kinds */}
        <Field label="Type" error={errors.type}>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                selectedType === 'YouTube'
                  ? 'border-[var(--danger)] bg-[var(--danger)]/10 text-[var(--danger)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <input type="radio" value="YouTube" {...register('type', { required: true })} className="hidden" />
              <FaYoutube className="text-base" />
              YouTube
            </label>
            <label
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                selectedType === 'Drive'
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <input type="radio" value="Drive" {...register('type', { required: true })} className="hidden" />
              <FaGoogleDrive className="text-base" />
              Google Drive
            </label>
          </div>
        </Field>

        {!lockedClubId && (
          <Field label="Club" error={errors.club}>
            {clubsUnavailable ? (
              <input {...register('club')} className={inputClass} placeholder="Club ID (optional)" />
            ) : (
              <select {...register('club')} className={inputClass} defaultValue="">
                <option value="">No club</option>
                {clubs.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.clubName}
                  </option>
                ))}
              </select>
            )}
          </Field>
        )}

        <Field label={selectedType === 'YouTube' ? 'YouTube Link' : 'Google Drive Link'} error={errors.externalUrl}>
          <input
            {...register('externalUrl', { validate: validateUrl })}
            className={inputClass}
            placeholder={
              selectedType === 'YouTube'
                ? 'https://youtube.com/watch?v=...'
                : 'https://drive.google.com/file/d/.../view'
            }
          />
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
            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Content'}
          </button>
        </div>
      </form>
    </Modal>
  )
}