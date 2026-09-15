'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import EventCard from '@/components/events/EventCard'
import EventsSummaryCard from '@/components/events/EventsSummaryCard'
import EventsFilterBar from '@/components/events/EventsFilterBar'
import EventFormModal from '@/components/events/EventFormModal'
import { apiClient } from '@/lib/api'

const FILE_BASE_URL = 'https://rccs-backend-production.up.railway.app' // confirmed: uploads are NOT under /api

export default function EventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.get('/events?page=1&limit=20')
      setEvents(response.data.events ?? [])
    } catch (err) {
      console.error(err)
      setError('Could not load events. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesStatus = status === 'All' || event.status === status
      const query = search.trim().toLowerCase()
      const matchesSearch =
        !query ||
        event.title?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.club?.clubName?.toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [events, search, status])

  return (
    <div className="flex flex-col gap-6">
      <EventsSummaryCard title={'Total Events'} total={events.length} onAddClick={() => setIsModalOpen(true)} buttomtitle={"add Event"} />

      <EventsFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
        </div>
      ) : error ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
          <p>{error}</p>
          <button
            onClick={fetchEvents}
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          {events.length === 0 ? 'No events yet.' : 'No events match your search or filter.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              baseUrl={FILE_BASE_URL}
              onClick={() => router.push(`events/${event._id}`)}
            />
          ))}
        </div>
      )}

      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchEvents}
      />
    </div>
  )
}