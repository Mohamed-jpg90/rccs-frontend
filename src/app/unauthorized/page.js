'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { MdBlock } from 'react-icons/md'
import { clearAuth } from '@/lib/auth'

export default function UnauthorizedPage() {
  const router = useRouter()

  const handleLogout = () => {
    clearAuth()
    router.replace('/login')
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[var(--bg-main)] px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--danger)]/10 text-[var(--danger)]">
        <MdBlock className="text-2xl" />
      </div>
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">Access restricted</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This dashboard is only available to admin accounts. If you believe this is a mistake, contact your administrator.
      </p>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Sign out
      </button>
    </div>
  )
}