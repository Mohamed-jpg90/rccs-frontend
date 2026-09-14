'use client'

import { use } from 'react'
import EventAnalyticsView from '@/components/events/EventAnalyticsView'

export default function EventAnalyticsPage({ params }) {
  const { id: eventId } = use(params)
  return <EventAnalyticsView eventId={eventId} />
}