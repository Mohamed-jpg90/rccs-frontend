'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Modal from '@/components/shared/Modal'
import { apiClient } from '@/lib/api'

const inputClass =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]'

function Field({ label, error, children }) {
  return <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text-primary)]">{label}{children}{error && <span className="text-xs font-normal text-[var(--danger)]">{error.message}</span>}</label>
}

export default function ResetPasswordByEmailModal({ isOpen, onClose }) {
  const [showPassword, setShowPassword] = useState(false)
  const [temporaryPassword, setTemporaryPassword] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: { email: '', newPassword: '' } })

  useEffect(() => {
    if (!isOpen) return
    reset({ email: '', newPassword: '' })
  }, [isOpen, reset])

  const handleClose = () => {
    reset({ email: '', newPassword: '' })
    setTemporaryPassword('')
    setShowPassword(false)
    onClose()
  }

  const onSubmit = async ({ email, newPassword }) => {
    try {
      const response = await apiClient.post('/users/reset-password', { email, ...(newPassword ? { newPassword } : {}) })
      toast.success(response.data?.message || 'Password reset successfully')
      setTemporaryPassword(response.data?.temporaryPassword || '')
      if (!response.data?.temporaryPassword) handleClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not reset password')
    }
  }

  const copyPassword = async () => {
    await navigator.clipboard.writeText(temporaryPassword)
    toast.success('Copied')
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reset password by email" maxWidth="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Email" error={errors.email}>
          <input type="email" className={inputClass} placeholder="member@example.com" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
        </Field>
        <Field label="New password (optional)" error={errors.newPassword}>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} className={`${inputClass} pr-11`} placeholder="Generate one automatically" {...register('newPassword', { minLength: { value: 8, message: 'Password must be at least 8 characters' } })} />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)]">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
          </div>
        </Field>
        {temporaryPassword && <div className="rounded-xl border border-[var(--primary)] bg-[var(--primary-light)] p-3"><div className="flex items-center justify-between gap-3"><code className="break-all text-sm font-semibold text-[var(--text-primary)]">{temporaryPassword}</code><button type="button" onClick={copyPassword} className="rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--primary)]">Copy</button></div><p className="mt-2 text-xs text-[var(--text-muted)]">Shown once — share it with the user securely.</p></div>}
        <div className="flex justify-end gap-3"><button type="button" onClick={handleClose} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">Cancel</button><button type="submit" disabled={isSubmitting} className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-60">{isSubmitting ? 'Resetting...' : 'Reset password'}</button></div>
      </form>
    </Modal>
  )
}
