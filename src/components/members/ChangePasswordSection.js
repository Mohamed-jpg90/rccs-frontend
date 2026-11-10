'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { apiClient } from '@/lib/api'

const inputClass =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3.5 py-2.5 pr-11 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]'

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text-primary)]">
      {label}
      {children}
      {error && <span className="text-xs font-normal text-[var(--danger)]">{error.message}</span>}
    </label>
  )
}

export default function ChangePasswordSection({ userId, userName }) {
  const [showPassword, setShowPassword] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { newPassword: '', confirmPassword: '' } })
  const newPassword = watch('newPassword')

  useEffect(() => {
    reset({ newPassword: '', confirmPassword: '' })
    setGeneratedPassword('')
    setShowPassword(false)
  }, [userId, reset])

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const values = new Uint32Array(12)
    crypto.getRandomValues(values)
    const password = Array.from(values, (value) => chars[value % chars.length]).join('')
    reset({ newPassword: password, confirmPassword: password })
    setGeneratedPassword(password)
    setShowPassword(true)
  }

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword)
      toast.success('Copied')
    } catch {
      toast.error('Could not copy password')
    }
  }

  const onSubmit = async ({ newPassword: password }) => {
    try {
      await apiClient.patch(`/users/${userId}/password`, { newPassword: password })
      toast.success(`Password updated for ${userName}`)
      reset({ newPassword: '', confirmPassword: '' })
      setGeneratedPassword('')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update password')
    }
  }

  return (
    <section className="mt-5 rounded-xl border border-[var(--border)] p-4">
      <h4 className="text-sm font-semibold text-[var(--text-primary)]">Change password</h4>
      <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
        Set a new password for {userName}. They will need to use it the next time they sign in.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-3.5">
        <Field label="New password" error={errors.newPassword}>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className={inputClass}
              {...register('newPassword', {
                required: 'New password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)]">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </Field>

        <Field label="Confirm new password" error={errors.confirmPassword}>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className={inputClass}
              {...register('confirmPassword', {
                required: 'Please confirm the password',
                validate: (value) => value === newPassword || 'Passwords do not match',
              })}
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)]">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </Field>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <button type="button" onClick={generatePassword} className="text-xs font-medium text-[var(--primary)] hover:underline">
            Generate random password
          </button>
          {generatedPassword && (
            <button type="button" onClick={copyPassword} className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]">
              Copy
            </button>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="self-start rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </section>
  )
}
