'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import LedClubCard from '@/components/leader/LedClubCard'

const FILE_BASE_URL = 'http://localhost:5000'

export default function LeaderDashboardPage() {
  const router = useRouter()
  const [clubs, setClubs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiClient
      .get('/me/led-clubs')
      .then((res) => setClubs(res.data?.clubs ?? []))
      .catch((err) => {
        console.error(err)
        setError('Could not load your clubs.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return <div className="flex h-64 items-center justify-center text-sm text-[var(--danger)]">{error}</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">Clubs You Lead</h1>

      {clubs.length === 0 ? (
        <p className="text-sm text-muted-foreground">You aren&apos;t leading any clubs yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {clubs.map((club) => (
            <LedClubCard
              key={club._id}
              club={club}
              baseUrl={FILE_BASE_URL}
              onClick={() => router.push(`/leader/clubs/${club._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}