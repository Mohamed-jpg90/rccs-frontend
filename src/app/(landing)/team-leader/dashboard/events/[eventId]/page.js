'use client'

import { use } from 'react'
import EventAnalyticsView from '@/components/events/EventAnalyticsView'

export default function TeamLeaderEventAnalyticsPage({ params }) {
  const { eventId } = use(params)
  return <EventAnalyticsView eventId={eventId} />
}