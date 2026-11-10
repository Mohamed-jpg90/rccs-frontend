'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Modal from '@/components/shared/Modal'
import { apiClient } from '@/lib/api'

const inputClass =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3.5 py-2.5 pr-11 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]'

function Field({ label, error, children }) {
  return <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text-primary)]">{label}{children}{error && <span className="text-xs font-normal text-[var(--danger)]">{error.message}</span>}</label>
}

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false })
  const [submitError, setSubmitError] = useState('')
  const { register, handleSubmit, reset, setError, watch, formState: { errors, isSubmitting } } = useForm({ defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' } })
  const currentPassword = watch('currentPassword')
  const newPassword = watch('newPassword')

  useEffect(() => {
    if (!isOpen) return
    reset({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setSubmitError('')
    setVisible({ current: false, next: false, confirm: false })
  }, [isOpen, reset])

  const onSubmit = async ({ currentPassword: current, newPassword: next }) => {
    setSubmitError('')
    try {
      await apiClient.patch('/auth/change-password', { currentPassword: current, newPassword: next })
      toast.success('Password changed successfully')
      reset()
      onClose()
    } catch (error) {
      const message = error.response?.data?.message || 'Could not change password'
      setSubmitError(message)
      if (message === 'Current password is incorrect') setError('currentPassword', { type: 'server', message })
    }
  }

  const passwordInput = (name, isVisible, toggle) => <div className="relative"><input type={isVisible ? 'text' : 'password'} className={inputClass} {...register(name, name === 'currentPassword' ? { required: 'Current password is required' } : name === 'newPassword' ? { required: 'New password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' }, validate: (value) => value !== currentPassword || 'New password must be different from the current one' } : { required: 'Please confirm the password', validate: (value) => value === newPassword || 'Passwords do not match' })} /><button type="button" onClick={toggle} aria-label="Toggle password visibility" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)]">{isVisible ? <FaEyeSlash /> : <FaEye />}</button></div>

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change password" maxWidth="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Current password" error={errors.currentPassword}>{passwordInput('currentPassword', visible.current, () => setVisible((value) => ({ ...value, current: !value.current })))}</Field>
        <Field label="New password" error={errors.newPassword}>{passwordInput('newPassword', visible.next, () => setVisible((value) => ({ ...value, next: !value.next })))}</Field>
        <Field label="Confirm new password" error={errors.confirmPassword}>{passwordInput('confirmPassword', visible.confirm, () => setVisible((value) => ({ ...value, confirm: !value.confirm })))}</Field>
        {submitError && <p className="text-sm text-[var(--danger)]">{submitError}</p>}
        <div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">Cancel</button><button type="submit" disabled={isSubmitting} className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-60">{isSubmitting ? 'Saving...' : 'Change password'}</button></div>
      </form>
    </Modal>
  )
}
