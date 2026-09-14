'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdCloudUpload } from 'react-icons/md'
import Modal from '@/components/shared/Modal'
import { apiClient } from '@/lib/api'

const inputClass =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]'

// Mirrors backend EVENT_STATUS enum (config/constants.js). Keep in sync if that changes.
const EVENT_STATUS_OPTIONS = ['Upcoming', 'Ongoing', 'Finished', 'Cancelled']

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
      {children}
      {error && <span className="text-xs text-[var(--danger)]">{error.message}</span>}
    </div>
  )
}

export default function EventFormModal({ isOpen, onClose, onSaved, event, clubId }) {
  const isEdit = Boolean(event?._id)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '', description: '', club: clubId ?? '', location: '',
      date: '', time: '', capacity: '', registrationDeadline: '', requiresApproval: false,
      status: 'Upcoming',
    },
  })

  const [clubs, setClubs] = useState([])
  const [clubsUnavailable, setClubsUnavailable] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const coverImageFiles = watch('coverImage')

  useEffect(() => {
    if (!isOpen) return
    setSubmitError(null)

    reset({
      title: event?.title ?? '',
      description: event?.description ?? '',
      club: event?.club?._id ?? event?.club ?? clubId ?? '',
      location: event?.location ?? '',
      date: event?.date ? event.date.slice(0, 10) : '',
      time: event?.time ?? '',
      capacity: event?.capacity ?? '',
      registrationDeadline: event?.registrationDeadline ? event.registrationDeadline.slice(0, 10) : '',
      requiresApproval: event?.requiresApproval ?? false,
      status: event?.status ?? 'Upcoming',
    })

    if (clubId) return

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
  }, [isOpen, event, clubId, reset])

  const onSubmit = async (data) => {
    setSubmitError(null)
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('club', data.club)
      formData.append('location', data.location)
      formData.append('date', data.date)
      formData.append('time', data.time)
      formData.append('capacity', data.capacity)
      formData.append('registrationDeadline', data.registrationDeadline)
      formData.append('requiresApproval', String(data.requiresApproval))
      if (isEdit) formData.append('status', data.status)
      if (data.coverImage?.[0]) formData.append('coverImage', data.coverImage[0])

      let res;
      if (isEdit) {
        res = await apiClient.put(`/events/${event._id}`, formData)
      } else {
        res = await apiClient.post('/events', formData)
      }

      // ⚠️ unconfirmed response shape — assuming { event } like other endpoints
      // in this app (e.g. { club }, { request }). Falls back to the raw body
      // if the event isn't nested, so this still works either way.
      const savedEvent = res.data?.event ?? res.data
      onSaved?.(savedEvent)
      onClose()
    } catch (err) {
      console.error(err)
      setSubmitError(err.response?.data?.message ?? 'Could not save the event. Please try again.')
    }
  }

  const handleClose = () => {
    setSubmitError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? 'Edit Event' : 'Create Event'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Title" error={errors.title}>
          <input {...register('title', { required: 'Title is required' })} className={inputClass} placeholder="Event title" />
        </Field>

        <Field label="Description" error={errors.description}>
          <textarea {...register('description', { required: 'Description is required' })} rows={3} className={inputClass} />
        </Field>

        {!clubId && (
          <Field label="Club" error={errors.club}>
            {clubsUnavailable ? (
              <input {...register('club', { required: 'Club is required' })} className={inputClass} placeholder="Club ID" />
            ) : (
              <select {...register('club', { required: 'Club is required' })} className={inputClass} defaultValue="">
                <option value="" disabled>Select a club</option>
                {clubs.map((c) => (
                  <option key={c._id} value={c._id}>{c.clubName}</option>
                ))}
              </select>
            )}
          </Field>
        )}

        <Field label="Location" error={errors.location}>
          <input {...register('location', { required: 'Location is required' })} className={inputClass} placeholder="Main Hall" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Date" error={errors.date}>
            <input type="date" {...register('date', { required: 'Date is required' })} className={inputClass} />
          </Field>
          <Field label="Time" error={errors.time}>
            <input type="time" {...register('time', { required: 'Time is required' })} className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Capacity" error={errors.capacity}>
            <input type="number" min={1} {...register('capacity', { required: 'Capacity is required', min: { value: 1, message: 'Must be at least 1' } })} className={inputClass} />
          </Field>
          <Field label="Registration Deadline" error={errors.registrationDeadline}>
            <input type="date" {...register('registrationDeadline', { required: 'Deadline is required' })} className={inputClass} />
          </Field>
        </div>

        {isEdit && (
          <Field label="Status" error={errors.status}>
            <select {...register('status')} className={inputClass}>
              {EVENT_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        )}

        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input type="checkbox" {...register('requiresApproval')} className="h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)]" />
          Requires approval before joining
        </label>

        <Field label="Cover Image" error={errors.coverImage}>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[var(--border)] px-4 py-6 text-center text-sm text-muted-foreground transition-colors hover:border-[var(--primary)] hover:bg-[var(--bg-hover)]">
            <MdCloudUpload className="text-2xl text-[var(--primary)]" />
            {coverImageFiles?.[0]?.name ?? (isEdit ? 'Click to replace image' : 'Click to upload an image')}
            <input type="file" accept="image/*" {...register('coverImage')} className="hidden" />
          </label>
        </Field>

        {submitError && <p className="text-sm text-[var(--danger)]">{submitError}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <button type="button" onClick={handleClose} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)]">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Event'}
          </button>
        </div>
      </form>
    </Modal>
  )
}