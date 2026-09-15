'use client'

import React, { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { isAdmin } from '@/lib/auth'
import EventHero from '@/components/events/EventHero'
import AttendanceChart from '@/components/events/AttendanceChart'
import ParticipantsList from '@/components/events/ParticipantsList'
import AttendanceTable from '@/components/events/AttendanceTable'
import RegistrationsTable from '@/components/events/RegistrationsTable'
import RegistrationDetailsDrawer from '@/components/events/RegistrationDetailsDrawer'
import AddAttendanceModal from '@/components/events/AddAttendanceModal'
import EventQrCode from '@/components/events/EventQrCode'
import FeedbackList from '@/components/events/FeedbackList'
import DataCard from '@/components/analysis/DataCard'
import { MdOutlinePeople, MdCheckCircle, MdCancel, MdPercent, MdPersonAdd } from 'react-icons/md'

const FILE_BASE_URL = 'https://rccs-backend-production.up.railway.app'

export default function EventAnalyticsView({ eventId }) {
  // read once on mount — isAdmin() touches localStorage, which only exists client-side.
  // Since this component is 'use client' and already gated behind isLoading, computing
  // it in state (instead of calling isAdmin() directly during render) avoids any
  // server/client markup mismatch on first paint.
  const [userIsAdmin, setUserIsAdmin] = useState(false)

  const [event, setEvent] = useState(null)
  const [participants, setParticipants] = useState({ total: 0, participants: [] })
  const [attendance, setAttendance] = useState({ total: 0, attendance: [] })
  const [registrations, setRegistrations] = useState({ total: 0, registrations: [] })
  const [feedback, setFeedback] = useState({ total: 0, feedback: [] })
  const [presentTotal, setPresentTotal] = useState(0)
  const [absentTotal, setAbsentTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRegistration, setSelectedRegistration] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isAddAttendanceOpen, setIsAddAttendanceOpen] = useState(false)

  useEffect(() => {
    setUserIsAdmin(isAdmin())
  }, [])

  useEffect(() => {
    if (!eventId) return

    const fetchAll = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const withTimeout = (promise, ms = 10000) =>
          Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
          ])

        const [
          eventRes,
          participantsRes,
          attendanceRes,
          presentRes,
          absentRes,
          registrationsRes,
          feedbackRes,
        ] = await Promise.allSettled([
          withTimeout(apiClient.get(`/events/${eventId}`)),
          withTimeout(apiClient.get(`/events/${eventId}/participants`)),
          withTimeout(apiClient.get(`/events/${eventId}/attendance`)),
          withTimeout(apiClient.get(`/events/${eventId}/attendance/present`)),
          withTimeout(apiClient.get(`/events/${eventId}/attendance/absent`)),
          withTimeout(apiClient.get(`/events/${eventId}/registrations`)),
          withTimeout(apiClient.get(`/events/${eventId}/feedback`)),
        ])

        if (eventRes.status !== 'fulfilled') {
          throw new Error('Could not load the event')
        }
        setEvent(eventRes.value.data.event)

        if (participantsRes.status === 'fulfilled') setParticipants(participantsRes.value.data)
        if (attendanceRes.status === 'fulfilled') setAttendance(attendanceRes.value.data)
        if (presentRes.status === 'fulfilled') setPresentTotal(presentRes.value.data.total)
        if (absentRes.status === 'fulfilled') setAbsentTotal(absentRes.value.data.total)
        if (registrationsRes.status === 'fulfilled') setRegistrations(registrationsRes.value.data)
        if (feedbackRes.status === 'fulfilled') setFeedback(feedbackRes.value.data)

        ;[
          ['participants', participantsRes],
          ['attendance', attendanceRes],
          ['present', presentRes],
          ['absent', absentRes],
          ['registrations', registrationsRes],
          ['feedback', feedbackRes],
        ].forEach(([name, res]) => {
          if (res.status === 'rejected') console.error(`Failed to load ${name}:`, res.reason)
        })
      } catch (err) {
        console.error(err)
        setError('Could not load event analytics.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAll()
  }, [eventId])

  const refetchRegistrations = async () => {
    try {
      const res = await apiClient.get(`/events/${eventId}/registrations`)
      setRegistrations(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await apiClient.delete(`/events/${eventId}/feedback/${feedbackId}`)
      setFeedback((prev) => ({
        total: prev.total - 1,
        feedback: prev.feedback.filter((f) => f._id !== feedbackId),
      }))
    } catch (err) {
      console.error(err)
    }
  }

  const openRegistration = (registration) => {
    setSelectedRegistration(registration)
    setIsDrawerOpen(true)
  }

  const handleAttendanceMarked = (record) => {
    setAttendance((prev) => ({
      total: prev.total + 1,
      attendance: [record, ...prev.attendance],
    }))
    setPresentTotal((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--danger)]">
        {error}
      </div>
    )
  }

  if (!event) return null

  const attendanceRate =
    registrations.total > 0 ? Math.round((presentTotal / registrations.total) * 100) : 0

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <EventHero event={event} baseUrl={FILE_BASE_URL} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DataCard icon={MdOutlinePeople} label="Registered" value={registrations.total} />
        <DataCard icon={MdCheckCircle} label="Present" value={presentTotal} />
        <DataCard icon={MdCancel} label="Absent" value={absentTotal} />
        <DataCard icon={MdPercent} label="Attendance Rate" value={`${attendanceRate}%`} />
        <button
          type="button"
          onClick={() => setIsAddAttendanceOpen(true)}
          className="flex shrink-0 items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <MdPersonAdd /> Add Attendance
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <AttendanceChart
            present={presentTotal}
            absent={absentTotal}
            registered={registrations.total}
          />
          <EventQrCode eventId={eventId} />
        </div>
        <div className="lg:col-span-2">
          <ParticipantsList participants={participants.participants} total={participants.total} />
        </div>
      </div>

      <RegistrationsTable registrations={registrations.registrations} onSelect={openRegistration} />
      <AttendanceTable attendance={attendance.attendance} />

      <FeedbackList
        feedback={feedback.feedback}
        total={feedback.total}
        isAdmin={userIsAdmin}
        onDelete={handleDeleteFeedback}
      />

      <RegistrationDetailsDrawer
        eventId={eventId}
        registration={selectedRegistration}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdated={refetchRegistrations}
      />

      <AddAttendanceModal
        isOpen={isAddAttendanceOpen}
        onClose={() => setIsAddAttendanceOpen(false)}
        eventId={eventId}
        registrations={registrations.registrations}
        attendance={attendance.attendance}
        onMarked={handleAttendanceMarked}
      />
    </div>
  )
}